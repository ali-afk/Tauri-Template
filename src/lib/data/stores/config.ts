/** Svelte writable stores for app config retrieved from Rust backend via IPC.
 *  Populated in root +layout.svelte on mount.
 *  Access anywhere via $AppSettings / $AppMetaData auto-subscription syntax.
 *  Import types from $bindings (auto-generated from Rust specta commands). */
import { writable } from "svelte/store";
import type { AppMetadata as AppMetadataType } from "$tauri/bindings";

export const AppMetadata = writable<AppMetadataType | null>(null);
