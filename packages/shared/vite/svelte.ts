import adapter from "@sveltejs/adapter-static";
import { type Config } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Shared SvelteKit *app* plugin config, used by the app-like packages (web,
// and ui until it becomes a library). A library build uses svelte-package and
// must not register adapter-static.

export const SveltekitConfig: Config = {
	preprocess: vitePreprocess(),
	compilerOptions: { runes: true, experimental: { async: true } },
	experimental: { sendWarningsToBrowser: true },
	adapter: adapter({
		pages: "./.out/build",
		assets: "./.out/build",
		fallback: "index.html",
		strict: true,
	}),
};
