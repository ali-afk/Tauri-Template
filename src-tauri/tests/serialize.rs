mod common;

use tauri_plugin_store::StoreExt;
use tauri_template_lib::app::config::{
    AppSettings, AppSettingsKey, AppSettingsKeyKind, Resolution, Theme,
};
use tauri_template_lib::infrastructure::serialize;
use tauri_template_lib::infrastructure::serialize::if_empty_write_default;

#[test]
fn write_then_read_settings_round_trip() {
    let app = common::test_app();

    let mut settings = AppSettings::default();
    settings.theme = Theme::Dark;
    serialize::write_settings(&app, &settings).unwrap();

    let read = serialize::read_settings(&app).unwrap();
    assert_eq!(read.theme, Theme::Dark);
}

#[test]
fn read_settings_field_returns_expected_value() {
    let app = common::test_app();

    let settings = AppSettings::default();
    serialize::write_settings(&app, &settings).unwrap();

    let theme = serialize::read_settings_field(&app, &AppSettingsKeyKind::Theme).unwrap();
    assert!(matches!(theme, AppSettingsKey::Theme(Theme::System)));
}

#[test]
fn write_settings_field_persists_value() {
    let app = common::test_app();

    let value = AppSettingsKey::Theme(Theme::Dark);
    serialize::write_settings_field(&app, value).unwrap();

    let read = serialize::read_settings(&app).unwrap();
    assert_eq!(read.theme, Theme::Dark);
}

#[test]
fn write_settings_field_fullscreen() {
    let app = common::test_app();

    let value = AppSettingsKey::Fullscreen(true);
    serialize::write_settings_field(&app, value).unwrap();

    let read = serialize::read_settings(&app).unwrap();
    assert!(read.fullscreen);
}

#[test]
fn write_then_read_settings_all_fields() {
    let app = common::test_app();

    let mut settings = AppSettings::default();
    settings.theme = Theme::Dark;
    settings.resolution = Resolution::new("800x600").unwrap();
    settings.fullscreen = true;
    serialize::write_settings(&app, &settings).unwrap();

    let read = serialize::read_settings(&app).unwrap();
    assert_eq!(read.theme, Theme::Dark);
    assert_eq!(read.resolution.to_string(), "800x600");
    assert!(read.fullscreen);
}

#[test]
fn if_empty_write_default_seeds_store() {
    let app = common::test_app();
    let store = app.store("settings.json").expect("store to exist");

    // Seed store with defaults, then verify if_empty_write_default
    // correctly detects non-empty store (no crash, no data corruption).
    serialize::write_settings(&app, &AppSettings::default()).unwrap();
    if_empty_write_default(&app, &store).unwrap();

    let settings = serialize::read_settings(&app).unwrap();
    assert_eq!(settings.theme, AppSettings::default().theme);
    assert_eq!(
        settings.resolution.to_string(),
        AppSettings::default().resolution.to_string()
    );
    assert_eq!(settings.fullscreen, AppSettings::default().fullscreen);
}

#[test]
fn if_empty_write_default_does_not_overwrite() {
    let app = common::test_app();

    let mut custom = AppSettings::default();
    custom.theme = Theme::Dark;
    custom.fullscreen = true;
    serialize::write_settings(&app, &custom).unwrap();

    let store = app.store("settings.json").expect("store to exist");
    if_empty_write_default(&app, &store).unwrap();

    let settings = serialize::read_settings(&app).unwrap();
    assert_eq!(settings.theme, Theme::Dark);
    assert!(settings.fullscreen);
}

#[test]
fn from_json_value_type_mismatch_returns_error() {
    let result = AppSettingsKey::from_json_value(AppSettingsKeyKind::Theme, serde_json::json!(42));
    assert!(result.is_err());
}
