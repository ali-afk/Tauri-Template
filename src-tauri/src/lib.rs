/// Tauri backend entry point.
pub mod commands;
pub mod config;
pub mod error;
pub mod setup;

use tauri_specta::{Builder, collect_commands};
use crate::commands::{app_metadata, app_settings, save_settings};
use crate::setup::build;

pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![app_settings, app_metadata, save_settings]);
    build(builder);
}
