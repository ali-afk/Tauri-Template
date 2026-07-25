use crate::app::config::{AppMetadata, AppSettings, AppSettingsKey, AppSettingsKeyKind};
use crate::domain::error::AppError;
use crate::infrastructure::serialize;
use tauri::AppHandle;

/// Reads application metadata from the managed `AppMetadata` state.
#[tauri::command]
#[specta::specta]
pub fn app_metadata(state: tauri::State<'_, AppMetadata>) -> Result<AppMetadata, AppError> {
    Ok((*state).clone())
}

/// Reads all settings from the store. Returns the full `AppSettings` struct.
#[tauri::command]
#[specta::specta]
pub fn read_settings(app_handle: AppHandle) -> Result<AppSettings, AppError> {
    serialize::read_settings(&app_handle)
}

/// Reads a single setting field by its `AppSettingsKeyKind` identifier.
#[tauri::command]
#[specta::specta]
pub fn read_settings_field(
    app_handle: AppHandle,
    key: AppSettingsKeyKind,
) -> Result<AppSettingsKey, AppError> {
    serialize::read_settings_field(&app_handle, &key)
}

/// Writes all settings to the store, overwriting the entire config.
#[tauri::command]
#[specta::specta]
pub fn write_settings(app_handle: AppHandle, settings: AppSettings) -> Result<(), AppError> {
    serialize::write_settings(&app_handle, &settings)
}

/// Writes a single setting field, leaving other fields unchanged.
#[tauri::command]
#[specta::specta]
pub fn write_settings_field(app_handle: AppHandle, value: AppSettingsKey) -> Result<(), AppError> {
    serialize::write_settings_field(&app_handle, value)
}
