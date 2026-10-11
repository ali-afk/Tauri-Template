/** Color scale degrees as const array for use in cycleColorScale().
 *  Values must match the keys in design-tokens.ts color groups. */
export const ColorScale = [100, 300, 500, 700, 900] as const;
export type ColorDegrees = (typeof ColorScale)[number];
export type ColorRecord = {
	[K in ColorDegrees]: string;
};
