pub mod serialize;
pub mod types;

use crate::config::types::{ContactInfo, Resolution, Theme};
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

/// Persisted user settings. Backed by tauri-plugin-store (settings.json).
/// Defaults written on first access via if_empty_write_default().
#[derive(Deserialize, Serialize, Clone, Type, Copy, Default)]
pub struct AppSettings {
    pub theme: Theme,
    pub resolution: Resolution,
    pub fullscreen: bool,
}

/// IPC-compatible enum identifying which setting field to read/write.
/// Use `as_ref()` to get the lowercase store key.
/// TS type: `"Theme" | "Resolution" | "Fullscreen"`.
#[derive(Deserialize, Serialize, Clone, Type, Display, AsRefStr)]
pub enum AppSettingsKeyKind {
    #[strum(to_string = "theme")]
    Theme,
    #[strum(to_string = "resolution")]
    Resolution,
    #[strum(to_string = "fullscreen")]
    Fullscreen,
}

/// A tagged union of a single setting value, used by read_settings_field
/// and write_settings_field IPC commands. Exactly one variant is set.
/// TS type: `{ Theme: Theme } | { Resolution: Resolution } | { Fullscreen: boolean }`.
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
