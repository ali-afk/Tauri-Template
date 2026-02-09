/// <reference types="@sveltejs/kit" />

import { build, files, prerendered, version } from "$service-worker";
import {
	addFilesToCache,
	type CacheName,
	deleteOldCache,
	respond,
} from "./lib/scripts/service-worker";

// Type declarations for service worker
declare let self: ServiceWorkerGlobalScope;

// Cache names
const CACHE = `cache-${version}` as CacheName;
const ASSETS = [...build, ...files, ...prerendered];

// Install event - precache all static assets
self.addEventListener("install", (event: ExtendableEvent) =>
	event.waitUntil(addFilesToCache(CACHE, ASSETS)),
);

// Activate event - clean up old caches
self.addEventListener("activate", (event: ExtendableEvent) =>
	event.waitUntil(deleteOldCache(CACHE)),
);

// Fetch event - serve from cache when possible
self.addEventListener("fetch", (event: FetchEvent) => {
	const { request } = event;
	const url = new URL(request.url);

	if (url.origin !== location.origin) return; // Ignore cross-origin requests
	if (request.method !== "GET") return; // Ignore non-GET requests

	event.respondWith(respond(request, url, CACHE, ASSETS));
});
