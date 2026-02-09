/** Shared type definitions for component props.
 *  Image wraps a Vite asset URL with explicit dimensions.
 *  Item / ItemCategory for card grids and category displays.
 *  QuoteData for testimonial/quote cards. */
import type { FilePath, HttpPath } from "$types/app";

export type LoadPriority = "high" | "low";

export interface QuoteData {
	title: string;
	comment: string;
	avatar: Image;
}

export type Image = {
	url: FilePath | HttpPath;
	dimensions: { width: number; height: number };
};

/** Generic item for showcase/category displays */
export type Item = {
	name: string;
	image: Image;
	/** Optional link to more details */
	link?: string;
	/** Optional description */
	description?: string;
};

/** Category grouping items together */
export type ItemCategory = {
	name: string;
	items: Item[];
};

export type DocumentLink = {
	label: string;
	href: string;
};

export type DocumentGroup = {
	links: DocumentLink[];
};
