import type {
	AppError,
	AppSettings,
	AppSettingsKey,
	AppSettingsKeyKind,
	Resolution,
	Result,
	SettingsPort,
	Theme,
} from "@tauri-template/domain/ports";

import { configError, isRecord, readJson } from "./read-json.js";
import { defaultWebStorage, type WebStorage } from "./web-storage.js";

const SETTINGS_KEY = "settings";

function isTheme(value: unknown): value is Theme {
	return value === "Light" || value === "Dark" || value === "System";
}

function isResolution(value: unknown): value is Resolution {
	return (
		Array.isArray(value) &&
		value.length === 2 &&
		typeof value.at(0) === "number" &&
		typeof value.at(1) === "number"
	);
}

/** Boundary guard: parsed JSON must match the AppSettings shape before it
 *  crosses into typed land. */
function isAppSettings(value: unknown): value is AppSettings {
	if (!isRecord(value)) return false;
	return (
		isTheme(value["theme"]) &&
		isResolution(value["resolution"]) &&
		typeof value["fullscreen"] === "boolean"
	);
}

async function readSettings(storage: WebStorage): Promise<Result<AppSettings, AppError>> {
	const parsed = readJson(storage, SETTINGS_KEY);
	if (parsed.status === "error") return parsed;
	if (!isAppSettings(parsed.data)) {
		return configError("Stored settings do not match the AppSettings shape");
	}
	return { status: "ok", data: parsed.data };
}

async function writeSettings(
	storage: WebStorage,
	settings: AppSettings,
): Promise<Result<null, AppError>> {
	try {
		storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
		return { status: "ok", data: null };
	} catch (error) {
		return configError(`Failed to write settings to web storage: ${error}`);
	}
}

/** Merges one tagged key into the settings, preserving the other fields.
 *  Destructure + undefined checks: the union's `?: never` members defeat
 *  `in`-narrowing, and the throw names the contract violation for
 *  ill-typed JS callers. */
function applyKey(settings: AppSettings, key: AppSettingsKey): AppSettings {
	const { Theme: theme, Resolution: resolution, Fullscreen: fullscreen } = key;
	if (theme !== undefined) return { ...settings, theme };
	if (resolution !== undefined) return { ...settings, resolution };
	if (fullscreen !== undefined) return { ...settings, fullscreen };
	throw new TypeError("AppSettingsKey must set exactly one field");
}

async function readSettingsField(
	storage: WebStorage,
	kind: AppSettingsKeyKind,
): Promise<Result<AppSettingsKey, AppError>> {
	const parsed = await readSettings(storage);
	if (parsed.status === "error") return parsed;
	switch (kind) {
		case "Theme":
			return { status: "ok", data: { Theme: parsed.data.theme } };
		case "Resolution":
			return { status: "ok", data: { Resolution: parsed.data.resolution } };
		case "Fullscreen":
			return { status: "ok", data: { Fullscreen: parsed.data.fullscreen } };
	}
}

async function writeSettingsField(
	storage: WebStorage,
	key: AppSettingsKey,
): Promise<Result<null, AppError>> {
	const parsed = await readSettings(storage);
	if (parsed.status === "error") return parsed;
	return writeSettings(storage, applyKey(parsed.data, key));
}

/** Web adapter for the settings port, backed by the storage seam
 *  (localStorage by default). The stored JSON shape matches AppSettings. */
export function createWebSettingsService(storage: WebStorage = defaultWebStorage()): SettingsPort {
	return {
		readSettings: () => readSettings(storage),
		readSettingsField: (kind) => readSettingsField(storage, kind),
		writeSettings: (settings) => writeSettings(storage, settings),
		writeSettingsField: (key) => writeSettingsField(storage, key),
	};
}
