import { render, screen, within } from "@testing-library/svelte";

import HeroImage from "#components/HeroImage.svelte";
import type { Image } from "#types/component-props.js";

const image: Image = {
	url: "https://example.com/hero.webp",
	dimensions: { width: 1600, height: 900 },
};

describe(HeroImage, () => {
	it("renders image inside h1 with title as alt when renderTitle omitted", () => {
		render(HeroImage, { image, title: "Hero Title" });

		const heading = screen.getByRole("heading", { level: 1 });
		const img = within(heading).getByRole("img");

		expect(img).toHaveAttribute("src", "https://example.com/hero.webp");
		expect(img).toHaveAttribute("alt", "Hero Title");
		expect(img).toHaveAttribute("width", "1600");
		expect(img).toHaveAttribute("height", "900");
		expect(img).toHaveAttribute("fetchpriority", "high");
	});

	it("renders separate overlay h1 and image outside it when renderTitle is true", () => {
		render(HeroImage, { image, title: "Hero Title", renderTitle: true });

		const heading = screen.getByRole("heading", {
			level: 1,
			name: "Hero Title",
		});
		const img = screen.getByRole("img");

		expect(heading).toHaveClass("title--page", "rendered-title");
		expect(heading).not.toContainElement(img);
	});
});
