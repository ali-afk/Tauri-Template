import type { MediaQuery } from "svelte/reactivity";
import { isSSR } from "$scripts/utils";

/**
 * Returns a value color-based on whether a CSS media query matches the current viewport.
 * @param query - Media query
 * @param onTrue - Value if query returns true
 * @param onFalse - Value if query returns false
 */
export function getMediaCurrent<T>(
	query: MediaQuery,
	onTrue: T,
	onFalse: T,
): T {
	if (isSSR()) return onFalse;
	return query.current ? onTrue : onFalse;
}

/**
 * Reads a CSS property from the named element (defaults to root).
 */
export function queryCssProperty(
	property: string,
	element: HTMLElement | null = null,
): string {
	if (isSSR()) return "";
	const target = element ?? document.documentElement;
	return getComputedStyle(target).getPropertyValue(`--${property}`).trim();
}
