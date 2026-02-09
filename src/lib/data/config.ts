/** Svelte writable stores for app config retrieved from Rust backend via IPC.
 *  Populated in root +layout.svelte on mount.
 *  Access anywhere via $AppSettings / $AppMetaData auto-subscription syntax.
 *  Import types from $bindings (auto-generated from Rust specta commands). */
import { writable } from "svelte/store";
import type {
	AppMetaData as AppMetaDataType,
	AppSettings as AppSettingsType,
} from "$bindings";

export const AppSettings = writable<AppSettingsType | null>(null);
export const AppMetaData = writable<AppMetaDataType | null>(null);
