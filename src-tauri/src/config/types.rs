use regex::Regex;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::OnceLock;

/// Validated email address. Must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
/// Uses OnceLock to compile regex once.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct Email(pub String);

impl Email {
    pub fn parse(email: String) -> Result<Self, String> {
        static PATTERN_LOCK: OnceLock<Regex> = OnceLock::new();
        let pattern =
            PATTERN_LOCK.get_or_init(|| Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap());

        if pattern.is_match(&email) {
            Ok(Email(email))
        } else {
            Err(format!("Invalid email: {email}"))
        }
    }
}

impl AsRef<str> for Email {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

/// Validated window resolution string (`WIDTHxHEIGHT`).
/// Currently defined but NOT used — AppSettings.resolution uses `(u32, u32)`.
/// Planned for future editable user config where validated string storage is needed.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct WindowResolution(String);

impl WindowResolution {
    pub fn parse(resolution: String) -> Result<Self, String> {
        static PATTERN_LOCK: OnceLock<Regex> = OnceLock::new();
        let pattern = PATTERN_LOCK.get_or_init(|| Regex::new(r"^(\d)+x(\d)+$").unwrap());

        if pattern.is_match(&resolution) {
            Ok(WindowResolution(resolution))
        } else {
            Err(format!("Invalid resolution: {resolution}"))
        }
    }
}

impl AsRef<str> for WindowResolution {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

/// Contact information for the application author/maintainer.
#[derive(Deserialize, Serialize, Clone, Type)]
pub struct ContactInfo {
    pub email: Email,
    pub github: String,
}

/// Theme preference matching the Tauri window's light/dark detection.
#[derive(Deserialize, Serialize, Clone, Type)]
pub enum Theme {
    Light,
    Dark,
    System,
}
