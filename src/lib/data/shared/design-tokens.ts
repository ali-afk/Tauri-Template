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
 * Token values may be static strings, Open Props var() references, color-mix(),
 * light-dark(), or any other CSS computed value — gen.ts omits initial-value from
 * @property blocks, which allows computed values to be used freely in :root.
 *
 * variables.css overrides fluid tokens (--fs-*, --space-*, etc.) with Open Props
 * aliases and responsive shift-down media queries on top of the values set here.
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
 * Safe to change: Any leaf value (colors, computed expressions, Open Props refs)
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
		// Base grays are tinted with the primary color via color-mix().
		// Changing --color-primary-500 automatically updates all base grays.
		base: {
			900: "color-mix(in srgb, #000, var(--color-primary-500) 5%)",
			700: "color-mix(in srgb, #444, var(--color-primary-500) 5%)",
			500: "color-mix(in srgb, #888, var(--color-primary-500) 5%)",
			300: "color-mix(in srgb, #ccc, var(--color-primary-500) 5%)",
			100: "color-mix(in srgb, #fff, var(--color-primary-500) 5%)",
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
		value: "light-dark(var(--color-base-100), var(--color-base-700))",
	},
};

const fontTokens = {
	fw: {
		config: { syntax: "<number>", inherits: true },
		light: "var(--font-weight-3)",
		regular: "var(--font-weight-4)",
		semibold: "var(--font-weight-6)",
		bold: "var(--font-weight-7)",
	},
	fs: {
		config: { syntax: "<length>", inherits: true },
		0: "var(--font-size-fluid-0)",
		1: "var(--font-size-fluid-0)",
		2: "var(--font-size-fluid-1)",
		3: "var(--font-size-fluid-1)",
		4: "var(--font-size-fluid-1)",
		5: "var(--font-size-fluid-2)",
		6: "var(--font-size-fluid-2)",
		7: "var(--font-size-fluid-3)",
	},
	lh: {
		config: { syntax: "<number>", inherits: true },
		1: "var(--font-lineheight-0)",
		2: "var(--font-lineheight-1)",
		3: "var(--font-lineheight-3)",
		4: "var(--font-lineheight-4)",
	},
	text: {
		config: { syntax: "<color>", inherits: true },
		main: "light-dark(var(--color-base-900), var(--color-base-100))",
		mute: "light-dark(var(--color-base-700), var(--color-base-300))",
	},
};

const spaceTokens = {
	space: {
		config: { syntax: "<length>", inherits: true },
		0: "var(--size-fluid-1)",
		1: "var(--size-fluid-1)",
		2: "var(--size-fluid-2)",
		3: "var(--size-fluid-3)",
		4: "var(--size-fluid-4)",
		5: "var(--size-fluid-4)",
		6: "var(--size-fluid-6)",
		7: "var(--size-fluid-7)",
		8: "var(--size-fluid-8)",
	},
	container: {
		config: { syntax: "<length>", inherits: true },
		min: "var(--size-sm)",
		max: "var(--size-xl)",
	},
	breakpoint: {
		config: { syntax: "<length>", inherits: true },
		1: "var(--size-sm)",
		2: "var(--size-md)",
		3: "var(--size-lg)",
		4: "var(--size-xl)",
	},
};

const borderTokens = {
	border: {
		radius: { config: { syntax: "<length>", inherits: true }, value: "var(--radius-3)" },
		darkness: {
			config: { syntax: "<number>", inherits: true },
			value: "0.025",
		},
		color: {
			config: { syntax: "<color>", inherits: true },
			value: "var(--color-base-300)",
		},
	},
};

const transitionTokens = {
	transition: {
		easing: {
			config: { syntax: "*", inherits: true },
			value: "var(--ease-out-3)",
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
				value: "var(--color-base-500)",
			},
		},
	},
	shadow: {
		color: {
			config: { syntax: "<color>", inherits: true },
			value: "color-mix(in srgb, var(--color-base-900), transparent 80%)",
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
