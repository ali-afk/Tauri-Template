use crate::domain::error::AppError;
use regex::Regex;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fmt;
use std::sync::OnceLock;

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
            let width: u32 = captured[1]
                .parse()
                .expect("Should have parsed u32, regex might be invalid");
            let height: u32 = captured[2]
                .parse()
                .expect("Should have parsed u32, regex might be invalid");
            Ok(Resolution(width, height))
        } else {
            Err(AppError::Validation(format!(
                "Invalid resolution: {resolution}"
            )))
        }
    }
}

impl Default for Resolution {
    fn default() -> Self {
        Resolution(1920, 1080)
    }
}

impl fmt::Display for Resolution {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}x{}", self.0, self.1)
    }
}

#[derive(Deserialize, Serialize, Clone, Type)]
pub struct ContactInfo {
    pub email: Email,
    pub github: String,
}

#[derive(Deserialize, Serialize, Clone, Type, Copy, Default, Debug, PartialEq)]
pub enum Theme {
    Light,
    Dark,
    #[default]
    System,
}

#[cfg(test)]
mod tests {
    use super::{Email, Resolution, Theme};

    // --- Email ---

    #[test]
    fn email_minimal_valid() {
        assert!(Email::new("a@b.c").is_ok());
    }

    #[test]
    fn email_unicode_domain() {
        assert!(Email::new("user@例子.地址").is_ok());
    }

    #[test]
    fn email_dots_in_local_part() {
        assert!(Email::new("first.last@domain.com").is_ok());
    }

    #[test]
    fn email_missing_dot_in_domain() {
        assert!(Email::new("user@domain").is_err());
    }

    // --- Resolution ---

    #[test]
    fn resolution_zero() {
        let res = Resolution::new("0x0").unwrap();
        assert_eq!(res.to_string(), "0x0");
    }

    #[test]
    fn resolution_extreme() {
        let res = Resolution::new("99999x99999").unwrap();
        assert_eq!(res.to_string(), "99999x99999");
    }

    #[test]
    fn resolution_negative_not_allowed() {
        assert!(Resolution::new("-1x-1").is_err());
    }
    #[test]
    fn valid_email_accepts_standard_format() {
        let email = Email::new("user@example.com");
        assert!(email.is_ok());
    }

    #[test]
    fn valid_email_accepts_plus_addressing() {
        let email = Email::new("user+tag@example.co.uk");
        assert!(email.is_ok());
    }

    #[test]
    fn invalid_email_rejects_missing_at() {
        let email = Email::new("userexample.com");
        assert!(email.is_err());
    }

    #[test]
    fn invalid_email_rejects_missing_domain() {
        let email = Email::new("user@.com");
        assert!(email.is_err());
    }

    #[test]
    fn invalid_email_rejects_empty() {
        let email = Email::new("");
        assert!(email.is_err());
    }

    #[test]
    fn email_as_ref_str() {
        let email = Email::new("test@test.com").unwrap();
        assert_eq!(email.as_ref(), "test@test.com");
    }

    // --- Resolution ---

    #[test]
    fn resolution_valid_format() {
        let res = Resolution::new("1920x1080");
        assert!(res.is_ok());
    }

    #[test]
    fn resolution_parses_correct_values() {
        let res = Resolution::new("1920x1080").unwrap();
        assert_eq!(res.to_string(), "1920x1080");
    }

    #[test]
    fn resolution_invalid_format_rejected() {
        let res = Resolution::new("1920x1080p");
        assert!(res.is_err());
    }

    #[test]
    fn resolution_non_numeric_rejected() {
        let res = Resolution::new("abcxdef");
        assert!(res.is_err());
    }

    #[test]
    fn resolution_default_is_1920x1080() {
        let res = Resolution::default();
        assert_eq!(res.to_string(), "1920x1080");
    }

    // --- Theme ---

    #[test]
    fn theme_default_is_system() {
        assert_eq!(Theme::default(), Theme::System);
    }
}
