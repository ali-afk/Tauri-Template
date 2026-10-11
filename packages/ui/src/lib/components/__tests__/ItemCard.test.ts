import { render, screen } from "@testing-library/svelte";

import ItemCard from "#components/ItemCard.svelte";
import type { Item } from "#types/component-props.js";

const item: Item = {
	name: "Test Item",
	image: {
		url: "https://example.com/item.webp",
		dimensions: { width: 400, height: 300 },
	},
	link: "https://example.com/item",
};

describe(ItemCard, () => {
	it("renders image and name heading when given an item", () => {
		render(ItemCard, { item, loadPriority: "high" });

		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "https://example.com/item.webp");
		expect(img).toHaveAttribute("alt", "Test Item");
		expect(img).toHaveAttribute("width", "400");
		expect(img).toHaveAttribute("height", "300");

		expect(screen.getByRole("heading", { level: 3, name: "Test Item" })).toBeInTheDocument();
	});

	it("renders details link with safe attributes when item has a link", () => {
		render(ItemCard, { item, loadPriority: "high" });

		const link = screen.getByRole("link", { name: "Details" });
		expect(link).toHaveAttribute("href", "https://example.com/item");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("omits details link when item has no link", () => {
		render(ItemCard, { item: { ...item, link: undefined }, loadPriority: "high" });

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});

	it("loads eagerly with high fetchpriority when loadPriority is high", () => {
		render(ItemCard, { item, loadPriority: "high" });

		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("loading", "eager");
		expect(img).toHaveAttribute("fetchpriority", "high");
	});

	it("loads lazily with low fetchpriority when loadPriority is low", () => {
		render(ItemCard, { item, loadPriority: "low" });

		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("loading", "lazy");
		expect(img).toHaveAttribute("fetchpriority", "low");
	});
});
