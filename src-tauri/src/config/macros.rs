#[macro_export]
macro_rules! app_settings {
    ( $( $field:ident: $variant:ident ($type:ty) ),+ $(,)? ) => {
        /// Persisted user settings. Backed by tauri-plugin-store (settings.json).
        /// Defaults written on first access via if_empty_write_default().
        #[derive(Deserialize, Serialize, Clone, Type, Copy, Default)]
        pub struct AppSettings {
            $(
                pub $field: $type,
            )+
        }

        /// IPC-compatible enum identifying which setting field to read/write.
        /// Use `as_ref()` to get the lowercase store key.
        /// TS type: `"Theme" | "Resolution" | "Fullscreen"`.
        #[derive(Deserialize, Serialize, Clone, Type, Display, AsRefStr, Copy, strum::EnumString)]
        #[strum(serialize_all = "lowercase")]
        pub enum AppSettingsKeyKind {
            $(
                $variant,
            )+
        }

        /// A tagged union of a single setting value, used by read_settings_field
        /// and write_settings_field IPC commands. Exactly one variant is set.
        /// TS type: `{ Theme: Theme } | { Resolution: Resolution } | { Fullscreen: boolean }`.
        #[derive(Deserialize, Serialize, Clone, Type)]
        pub enum AppSettingsKey {
            $(
                $variant($type),
            )+
        }

        impl AppSettingsKey {
            pub fn kind(&self) -> AppSettingsKeyKind {
                match self {
                    $(
                        Self::$variant(_) => AppSettingsKeyKind::$variant,
                    )+
                }
            }

            pub fn to_json_value(&self) -> Result<serde_json::Value, AppError> {
                let val = match self {
                    $(
                        AppSettingsKey::$variant(val) => serde_json::to_value(val),
                    )+
                };
                val.map_err(|e| AppError::Config(e.to_string()))
            }

            pub fn from_json_value(
                kind: AppSettingsKeyKind,
                val: Value,
            ) -> Result<AppSettingsKey, AppError> {
                fn parse<T: serde::de::DeserializeOwned>(
                    kind: &AppSettingsKeyKind,
                    val: Value,
                ) -> Result<T, AppError> {
                    serde_json::from_value(val)
                        .map_err(|e| AppError::Config(format!("Setting '{kind}' is invalid: {e}")))
                }

                match kind {
                    $(
                        AppSettingsKeyKind::$variant => Ok(Self::$variant(parse(&kind, val)?)),
                    )+
                }
            }
        }
    };
}
