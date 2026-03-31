/// mdpad — Tauri application library.
///
/// Sets up the Tauri builder with plugins, commands, and window configuration.

mod commands;
mod error;

use commands::files;

/// Set the window title to "filename - mdpad" or "directory - mdpad".
#[tauri::command]
fn set_window_title(window: tauri::Window, title: String) -> Result<(), String> {
    let display = if title.is_empty() {
        "mdpad".to_string()
    } else {
        format!("{title} - mdpad")
    };
    window.set_title(&display).map_err(|e| e.to_string())
}

/// Run the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            files::list_files,
            files::read_file,
            set_window_title,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
