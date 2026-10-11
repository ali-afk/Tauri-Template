import type { MetadataPort } from "@tauri-template/domain/ports";

import { createNativeMetadataService } from "../adapters/native/native-metadata-adapter.js";
import { createWebMetadataService } from "../adapters/web/web-metadata-adapter.js";

let metadataService: MetadataPort | undefined;

/** True when running inside a Tauri webview with IPC available. */
function isNativeRuntime(): boolean {
	return "__TAURI_INTERNALS__" in globalThis;
}

/** Module-singleton metadata service: the native adapter (Tauri IPC) under
 *  Tauri, the web adapter (localStorage) in a plain browser. The runtime
 *  choice is made once at first access and cached for every later call. */
export function getMetadataService(): MetadataPort {
	metadataService ??= isNativeRuntime()
		? createNativeMetadataService()
		: createWebMetadataService();
	return metadataService;
}
