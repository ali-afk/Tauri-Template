import { sveltekit } from "@sveltejs/kit/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

const browserVersions = { chrome: 120, safari: 16 };
const targets = browserslistToTargets(
	browserslist(
		`chrome ${browserVersions.chrome}, safari ${browserVersions.safari}`,
	),
);

const host = process.env["TAURI_DEV_HOST"];
const isDebugBuild = Boolean(process.env["TAURI_ENV_DEBUG"]);
const buildPlatform = process.env["TAURI_ENV_PLATFORM "];

function getBuildTarget() {
	switch (buildPlatform) {
		case "windows":
		case "android":
			return `chrome${browserVersions.chrome}`;
		case "linux":
		case "macos":
		case "ios":
			return `safari${browserVersions.safari}`;
		default:
			return undefined;
	}
}
export default defineConfig({
	plugins: [sveltekit()],
	css: {
		transformer: "lightningcss",
		lightningcss: { targets },
	},
	build: {
		cssMinify: "lightningcss",
		minify: isDebugBuild ? false : "esbuild",
		sourcemap: isDebugBuild,
		target: getBuildTarget(),
	},
	clearScreen: false,
	server: {
		port: 5173,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 5174,
				}
			: undefined,
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
	envPrefix: ["VITE_", "TAURI_ENV_*"],
});
