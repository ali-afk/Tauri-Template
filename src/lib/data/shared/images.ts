import { Logo as logo, ToggleIcon as toggleIcon } from "$assets/shared";
import type { FilePath, Image } from "$types/component-props";

export const Logo = {
	url: logo as FilePath,
	dimensions: { width: 800, height: 706 },
} as const satisfies Image;

export const ToggleIcon = {
	url: toggleIcon as FilePath,
	dimensions: { width: 16, height: 16 },
} as const satisfies Image;
