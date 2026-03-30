/// mdpad — Tauri application library.
///
/// Sets up the Tauri builder with plugins, commands, and window configuration.

mod commands;
mod error;

use commands::files;

/// Run the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            files::list_files,
            files::read_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
