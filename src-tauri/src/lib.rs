pub mod app;
pub mod domain;
pub mod infrastructure;

use crate::{
    app::commands::{
        app_metadata, read_settings, read_settings_field, write_settings, write_settings_field,
    },
    infrastructure::setup,
};
use setup::build;
use tauri_specta::{collect_commands, Builder};

pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        app_metadata,
        write_settings,
        write_settings_field,
        read_settings,
        read_settings_field
    ]);
    build(builder);
}
