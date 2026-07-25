use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{app_error, to_app_error};

app_error! {
    Config,
    Validation
}

to_app_error!(std::io::Error, strum::ParseError, serde_json::Error);

#[cfg(test)]
mod tests {
    use super::*;
    use std::io;

    #[test]
    fn config_display_shows_inner_message() {
        let err = AppError::Config("storage failed".to_string());
        assert_eq!(err.to_string(), "storage failed");
    }

    #[test]
    fn validation_display_shows_inner_message() {
        let err = AppError::Validation("invalid input".to_string());
        assert_eq!(err.to_string(), "invalid input");
    }

    #[test]
    fn io_error_conversion_from_boxed() {
        let io_err = io::Error::new(io::ErrorKind::NotFound, "file missing");
        let app_err: AppError = io_err.into();
        assert!(matches!(app_err, AppError::Config(_)));
        assert_eq!(app_err.to_string(), "file missing");
    }

    #[test]
    fn strum_error_conversion() {
        let parse_err = strum::ParseError::VariantNotFound;
        let app_err: AppError = parse_err.into();
        assert!(matches!(app_err, AppError::Config(_)));
        assert!(!app_err.to_string().is_empty());
    }

    #[test]
    fn serde_json_error_conversion() {
        let json_err = serde_json::from_value::<String>(serde_json::Value::Null).unwrap_err();
        let app_err: AppError = json_err.into();
        assert!(matches!(app_err, AppError::Config(_)));
        assert!(app_err.to_string().contains("invalid type"));
    }
}
