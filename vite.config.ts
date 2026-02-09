import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// Target modern browsers/webviews (Tauri uses system webview)
// Chrome 120+, Safari 17+, Firefox 121+
const targets = {
	chrome: 120 << 16,
	safari: (17 << 16) | (4 << 8),
	firefox: 121 << 16,
};

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets,
		},
	},
	build: {
		cssMinify: "lightningcss",
	},
});
