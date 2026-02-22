import type { Time } from "lightningcss";
import { type ColorDegrees, ColorScale } from "$types/colors";
import type { LoadPriority } from "$types/component-props";

let idCounter = 0; // This is just to make sure the generateId function doesn't return the same value twice (even if that's unlikely)

/**
 * Generates a unique, semantically prefixed ID for ARIA linking.

 * @param prefix - Defaults to 'id'. (e.g., 'faq', 'content')
 * @returns Unique prefixed id
 */
export function generateId(prefix: string = "id"): string {
	idCounter++;
	return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 5)}`;
}

/**
 * Converts a CSS time string to a raw number in milliseconds.

 * @example "0.5s" -> 500, "200ms" -> 200
 * @param duration - Milliseconds (ms) or seconds (s)
 * @returns Unitless millisecond value
 */
export function parseTime(
	duration: Time | `${number}s` | `${number}ms`,
): number {
	const castIntoTime = (unit: string, number: number) => {
		if (unit === "seconds" || unit === "s") return number * 1000;
		else return number;
	};

	if (typeof duration !== "string") {
		return castIntoTime(duration.type, duration.value);
	}

	const number = duration.match(/\d+(\.\d+)?/);
	const unit = duration.match(/(ms|s)/);

	if (!(number && unit)) {
		throw Error("Could not parse time!");
	}
	return castIntoTime(unit[0], parseFloat(number[0]));
}

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

/**
 * Simple colorset cycler.
 *
 * @param index - The color's index (or i % 5) on the color scale
 * @returns Valid color degree used to index a colorset type
 */
export function cycleColorScale(index: number): ColorDegrees {
	if (index < 0) throw Error("Color scale index cannot be negative");
	// 500 is the default color scale value;
	return ColorScale[index % 5] ?? 500;
}
