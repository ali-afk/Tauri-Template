import adapter from "@sveltejs/adapter-static";
import type { Config } from "@sveltejs/kit";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: Config = {
	preprocess: vitePreprocess(),
	vitePlugin: {
		inspector: true,
		// This template containes legacy svelte that refuses to compile
		dynamicCompileOptions: ({ filename }) => {
			if (filename.includes("LegacyTemplate.svelte")) {
				return { runes: false };
			}
		},
		experimental: {
			sendWarningsToBrowser: true,
		},
	},
	kit: {
		adapter: adapter({
			fallback: "index.html",
			strict: true,
		}),
		alias: {
			$assets: "src/lib/assets",
			$components: "src/lib/components",
			$data: "src/lib/data",
			$scripts: "src/lib/scripts",
			$styles: "src/lib/styles",
			$bindings: "src/lib/bindings",
			$types: "src/lib/types",
		},
		typescript: {
			config(config) {
				config["exclude"].push("../src/lib/bindings.ts");
				config["include"].push("../scripts/**/*.ts");
			},
		},
	},
	compilerOptions: {
		runes: true,
	},
};

export default config;
