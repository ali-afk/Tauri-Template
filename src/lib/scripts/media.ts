/** Media query and CSS property utilities.
 *  getCurrentMedia wraps Svelte's MediaQuery for reactive media matching.
 *  queryCssProperty reads computed CSS custom property values at runtime. */
import { MediaQuery } from "svelte/reactivity";

/**
 * Returns a boolean based on whether a CSS media query matches the current viewport.
 * @param query - Media query instance or string
 * @returns A boolean representing the current match status
 */
export function getCurrentMedia(query: MediaQuery | string): boolean;

/**
 * Returns a specific value based on whether a CSS media query matches the current viewport.
 * @param query - Media query instance or string
 * @param onTrue - Value to return if query matches
 * @param onFalse - Value to return if query does not match
 * @returns The value of either onTrue or onFalse
 */
export function getCurrentMedia<T>(
	query: MediaQuery | string,
	onTrue: T,
	onFalse: T,
): T;

/**
 * Single implementation for the overloads above.
 */
export function getCurrentMedia<T>(
	query: MediaQuery | string,
	onTrue?: T,
	onFalse?: T,
): T | boolean {
	const media = typeof query === "string" ? new MediaQuery(query) : query;

	// No values provided — return raw boolean
	if (onTrue !== undefined && onFalse !== undefined) {
		return media.current ? onTrue : onFalse;
	}

	return media.current;
}

/**
 * Reads a CSS custom property from an element's computed style.
 * @param property - Property name prefixed by "--"
 * @param element - Defaults to `:root` if omitted
 * @returns The trimmed string value of the property
 */
export function queryCssProperty(
	property: string,
	element?: HTMLElement,
): string {
	if (!property.startsWith("--")) {
		throw Error(`${property} must include "--" prefix`);
	}
	const target = element ?? document.documentElement;
	return getComputedStyle(target).getPropertyValue(property).trim();
}
