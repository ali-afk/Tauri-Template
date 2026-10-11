import path from "node:path";
import { fileURLToPath } from "node:url";

import type { WdioTauriConfig } from "@wdio/native-types";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageRoot, "../..");

// Debug binary built with the `e2e` feature, via
// `bunx tauri build --no-bundle --debug --features e2e` in packages/shell.
// CARGO_TARGET_DIR is packages/shell/.out/build — see packages/shell/.cargo/config.toml.
const appBinaryPath = path.join(
	repoRoot,
	"packages/shell/.out/build/debug",
	process.platform === "win32" ? "shell.exe" : "shell",
);

export const config: WdioTauriConfig = {
	runner: "local",
	specs: ["./tests/specs/**/*.spec.ts"],
	maxInstances: 1,
	capabilities: [
		{
			browserName: "tauri",
			"tauri:options": {
				application: appBinaryPath,
			},
		},
	],
	services: [
		[
			"@wdio/tauri-service",
			{
				appBinaryPath,
				driverProvider: "embedded",
				startTimeout: 120_000,
			},
		],
	],
	framework: "mocha",
	reporters: ["spec", ["junit", { outputDir: path.join(packageRoot, ".out/reports") }]],
	mochaOpts: {
		ui: "bdd",
		timeout: 120_000,
	},
	logLevel: "info",
	waitforTimeout: 10_000,
	connectionRetryTimeout: 120_000,
	connectionRetryCount: 3,
};
