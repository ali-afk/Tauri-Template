/// Tauri IPC commands exposed to the frontend via specta.
/// Each command is both #[tauri::command] (Tauri handler) and
/// #[specta::specta] (TypeScript type generation).
///
/// Commands read from managed state (set up in lib.rs::build).
/// New commands: add here, register in collect_commands![] in lib.rs.
use crate::config::{AppMetaData, AppSettings};

#[tauri::command]
#[specta::specta]
pub fn app_settings(state: tauri::State<'_, AppSettings>) -> Result<AppSettings, String> {
    Ok((*state).clone())
}

#[tauri::command]
#[specta::specta]
pub fn app_metadata(state: tauri::State<'_, AppMetaData>) -> Result<AppMetaData, String> {
    Ok((*state).clone())
}
