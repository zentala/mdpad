/// File system commands — list directories and read files via IPC.
use serde::Serialize;
use std::path::{Path, PathBuf};

use crate::error::AppError;

/// Directories to exclude from file tree scanning.
const EXCLUDE_DIRS: &[&str] = &[
    ".git",
    "node_modules",
    "target",
    "dist",
    ".claude",
    "__pycache__",
    ".next",
];

/// A node in the file tree, matching the TypeScript FileNode interface.
#[derive(Debug, Clone, Serialize)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub node_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extension: Option<String>,
}

/// Scan a directory recursively and return a file tree.
///
/// Excludes common non-content directories (.git, node_modules, target, etc.).
#[tauri::command]
pub fn list_files(root_path: String) -> Result<Vec<FileNode>, String> {
    let root = PathBuf::from(&root_path);
    if !root.is_dir() {
        return Err(AppError::InvalidPath(format!("{root_path} is not a directory")).into());
    }

    let canonical_root = root.canonicalize().map_err(AppError::Io)?;
    Ok(build_tree(&canonical_root, &canonical_root))
}

/// Read the content of a single file, with path traversal protection.
#[tauri::command]
pub fn read_file(root_path: String, file_path: String) -> Result<String, String> {
    let root = PathBuf::from(&root_path).canonicalize().map_err(AppError::Io)?;
    let target = root.join(&file_path).canonicalize().map_err(AppError::Io)?;

    // Prevent path traversal
    if !target.starts_with(&root) {
        return Err(AppError::PathTraversal.into());
    }

    std::fs::read_to_string(&target).map_err(|e| AppError::Io(e).into())
}

/// Build a FileNode tree from the filesystem.
fn build_tree(dir: &Path, root: &Path) -> Vec<FileNode> {
    let mut folders: Vec<FileNode> = Vec::new();
    let mut files: Vec<FileNode> = Vec::new();

    let entries = match std::fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return Vec::new(),
    };

    for entry in entries {
        let entry = match entry {
            Ok(e) => e,
            Err(e) => {
                log::debug!("Skipping inaccessible entry in {}: {}", dir.display(), e);
                continue;
            }
        };
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip hidden files (except common config dirs)
        if name.starts_with('.') && !matches!(name.as_str(), ".arch" | ".plan") {
            continue;
        }

        let rel_path = path
            .strip_prefix(root)
            .unwrap_or(&path)
            .to_string_lossy()
            .replace('\\', "/");

        if path.is_dir() {
            if EXCLUDE_DIRS.contains(&name.as_str()) {
                continue;
            }
            let children = build_tree(&path, root);
            folders.push(FileNode {
                name,
                path: rel_path,
                node_type: "folder".to_string(),
                children: Some(children),
                extension: None,
            });
        } else if path.is_file() {
            let ext = path
                .extension()
                .map(|e| e.to_string_lossy().to_string());
            files.push(FileNode {
                name,
                path: rel_path,
                node_type: "file".to_string(),
                children: None,
                extension: ext,
            });
        }
    }

    folders.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    folders.extend(files);
    folders
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    #[test]
    fn test_list_files_returns_tree() {
        let dir = TempDir::new().unwrap();
        fs::write(dir.path().join("README.md"), "# Hello").unwrap();
        fs::create_dir(dir.path().join("docs")).unwrap();
        fs::write(dir.path().join("docs/guide.md"), "# Guide").unwrap();

        let result = list_files(dir.path().to_string_lossy().to_string());
        assert!(result.is_ok());
        let tree = result.unwrap();
        assert_eq!(tree.len(), 2); // docs/ folder + README.md
    }

    #[test]
    fn test_read_file_success() {
        let dir = TempDir::new().unwrap();
        fs::write(dir.path().join("test.md"), "hello world").unwrap();

        let result = read_file(
            dir.path().to_string_lossy().to_string(),
            "test.md".to_string(),
        );
        assert_eq!(result.unwrap(), "hello world");
    }

    #[test]
    fn test_read_file_prevents_traversal() {
        let dir = TempDir::new().unwrap();
        let result = read_file(
            dir.path().to_string_lossy().to_string(),
            "../../../etc/passwd".to_string(),
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_list_files_excludes_git() {
        let dir = TempDir::new().unwrap();
        fs::create_dir(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".git/config"), "").unwrap();
        fs::write(dir.path().join("README.md"), "# Hello").unwrap();

        let tree = list_files(dir.path().to_string_lossy().to_string()).unwrap();
        assert_eq!(tree.len(), 1); // only README.md, no .git
        assert_eq!(tree[0].name, "README.md");
    }
}
