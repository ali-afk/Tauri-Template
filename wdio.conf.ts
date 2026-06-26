import { defineConfig } from "@wdio/config";
import { browserVersions } from "./vite.config";

/// <reference types="@wdio/tauri-service" />
export default defineConfig({
	runner: "local",
	tsConfigPath: "./test/tsconfig.json",

	specs: ["./test/specs/**/*.ts"],
	exclude: [],

	maxInstances: 10,

	capabilities: [
		{
			browserName: "chrome",
			browserVersion: browserVersions.chrome.toString(),
		},
		{
			browserName: "safari",
			browserVersion: browserVersions.safari.toString(),
		},
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
