import type {
	AppError,
	AppSettings,
	AppSettingsKey,
	AppSettingsKeyKind,
	Result,
	SettingsPort,
} from "@tauri-template/domain/ports";
import { getSettingsService } from "@tauri-template/infrastructure";

/** Application-layer settings use cases over the SettingsPort. */
export interface SettingsController {
	/** Reads all settings from the store. */
	readSettings(): Promise<Result<AppSettings, AppError>>;

	/** Reads a single setting field by its kind identifier. */
	readSettingsField(key: AppSettingsKeyKind): Promise<Result<AppSettingsKey, AppError>>;

	/** Writes all settings, overwriting the entire config. */
	writeSettings(settings: AppSettings): Promise<Result<null, AppError>>;

	/** Writes a single setting field, leaving other fields unchanged. */
	writeSettingsField(value: AppSettingsKey): Promise<Result<null, AppError>>;
}

/** Builds the settings controller over the given port, defaulting to the
 *  infrastructure module-singleton service (native IPC under Tauri,
 *  localStorage in a plain browser). */
export function createSettingsController(
	settings: SettingsPort = getSettingsService(),
): SettingsController {
	return {
		readSettings: () => settings.readSettings(),
		readSettingsField: (key) => settings.readSettingsField(key),
		writeSettings: (value) => settings.writeSettings(value),
		writeSettingsField: (value) => settings.writeSettingsField(value),
	};
}
