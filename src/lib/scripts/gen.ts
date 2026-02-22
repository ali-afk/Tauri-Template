/**
 * BUILD-TIME CSS CUSTOM PROPERTY GENERATOR
 *
 * Reads design tokens from design-tokens.ts and generates gen.css containing:
 *
 * 1. @property declarations — registers each token as a typed CSS custom property.
 *    No `initial-value` is declared, which allows computed values (color-mix(),
 *    clamp(), var()) to be assigned in :root without triggering a spec violation.
 *
 * 2. :root block — assigns all token values to their CSS custom properties.
 *
 * Benefits of @property registration:
 * - TYPE SAFETY: browser validates values against the declared syntax
 * - SMOOTH ANIMATIONS: registered properties can be transitioned/animated
 * - RELATIVE COLOR SYNTAX: enables oklch(from var(--color) l c h) patterns
 *   which powers the .card/.btn auto-contrast system in interactive.css
 * - EDITOR AUTOCOMPLETE: IDEs surface registered properties with type hints
 *
 * HOW IT WORKS:
 * 1. Reads DesignTokens from design-tokens.ts
 * 2. Flattens nested structure: { color: { primary: { 500: "#934599" } } }
 *    → CSS name "--color-primary-500", value "#934599"
 * 3. Looks up the nearest config (sub-group takes precedence over group)
 *    to find syntax and inherits for the @property declaration
 * 4. Writes all @property blocks then a single :root {} block to gen.css
 *
 * Run automatically by vite-plugin-run when design-tokens.ts changes.
 * Also runs as part of `bun fix-all` to keep gen.css fresh for svelte-check.
 *
 * @see src/lib/data/shared/design-tokens.ts for token definitions
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@property
 */

import { DesignTokens } from "$data/shared";
import type {
	PropertyConfig,
	PropertyNode,
	PropertyValue,
} from "$types/design-tokens";

/**
 * Flattens nested object: { color: { primary: { 500: "#934599" } } }
 * Becomes: { "color-primary-500": "#934599" }
 */
function toCssProperties(
	propertyNode: PropertyNode,
	prefix: string = "",
): Record<string, PropertyValue> {
	let flattenedProperties: Record<string, PropertyValue> = {};
	const delimiter: string = "-";

	for (const [key, value] of Object.entries(propertyNode)) {
		const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			// Nested object → recurse deeper
			flattenedProperties = {
				...flattenedProperties,
				...toCssProperties(value as PropertyNode, newKey),
			};
		} else {
			// Leaf value → add to result
			flattenedProperties[newKey] = value as PropertyValue;
		}
	}

	return flattenedProperties;
}

/**
 * Generates gen.css from DesignTokens at build time.
 * Writes @property declarations (no initial-value) + :root {} block.
 */
async function genDesignTokens() {
	const properties = toCssProperties(DesignTokens);
	const keys = Object.keys(properties);

	let propertyBlocks = "";
	let rootValues = "";

	for (const key of keys) {
		// Skip config objects (they're metadata, not actual properties)
		if (key.includes("-config-")) continue;

		const value = properties[key];

		// Example: "color-primary-500" → ["color", "primary", "500"]
		const pathParts = key.split("-");
		const rootKey = pathParts[0] as keyof typeof DesignTokens | undefined;
		const subKey = pathParts[1] as string | undefined;

		// Sub-group config takes precedence over group config
		const root = rootKey ? DesignTokens[rootKey] : undefined;
		const sub =
			root && subKey
				? (root as Record<string, PropertyNode>)[subKey]
				: undefined;
		const groupConfig: PropertyConfig | undefined =
			sub?.config ?? (root as PropertyNode | undefined)?.config;

		// Convert to CSS variable name: "transition-easing-value" → "--transition-easing"
		const name = `--${key.replace("-value", "")}`;
		const syntax = groupConfig?.syntax ?? "*";
		const inherits = groupConfig?.inherits ?? true;
		const initialValue = typeof value === "object" ? "" : String(value);

		// @property block — no initial-value, allows computed values in :root
		propertyBlocks += `@property ${name} {\n\tsyntax: "${syntax}";\n\tinherits: ${inherits};\n}\n\n`;

		// :root value
		rootValues += `\t${name}: ${initialValue};\n`;
	}

	const output =
		`/* Auto-generated — DO NOT EDIT */\n` +
		`/* Source: src/lib/data/shared/design-tokens.ts */\n\n` +
		propertyBlocks +
		`:root {\n` +
		rootValues +
		`}\n`;

	await Bun.write("src/lib/styles/gen.css", output);
	console.log("gen.css written");
}

if (import.meta.main) {
	await genDesignTokens();
}
