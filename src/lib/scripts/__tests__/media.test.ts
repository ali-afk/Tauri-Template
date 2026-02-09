import { MediaQuery } from "svelte/reactivity";
import { getCurrentMedia, queryCssProperty } from "$scripts/media";

describe(queryCssProperty, () => {
	const div = document.createElement("div");
	div.style.setProperty("--test-width", "10px");
	document.documentElement.style.setProperty("--test-color", "hotpink");
	document.body.appendChild(div);

	it("reads property from :root by default", () => {
		expect(queryCssProperty("--test-color")).toBe("hotpink");
	});

	it("returns property from specified target", () => {
		expect(queryCssProperty("--test-width", div)).toBe("10px");
	});

	it("throws if '--' prefix is missing", () => {
		expect(() => {
			queryCssProperty("test-color");
		}).toThrow();
	});

	it("returns empty string for undefined property", () => {
		expect(queryCssProperty("--nonexistent")).toBe("");
	});
});

// Ensures media.current returns our value,
// this allows us to pass the media query
const mockMedia = vi.hoisted(() => ({
	current: false,
}));

// Replace MediaQuery with our own
vi.mock("svelte/reactivity", () => ({
	MediaQuery: class {
		get current() {
			return mockMedia.current;
		}
	},
}));

describe(getCurrentMedia, () => {
	it("returns boolean when value params omitted", () => {
		mockMedia.current = true;
		expect(getCurrentMedia("(prefers-color-scheme: dark)")).toBe(true);
		mockMedia.current = false;
		expect(getCurrentMedia("(prefers-color-scheme: dark)")).toBe(false);
	});

	it("returns onTrue when matched, onFalse when not", () => {
		mockMedia.current = true;
		expect(getCurrentMedia("(min-width: 768px)", "wide", "narrow")).toBe(
			"wide",
		);
		mockMedia.current = false;
		expect(getCurrentMedia("(min-width: 768px)", "wide", "narrow")).toBe(
			"narrow",
		);
	});

	it("accepts a MediaQuery instance directly", async () => {
		mockMedia.current = true;
		expect(getCurrentMedia(new MediaQuery("(hover: hover)"))).toBe(true);
	});
});
