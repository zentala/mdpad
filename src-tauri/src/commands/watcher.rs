/// File system watcher — monitors a directory for changes and emits events to the frontend.
use std::path::PathBuf;
use std::sync::Mutex;

use notify::{Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use tauri::{AppHandle, Emitter};

use crate::error::AppError;

/// Event payload emitted to the frontend when a file system change is detected.
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "kind", content = "path")]
pub enum FsEvent {
    /// A file's content was modified.
    FileChanged(String),
    /// A new file or directory was created.
    FileCreated(String),
    /// A file or directory was deleted.
    FileDeleted(String),
}

/// Holds the active file watcher instance and the root path being watched.
pub struct WatcherState {
    watcher: Mutex<Option<RecommendedWatcher>>,
    root: Mutex<Option<PathBuf>>,
}

impl WatcherState {
    /// Create a new empty watcher state (no active watcher).
    pub fn new() -> Self {
        Self {
            watcher: Mutex::new(None),
            root: Mutex::new(None),
        }
    }
}

/// Convert a notify event into zero or more `FsEvent` payloads.
fn to_fs_events(event: &Event, root: &PathBuf) -> Vec<FsEvent> {
    let variant_fn: fn(String) -> FsEvent = match event.kind {
        EventKind::Create(_) => FsEvent::FileCreated,
        EventKind::Modify(_) => FsEvent::FileChanged,
        EventKind::Remove(_) => FsEvent::FileDeleted,
        _ => return Vec::new(),
    };

    event
        .paths
        .iter()
        .filter_map(|p| {
            p.strip_prefix(root)
                .ok()
                .map(|rel| rel.to_string_lossy().replace('\\', "/"))
        })
        .map(variant_fn)
        .collect()
}

/// Start watching a directory for file system changes.
///
/// Emits `fs_event` to the frontend for every create, modify, or delete event.
/// Calling this while already watching stops the previous watcher first.
#[tauri::command]
pub fn watch_directory(
    app: AppHandle,
    state: tauri::State<'_, WatcherState>,
    root_path: String,
) -> Result<(), String> {
    let root = PathBuf::from(&root_path)
        .canonicalize()
        .map_err(AppError::Io)?;

    if !root.is_dir() {
        return Err(AppError::InvalidPath(format!("{root_path} is not a directory")).into());
    }

    let emit_root = root.clone();
    let watcher = notify::recommended_watcher(move |res: Result<Event, notify::Error>| {
        let event = match res {
            Ok(e) => e,
            Err(e) => {
                log::warn!("File watcher error: {e}");
                return;
            }
        };
        for fs_event in to_fs_events(&event, &emit_root) {
            if let Err(e) = app.emit("fs_event", &fs_event) {
                log::warn!("Failed to emit fs_event: {e}");
            }
        }
    })
    .map_err(|e| AppError::Watcher(e.to_string()))?;

    let mut watcher_guard = state
        .watcher
        .lock()
        .map_err(|e| AppError::Lock(e.to_string()))?;

    let mut root_guard = state
        .root
        .lock()
        .map_err(|e| AppError::Lock(e.to_string()))?;

    // Replace old watcher (drops it, stopping previous watch).
    *watcher_guard = Some(watcher);
    *root_guard = Some(root.clone());

    // Start watching after storing — borrow the stored watcher.
    if let Some(w) = watcher_guard.as_mut() {
        w.watch(&root, RecursiveMode::Recursive)
            .map_err(|e| AppError::Watcher(e.to_string()))?;
    }

    log::info!("Watching directory: {}", root.display());
    Ok(())
}

/// Stop watching the current directory.
///
/// No-op if no directory is currently being watched.
#[tauri::command]
pub fn unwatch_directory(state: tauri::State<'_, WatcherState>) -> Result<(), String> {
    let mut watcher_guard = state
        .watcher
        .lock()
        .map_err(|e| AppError::Lock(e.to_string()))?;

    let mut root_guard = state
        .root
        .lock()
        .map_err(|e| AppError::Lock(e.to_string()))?;

    // Dropping the watcher stops all watches.
    *watcher_guard = None;
    *root_guard = None;

    log::info!("Stopped watching directory");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use notify::event::{AccessKind, CreateKind, DataChange, ModifyKind, RemoveKind};

    fn make_event(kind: EventKind, paths: Vec<PathBuf>) -> Event {
        Event {
            kind,
            paths,
            attrs: Default::default(),
        }
    }

    #[test]
    fn to_fs_events_maps_create() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Create(CreateKind::File),
            vec![PathBuf::from("/project/src/main.rs")],
        );
        let results = to_fs_events(&event, &root);
        assert_eq!(results.len(), 1);
        assert!(matches!(&results[0], FsEvent::FileCreated(p) if p == "src/main.rs"));
    }

    #[test]
    fn to_fs_events_maps_modify() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Modify(ModifyKind::Data(DataChange::Any)),
            vec![PathBuf::from("/project/README.md")],
        );
        let results = to_fs_events(&event, &root);
        assert_eq!(results.len(), 1);
        assert!(matches!(&results[0], FsEvent::FileChanged(p) if p == "README.md"));
    }

    #[test]
    fn to_fs_events_maps_remove() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Remove(RemoveKind::File),
            vec![PathBuf::from("/project/old.txt")],
        );
        let results = to_fs_events(&event, &root);
        assert_eq!(results.len(), 1);
        assert!(matches!(&results[0], FsEvent::FileDeleted(p) if p == "old.txt"));
    }

    #[test]
    fn to_fs_events_ignores_access_events() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Access(AccessKind::Read),
            vec![PathBuf::from("/project/file.txt")],
        );
        let results = to_fs_events(&event, &root);
        assert!(results.is_empty());
    }

    #[test]
    fn to_fs_events_skips_paths_outside_root() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Create(CreateKind::File),
            vec![PathBuf::from("/other/file.txt")],
        );
        let results = to_fs_events(&event, &root);
        assert!(results.is_empty());
    }

    #[test]
    fn to_fs_events_handles_multiple_paths() {
        let root = PathBuf::from("/project");
        let event = make_event(
            EventKind::Modify(ModifyKind::Data(DataChange::Any)),
            vec![
                PathBuf::from("/project/a.md"),
                PathBuf::from("/project/b.md"),
            ],
        );
        let results = to_fs_events(&event, &root);
        assert_eq!(results.len(), 2);
    }

    #[test]
    fn watcher_state_starts_empty() {
        let state = WatcherState::new();
        let guard = state.watcher.lock().expect("lock watcher");
        assert!(guard.is_none());
        let root = state.root.lock().expect("lock root");
        assert!(root.is_none());
    }
}
