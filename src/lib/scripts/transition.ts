/**
 * TRANSITION & EASING SYSTEM
 *
 * Wraps Svelte transitions with consistent easing/duration from design tokens.
 * Automatically disables animations when prefers-reduced-motion is active.
 *
 * Usage — always use `standard()` instead of transitions directly:
 * ```svelte
 * <div transition:standard={[slide]}>content</div>
 * ```
 *
 * @see src/lib/data/shared/design-tokens.ts for easing/duration values
 */

import BezierEasing from "bezier-easing";
import * as svelteEasings from "svelte/easing";
import { prefersReducedMotion } from "svelte/motion";
import {
	type FadeParams,
	type FlyParams,
	fade,
	type SlideParams,
	type TransitionConfig,
} from "svelte/transition";
import { DesignTokens } from "$data/shared";
import { getCurrentMedia, queryCssProperty } from "./media";
import { parseTime } from "./utils";

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
};

/**
 * Gets the appropriate easing function for Svelte transitions
 *
 * Resolution order:
 * 1. Check if it's a CSS keyword mappable to a Svelte name (e.g., "ease-out" → "quadOut")
 * 2. Check if Svelte has a built-in easing with this name (e.g., "quadOut")
 * 3. Check if it's a CSS keyword mappable to bezier coords (e.g., "ease")
 * 4. Parse as cubic-bezier() string
 *
 * @param queriedElement - Element to query easing from (defaults to root)
 * @returns Easing function that takes t (0-1) and returns eased value (0-1)
 */
function getEasing(queriedElement?: HTMLElement): (t: number) => number {
	const raw = queryCssProperty("transition-easing", queriedElement);
	if (!raw) throw Error("var(--transition-easing) is invalid!");

	// Tries to map css keyword to existing svelte keyword if they differ
	const svelteKey = CSS_TO_SVELTE_MAP[raw] || raw;

	type SvelteEasingKey = keyof typeof svelteEasings;
	if (svelteKey in svelteEasings) {
		return svelteEasings[svelteKey as SvelteEasingKey];
	}

	// Tries to map non-svelte css keyword to coords, or parse as cubic-bezier
	const coords = CSS_NATIVE_COORDS[raw] || parseBezierCoords(raw);
	return BezierEasing(coords[0], coords[1], coords[2], coords[3]);
}

/**
 * Parses cubic-bezier() CSS functions into coordinate arrays
 *
 * @param bezier - CSS cubic-bezier string or easing keyword
 * @returns Tuple of 4 numbers [x1, y1, x2, y2] for BezierEasing
 * @example
 * parseBezierCoords("cubic-bezier(0.4, 0, 0.2, 1)");
 * // Returns: [0.4, 0, 0.2, 1]
 *
 */
function parseBezierCoords(bezier: string): [number, number, number, number] {
	const regex = /cubic-bezier\(([^)]+)\)/;
	const match = bezier.match(regex);

	if (!match?.[1]) {
		throw new Error(
			`Invalid bezier pattern in var(--transition-easing): ${bezier}`,
		);
	}

	// Extract coordinates and convert to numbers
	const coords = match[1].split(",").map((n) => parseFloat(n.trim()));

	if (coords.length !== 4)
		throw Error(
			`var(--transition-easing) bezier did not contain 4 coords: ${bezier}`,
		);
	if (!coords.every((coord) => !Number.isNaN(coord)))
		throw Error(
			`var(--transition-easing) bezier coords are of type NaN!: ${bezier}`,
		);

	return coords as [number, number, number, number];
}

/**
 * Type for a Svelte transition's parameters.
 * Can be extended with other Svelte parameters.
 */
type Params = SlideParams | FadeParams | FlyParams;

/**
 * Type for a Svelte transition function
 * Takes a node and optional parameters, returns TransitionConfig
 */
type TransitionFn<T extends Params> = (
	node: Element,
	params?: T,
) => TransitionConfig;

/**
 * Standardizes Svelte transition parameters.
 * If user has prefers-reduced-motion enabled, fade is used with a short duration.
 *
 * @param node - The DOM element (automatically provided by Svelte)
 * @param params - Optional transition parameters (duration, axis, etc.)
 * @returns Svelte transition object
 *
 * @example
 * // Simple usage
 * <div transition:standard={[slide]}>
 *
 * @example
 * // Custom duration
 * <div transition:standard={[fly, { duration: 300 }]}>
 */
export function standard<T extends Params>(
	node: HTMLElement,
	args: [transitionFn: TransitionFn<T>, T?],
): TransitionConfig {
	const easing = getEasing(node);
	const [transitionFn, transtionParams] = args;

	const defaultDuration =
		transtionParams?.duration ??
		parseTime(DesignTokens.transition.duration.medium);
	const reducedDuration = parseTime(DesignTokens.transition.duration.short);

	if (getCurrentMedia(prefersReducedMotion))
		return fade(node, {
			duration: reducedDuration,
			easing,
		});

	return transitionFn(node, {
		...transtionParams,
		duration: defaultDuration,
		easing,
	} as T);
}
