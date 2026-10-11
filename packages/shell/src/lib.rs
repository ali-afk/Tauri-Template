pub mod setup;
use tauri_specta::Builder;

pub fn run() {
    let builder = Builder::<tauri::Wry>::new();
    setup::build(builder, tauri::generate_context!());
}
