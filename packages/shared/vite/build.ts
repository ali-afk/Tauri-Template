import type { BuildEnvironmentOptions, CSSOptions, ViteUserConfig } from "vite-plus";

import { browserVersions, getBuildTarget, targets } from "../utils/build.js";

export default {
	css: {
		transformer: "lightningcss",
		// devSourcemap: true,
		lightningcss: { targets },
	} satisfies CSSOptions,
	build: {
		// sourcemap: isDebugBuild,
		// minify: isDebugBuild && "oxc",
		// license: {
		// 	fileName: "./.out/license.md",
		// },
		target: getBuildTarget(browserVersions.webview, browserVersions.webkit),
		outDir: "./.out/build",
		emptyOutDir: true,
		rolldownOptions: {
			experimental: { nativeMagicString: true, incrementalBuild: true },
			// output: { sourcemap: isDebugBuild, minify: !isDebugBuild },
		},
	} satisfies BuildEnvironmentOptions,
	devtools: {
		enabled: process.env.NODE_ENV !== "production",
	},
} satisfies ViteUserConfig;
