import type { AppMetadata as AppMetadataType } from "@tauri-template/infrastructure/tauri/bindings";
/** Svelte writable store for app metadata retrieved from Rust backend via IPC.
 *  Populated in root +layout.svelte on mount.
 *  Access anywhere via $AppMetadata auto-subscription syntax.
 *  Import types from @tauri-template/infrastructure/tauri/bindings (auto-generated
 *  from Rust specta commands; type-only — raw IPC stays inside infrastructure). */
import { writable } from "svelte/store";

export const AppMetadata = writable<AppMetadataType | null>(null);
