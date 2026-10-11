fn main() {
    // We use a custom capabilities path pattern below, so tauri-build does not emit
    // its own rerun-if-changed for the capabilities directory. Emit it ourselves so
    // edits to capability files re-run this build script.
    println!("cargo:rerun-if-changed=capabilities");

    // The wdio plugin crates are optional dependencies behind the off-by-default `e2e`
    // feature, so their ACL manifests only exist in an e2e build. The capability file
    // that references `wdio:*` permissions must therefore only be loaded then; the
    // default build loads just `default.json`.
    let capabilities_pattern = if std::env::var("CARGO_FEATURE_E2E").is_ok() {
        "./capabilities/**/*"
    } else {
        "./capabilities/default.json"
    };

    tauri_build::try_build(
        tauri_build::Attributes::new().capabilities_path_pattern(capabilities_pattern),
    )
    .expect("failed to run tauri-build");
}
