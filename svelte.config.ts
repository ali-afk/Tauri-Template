import adapter from "@sveltejs/adapter-static";
import type { Config } from "@sveltejs/kit";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: Config = {
	preprocess: vitePreprocess(),
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
			$tauri: "src/lib/tauri",
			$types: "src/lib/types",
		},
	},
	compilerOptions: {
		runes: true,
	},
};

export default config;
