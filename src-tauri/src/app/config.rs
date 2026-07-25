pub use crate::domain::types::{ContactInfo, Resolution, Theme};

use crate::{app_settings, domain::error::AppError};
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn app_settings_default_values() {
        let settings = AppSettings::default();
        assert_eq!(settings.theme, Theme::System);
        assert_eq!(settings.resolution.to_string(), "1920x1080");
        assert!(!settings.fullscreen);
    }

    #[test]
    fn app_settings_key_kind_round_trip() {
        let mut kind: AppSettingsKeyKind;

        kind = AppSettingsKeyKind::Theme;
        assert_eq!(kind.as_ref(), "theme");
        assert_eq!(AppSettingsKeyKind::from_str("theme").unwrap(), kind);

        kind = AppSettingsKeyKind::Resolution;
        assert_eq!(kind.as_ref(), "resolution");
        assert_eq!(AppSettingsKeyKind::from_str("resolution").unwrap(), kind);

        kind = AppSettingsKeyKind::Fullscreen;
        assert_eq!(kind.as_ref(), "fullscreen");
        assert_eq!(AppSettingsKeyKind::from_str("fullscreen").unwrap(), kind);
    }

    #[test]
    fn app_settings_key_to_json_value() {
        let key = AppSettingsKey::Theme(Theme::Dark);
        let val = key.to_json_value().unwrap();
        assert_eq!(val, serde_json::json!("Dark"));
    }

    #[test]
    fn app_settings_key_from_json_value() {
        let val = serde_json::json!("Dark");
        let key = AppSettingsKey::from_json_value(AppSettingsKeyKind::Theme, val).unwrap();
        assert!(matches!(key, AppSettingsKey::Theme(Theme::Dark)));
    }

    #[test]
    fn app_settings_key_kind_method() {
        let key = AppSettingsKey::Fullscreen(true);
        assert_eq!(key.kind(), AppSettingsKeyKind::Fullscreen);
    }
}
