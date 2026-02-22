import type { MediaQuery } from "svelte/reactivity";

/**
 * Returns a value based on whether a CSS media query matches the current viewport.
 * @param query - Media query
 * @param onTrue - Value if query returns true
 * @param onFalse - Value if query returns false
 */
export function getCurrentMedia<T>(
	query: MediaQuery,
	onTrue: T,
	onFalse: T,
): T {
	return query.current ? onTrue : onFalse;
}

/**
 * Reads a CSS property from the named element (defaults to root).
 */
export function queryCssProperty(
	property: string,
	element?: HTMLElement,
): string {
	const target = element ?? document.documentElement;
	return getComputedStyle(target).getPropertyValue(`--${property}`).trim();
}
