use std::str::FromStr;
use std::sync::Arc;

use crate::config::{AppSettings, AppSettingsKey, AppSettingsKeyKind};
use crate::error::AppError;
use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

/// Writes default settings to the store if it's empty (first launch).
/// Called as a side-effect guard by read functions — ensures the
/// store always has valid data before reading.
pub fn if_empty_write_default(app: &AppHandle, settings: &Arc<Store<Wry>>) -> Result<(), AppError> {
    if settings.is_empty() {
        write_settings(app, &AppSettings::default())?
    }
    Ok(())
}

pub fn read_settings(app: &AppHandle) -> Result<AppSettings, AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let mut read_settings = AppSettings::default();

    for (key, value) in settings.entries() {
        let kind = AppSettingsKeyKind::from_str(key.as_ref())?;
        match AppSettingsKey::from_json_value(kind, value)? {
            AppSettingsKey::Theme(t) => read_settings.theme = t,
            AppSettingsKey::Resolution(r) => read_settings.resolution = r,
            AppSettingsKey::Fullscreen(f) => read_settings.fullscreen = f,
        }
    }

    Ok(read_settings)
}

pub fn read_settings_field(
    app: &AppHandle,
    key: &AppSettingsKeyKind,
) -> Result<AppSettingsKey, AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let val = settings.get(key.as_ref()).ok_or_else(|| {
        AppError::Config(format!("Setting '{key}' does not exist in app settings"))
    })?;

    AppSettingsKey::from_json_value(*key, val)
}

pub fn write_settings_field(app: &AppHandle, value: AppSettingsKey) -> Result<(), AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let (key, val) = (value.kind(), value.to_json_value()?);
    settings.set(key.as_ref(), val);
    settings
        .save()
        .map_err(|e| AppError::Config(e.to_string()))?;
    Ok(())
}

pub fn write_settings(app: &AppHandle, new_settings: &AppSettings) -> Result<(), AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let settings_json =
        serde_json::to_value(new_settings).map_err(|e| AppError::Config(e.to_string()))?;

    if let Some(settings_map) = settings_json.as_object() {
        for (key, val) in settings_map.clone() {
            settings.set(key, val);
        }
    }
    settings
        .save()
        .map_err(|e| AppError::Config(e.to_string()))?;
    Ok(())
}
