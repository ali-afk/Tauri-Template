use regex::Regex;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::OnceLock;

use crate::error::AppError;

#[derive(Deserialize, Serialize, Clone, Type)]
pub struct Email(String);

impl Email {
    pub fn new(email: impl Into<String>) -> Result<Self, AppError> {
        let email = email.into();
        static PATTERN_LOCK: OnceLock<Regex> = OnceLock::new();
        let pattern =
            PATTERN_LOCK.get_or_init(|| Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap());

        if pattern.is_match(&email) {
            Ok(Email(email))
        } else {
            Err(AppError::Validation(format!("Invalid email: {email}")))
        }
    }
}

impl AsRef<str> for Email {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

#[derive(Deserialize, Serialize, Clone, Type, Copy)]
pub struct Resolution(u32, u32);

impl Resolution {
    pub fn new(resolution: impl Into<String>) -> Result<Self, AppError> {
        let resolution = resolution.into();
        static PATTERN_LOCK: OnceLock<Regex> = OnceLock::new();
        let pattern = PATTERN_LOCK.get_or_init(|| Regex::new(r"^(\d+)x(\d+)$").unwrap());

        if let Some(captured) = pattern.captures(&resolution) {
            let width: u32 = captured[1].parse().expect("Should have parsed u32, regex might be invalid");
            let height: u32 = captured[2].parse().expect("Should have parsed u32, regex might be invalid");
            Ok(Resolution(width, height))
        } else {
            Err(AppError::Validation(format!(
                "Invalid resolution: {resolution}"
            )))
        }
    }
}

#[derive(Deserialize, Serialize, Clone, Type)]
pub struct ContactInfo {
    pub email: Email,
    pub github: String,
}

#[derive(Deserialize, Serialize, Clone, Type, Copy)]
pub enum Theme {
    Light,
    Dark,
    System,
}
