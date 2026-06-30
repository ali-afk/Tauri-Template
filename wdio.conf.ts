import { defineConfig } from "@wdio/config";
import { buildTargets, getBuildTarget } from "./vite.config";

/// <reference types="@wdio/tauri-service" />
export const config = defineConfig({
	runner: "local",
	specs: ["./test/specs/**/*.ts"],
	maxInstances: 10,
	capabilities: [
		getBuildTarget(
			{
				browserName: buildTargets.webview.browser,
				browserVersion: buildTargets.webview.version,
			},
			{
				browserName: buildTargets.webkit.browser,
				browserVersion: buildTargets.webkit.version,
			},
		),
	],
	logLevel: "info",
	bail: 0,
	waitforTimeout: 10000,
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,
	services: [
		[
			"tauri",
			{
				driverProvider: "official",
			},
		],
		"tauri-plugin",
	],
	framework: "mocha",
	reporters: ["spec", "junit"],
	mochaOpts: {
		ui: "bdd",
		timeout: 60000,
	},
});
