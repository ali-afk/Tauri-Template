/**
 * DESIGN TOKENS - Single Source of Truth
 *
 * TEMPLATE CUSTOMIZATION:
 * The colors below are example values from the original project. Replace them with your brand colors!
 * The primary/secondary structure works for any color scheme.
 * Use https://oklch.com/ to pick OKLCH colors for optimal contrast and accessibility.
 *
 * This file defines all design tokens (colors, spacing, typography, etc.) for the entire app.
 * These values are automatically converted to CSS custom properties (CSS variables) and registered
 * with the browser for type-safe, animatable properties.
 *
 * This allows you to use these properties if you can't use CSS somewhere in the code (like in certain scripts).
 * Therefore, instead of querying for "--color-primary-500", reference "DesignTokens.color.primary[500]"
 * if a leaf value is not an array, then use "DesignTokens.[something1].[something2].value"
 *
 * HOW IT WORKS:
 * 1. Nested objects are flattened: color.primary.500 → --color-primary-500
 * 2. Each property is registered with CSS.registerProperty() for type safety
 * 3. Browser validates values (e.g., can't assign "car" to a <color> property)
 * 4. Registered properties can be smoothly animated/transitioned
 *
 * STRUCTURE:
 * Each group can have a `config` object defining:
 * - syntax: CSS type (<color>, <length>, <number>, etc.) - see https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax
 * - inherits: Whether child elements inherit this value (usually true)
 *
 * USAGE IN CSS:
 * background-color: var(--color-primary-500);
 * padding: var(--space-3);
 * font-size: var(--fs-4);
 *
 * MODIFYING VALUES:
 * Safe to change: Any value (numbers, colors, sizes)
 * Be careful with: Syntax types in config (must match CSS spec)
 * Don't change: Object structure or property names (will break CSS references)
 *
 * @see src/lib/scripts/register-design-tokens.ts for registration logic
 */

import type { PropertyNode } from "$types/design-tokens";

/**
 * Design tokens organized by category
 *
 * Structure:
 * - Group level (e.g., "color") can have a config that applies to all children
 * - Sub-group level (e.g., "primary") can override with its own config
 * - Leaf values are the actual design tokens
 */
export const DesignTokens = {
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
	_background: {
		config: { syntax: "<color>", inherits: true },
		value: "#ffffff",
	},
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
		1: "1.1",
		2: "1.3",
		3: "1.6",
		4: "1.8",
	},
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
	transition: {
		easing: {
			config: { syntax: "*", inherits: true },
			value: "ease-out",
		},
		duration: {
			config: { syntax: "<time>", inherits: true },
			long: "300ms",
			medium: "200ms",
			short: "150ms",
		},
	},
	border: {
		radius: { config: { syntax: "<length>", inherits: true }, value: "16px" },
		darkness: {
			config: { syntax: "<number>", inherits: true },
			value: "0.025",
		},
		color: {
			config: { syntax: "<color>", inherits: true },
			value: "#ccc",
		},
	},
	shadow: {
		color: {
			config: { syntax: "<color>", inherits: true },
			value: "rgba(0, 0, 0, 0.25)",
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
				value: "#888",
			},
		},
	},
	container: {
		config: { syntax: "<length>", inherits: true },
		min: "480px",
		max: "1280px",
	},
	text: {
		config: { syntax: "<color>", inherits: true },
		main: "#000",
		mute: "#444",
	},
	breakpoint: {
		config: { syntax: "<length>", inherits: true },
		1: "480px",
		2: "768px",
		3: "1024px",
		4: "1280px",
	},
} as const satisfies Record<string, PropertyNode>;
