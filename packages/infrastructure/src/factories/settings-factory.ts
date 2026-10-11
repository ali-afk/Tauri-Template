import type { SettingsPort } from "@tauri-template/domain/ports";

import { createNativeSettingsService } from "../adapters/native/native-settings-adapter.js";
import { createWebSettingsService } from "../adapters/web/web-settings-adapter.js";

let settingsService: SettingsPort | undefined;

/** True when running inside a Tauri webview with IPC available. */
function isNativeRuntime(): boolean {
	return "__TAURI_INTERNALS__" in globalThis;
}

/** Module-singleton settings service: the native adapter (Tauri IPC) under
 *  Tauri, the web adapter (localStorage) in a plain browser. The runtime
 *  choice is made once at first access and cached for every later call. */
export function getSettingsService(): SettingsPort {
	settingsService ??= isNativeRuntime()
		? createNativeSettingsService()
		: createWebSettingsService();
	return settingsService;
}
