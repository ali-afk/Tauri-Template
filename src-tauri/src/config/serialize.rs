use std::fs::{create_dir_all, File};
use std::io::{Read, Write};
use tauri::path::BaseDirectory;
use tauri::AppHandle;
use tauri::Manager;

use crate::config::AppSettings;
use crate::error::AppError;

fn config_path(app_handle: &AppHandle) -> Result<std::path::PathBuf, AppError> {
    let path = app_handle
        .path()
        .resolve("config.json", BaseDirectory::AppConfig)
        .map_err(|e| AppError::Config(e.to_string()))?;

    if let Some(parent) = path.parent() {
        if !parent.exists() {
            create_dir_all(parent)?;
        }
    }

    Ok(path)
}

pub fn read_settings(app_handle: &AppHandle) -> Result<AppSettings, AppError> {
    let path = config_path(app_handle)?;

    if !path.exists() {
        let settings = AppSettings::default();
        write_settings_inner(&path, &settings)?;
        return Ok(settings);
    }

    let mut file = File::open(&path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let settings: AppSettings = serde_json::from_str(&contents)?;
    Ok(settings)
}

pub fn write_settings(app_handle: &AppHandle, new_settings: &AppSettings) -> Result<(), AppError> {
    let path = config_path(app_handle)?;
    write_settings_inner(&path, new_settings)
}

fn write_settings_inner(path: &std::path::Path, new_settings: &AppSettings) -> Result<(), AppError> {
    let json_data = serde_json::to_string_pretty(new_settings)?;
    let mut file = File::create(path)?;
    file.write_all(json_data.as_bytes())?;
    Ok(())
}
