import os from "node:os";

import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export const buildTargets = {
	webview: { browser: "chrome", version: "120" },
	webkit: { browser: "safari", version: "16" },
};
const browserQueries = {
	webview: `${buildTargets.webview.browser} ${buildTargets.webview.version}`,
	webkit: `${buildTargets.webkit.browser} ${buildTargets.webkit.version}`,
};
export const browserVersions = {
	webview: `${buildTargets.webview.browser}${buildTargets.webview.version}`,
	webkit: `${buildTargets.webkit.browser}${buildTargets.webkit.version}`,
};
export const targets = browserslistToTargets(
	browserslist(`${browserQueries.webview}, ${browserQueries.webkit}`),
);

// TODO: TAURI env vars are too coupled
export const host = process.env["TAURI_DEV_HOST"];
export const isDebugBuild = Boolean(process.env["TAURI_ENV_DEBUG"]);
export const isTest = Boolean(process.env["VITEST"]);

type platformTypes = "windows" | "android" | "linux" | "macos" | "ios";
function detectBuildPlatform(): platformTypes {
	const env = process.env["TAURI_ENV_PLATFORM"];
	if (env) return env as platformTypes;
	const platform = os.platform();
	if (platform === "win32") return "windows";
	if (platform === "darwin") return "macos";
	return "linux";
}
const buildPlatform = detectBuildPlatform();

export function getBuildTarget<T>(WebviewOpts: T, WebkitOpts: T): T {
	switch (buildPlatform) {
		case "windows":
		case "android":
			return WebviewOpts;
		case "linux":
		case "macos":
		case "ios":
			return WebkitOpts;
	}
}
