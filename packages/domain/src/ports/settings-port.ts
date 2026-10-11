import type {
	AppError,
	AppSettings,
	AppSettingsKey,
	AppSettingsKeyKind,
} from "@tauri-template/infrastructure/tauri/bindings";

import type { Result } from "./result.js";

/** Port for the persisted user settings (theme, resolution, fullscreen).
 *  Implemented by the native adapter (Tauri IPC) and the web adapter
 *  (localStorage behind the WebStorage seam). */
export interface SettingsPort {
	/** Reads all settings from the store. */
	readSettings(): Promise<Result<AppSettings, AppError>>;

	/** Reads a single setting field by its kind identifier. */
	readSettingsField(key: AppSettingsKeyKind): Promise<Result<AppSettingsKey, AppError>>;

	/** Writes all settings, overwriting the entire config. */
	writeSettings(settings: AppSettings): Promise<Result<null, AppError>>;

	/** Writes a single setting field, leaving other fields unchanged. */
	writeSettingsField(value: AppSettingsKey): Promise<Result<null, AppError>>;
}
