/**
 * DESIGN TOKENS - Single Source of Truth
 *
 * TEMPLATE CUSTOMIZATION:
 * The colors below are example values from the original project. Replace them with your brand colors!
 * The primary/secondary structure works for any color scheme.
 * Use https://oklch.com/ to pick OKLCH colors for optimal contrast and accessibility.
 *
 * This file defines all design tokens (colors, typography, etc.) for the entire app.
 * At build time, gen.ts reads this file and generates gen.css, which contains:
 *   - @property declarations for each token (enables type safety + smooth animations)
 *   - A :root {} block assigning each token's initial value
 *
 * Fluid spacing and font sizes are defined in variables.css as Open Props aliases.
 * This file only holds static values that benefit from @property registration.
 *
 * To reference a token value in TypeScript (e.g. in a script), use:
 *   DesignTokens.color.primary[500]         ← for leaf values
 *   DesignTokens.border.radius.value        ← for named single values
 *
 * STRUCTURE:
 * Each group can have a `config` object defining:
 * - syntax: CSS type (<color>, <length>, <number>, etc.)
 *   see https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax
 * - inherits: Whether child elements inherit this value (usually true)
 *
 * USAGE IN CSS:
 * background-color: var(--color-primary-500);
 * font-size: var(--fs-4);        ← aliased in variables.css to Open Props fluid value
 * padding: var(--space-3);       ← aliased in variables.css to Open Props fluid value
 *
 * MODIFYING VALUES:
 * Safe to change: Any leaf value (colors, sizes, numbers)
 * Be careful with: syntax in config (must match CSS spec)
 * Don't rename: Object keys or structure (breaks CSS var() references)
 *
 * @see src/lib/scripts/gen.ts for CSS generation logic
 * @see src/lib/styles/variables.css for Open Props aliases and computed values
 */

import type { PropertyNode } from "$types/design-tokens";

const colors = {
	color: {
		config: { syntax: "<color>", inherits: true },
		primary: {
			900: "#381446",
			700: "#653568",
			500: "#934599",
			300: "#d192d6",
			100: "#d9aecf",
		},
		secondary: {
			900: "#5d0634",
			700: "#940c53",
			500: "#b00e63",
			300: "#d66da4",
			100: "#f4d7e6",
		},
		base: {
			900: "#000000",
			700: "#444444",
			500: "#888888",
			300: "#cccccc",
			100: "#ffffff",
		},
		status: {
			danger: "#dc2626",
			warn: "#d97706",
			info: "#00b4d8",
			success: "#16a34a",
		},
	},
};

const colorTokens = {
	...colors,
	_background: {
		config: { syntax: "<color>", inherits: true },
		value: colors.color.base[100],
	},
};

const fontTokens = {
	fw: {
		config: { syntax: "<number>", inherits: true },
		light: 300,
		regular: 400,
		semibold: 600,
		bold: 700,
	},
	fs: {
		config: { syntax: "<length>", inherits: true },
		0: "10px",
		1: "12px",
		2: "14px",
		3: "16px",
		4: "20px",
		5: "25px",
		6: "35px",
		7: "50px",
	},
	lh: {
		config: { syntax: "<number>", inherits: true },
		1: "1.1", // --font-lineheight-0
		2: "1.25", // --font-lineheight-1
		3: "1.5", // --font-lineheight-3
		4: "1.75", // --font-lineheight-4
	},
	text: {
		config: { syntax: "<color>", inherits: true },
		main: colorTokens.color.base[900],
		mute: colorTokens.color.base[700],
	},
};

const spaceTokens = {
	space: {
		config: { syntax: "<length>", inherits: true },
		0: "3px",
		1: "5px",
		2: "10px",
		3: "14px",
		4: "20px",
		5: "30px",
		6: "45px",
		7: "70px",
		8: "95px",
	},
	container: {
		config: { syntax: "<length>", inherits: true },
		min: "480px",
		max: "1280px",
	},
	breakpoint: {
		config: { syntax: "<length>", inherits: true },
		1: "480px",
		2: "768px",
		3: "1024px",
		4: "1440px",
	},
};

const borderTokens = {
	border: {
		radius: { config: { syntax: "<length>", inherits: true }, value: "1rem" }, // --radius-3
		darkness: {
			config: { syntax: "<number>", inherits: true },
			value: "0.025",
		},
		color: {
			config: { syntax: "<color>", inherits: true },
			value: colorTokens.color.base[300],
		},
	},
};

const transitionTokens = {
	transition: {
		easing: {
			config: { syntax: "*", inherits: true },
			value: "cubic-bezier(0, 0, .3, 1)", // --ease-out-3
		},
		duration: {
			config: { syntax: "<time>", inherits: true },
			long: "300ms",
			medium: "200ms",
			short: "150ms",
		},
	},
	hover: {
		color: {
			config: { syntax: "<color> | none", inherits: true },
			value: "none",
		},
		degree: {
			config: { syntax: "<number>", inherits: true },
			value: "0.03",
		},
		border: {
			darkness: {
				config: { syntax: "<number>", inherits: true },
				value: "0.1",
			},
			color: {
				config: { syntax: "<color>", inherits: true },
				value: colorTokens.color.base[500],
			},
		},
	},
	shadow: {
		color: {
			config: { syntax: "<color>", inherits: true },
			value: "rgba(0, 0, 0, 0.25)",
		},
	},
};

/**
 * Design tokens organized by category
 *
 * Structure:
 * - Group level (e.g., "color") can have a config that applies to all children
 * - Sub-group level (e.g., "primary") can override with its own config
 * - Leaf values are the actual design tokens
 */
export const DesignTokens = {
	...borderTokens,
	...colorTokens,
	...fontTokens,
	...spaceTokens,
	...transitionTokens,
} as const satisfies Record<string, PropertyNode>;
