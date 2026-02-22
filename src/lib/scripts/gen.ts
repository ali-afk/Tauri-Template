/**
 * BUILD-TIME CSS CUSTOM PROPERTY GENERATOR
 *
 * Reads DesignTokens from design-tokens.ts and writes gen.css:
 * - `@property` blocks with a safe `initial-value` per syntax type, so the
 *   browser accepts the registration. The `:root` block that follows immediately
 *   overrides each property with its real value (which may be a computed
 *   expression like `color-mix()` or `var()`).
 * - A single `:root {}` block with all token values.
 *
 * Runs automatically via vite-plugin-run on design-tokens.ts changes,
 * and as part of `bun fix-all`.
 *
 * @see src/lib/data/shared/design-tokens.ts for token definitions and structure
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@property
 */

import { DesignTokens } from "$data/shared";
import type {
	PropertyConfig,
	PropertyNode,
	PropertyValue,
} from "$types/design-tokens";

/**
 * Flattens nested object { color: { primary: { 500: "#934599" } } }
 * into: { "--color-primary-500": "#934599" }
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

function getDefaultCssValues(syntax: string) {
	switch (syntax) {
		case "<color>": {
			return "#fff";
		}
		case "<number>":
		case "<integer>":
		case "<length>":
		case "<length-percentage>":
		case "<angle>":
		case "<percentage>":
		case "<resolution>": {
			return "0";
		}
		case "<time>": {
			return "0s";
		}
		case "<url>": {
			return "about:invalid";
		}
		case "<transform-list>":
		case "<image>": {
			return "none";
		}
		case "<custom-ident>": {
			return "auto";
		}
		default: {
			return "0";
		}
	}
}

/**
 * Generates gen.css from DesignTokens at build time.
 * Writes @property declarations with safe initial-value defaults + :root {} block.
 *
 * @see src/lib/data/shared/design-tokens.ts for token definitions
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
		const trueValue = typeof value === "object" ? "" : String(value);

		const initialValue = getDefaultCssValues(syntax);

		// @property block — initial-value satisfies the spec; :root overrides with real value
		propertyBlocks += `@property ${name} {\n\tsyntax: "${syntax}";\n\tinherits: ${inherits};\n\tinitial-value: ${initialValue};\n}\n\n`;

		// :root value
		rootValues += `\t${name}: ${trueValue};\n`;
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
