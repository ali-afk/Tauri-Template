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

const colorTokens = {
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
			900: "color-mix(in srgb, #000, var(--color-primary-500) var(--color-mix-strength))",
			700: "color-mix(in srgb, #444, var(--color-primary-500) var(--color-mix-strength))",
			500: "color-mix(in srgb, #888, var(--color-primary-500) var(--color-mix-strength))",
			300: "color-mix(in srgb, #ccc, var(--color-primary-500) var(--color-mix-strength))",
			100: "color-mix(in srgb, #fff, var(--color-primary-500) var(--color-mix-strength))",
		},
		status: {
			danger: "#dc2626",
			warn: "#d97706",
			info: "#00b4d8",
			success: "#16a34a",
		},
	},
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
		1: "var(--font-size-fluid-0)",
		2: "var(--font-size-fluid-1)",
		3: "var(--font-size-fluid-2)",
		4: "var(--font-size-fluid-3)",
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
		1: "var(--size-fluid-1)",
		2: "var(--size-fluid-2)",
		3: "var(--size-fluid-3)",
		4: "var(--size-fluid-4)",
		5: "var(--size-fluid-6)",
		6: "var(--size-fluid-7)",
		7: "var(--size-fluid-8)",
		gutter: "calc((100% - var(--space-max)) / 2)",
		min: "var(--size-sm)",
		max: "var(--size-xl)",
	},
	breakpoint: {
		config: { syntax: "<length>", inherits: true },
		sm: "var(--size-sm)",
		md: "var(--size-md)",
		lg: "var(--size-lg)",
		xl: "var(--size-xl)",
	},
};

const otherTokens = {
	border: {
		config: { syntax: "<color>", inherits: true },
		color: "var(--color-base-300)",
	},
	transition: {
		easing: {
			config: { syntax: "<easing-function>", inherits: true },
			value: "var(--ease-in-out-3)",
		},
		duration: {
			config: { syntax: "<time>", inherits: true },
			short: "var(--duration-quick-2)",
			medium: "var(--duration-moderate-1)",
			long: "var(--duration-gentle-1)",
		},
	},
	shadow: {
		config: { syntax: "<color>", inherits: true },
		color: "color-mix(in srgb, var(--color-base-900), transparent 80%)",
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
	...colorTokens,
	...fontTokens,
	...spaceTokens,
	...otherTokens,
} as const satisfies Record<string, PropertyNode>;
