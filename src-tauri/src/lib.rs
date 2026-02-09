/// Tauri backend entry point.
///
/// build(): sets up specta for type-safe IPC, registers commands,
/// initializes app config state, and starts the Tauri runtime.
///
/// gen_bindings(): in debug mode, exports TypeScript types to
/// src/lib/bindings.ts for the frontend.
///
/// To add a new IPC command:
/// 1. Define fn in commands.rs with #[tauri::command] + #[specta::specta]
/// 2. Add to collect_commands![] below
/// 3. Manage any new state via app.manage()
/// 4. Frontend auto-generates bindings on rebuild
use crate::commands::{app_metadata, app_settings};
use crate::config::init::{get_app_metadata, init_app_settings};
use specta_typescript::Typescript;
use tauri::{Manager, Wry};
use tauri_specta::{collect_commands, Builder};

pub mod commands;
pub mod config;

pub fn run() {
    build();
}

pub fn build() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![app_settings, app_metadata]);
    gen_bindings(&builder);

    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            let app_metadata = get_app_metadata(app.config());
            let app_settings =
                init_app_settings(app.handle()).expect("Could not initialize config!");

            app.manage(app_metadata);
            app.manage(app_settings);

            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub fn gen_bindings(builder: &Builder<Wry>) {
    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to generate Typescript bindings!");
}
