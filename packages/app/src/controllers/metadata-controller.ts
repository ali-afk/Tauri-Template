import type { AppError, AppMetadata, MetadataPort, Result } from "@tauri-template/domain/ports";
import { getMetadataService } from "@tauri-template/infrastructure";

/** Application-layer metadata use cases over the MetadataPort. */
export interface MetadataController {
	/** Reads application metadata (version, name, description, url, contacts). */
	appMetadata(): Promise<Result<AppMetadata, AppError>>;
}

/** Builds the metadata controller over the given port, defaulting to the
 *  infrastructure module-singleton service (native IPC under Tauri,
 *  localStorage in a plain browser). */
export function createMetadataController(
	metadata: MetadataPort = getMetadataService(),
): MetadataController {
	return {
		appMetadata: () => metadata.appMetadata(),
	};
}
