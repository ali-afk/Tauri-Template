import type { AppMetadata as AppMetadataType } from "@tauri-template/infrastructure/tauri/bindings";
import { waitFor } from "@testing-library/dom";
import { render } from "@testing-library/svelte";

import Meta from "#components/Meta.svelte";
import { AppMetadata } from "#data/stores/config.js";

import MetaHarness from "./MetaHarness.svelte";

const metadata: AppMetadataType = {
	version: "1.2.3",
	name: "Test App",
	description: "A test app",
	url: "https://example.com",
	contacts: {
		email: "test@example.com",
		github: "https://github.com/test",
	},
};

afterEach(() => {
	AppMetadata.set(null);
});

describe(Meta, () => {
	it("sets document title to 'title | app name' when AppMetadata store is seeded", () => {
		// Given: the real AppMetadata store holds the backend-provided name
		AppMetadata.set(metadata);

		// When: Meta is rendered with a page title
		render(Meta, { title: "Home" });

		// Then: the document title composes page title and app name
		expect(document.title).toBe("Home | Test App");
		expect(document.head.querySelector("title")?.textContent).toBe("Home | Test App");
	});

	it("composes title with undefined name when store is null", () => {
		// Given: the store has not been populated (pre-mount state)
		AppMetadata.set(null);

		// When: Meta is rendered
		render(Meta, { title: "Home" });

		// Then: the title characterizes current null-store behavior
		expect(document.title).toBe("Home | undefined");
	});

	it("updates document title reactively when store changes after mount", async () => {
		// Given: Meta rendered against a seeded store
		AppMetadata.set(metadata);
		render(Meta, { title: "Home" });

		// When: the backend metadata arrives with a different name
		AppMetadata.set({ ...metadata, name: "Renamed App" });

		// Then: the title recomputes without a remount
		await waitFor(() => {
			expect(document.title).toBe("Home | Renamed App");
		});
	});

	it("renders children snippet into head when provided", () => {
		// Given: the store is seeded and Meta receives extra head content
		AppMetadata.set(metadata);

		// When: the harness renders Meta with a meta tag as children
		render(MetaHarness);

		// Then: the child meta tag lands in document.head alongside the title
		const meta = document.head.querySelector('meta[name="test-description"]');
		expect(meta).toHaveAttribute("content", "harness meta content");
		expect(document.title).toBe("Harness Page | Test App");
	});
});
