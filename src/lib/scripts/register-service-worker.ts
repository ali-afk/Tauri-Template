import { dev } from "$app/environment";

/**
 * Register service worker for PWA functionality
 */
export function registerServiceWorker() {
	if (!dev && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("/service-worker.js").catch((error) => {
			console.error("Service worker registration failed:", error);
		});
	}
}
