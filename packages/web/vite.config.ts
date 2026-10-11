import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vite-plus";

import { isTest } from "../shared/utils/build.js";
import { BuildConfig, TestConfig, BaseConfig, SveltekitConfig } from "../shared/vite/index.js";

export default defineConfig({
	...BuildConfig,
	...TestConfig,
	...BaseConfig,
	plugins: [sveltekit(SveltekitConfig), ...(isTest ? [svelteTesting()] : [])],
	run: {
		tasks: {
			build: {
				command: "vp build",
				cache: { input: ["./src/**"] },
			},
		},
	},
});
