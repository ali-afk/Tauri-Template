/// Tauri IPC commands exposed to the frontend via specta.
/// Each command is both #[tauri::command] (Tauri handler) and
/// #[specta::specta] (TypeScript type generation).
///
/// Commands hit the store directly via tauri-plugin-store (set up in setup.rs).
/// New commands: add here, register in collect_commands![] in lib.rs.
use crate::config::serialize;
use crate::config::{AppMetadata, AppSettings, AppSettingsKey, AppSettingsKeyKind};
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub fn app_metadata(state: tauri::State<'_, AppMetadata>) -> Result<AppMetadata, String> {
    Ok((*state).clone())
}

#[tauri::command]
#[specta::specta]
pub fn read_settings(app_handle: AppHandle) -> Result<AppSettings, String> {
    serialize::read_settings(&app_handle).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn read_settings_field(
    app_handle: AppHandle,
    key: AppSettingsKeyKind,
) -> Result<AppSettingsKey, String> {
    serialize::read_settings_field(&app_handle, &key).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn write_settings(app_handle: AppHandle, settings: AppSettings) -> Result<(), String> {
    serialize::write_settings(&app_handle, &settings).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn write_settings_field(app_handle: AppHandle, value: AppSettingsKey) -> Result<(), String> {
    serialize::write_settings_field(&app_handle, value).map_err(|e| e.to_string())
}
