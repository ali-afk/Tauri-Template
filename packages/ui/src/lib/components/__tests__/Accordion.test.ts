import { fireEvent, render } from "@testing-library/svelte";
import { vi } from "vite-plus/test";

import AccordionHarness from "./AccordionHarness.svelte";

// The content reveal runs a slide intro transition. Animation timing is
// orthogonal to these assertions (and covered by transition.test.ts), so
// collapse it to zero to keep unmount cleanup deterministic — otherwise
// auto-cleanup cancels the mid-flight animation and Svelte rejects unhandled.
vi.mock("#utils/transition.js", () => ({
	standard: () => ({ duration: 0 }),
}));

// Accordion requires a children snippet, which cannot be created from plain
// TypeScript — the harness supplies it.

/** Narrows a nullable query result, failing the test loudly when absent. */
function required<T>(el: T | null): T {
	if (!el) throw new Error("expected value to be present");
	return el;
}

describe("Accordion", () => {
	it("renders collapsed with aria state when mounted", () => {
		const { container } = render(AccordionHarness);

		const summary = required(container.querySelector("summary"));
		expect(summary).toHaveTextContent("More Info");
		expect(summary).toHaveAttribute("aria-expanded", "false");
		expect(summary).toHaveAttribute("aria-controls", expect.stringMatching(/^content-/));
		expect(summary.querySelector("img")).toBeInTheDocument();

		const details = container.querySelector("details");
		expect(details).toHaveAttribute("name", "faq");
		expect(document.getElementById(required(summary.getAttribute("aria-controls")))).toBeNull();
	});

	it("reveals content and expands aria state when summary is clicked", async () => {
		const { container } = render(AccordionHarness);

		const summary = required(container.querySelector("summary"));
		await fireEvent.click(summary);

		const content = document.getElementById(required(summary.getAttribute("aria-controls")));
		expect(content).not.toBeNull();
		expect(content).toHaveTextContent("Accordion body content");
		expect(summary).toHaveAttribute("aria-expanded", "true");
	});

	it("hides content again when summary is clicked twice", async () => {
		const { container } = render(AccordionHarness);

		const summary = required(container.querySelector("summary"));
		await fireEvent.click(summary);
		await fireEvent.click(summary);

		const contentId = required(summary.getAttribute("aria-controls"));
		expect(summary).toHaveAttribute("aria-expanded", "false");
		expect(document.getElementById(contentId)).toBeNull();
	});
});
