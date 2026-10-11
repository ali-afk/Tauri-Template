use app::config::AppMetadata;
use domain::{
    error::AppError,
    types::{ContactInfo, Email},
};
use infrastructure::serialize;
use tauri::{App, Context, Wry};
use tauri::{Config, Manager};
use tauri_plugin_store::StoreExt;
use tauri_specta::{Builder, collect_commands};

fn init_app_metadata(config: &Config) -> AppMetadata {
    let description = "A modern, accessible desktop application built with Tauri + SvelteKit, featuring design tokens, auto-contrast colors, and a component library.".into();
    let url = "https://oun.digital".into();
    let email = Email::new("ali.hussain.ali.oun@gmail.com").expect("App metadata init failure");
    let github = "https://github.com/ali-afk".into();
    let contacts = ContactInfo { email, github };

    AppMetadata {
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
    let bindings_path = "../infrastructure/src/tauri/bindings.ts";
    builder
        .export(specta_typescript::Typescript::default(), bindings_path)
        .expect("Failed to generate Typescript bindings!");
}

fn setup(app: &App, builder: &Builder<Wry>) -> Result<(), AppError> {
    let app_metadata = init_app_metadata(app.config());
    app.manage(app_metadata);

    let settings = app
        .store("settings.json")
        .map_err(|e| AppError::Config(e.to_string()))?;
    serialize::if_empty_write_default(app.handle(), &settings)?;

    builder.mount_events(app);
    Ok(())
}

pub fn build(builder: Builder<Wry>, context: Context<Wry>) {
    let builder = builder.commands(collect_commands![
        infrastructure::commands::app_metadata,
        infrastructure::commands::write_settings,
        infrastructure::commands::write_settings_field,
        infrastructure::commands::read_settings,
        infrastructure::commands::read_settings_field
    ]);

    #[cfg(debug_assertions)]
    gen_bindings(&builder);

    let tauri_builder = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            setup(app, &builder)?;
            Ok(())
        });

    #[cfg(not(debug_assertions))]
    let tauri_builder = {
        use tauri_plugin_log::{Target, TargetKind};
        let logfile = Target::new(TargetKind::LogDir {
            file_name: Some("log".to_string()),
        });
        let log_targets = [Target::new(TargetKind::Stdout), logfile];
        tauri_builder.plugin(
            tauri_plugin_log::Builder::new()
                .targets(log_targets)
                .build(),
        )
    };

    #[cfg(debug_assertions)]
    let tauri_builder = tauri_builder.plugin(tauri_plugin_devtools::init());

    #[cfg(feature = "e2e")]
    let tauri_builder = tauri_builder
        .plugin(tauri_plugin_wdio::init())
        .plugin(tauri_plugin_wdio_webdriver::init());

    tauri_builder
        .run(context)
        .expect("error while running tauri application");
}
