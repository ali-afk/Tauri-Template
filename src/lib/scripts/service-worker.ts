/// <reference lib="webworker" />

/**
 * Cache name type for service worker caching
 */
export type CacheName = `cache-${string}`;

/**
 * Service worker caching utilities
 */

export async function addFilesToCache(cacheName: CacheName, assets: string[]) {
	const cache = await caches.open(cacheName);
	await cache.addAll(assets);
}

export async function deleteOldCache(cacheName: CacheName) {
	const keys = await caches.keys();
	for (const key of keys) {
		if (key !== cacheName) {
			await caches.delete(key);
		}
	}
}

export async function respond(
	request: Request,
	url: URL,
	cacheName: CacheName,
	assets: string[],
) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);

	// Cache-first for both HTML and assets
	if (cached) {
		return cached;
	}

	// Fetch assets if not cached
	if (assets.includes(url.pathname)) {
		const response = await fetch(request);
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	}

	// Fetch HTML if not cached
	try {
		const response = await fetch(request);
		if (
			response.ok &&
			response.headers.get("content-type")?.includes("text/html")
		) {
			cache.put(request, response.clone());
		}

		return response;
	} catch {
		// Network failed
		return new Response(null, {
			status: 503,
			statusText: "Offline - Please check your connection",
			headers: { "Content-Type": "text/plain", "Retry-After": "300" },
		});
	}
}
