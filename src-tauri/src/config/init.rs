/// App config initialization.
///
/// get_app_metadata: reads version/name/contacts from compile-time tauri::Config.
/// short_description and long_description are commented out because tauri v2's
/// Config struct doesn't expose them directly (broke backend export). Will be
/// restored when the API supports it.
///
/// init_app_settings: reads or creates config.json in BaseDirectory::AppConfig.
/// Creates file with AppSettings::default() if absent, then deserializes and
/// returns cached settings on every startup.
use tauri::{Config, Manager};

pub fn get_app_metadata(config: &Config) -> AppMetaData {
    let app_url = "https://oun.digital".into();
    let email = Email("ali.hussain.ali.oun@gmail.com".into());
    let github = "https://github.com/ali-afk".into();
    let contacts = ContactInfo { email, github };

    AppMetaData {
        app_version: config
            .version
            .clone()
            .expect("Could not retrieve app version!"),
        app_name: config
            .product_name
            .clone()
            .expect("Could not retrieve app name!"),
        // short_description: config.bundle.short_description.clone().expect("Could not retreive app short description!"),
        // long_description: config.bundle.long_description.clone().expect("Could not retrieve app long description!"),
        app_url,
        contacts,
    }
}

use std::fs::{create_dir_all, File};
use std::io::{Read, Write};
use tauri::path::BaseDirectory;
use tauri::AppHandle;

use crate::config::types::{ContactInfo, Email};
use crate::config::{AppMetaData, AppSettings};

pub fn init_app_settings(app_handle: &AppHandle) -> Result<AppSettings, String> {
    let config_path = app_handle
        .path()
        .resolve("config.json", BaseDirectory::AppConfig)
        .map_err(|e| format!("Failed to resolve path: {e}"))?;

    if let Some(parent) = config_path.parent() {
        if !parent.exists() {
            create_dir_all(parent)
                .map_err(|e| format!("Failed to create config directory: {e}"))?;
        }
    }

    if !config_path.exists() {
        let default_settings = AppSettings::default();
        let json_data = serde_json::to_string_pretty(&default_settings)
            .map_err(|e| format!("Failed to serialize default config: {e}"))?;

        let mut file =
            File::create(&config_path).map_err(|e| format!("Failed to create config file: {e}"))?;
        file.write_all(json_data.as_bytes())
            .map_err(|e| format!("Failed to write config file: {e}"))?;

        return Ok(default_settings);
    }

    let mut file =
        File::open(&config_path).map_err(|e| format!("Failed to open config file: {e}"))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| format!("Failed to read config file: {e}"))?;

    let settings: AppSettings =
        serde_json::from_str(&contents).map_err(|e| format!("Failed to parse config JSON: {e}"))?;

    Ok(settings)
}
