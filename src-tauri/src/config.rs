pub mod serialize;
pub mod types;

use crate::config::types::{ContactInfo, Theme, Resolution};
use serde::{Deserialize, Serialize};
use specta::Type;

/// Application metadata read from tauri.conf.json at startup.
/// Displayed in window title, about dialogs, and contact sections.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct AppMetaData {
    pub version: String,
    pub name: String,
    pub description: String,
    pub url: String,
    pub contacts: ContactInfo,
}

/// Persisted user settings. Read from `config.json` in
/// `BaseDirectory::AppConfig` on startup. Falls back to
/// defaults if the file doesn't exist yet.
#[derive(Deserialize, Serialize, Clone, Type, Copy)]
pub struct AppSettings {
    pub theme: Theme,
    /// Window resolution as (width, height). Mirrors tauri.conf.json defaults.
    /// Future: will use WindowResolution type for validated string storage.
    pub resolution: Resolution,
    pub fullscreen: bool,
}

impl Default for AppSettings {
    fn default() -> AppSettings {
        let resolution = Resolution::new("1200x800").expect("App settings init failure");
        AppSettings {
            resolution,
            theme: Theme::System,
            fullscreen: false,
        }
    }
}
