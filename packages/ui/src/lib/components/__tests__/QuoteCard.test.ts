import { render, screen } from "@testing-library/svelte";

import QuoteCard from "#components/QuoteCard.svelte";
import { DesignTokens } from "#data/design-tokens.js";
import type { Image } from "#types/component-props.js";

const avatar: Image = {
	url: "https://example.com/avatar.webp",
	dimensions: { width: 64, height: 64 },
};

const baseProps = {
	title: "Jane Doe",
	comment: "Great product, would recommend!",
	avatar,
	loadPriority: "low",
	color: 500,
	direction: "left",
} as const;

describe(QuoteCard, () => {
	it("renders avatar, title, and comment when given quote data", () => {
		render(QuoteCard, { ...baseProps });

		// Avatar is decorative (alt="") → presentational role, not img
		expect(screen.getByRole("presentation")).toHaveAttribute(
			"src",
			"https://example.com/avatar.webp",
		);
		expect(screen.getByRole("heading", { level: 2, name: "Jane Doe" })).toBeInTheDocument();
		expect(screen.getByRole("blockquote")).toHaveTextContent("Great product, would recommend!");
	});

	it("applies primary color token as background variable when color given", () => {
		const { container } = render(QuoteCard, { ...baseProps });

		const article = container.querySelector("article");
		expect(article?.getAttribute("style")).toContain(
			`--_background: ${DesignTokens.color.primary[500]}`,
		);
	});

	it("adds reverse class when direction is right", () => {
		const { container } = render(QuoteCard, { ...baseProps, direction: "right" });

		expect(container.querySelector("article")).toHaveClass("reverse");
	});

	it("omits reverse class when direction is left", () => {
		const { container } = render(QuoteCard, { ...baseProps, direction: "left" });

		expect(container.querySelector("article")).not.toHaveClass("reverse");
	});

	it("passes loadPriority through to avatar loading strategy", () => {
		render(QuoteCard, { ...baseProps, loadPriority: "high" });

		// Avatar is the card's only image
		const img = screen.getByRole("presentation");

		expect(img).toHaveAttribute("loading", "eager");
		expect(img).toHaveAttribute("fetchpriority", "high");
	});
});
