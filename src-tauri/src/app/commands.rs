use crate::app::config::{AppMetadata, AppSettings, AppSettingsKey, AppSettingsKeyKind};
/// Commands hit the store directly via tauri-plugin-store (set up in setup.rs).
/// New commands: add here, register in collect_commands![] in lib.rs.
use crate::domain::error::AppError;
use crate::infrastructure::serialize;
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub fn app_metadata(state: tauri::State<'_, AppMetadata>) -> Result<AppMetadata, AppError> {
    Ok((*state).clone())
}

#[tauri::command]
#[specta::specta]
pub fn read_settings(app_handle: AppHandle) -> Result<AppSettings, AppError> {
    serialize::read_settings(&app_handle)
}

#[tauri::command]
#[specta::specta]
pub fn read_settings_field(
    app_handle: AppHandle,
    key: AppSettingsKeyKind,
) -> Result<AppSettingsKey, AppError> {
    serialize::read_settings_field(&app_handle, &key)
}

#[tauri::command]
#[specta::specta]
pub fn write_settings(app_handle: AppHandle, settings: AppSettings) -> Result<(), AppError> {
    serialize::write_settings(&app_handle, &settings)
}

#[tauri::command]
#[specta::specta]
pub fn write_settings_field(app_handle: AppHandle, value: AppSettingsKey) -> Result<(), AppError> {
    serialize::write_settings_field(&app_handle, value)
}
