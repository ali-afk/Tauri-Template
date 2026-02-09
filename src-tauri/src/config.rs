pub mod init;
pub mod types;

use crate::config::types::{ContactInfo, Theme};
use serde::{Deserialize, Serialize};
use specta::Type;

/// Application metadata read from tauri.conf.json at startup.
/// Displayed in window title, about dialogs, and contact sections.
///
/// NOTE: short_description and long_description are temporarily
/// commented out because tauri::Config v2 doesn't expose these
/// fields from the config struct in a directly accessible way.
/// Will be restored when the API supports them or when custom
/// configuration is implemented.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct AppMetaData {
    pub app_version: String,
    pub app_name: String,
    // pub short_description: String,
    // pub long_description: String,
    pub app_url: String,
    pub contacts: ContactInfo,
}

/// Persisted user settings. Read from `config.json` in
/// `BaseDirectory::AppConfig` on startup. Falls back to
/// defaults if the file doesn't exist yet.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct AppSettings {
    pub theme: Theme,
    /// Window resolution as (width, height). Mirrors tauri.conf.json defaults.
    /// Future: will use WindowResolution type for validated string storage.
    pub resolution: (u32, u32),
    pub fullscreen: bool,
}

impl Default for AppSettings {
    fn default() -> AppSettings {
        AppSettings {
            theme: Theme::System,
            resolution: (1200, 800),
            fullscreen: false,
        }
    }
}
