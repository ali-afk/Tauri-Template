import { fileURLToPath } from "node:url";

import type { ViteUserConfig } from "vite-plus";
import type { CoverageOptions, InlineConfig } from "vite-plus/test/node";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

export default {
	test: {
		reporters: ["default", ["junit", { outputFile: `./.out/reports/${timestamp}.xml` }]],
		coverage: {
			thresholds: { statements: 80, branches: 70, functions: 80, lines: 80 },
			reportsDirectory: "./.out/reports",
			reporter: ["text", "lcov"],
			provider: "istanbul",
		} satisfies CoverageOptions,
		include: ["./**/*.test.ts"],
		environment: "happy-dom",
		globals: true,
		passWithNoTests: true,
		setupFiles: [fileURLToPath(new URL("../utils/test-setup.ts", import.meta.url))],
	} satisfies InlineConfig,
} satisfies ViteUserConfig;
