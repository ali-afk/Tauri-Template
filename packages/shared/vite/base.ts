import type { ServerOptions, ViteUserConfig } from "vite-plus";
import type { OxfmtConfig } from "vite-plus/fmt";
import type { OxlintConfig } from "vite-plus/lint";

import { host } from "../utils/build.js";

export let defaultIgnorePatterns = [
	"**/.svelte-kit/**",
	"**/.out/**",
	"**/.cache/**",
	"**/node_modules/**",
];

export default {
	envPrefix: ["VITE_", "TAURI_ENV_*"],
	server: {
		strictPort: true,
		hmr: host ? true : undefined,
		...(host && { ws: { host, port: 5174 } }),
		// fs: {
		// 	strict: false, // Temporary till I get build/dev running properly
		// },
	} satisfies ServerOptions,
	fmt: { sortImports: true, ignorePatterns: defaultIgnorePatterns } satisfies OxfmtConfig,
	lint: {
		ignorePatterns: defaultIgnorePatterns,
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		plugins: ["import"],
		rules: {
			"import/extensions": ["error", "ignorePackages"],
			"vite-plus/prefer-vite-plus-imports": "error",
		},
		options: { typeAware: true, typeCheck: true },
	} satisfies OxlintConfig,
	cacheDir: "./.cache/vite",
} satisfies ViteUserConfig;
