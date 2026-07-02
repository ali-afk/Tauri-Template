use std::sync::Arc;

use crate::config::types::{Resolution, Theme};
use crate::config::{AppSettings, AppSettingsKey, AppSettingsKeyKind};
use crate::error::AppError;
use serde_json::Value;
use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

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

    let entries = settings.entries();

    let mut theme = Theme::default();
    let mut resolution = Resolution::default();
    let mut fullscreen = false;

    for (key, value) in entries {
        match tuple_as_kv(key, value)? {
            AppSettingsKey::Theme(t) => theme = t,
            AppSettingsKey::Resolution(r) => resolution = r,
            AppSettingsKey::Fullscreen(f) => fullscreen = f,
        }
    }

    Ok(AppSettings { theme, resolution, fullscreen })
}

pub fn read_settings_field(
    app: &AppHandle,
    key: &AppSettingsKeyKind,
) -> Result<AppSettingsKey, AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let json_value = settings.get(key.as_ref()).ok_or_else(|| {
        AppError::Config(format!("Setting '{key}' does not exist in app settings"))
    })?;

    tuple_as_kv(key.as_ref().to_string(), json_value)
}

fn kv_as_tuple(key: AppSettingsKey) -> (String, Value) {
    match key {
        AppSettingsKey::Theme(theme) => (
            "theme".to_string(),
            Value::String(match theme {
                Theme::Light => "Light".to_string(),
                Theme::Dark => "Dark".to_string(),
                Theme::System => "System".to_string(),
            }),
        ),
        AppSettingsKey::Resolution(resolution) => (
            "resolution".to_string(),
            Value::String(resolution.to_string()),
        ),
        AppSettingsKey::Fullscreen(fullscreen) => {
            ("fullscreen".to_string(), Value::Bool(fullscreen))
        }
    }
}

pub fn tuple_as_kv(key: String, val: Value) -> Result<AppSettingsKey, AppError> {
    match key.as_str() {
        "fullscreen" => match val.as_bool() {
            Some(fullscreen) => Ok(AppSettingsKey::Fullscreen(fullscreen)),
            None => Err(AppError::Config("Setting 'fullscreen' is not a valid boolean".into())),
        },
        "theme" | "resolution" => {
            let value = val.as_str()
                .ok_or_else(|| AppError::Config(format!("Setting '{key}' is not a valid string")))?;
            match key.as_str() {
                "theme" => match value {
                    "System" => Ok(AppSettingsKey::Theme(Theme::System)),
                    "Light" => Ok(AppSettingsKey::Theme(Theme::Light)),
                    "Dark" => Ok(AppSettingsKey::Theme(Theme::Dark)),
                    _ => Err(AppError::Config(format!("Invalid conversion of tuple value '{value}' to theme"))),
                },
                "resolution" => match Resolution::new(value) {
                    Ok(r) => Ok(AppSettingsKey::Resolution(r)),
                    Err(e) => Err(e),
                },
                _ => unreachable!(),
            }
        }
        _ => Err(AppError::Config(format!("Invalid key '{key}'"))),
    }
}

pub fn write_settings_field(app: &AppHandle, value: AppSettingsKey) -> Result<(), AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let (key, json_value) = kv_as_tuple(value);
    settings.set(key, json_value);
    settings.save()
        .map_err(|e| AppError::Config(e.to_string()))?;
    Ok(())
}

pub fn write_settings(app: &AppHandle, new_settings: &AppSettings) -> Result<(), AppError> {
    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;

    let (theme_key, theme_val) =
        kv_as_tuple(AppSettingsKey::Theme(new_settings.theme));
    let (res_key, res_val) =
        kv_as_tuple(AppSettingsKey::Resolution(new_settings.resolution));
    let (fs_key, fs_val) =
        kv_as_tuple(AppSettingsKey::Fullscreen(new_settings.fullscreen));
    settings.set(theme_key, theme_val);
    settings.set(res_key, res_val);
    settings.set(fs_key, fs_val);
    settings.save()
        .map_err(|e| AppError::Config(e.to_string()))?;
    Ok(())
}
