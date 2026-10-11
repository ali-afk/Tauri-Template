import { defineConfig } from "vite-plus";
import { TestConfig, BaseConfig } from "./packages/shared/vite/index.js";

export default defineConfig({
	...BaseConfig,
	...TestConfig,
	run: { cache: true },
});
