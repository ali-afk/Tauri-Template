import type { AppError, AppMetadata } from "@tauri-template/infrastructure/tauri/bindings";

import type { Result } from "./result.js";

/** Port for read-only application metadata sourced from tauri.conf.json.
 *  Displayed in window title, about dialogs, and contact sections. */
export interface MetadataPort {
	/** Reads application metadata (version, name, description, url, contacts). */
	appMetadata(): Promise<Result<AppMetadata, AppError>>;
}
