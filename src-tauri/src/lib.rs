/// Tauri backend entry point.
pub mod commands;
pub mod config;
pub mod error;
pub mod setup;

use tauri_specta::{Builder, collect_commands};
use crate::commands::{app_metadata, write_settings, write_settings_field, read_settings, read_settings_field};
use crate::setup::build;

pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![app_metadata, write_settings, write_settings_field, read_settings, read_settings_field]);
    build(builder);
}
