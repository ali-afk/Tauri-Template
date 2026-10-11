import type { SettingsPort } from "@tauri-template/domain/ports";

import { commands } from "../../tauri/bindings.js";

/** Native adapter: delegates to the specta-generated Tauri IPC commands.
 *  This is the only frontend module allowed to import the raw bindings
 *  (the guide's hard rule) — everything else goes through the ports. */
export function createNativeSettingsService(): SettingsPort {
	return {
		readSettings: () => commands.readSettings(),
		readSettingsField: (key) => commands.readSettingsField(key),
		writeSettings: (settings) => commands.writeSettings(settings),
		writeSettingsField: (value) => commands.writeSettingsField(value),
	};
}
