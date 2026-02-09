import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: "app.html",
			pages: "build",
			assets: "build",
			precompress: false,
			strict: true,
		}),
		alias: {
			$components: "src/lib/components",
			$data: "src/lib/data",
			$assets: "src/lib/assets",
			$scripts: "src/lib/scripts",
			$styles: "src/lib/styles",
			$types: "src/lib/types",
		},
	},
	compilerOptions: {
		runes: true,
	},
};

export default config;
