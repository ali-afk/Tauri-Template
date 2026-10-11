import type { MetadataPort } from "@tauri-template/domain/ports";

import { commands } from "../../tauri/bindings.js";

/** Native adapter: delegates to the specta-generated Tauri IPC commands.
 *  This is the only frontend module allowed to import the raw bindings
 *  (the guide's hard rule) — everything else goes through the ports. */
export function createNativeMetadataService(): MetadataPort {
	return {
		appMetadata: () => commands.appMetadata(),
	};
}
