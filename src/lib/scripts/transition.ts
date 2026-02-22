/**
 * TRANSITION & EASING SYSTEM
 *
 * Wraps Svelte transitions with consistent easing/duration from design tokens.
 * Automatically disables animations when prefers-reduced-motion is active.
 *
 * Usage — always use `standard()` instead of transitions directly:
 * ```svelte
 * <div transition:standard={slide}>content</div>
 * ```
 *
 * @see src/lib/data/shared/design-tokens.ts for easing/duration values
 *
 * TODO: refactor — currently too loose:
 * - `TransitionFn` uses `params?: any` and non-null assertions throughout
 * - `params?: SlideParams` on `standard()` is too narrow — only typed for `slide`,
 *   breaks type safety when used with `fly`, `fade`, etc.
 * - `standard()` should either accept a generic params type or provide
 *   per-transition overloads
 */

import BezierEasing from "bezier-easing";
import * as svelteEasings from "svelte/easing";
import { prefersReducedMotion } from "svelte/motion";
import type { SlideParams, TransitionConfig } from "svelte/transition";
import { DesignTokens } from "$data/shared";
import { getCurrentMedia, queryCssProperty } from "./media";
import { parseTime } from "./utils";

/**
 * Type for a Svelte transition function
 * Takes a node and optional parameters, returns TransitionConfig
 */
type TransitionFn = (node: Element, params?: any) => TransitionConfig;

/**
 * Maps CSS easing keywords to Svelte easing function names
 * Needed because CSS and Svelte use different naming conventions
 */
const CSS_TO_SVELTE_MAP: Record<string, string> = {
	"ease-in": "quadIn",
	"ease-out": "quadOut",
	"ease-in-out": "quadInOut",
};

/**
 * Cubic bezier coordinates for CSS native easing keywords
 * Format: [x1, y1, x2, y2] for cubic-bezier(x1, y1, x2, y2)
 */
const CSS_NATIVE_COORDS: Record<string, [number, number, number, number]> = {
	ease: [0.25, 0.1, 0.25, 1.0], // The default browser easing
	default: [0.25, 0.1, 0.25, 1.0],
};

/**
 * Gets the appropriate easing function for Svelte transitions
 *
 * Resolution order:
 * 1. Check if Svelte has a built-in easing with this name (e.g., "quadOut")
 * 2. Check if it's a CSS keyword we can map to Svelte (e.g., "ease-out" → "quadOut")
 * 3. Parse as cubic-bezier() if it's a custom curve
 * 4. Fall back to default easing from design tokens
 *
 * @param queriedElement - Element to query easing from (defaults to root)
 * @returns Easing function that takes t (0-1) and returns eased value (0-1)
 *
 * @example
 * // In a Svelte component:
 * <div transition:slide={{ duration: 200, easing: getEasing() }}>
 */
export function getEasing(queriedElement?: HTMLElement): (t: number) => number {
	const raw =
		queryCssProperty("transition-easing", queriedElement) ||
		DesignTokens.transition.easing.value;

	// Tries to map css keyword to existing svelte keyword if they differ
	const svelteKey = CSS_TO_SVELTE_MAP[raw] || raw;

	if (svelteKey in svelteEasings) {
		return (svelteEasings as any)[svelteKey];
	}

	// Tries to map non-svelte css keyword to coords, or parse as cubic-bezier
	const coords = CSS_NATIVE_COORDS[raw] || parseBezierCoords(raw);
	return BezierEasing(coords[0], coords[1], coords[2], coords[3]);
}

/**
 * Parses cubic-bezier() CSS functions into coordinate arrays
 *
 * Takes a string like "cubic-bezier(0.25, 0.1, 0.25, 1.0)" and extracts
 * the four control point coordinates as numbers.
 *
 * @param bezier - CSS cubic-bezier string or easing keyword
 * @returns Tuple of 4 numbers [x1, y1, x2, y2] for BezierEasing
 *
 * @example
 * parseBezierCoords("cubic-bezier(0.4, 0, 0.2, 1)")
 * // Returns: [0.4, 0, 0.2, 1]
 *
 * @internal This is called by getEasing() - you rarely need to call it directly
 */
function parseBezierCoords(bezier: string): [number, number, number, number] {
	const regex = /cubic-bezier\(([^)]+)\)/;
	const match = bezier.match(regex);

	if (match) {
		// Extract coordinates and convert to numbers
		const coords = match[1]!.split(",").map((n) => parseFloat(n.trim()));
		return [coords[0]!, coords[1]!, coords[2]!, coords[3]!];
	}

	// Fallback to default easing from design tokens if parsing fails
	const fallbackMatch = DesignTokens.transition.easing.value.match(regex);
	if (!fallbackMatch) {
		throw new Error(
			`Invalid default easing value: "${DesignTokens.transition.easing.value}". ` +
				`Expected cubic-bezier() format.`,
		);
	}
	const coords = fallbackMatch[1]!.split(",").map((n) => parseFloat(n.trim()));
	return [coords[0]!, coords[1]!, coords[2]!, coords[3]!];
}

/**
 * Creates standardized transition parameters for use with Svelte transitions
 *
 * ACCESSIBILITY NOTE:
 * If user has prefers-reduced-motion enabled, duration becomes 0ms (instant)
 * This prevents motion sickness in users with vestibular disorders
 *
 * @param node - The DOM element (automatically provided by Svelte)
 * @param params - Optional slide parameters (duration, axis, etc.)
 * @returns Svelte transition object
 *
 * @example
 * // Simple usage with slide transition
 * <div transition:standard={slide}>
 *
 * @example
 * // With custom duration
 * <div transition:standard={fade, { duration: 300 }}>
 */
export function standard(
	node: HTMLElement,
	transitionFn: TransitionFn,
	params?: SlideParams,
): TransitionConfig {
	const mergedParams: SlideParams = {
		...params,
		duration:
			params?.duration ?? parseTime(DesignTokens.transition.duration.medium),
		easing: getEasing(node),
	};

	if (getCurrentMedia(prefersReducedMotion, true, false)) {
		mergedParams.duration = 0;
	}

	return transitionFn(node, mergedParams);
}
