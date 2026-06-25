import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { DevTools } from "@vitejs/devtools";
import { webdriverio } from "@vitest/browser-webdriverio";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { svelteDevtools } from "vite-devtools-svelte";
import { run } from "vite-plugin-run";
/// <reference types="vite" />
import { defineConfig } from "vitest/config";

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const versions = {
	chrome: 120,
	safari: 16,
};
const targets = browserslistToTargets(
	browserslist(`chrome ${versions.chrome}, safari ${versions.safari}`),
);
const host = process.env["TAURI_DEV_HOST"];
const isDebugBuild = Boolean(process.env["TAURI_ENV_DEBUG"]);
const buildPlatform = process.env["TAURI_ENV_PLATFORM"];
function getBuildTarget() {
	switch (buildPlatform) {
		case "windows":
		case "android":
			return `chrome${versions.chrome}`;
		case "linux":
		case "macos":
		case "ios":
			return `safari${versions.safari}`;
		default:
			return undefined;
	}
}

export default defineConfig({
	plugins: [
		...(process.env["VITEST"]
			? []
			: [svelteDevtools(), DevTools(), svelteTesting()]),
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
		target: getBuildTarget(),
		rolldownOptions: {
			devtools: {},
		},
	},
	clearScreen: false,
	server: {
		port: 5173,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 5174,
				}
			: undefined,
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
					outputFile: ".vitest/report.xml",
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
		projects: [
			{
				extends: true,
				test: {
					environment: "happy-dom",
					setupFiles: ["src/lib/scripts/test-setup.ts"],
					globals: true,
				},
			},
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: ".storybook",
					}),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: webdriverio({}),
						instances: [{ browser: "chrome" }, { browser: "safari" }],
					},
				},
			},
		],
	},
});
