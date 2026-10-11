import { defineConfig } from "vite-plus";

import { BaseConfig, TestConfig } from "../shared/vite/index.js";

export default defineConfig({
	...BaseConfig,
	...TestConfig,
});
