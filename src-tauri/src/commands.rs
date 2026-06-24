/// Tauri IPC commands exposed to the frontend via specta.
/// Each command is both #[tauri::command] (Tauri handler) and
/// #[specta::specta] (TypeScript type generation).
///
/// Commands read from managed state (set up in lib.rs::build).
/// New commands: add here, register in collect_commands![] in lib.rs.
use crate::{config::{AppMetaData, AppSettings, serialize::write_settings}};
use std::sync::Mutex;
use tauri::{AppHandle, State};


#[tauri::command]
#[specta::specta]
pub fn app_settings(state: tauri::State<'_, Mutex<AppSettings>>) -> Result<AppSettings, String> {
    Ok(*state.lock().expect("Failed to retrieve app settings"))
}

#[tauri::command]
#[specta::specta]
pub fn app_metadata(state: tauri::State<'_,AppMetaData>) -> Result<AppMetaData, String> {
    Ok((*state).clone())
}

#[tauri::command]
#[specta::specta]
pub fn save_settings(app_handle: AppHandle, new_settings: AppSettings, state: State<Mutex<AppSettings>>) -> Result<(),String> {
    write_settings(&app_handle, &new_settings).map_err(|e| e.to_string())?;
    let mut app_state = state.lock().expect("Failed to save app settings");
    *app_state = new_settings;
    Ok(())
}
