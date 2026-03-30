/// Application error types for IPC command results.
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Path is outside root directory")]
    PathTraversal,

    #[error("Invalid path: {0}")]
    InvalidPath(String),
}

impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        err.to_string()
    }
}
