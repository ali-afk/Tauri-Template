import os from "node:os";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { DevTools } from "@vitejs/devtools";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { svelteDevtools } from "vite-devtools-svelte";
import { run } from "vite-plugin-run";
/// <reference types="vite" />
import { defineConfig } from "vitest/config";

export const buildTargets = {
	webview: { browser: "chrome", version: "120" },
	webkit: { browser: "safari", version: "16" },
};
const browserQueries = {
	webview: `${buildTargets.webview.browser} ${buildTargets.webview.version}`,
	webkit: `${buildTargets.webkit.browser} ${buildTargets.webkit.version}`,
};
const browserVersions = {
	webview: `${buildTargets.webview.browser}${buildTargets.webview.version}`,
	webkit: `${buildTargets.webkit.browser}${buildTargets.webkit.version}`,
};
const targets = browserslistToTargets(
	browserslist(`${browserQueries.webview}, ${browserQueries.webkit}`),
);

const host = process.env["TAURI_DEV_HOST"];
const isDebugBuild = Boolean(process.env["TAURI_ENV_DEBUG"]);
const isTest = Boolean(process.env["VITEST"]);

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

export function getBuildTarget<T>(ifWebview: T, ifWebkit: T): T {
	switch (buildPlatform) {
		case "windows":
		case "android":
			return ifWebview;
		case "linux":
		case "macos":
		case "ios":
			return ifWebkit;
	}
}

export default defineConfig({
	plugins: [
		...(isDebugBuild ? [svelteDevtools(), DevTools(), svelteTesting()] : []),
		...(isTest ? [svelteTesting()] : []),
		sveltekit(),
		run({
			name: "Gen Task",
			run: ["bun", "gen"],
			pattern: ["src/lib/data/design-tokens.ts"],
			startup: true,
			build: true,
		}),
	],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets,
		},
	},
	build: {
		cssMinify: "lightningcss",
		minify: isDebugBuild ? false : "oxc",
		sourcemap: isDebugBuild,
		target: getBuildTarget(browserVersions.webview, browserVersions.webkit),
		rolldownOptions: {
			...(isDebugBuild && { devtools: {} }),
		},
	},
	clearScreen: false,
	server: {
		strictPort: true,
		hmr: host ? true : undefined,
		...(host && { ws: { host, port: 5174 } }),
		watch: {
			ignored: ["src-tauri"],
		},
	},
	envPrefix: ["VITE_", "TAURI_ENV_*"],
	test: {
		reporters: [
			"default",
			[
				"junit",
				{
					outputFile: "tests/report.xml",
				},
			],
		],
		coverage: {
			thresholds: {
				statements: 80,
				branches: 70,
				functions: 80,
				lines: 80,
			},
			reportsDirectory: ".vitest",
			reporter: ["text", "lcov"],
			provider: "istanbul",
		},
		environment: "happy-dom",
		setupFiles: ["tests/setup.ts"],
		globals: true,
	},
});
