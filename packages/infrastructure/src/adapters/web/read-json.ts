import type { AppError, Result } from "@tauri-template/domain/ports";

import type { WebStorage } from "./web-storage.js";

/** Builds the Config variant of the port error envelope. */
export function configError(message: string): Result<never, AppError> {
	return { status: "error", error: { type: "Config", data: message } };
}

/** Narrows parsed JSON to a plain object (arrays excluded). */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads and parses one JSON entry from the storage seam.
 *  Missing keys and unparsable content become Config errors; the parsed
 *  value stays `unknown` — shape guards belong to each adapter. */
export function readJson(storage: WebStorage, key: string): Result<unknown, AppError> {
	const raw = storage.getItem(key);
	if (raw === null) {
		return configError(`No data for key '${key}' in web storage`);
	}
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return configError(`Corrupt JSON for key '${key}' in web storage`);
	}
	return { status: "ok", data };
}
