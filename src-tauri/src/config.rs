pub mod serialize;
pub mod types;

use crate::{
    config::types::{ContactInfo, Resolution, Theme},
    error::AppError,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
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
#[derive(Deserialize, Serialize, Clone, Type, Display, AsRefStr, Copy)]
#[strum(serialize_all = "lowercase")]
pub enum AppSettingsKeyKind {
    Theme,
    Resolution,
    Fullscreen,
}

use std::str::FromStr;

impl FromStr for AppSettingsKeyKind {
    type Err = AppError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "theme" => Ok(AppSettingsKeyKind::Theme),
            "resolution" => Ok(AppSettingsKeyKind::Resolution),
            "fullscreen" => Ok(AppSettingsKeyKind::Fullscreen),
            _ => Err(AppError::Config(format!("Invalid setting key '{s}'"))),
        }
    }
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

    pub fn to_json_value(&self) -> Result<serde_json::Value, AppError> {
        let val = match self {
            AppSettingsKey::Theme(t) => serde_json::to_value(t),
            AppSettingsKey::Resolution(r) => serde_json::to_value(r),
            AppSettingsKey::Fullscreen(f) => serde_json::to_value(f),
        };
        val.map_err(|e| AppError::Config(e.to_string()))
    }

    pub fn from_json_value(
        kind: AppSettingsKeyKind,
        val: Value,
    ) -> Result<AppSettingsKey, AppError> {
        fn parse<T: serde::de::DeserializeOwned>(
            kind: &AppSettingsKeyKind,
            val: Value,
        ) -> Result<T, AppError> {
            serde_json::from_value(val)
                .map_err(|e| AppError::Config(format!("Setting '{kind}' is invalid: {e}")))
        }

        match kind {
            AppSettingsKeyKind::Theme => Ok(Self::Theme(parse(&kind, val)?)),
            AppSettingsKeyKind::Resolution => Ok(Self::Resolution(parse(&kind, val)?)),
            AppSettingsKeyKind::Fullscreen => Ok(Self::Fullscreen(parse(&kind, val)?)),
        }
    }
}
