import type {
	AppError,
	AppMetadata,
	ContactInfo,
	MetadataPort,
	Result,
} from "@tauri-template/domain/ports";

import { configError, isRecord, readJson } from "./read-json.js";
import { defaultWebStorage, type WebStorage } from "./web-storage.js";

const METADATA_KEY = "metadata";

function isContactInfo(value: unknown): value is ContactInfo {
	if (!isRecord(value)) return false;
	return typeof value["email"] === "string" && typeof value["github"] === "string";
}

/** Boundary guard: parsed JSON must match the AppMetadata shape before it
 *  crosses into typed land. */
function isAppMetadata(value: unknown): value is AppMetadata {
	if (!isRecord(value)) return false;
	return (
		typeof value["version"] === "string" &&
		typeof value["name"] === "string" &&
		typeof value["description"] === "string" &&
		typeof value["url"] === "string" &&
		isContactInfo(value["contacts"])
	);
}

async function appMetadata(storage: WebStorage): Promise<Result<AppMetadata, AppError>> {
	const parsed = readJson(storage, METADATA_KEY);
	if (parsed.status === "error") return parsed;
	if (!isAppMetadata(parsed.data)) {
		return configError("Stored metadata does not match the AppMetadata shape");
	}
	return { status: "ok", data: parsed.data };
}

/** Web adapter for the metadata port, backed by the storage seam
 *  (localStorage by default). The stored JSON shape matches AppMetadata.
 *  Metadata is read-only — there is no write path, mirroring the native
 *  command surface. */
export function createWebMetadataService(storage: WebStorage = defaultWebStorage()): MetadataPort {
	return {
		appMetadata: () => appMetadata(storage),
	};
}
