import { render, screen } from "@testing-library/svelte";
import { vi } from "vite-plus/test";

import Header from "#components/Header.svelte";

// NavLinks mounts its links with an intro transition. Animation timing is
// orthogonal to these render assertions (and covered by transition.test.ts),
// so collapse it to zero to keep unmount cleanup deterministic — otherwise
// auto-cleanup cancels the mid-flight animation and Svelte rejects unhandled.
vi.mock("#utils/transition.js", () => ({
	standard: () => ({ duration: 0 }),
}));

describe(Header, () => {
	it("renders logo link marked as current page when pathname is root", () => {
		render(Header, { pathname: "/" });

		const logo = screen.getByRole("link", { name: "Home" });
		expect(logo).toHaveAttribute("href", "/");
		expect(logo).toHaveAttribute("aria-current", "page");
	});

	it("omits aria-current when pathname is not root", () => {
		render(Header, { pathname: "/about" });

		// Svelte 5 renders aria-current={false} as the string "false" (valid ARIA state)
		expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "false");
	});

	it("shows desktop nav links without hamburger when viewport is desktop width", async () => {
		render(Header);

		const about = await screen.findByRole("link", { name: "About" });
		expect(about).toHaveAttribute("href", "/about");
		expect(screen.queryByRole("button", { name: "Navigation menu" })).not.toBeInTheDocument();
	});

	it("does not apply hidden class when page is not scrolled", () => {
		render(Header);

		expect(screen.getByRole("banner")).not.toHaveClass("hidden");
	});
});
