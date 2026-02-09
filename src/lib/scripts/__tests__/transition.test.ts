import { fade, slide } from "svelte/transition";
import { DesignTokens } from "$data/design-tokens";
import { parseBezierCoords, standard } from "$scripts/transition";
import { parseTime } from "$scripts/utils";

describe(parseBezierCoords, () => {
	it.each([
		{ bezier: "apple", reason: "non-bezier string" },
		{ bezier: "cubic-bezier(0.4, 0, 0.2)", reason: "< 4 coords" },
		{ bezier: "cubic-bezier(0.4, 0, 0.2, banana)", reason: "NaN coord" },
		{ bezier: "cubic-bezier(, 0, 0.2, 1)", reason: "empty coordinate 1" },
		{ bezier: "cubic-bezier(0.4, , 0.2, 1)", reason: "empty coordinate 2" },
		{ bezier: "cubic-bezier(0.4, 0, , 1)", reason: "empty coordinate 3" },
		{ bezier: "cubic-bezier(0.4, 0, 0.2, )", reason: "empty coordinate 4" },
		{ bezier: "cubic-bezier(-0.4, 0, 0.2, 1)", reason: "negative x1 coord" },
		{ bezier: "cubic-bezier(0.4, 0, -0.2, 1)", reason: "negative x2 coord" },
	])("throws if invalid bezier ($reason)", ({ bezier }) => {
		expect(() => parseBezierCoords(bezier)).toThrow();
	});

	it.each([
		{
			bezier: "cubic-bezier(0.4, 0, 0.2, 1)",
			coords: [0.4, 0, 0.2, 1],
			reason: "standard",
		},
		{
			bezier: "cubic-bezier(.4, 0, .2, 1)",
			coords: [0.4, 0, 0.2, 1],
			reason: "no preceding zero in floats",
		},
		{
			bezier: "cubic-bezier(0.4, -0.5, 0.2, 1.5)",
			coords: [0.4, -0.5, 0.2, 1.5],
			reason: "negative y1, y2 > 1",
		},
		{
			bezier: "cubic-bezier(0.42,0,0.58,1)",
			coords: [0.42, 0, 0.58, 1],
			reason: "no spaces",
		},
		{
			bezier: "  cubic-bezier(  0.42  ,  0  ,  0.58  ,  1  )  ",
			coords: [0.42, 0, 0.58, 1],
			reason: "excessive spaces",
		},
	])("parses $reason", ({ bezier, coords }) => {
		expect(parseBezierCoords(bezier)).toEqual(coords);
	});
});

const mockPrefersReducedMotion = vi.hoisted(() => ({
	current: false,
}));

vi.mock("$scripts/media", () => ({
	queryCssProperty() {
		return "cubic-bezier(.5,0,.5,1)"; // var(--ease-in-out-3)
	},
	getCurrentMedia() {
		return mockPrefersReducedMotion.current;
	},
}));

describe(standard, () => {
	it("returns transition with default duration", () => {
		const defaultDuration = parseTime(DesignTokens.transition.duration.medium);
		const config = standard(document.body, [fade]);
		expect(config.duration).toBe(defaultDuration);
		expect(config.delay).toBe(0);
		expect(typeof config.css).toBe("function");
	});

	it("returns specified transition", () => {
		const config = standard(document.body, [
			fade,
			{ duration: 800, delay: 100 },
		]);
		expect(config.duration).toBe(800);
		expect(config.delay).toBe(100);
		expect(typeof config.css).toBe("function");
	});

	it("returns fade with short duration when reduced motion", () => {
		mockPrefersReducedMotion.current = true;
		const shortDuration = parseTime(DesignTokens.transition.duration.short);
		const config = standard(document.body, [slide, { duration: 500 }]);
		expect(config.duration).toBe(shortDuration);
		expect(config.delay).toBe(0);
		expect(typeof config.css).toBe("function");
	});
});
