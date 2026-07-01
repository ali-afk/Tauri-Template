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
use crate::config::serialize::read_settings;
use crate::config::{
    types::{ContactInfo, Email},
    AppMetaData,
};
use tauri_plugin_log::{Target, TargetKind};
use crate::error::AppError;
use std::sync::Mutex;
use tauri::Config;
use tauri::{App, Manager, Wry};
use tauri_specta::Builder;

fn init_app_metadata(config: &Config) -> AppMetaData {
    let description = "A modern, accessible desktop application built with Tauri + SvelteKit, featuring design tokens, auto-contrast colors, and a component library.".into();
    let url = "https://oun.digital".into();
    let email = Email::new("ali.hussain.ali.oun@gmail.com").expect("App metadata init failure");
    let github = "https://github.com/ali-afk".into();
    let contacts = ContactInfo { email, github };

    AppMetaData {
        version: config
            .version
            .clone()
            .expect("Could not retrieve app version!"),
        name: config
            .product_name
            .clone()
            .expect("Could not retrieve app name!"),
        description,
        url,
        contacts,
    }
}

#[cfg(debug_assertions)]
fn gen_bindings(builder: &Builder<Wry>) {
    builder
        .export(specta_typescript::Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to generate Typescript bindings!");
}

fn setup(app: &App, builder: &Builder<Wry>) -> Result<(), AppError> {
    let app_metadata = init_app_metadata(app.config());
    let app_settings = read_settings(app.handle())?;

    app.manage(app_metadata);
    app.manage(Mutex::new(app_settings));

    builder.mount_events(app);
    Ok(())
}

pub fn build(builder: Builder<Wry>) {
    #[cfg(debug_assertions)]
    gen_bindings(&builder);

    let logfile = Target::new(TargetKind::LogDir {
      file_name: Some("log".to_string())
    });
    let log_targets = [Target::new(TargetKind::Stdout), logfile];

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().targets(log_targets).build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            setup(app, &builder)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
