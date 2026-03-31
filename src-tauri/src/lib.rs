/// mdpad — Tauri application library.
///
/// Sets up the Tauri builder with plugins, commands, and window configuration.

mod commands;
mod error;

use commands::files;
use commands::watcher::{self, WatcherState};
use serde::Serialize;
use std::path::PathBuf;
use tauri::Emitter;
use tauri_plugin_cli::CliExt;

/// Payload emitted to the frontend with resolved CLI arguments.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CliArgsPayload {
    root_path: String,
    initial_file: Option<String>,
}

/// Resolve the CLI `source` argument into a root directory and optional file.
///
/// - If source is a file: parent directory becomes root, file name is initial.
/// - If source is a directory: it becomes root.
/// - If no source: current working directory is root.
fn resolve_source(source: Option<&str>) -> (PathBuf, Option<String>) {
    match source {
        Some(s) => {
            let path = PathBuf::from(s);
            if path.is_file() {
                let parent = path.parent().unwrap_or(&path).to_path_buf();
                let file_name = path
                    .file_name()
                    .map(|f| f.to_string_lossy().to_string());
                (parent, file_name)
            } else if path.is_dir() {
                (path, None)
            } else {
                let parent = path.parent().unwrap_or(&path).to_path_buf();
                let parent = if parent.as_os_str().is_empty() {
                    PathBuf::from(".")
                } else {
                    parent
                };
                (parent, None)
            }
        }
        None => {
            let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
            (cwd, None)
        }
    }
}

/// Run the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .manage(WatcherState::new())
        .invoke_handler(tauri::generate_handler![
            files::list_files,
            files::read_file,
            watcher::watch_directory,
            watcher::unwatch_directory,
        ])
        .setup(|app| {
            let source_value = app
                .cli()
                .matches()
                .ok()
                .and_then(|m| m.args.get("source").cloned())
                .and_then(|arg| arg.value.as_str().map(String::from));

            let (root, initial_file) = resolve_source(source_value.as_deref());

            let root_str = root
                .canonicalize()
                .unwrap_or(root)
                .to_string_lossy()
                .to_string();

            let payload = CliArgsPayload {
                root_path: root_str,
                initial_file,
            };

            let _ = app.emit("cli_args", &payload);

            // Emit again after frontend loads its event listeners
            let payload_clone = payload.clone();
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(500));
                let _ = handle.emit("cli_args", &payload_clone);
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
