let idCounter = 0; // This is just to make sure the generateId function doesn't return the same value twice (even if that's unlikely)

/**
 * Generates a unique, semantically prefixed ID for ARIA linking.
 * @param prefix - Defaults to 'id'. (e.g., 'faq', 'content')
 */
export function generateId(prefix: string = "id"): string {
	idCounter++;
	return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 5)}`;
}

/**
 * Used to prevent running client scripts.
 */
export function isSSR(): boolean {
	return typeof window === "undefined";
}

/**
 * Converts a CSS time string (ms or s) to a raw number in milliseconds.
 * Example: "0.5s" -> 500, "200ms" -> 200
 */
export function parseCssTime(time: string): number {
	const trimmed = time.trim().toLowerCase();
	if (!trimmed || trimmed === "initial" || trimmed === "unset") return 0;

	// Matches digits/decimals and captures the unit (s or ms)
	const match = trimmed.match(/^([\d.]+)(s|ms)$/);

	if (!match) {
		const fallback = parseFloat(trimmed);
		return Number.isNaN(fallback) ? 0 : fallback;
	}

	const [_, value = "0", unit = "ms"] = match;
	const numValue = parseFloat(value);

	return unit === "s" ? numValue * 1000 : numValue;
}

import type { LoadPriority } from "$types/component-props";

/**
 * Simple load priority calculation.
 * Items above the fold get "high" priority for eager loading.
 *
 * @param index - The item's position in the list
 * @param threshold - Number of items considered "above the fold"
 * @returns "high" for items below threshold, "low" otherwise
 */
export function getLoadPriority(
	index: number,
	threshold: number,
): LoadPriority {
	return index < threshold ? "high" : "low";
}

import { type ColorDegrees, ColorScale } from "$types/colors";

/**
 * Simple colorset cycler.
 *
 * @param index - The color's index on the color scale.
 * @returns a valuid color degree used to index a colorset type
 */
export function cycleColorScale(index: number): ColorDegrees {
	return ColorScale[index % 5] ?? 500;
}
