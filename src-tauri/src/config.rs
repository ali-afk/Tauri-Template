pub mod macros;
pub mod serialize;
pub mod types;

use crate::{
    app_settings,
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

app_settings! {
    theme: Theme(Theme),
    resolution: Resolution(Resolution),
    fullscreen: Fullscreen(bool),
}
