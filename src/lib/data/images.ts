/** Image asset references with type-safe dimensions.
 *  Uses `as const satisfies Image` pattern — wraps Vite static URL
 *  with explicit width/height for layout stability before image loads.
 *  Import from $data/images (not $assets directly). */
import { Logo as logo, ToggleIcon as toggleIcon } from "$assets";
import type { FilePath } from "$types/app";
import type { Image } from "$types/component-props";

export const Logo = {
	url: logo as FilePath,
	dimensions: { width: 800, height: 706 },
} as const satisfies Image;

export const ToggleIcon = {
	url: toggleIcon as FilePath,
	dimensions: { width: 16, height: 16 },
} as const satisfies Image;
