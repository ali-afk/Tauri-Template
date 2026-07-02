pub mod serialize;
pub mod types;

use crate::{
    config::{types::{ContactInfo, Resolution, Theme}}
};
use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{AsRefStr, Display};

/// Application metadata read from tauri.conf.json at startup.
/// Displayed in window title, about dialogs, and contact sections.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct AppMetadata {
    pub version: String,
    pub name: String,
    pub description: String,
    pub url: String,
    pub contacts: ContactInfo,
}

/// Persisted user settings. Read from `config.json` in
/// `BaseDirectory::AppConfig` on startup. Falls back to
/// defaults if the file doesn't exist yet.
#[derive(Deserialize, Serialize, Clone, Type, Copy, Default)]
pub struct AppSettings {
    pub theme: Theme,
    pub resolution: Resolution,
    pub fullscreen: bool,
}

#[derive(Deserialize, Serialize, Clone, Type, Display, AsRefStr)]
pub enum AppSettingsKeyKind {
    #[strum(to_string = "theme")]
    Theme,
    #[strum(to_string = "resolution")]
    Resolution,
    #[strum(to_string = "fullscreen")]
    Fullscreen,
}

#[derive(Deserialize, Serialize, Clone, Type)]
pub enum AppSettingsKey {
    Theme(Theme),
    Resolution(Resolution),
    Fullscreen(bool),
}

impl AppSettingsKey {
    pub fn kind(&self) -> AppSettingsKeyKind {
        match self {
            Self::Theme(_) => AppSettingsKeyKind::Theme,
            Self::Resolution(_) => AppSettingsKeyKind::Resolution,
            Self::Fullscreen(_) => AppSettingsKeyKind::Fullscreen,
        }
    }
}
