import { defineConfig } from "vite-plus";

import { BaseConfig, TestConfig } from "./vite/index.js";

export default defineConfig({
	...BaseConfig,
	...TestConfig,
});
