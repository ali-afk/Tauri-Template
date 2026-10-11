/** Storage seam for the web adapters. Covers the subset of the DOM Storage
 *  API the adapters need, so an IndexedDB-backed implementation can replace
 *  localStorage without touching adapter logic (F2 decision). */
export interface WebStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

/** Default seam binding: the browser's localStorage. Resolved lazily so the
 *  module stays importable in non-DOM contexts (e.g. SSR builds). */
export function defaultWebStorage(): WebStorage {
	return globalThis.localStorage;
}
