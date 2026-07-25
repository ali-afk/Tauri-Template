use tauri::test::MockRuntime;
use tauri::test::{mock_builder, mock_context, noop_assets};

/// Creates a Tauri test app backed by an isolated temp directory.
/// Each call creates its own mock_context, giving each test a unique store path.
pub fn test_app() -> tauri::AppHandle<MockRuntime> {
    mock_builder()
        .plugin(tauri_plugin_store::Builder::new().build())
        .build(mock_context(noop_assets()))
        .expect("failed to build test app")
        .handle()
        .clone()
}
