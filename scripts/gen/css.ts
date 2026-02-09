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
 * and as part of `bun lint`.
 *
 * @see src/lib/data/design-tokens.ts for token definitions and structure
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@property
 */

import { DesignTokens } from "$data/design-tokens";
import type {
	DesignTokenConfig,
	DesignTokenData,
	DesignTokenNode,
} from "$types/design-tokens";

/**
 * Flattens a nested DesignTokenNode into a single-level key → value map.
 * Config objects are stored whole as `<path>-config` rather than flattened.
 *
 * @example { color: { primary: { 500: "#934599" } } } → { "color-primary-500": "#934599" }
 * @param designTokenProperty - Node to flatten; top-level call passes `DesignTokens`
 * @param parentKey - Accumulated prefix from parent calls; omit on first call
 * @param accumulatedProperties - Shared accumulator; omit on first call
 * @returns Flat map of dash-joined token keys to values or config objects
 */
export function flattenDesignToken(
	designTokenProperty: DesignTokenNode,
	parentKey: string = "",
	accumulatedProperties: Record<string, DesignTokenData> = {},
): Record<string, DesignTokenData> {
	for (const [key, value] of Object.entries(designTokenProperty)) {
		const prefixedKey = parentKey ? `${parentKey}-${key}` : key;

		// Don't flatten config for later parsing.
		if (key === "config") {
			accumulatedProperties[prefixedKey] = value as DesignTokenConfig;
			continue;
		}

		// Value is a node.
		if (typeof value === "object") {
			flattenDesignToken(
				value as DesignTokenNode,
				prefixedKey,
				accumulatedProperties,
			);
		} else accumulatedProperties[prefixedKey] = value; // Value is well... a value.
	}
	return accumulatedProperties;
}

/**
 * Maps CSS @property syntax types to spec-valid initial values.
 * Used by `getDefaultCssValues` and available for testing/verification.
 */
export const DEFAULT_CSS_VALUES: Record<string, string> = {
	"<color>": "#fff",
	"<number>": "0",
	"<integer>": "0",
	"<length>": "0",
	"<length-percentage>": "0",
	"<angle>": "0",
	"<percentage>": "0",
	"<resolution>": "0",
	"<time>": "0s",
	"<url>": "about:invalid",
	"<transform-list>": "none",
	"<image>": "none",
	"<custom-ident>": "auto",
};

/**
 * Returns a spec-valid `initial-value` for a given `@property` syntax type.
 *
 * @param syntax - A CSS `@property` syntax string (e.g. `"<color>"`, `"<time>"`)
 * @returns A safe concrete fallback — `var()`/`color-mix()` are not valid here
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@property/initial-value
 */
export function getDefaultCssValues(syntax: string) {
	return DEFAULT_CSS_VALUES[syntax] ?? "0";
}

/**
 * Walks up the key hierarchy to find the nearest config — sub-group takes precedence.
 * e.g. `"transition-duration-medium"` checks `"transition-duration-config"` before `"transition-config"`.
 *
 * @param key - A flattened token key (e.g. `"color-primary-500"`)
 * @param flattenedTokens - The flat map produced by `flattenDesignToken`
 * @returns The nearest `DesignTokenConfig` in the hierarchy
 * @throws If no config exists anywhere in the key's ancestry
 */
export function getNearestConfig(
	key: string,
	flattenedTokens: Record<string, DesignTokenData>,
) {
	const splitKey = key.split("-");
	splitKey.pop();

	const parentKeys: string[] = [];
	const possibleConfigKeys: string[] = [];
	const depth = splitKey.length;

	for (let i = 0; i < depth; i++) {
		parentKeys.push(splitKey.join("-"));
		splitKey.pop(); // Removes the leaf, walking up the hierarchy.
		possibleConfigKeys.push(`${parentKeys[i]}-config`);
	}

	let nearestConfigKey: string = "";

	for (const configKey of possibleConfigKeys) {
		if (flattenedTokens[configKey]) {
			nearestConfigKey = configKey;
			break;
		}
	}

	if (!nearestConfigKey)
		throw Error(`No available design token config for key: "${key}"`);

	return flattenedTokens[nearestConfigKey] as DesignTokenConfig;
}

/**
 * Generates gen.css from DesignTokens at build time.
 * Writes @property declarations with safe initial-value defaults + :root {} block.
 *
 * @see src/lib/data/design-tokens.ts for token definitions
 */
export default async function genDesignTokens() {
	const properties = flattenDesignToken(DesignTokens);
	const keys = Object.keys(properties);

	let propertyBlocks = "";
	let trueValues = "";

	for (const key of keys) {
		// Skip config objects (they're metadata, not actual properties)
		if (key.includes("-config")) continue;
		const config = getNearestConfig(key, properties);

		// Convert to CSS variable name: "transition-easing-value" → "--transition-easing"
		const name = `--${key.replace("-value", "")}`;
		const initialValue = getDefaultCssValues(config.syntax);
		const trueValue = String(properties[key]);

		// @property block — initial-value satisfies the spec; :root overrides with real value
		propertyBlocks += `@property ${name} {\n\tsyntax: "${config.syntax}";\n\tinherits: ${config.inherits};\n\tinitial-value: ${initialValue};\n}\n\n`;
		// :root value
		trueValues += `\t${name}: ${trueValue};\n`;
	}

	const output =
		`/* Auto-generated — DO NOT EDIT */\n` +
		`/* Source: src/lib/data/design-tokens.ts */\n\n` +
		propertyBlocks +
		`:root {\n` +
		trueValues +
		`}\n`;

	await Bun.write("src/lib/styles/gen.css", output);
	console.log("gen.css written");
}
