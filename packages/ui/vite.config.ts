import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { run } from "vite-plugin-run";
import { defineConfig } from "vite-plus";

import { isTest } from "../shared/utils/build.js";
import { TestConfig, BaseConfig, BuildConfig, SveltekitConfig } from "../shared/vite/index.js";

export default defineConfig({
	...BaseConfig,
	...BuildConfig,
	...TestConfig,
	plugins: [
		sveltekit(SveltekitConfig),
		run({
			name: "Gen Task",
			run: ["bun", "./src/lib/gen/index.ts"],
			pattern: ["./src/lib/data/design-tokens.ts"],
			startup: true,
			build: true,
		}),
		...(isTest ? [svelteTesting()] : []),
	],
	run: {
		tasks: {
			build: { command: "svelte-package -o .out/build" },
			"css-gen": {
				command: "bun ./src/lib/gen/index.ts",
				cache: { input: ["./src/lib/data/design-tokens.ts"], output: ["./src/lib/styles/gen.css"] },
			},
		},
	},
});
