import { sveltekit } from "@sveltejs/kit/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

const targets = browserslistToTargets(browserslist(">= 0.25%"));

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: targets,
			drafts: {
				customMedia: true,
			},
		},
	},
	build: {
		cssMinify: "lightningcss",
	},
});
