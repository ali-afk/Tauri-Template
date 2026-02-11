/**
 * CSS CUSTOM PROPERTY REGISTRATION SYSTEM
 *
 * This module automatically registers CSS custom properties (CSS variables) with the browser
 * using the CSS Properties and Values API. This provides several benefits:
 *
 * 1. TYPE SAFETY: Browser validates property values against defined syntax
 *    - Can't assign "foo" to a <color> property
 *    - Catches errors early during development
 *
 * 2. SMOOTH ANIMATIONS: Registered properties can be transitioned/animated
 *    - Unregistered: color instantly jumps from blue to red
 *    - Registered: color smoothly transitions from blue to red
 *
 * 3. RELATIVE COLOR SYNTAX: Enables oklch(from var(--color) l c h) patterns
 *    - Allows automatic contrast calculation
 *    - Powers the .interactive class brightness adjustments
 *
 * HOW IT WORKS:
 * 1. Reads design tokens from default-properties.ts
 * 2. Flattens nested structure: { color: { primary: { 500: "#934599" } } }
 *    → { "color-primary-500": "#934599" }
 * 3. Registers each with window.CSS.registerProperty()
 * 4. CSS can now use: var(--color-primary-500)
 *
 * BROWSER SUPPORT:
 * - Chrome 85+
 * - Safari 16.4+
 * - Firefox 128+
 * App still works without registration, just loses smooth transitions
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSS/registerProperty
 * @see src/lib/data/shared/design-tokens.ts for token definitions
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
	obj: PropertyNode,
	prefix: string = "",
): Record<string, PropertyValue> {
	let result: Record<string, PropertyValue> = {};
	const delimiter: string = "-";

	for (const [key, value] of Object.entries(obj)) {
		const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			// Nested object → recurse deeper
			result = {
				...result,
				...toCssProperties(value as PropertyNode, newKey),
			};
		} else {
			// Leaf value → add to result
			result[newKey] = value as PropertyValue;
		}
	}

	return result;
}

/**
 * Registers all design tokens as CSS custom properties
 *
 * Called once at app startup (see +layout.svelte or app.html)
 *
 * @example
 * // Before registration:
 * // var(--color-primary-500) works but can't animate
 *
 * // After registration:
 * // .button { background: var(--color-primary-500); transition: background 200ms; }
 * // Smoothly animates when --color-primary-500 changes
 */
export function registerDesignTokens() {
	const properties = toCssProperties(DesignTokens);

	const keys = Object.keys(properties);

	// Track failed registrations for debugging
	const failedProperties: Array<{
		Property: string;
		Syntax: string;
		Value: string;
		Reason: string;
		Details: string;
	}> = [];

	keys.forEach((key) => {
		// Skip config objects (they're metadata, not actual properties)
		if (key.includes("-config-")) return;

		const value = properties[key];

		// Convert to CSS variable name: "transition.easing.value" → "--transition-easing"
		const cssVarName = `--${key.replace("-value", "")}`;

		// Example: "color-primary-500" → ["color", "primary", "500"]
		const pathParts = key.split("-");
		const rootKey = pathParts[0] as keyof typeof DesignTokens | undefined; // "color"
		const subKey = pathParts[1] as string | undefined; // "primary"

		// Example: color.primary.config takes precedence over color.config
		// Step through safely: get root object, then sub-object, then check for configs
		const root = rootKey ? DesignTokens[rootKey] : undefined;
		const sub =
			root && subKey
				? (root as Record<string, PropertyNode>)[subKey]
				: undefined;
		const groupConfig: PropertyConfig | undefined =
			sub?.config ?? (root as PropertyNode | undefined)?.config;

		const syntax = groupConfig?.syntax ?? "*";
		const inherits = groupConfig?.inherits ?? true;
		const initialValue = typeof value === "object" ? "" : String(value);

		try {
			window.CSS.registerProperty({
				name: cssVarName,
				syntax: syntax,
				inherits: inherits,
				initialValue: initialValue,
			});
		} catch (e: unknown) {
			// Property registration can fail if:
			// - Already registered (multiple calls to registerProperties)
			// - Invalid syntax specification
			// - Initial value doesn't match syntax type
			// - Browser doesn't support feature

			const error = e as Error;
			const errorMessage = error.message.split(":");

			const errorReason = errorMessage[0] ?? "Unknown error reason";
			const errorDetails = errorMessage[1] ?? "Unknown error details";

			failedProperties.push({
				Property: cssVarName,
				Syntax: syntax,
				Value: initialValue,
				Reason: errorReason,
				Details: errorDetails,
			});
		}
	});

	// Log failures in development for debugging
	// In production, app still works (just without smooth transitions)
	if (import.meta.env.DEV && failedProperties.length > 0) {
		console.warn("⚠️ Some CSS properties failed to register:", failedProperties);
		console.info(
			"💡 App will still work, but these properties won't animate smoothly",
		);
	}
}
