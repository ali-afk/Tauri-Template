import { defineConfig } from "vite-plus";

import { BaseConfig, TestConfig } from "../shared/vite/index.js";

export default defineConfig({
	...BaseConfig,
	...TestConfig,
	test: {
		...TestConfig.test,
		coverage: {
			...TestConfig.test.coverage,
			// Specta-generated IPC bindings: excluded from typecheck too.
			exclude: ["src/tauri/bindings.ts"],
		},
	},
});
