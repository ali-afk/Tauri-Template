/** Svelte writable store for app metadata retrieved from Rust backend via IPC.
 *  Populated in root +layout.svelte on mount.
 *  Access anywhere via $AppMetadata auto-subscription syntax.
 *  Import types from $tauri/bindings (auto-generated from Rust specta commands). */
import { writable } from "svelte/store";
import type { AppMetadata as AppMetadataType } from "$tauri/bindings";

export const AppMetadata = writable<AppMetadataType | null>(null);
