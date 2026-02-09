import type { DesignTokenConfig, DesignTokenNode } from "$types/design-tokens";
import {
	DEFAULT_CSS_VALUES,
	flattenDesignToken,
	getDefaultCssValues,
	getNearestConfig,
} from "../css";

const mockTokens = vi.hoisted(() => ({
	transition: {
		config: { syntax: "<time>", inherits: true },
		duration: {
			config: { syntax: "<time>", inherits: true },
			medium: "0.3s",
		},
	},
}));

vi.mock("$data/design-tokens", () => ({
	DesignTokens: mockTokens,
}));

vi.spyOn(Bun, "write").mockImplementation(vi.fn());

describe(flattenDesignToken, () => {
	it("flattens a simple nested structure", () => {
		const input: DesignTokenNode = {
			color: {
				primary: {
					"500": "#934599",
				},
			},
		};
		expect(flattenDesignToken(input)).toEqual({
			"color-primary-500": "#934599",
		});
	});

	it("stores config objects whole at their path", () => {
		const input: DesignTokenNode = {
			transition: {
				config: { syntax: "<time>", inherits: true },
				duration: {
					config: { syntax: "<time>", inherits: true },
					medium: "0.3s",
				},
			},
		};
		expect(flattenDesignToken(input)).toEqual({
			"transition-config": { syntax: "<time>", inherits: true },
			"transition-duration-config": { syntax: "<time>", inherits: true },
			"transition-duration-medium": "0.3s",
		});
	});

	it("handles boolean and number values", () => {
		const input: DesignTokenNode = {
			visibility: {
				mobile: false,
				zIndex: 100,
			},
		};
		expect(flattenDesignToken(input)).toEqual({
			"visibility-mobile": false,
			"visibility-zIndex": 100,
		});
	});

	it("returns empty object for empty input", () => {
		expect(flattenDesignToken({})).toEqual({});
	});
});

describe(getDefaultCssValues, () => {
	it.each(
		Object.entries(DEFAULT_CSS_VALUES).map(([syntax, value]) => ({
			syntax,
			value,
		})),
	)("returns $value for $syntax", ({ syntax, value }) => {
		expect(getDefaultCssValues(syntax)).toBe(value);
	});

	it("falls back to '0' for unknown syntax", () => {
		expect(getDefaultCssValues("<unknown>")).toBe("0");
	});
});

describe(getNearestConfig, () => {
	const tokens = {
		"transition-config": { syntax: "<number>", inherits: false },
		"transition-duration-config": { syntax: "<time>", inherits: true },
		"transition-duration-medium": "0.3s",
		"transition-duration-short": "0.1s",
		"transition-easing": "ease-in",
	};

	it("returns nearest ancestor config", () => {
		expect(getNearestConfig("transition-duration-medium", tokens)).toEqual(
			tokens["transition-duration-config"] satisfies DesignTokenConfig,
		);
	});

	it("falls back to higher-level config when sub-group has none", () => {
		expect(getNearestConfig("transition-easing", tokens)).toEqual(
			tokens["transition-config"] satisfies DesignTokenConfig,
		);
	});

	it("throws when no config exists in ancestry", () => {
		expect(() =>
			getNearestConfig("unknown-key", { "some-value": "foo" }),
		).toThrow();
	});
});

describe("genDesignTokens", () => {
	it("generates CSS with @property blocks and :root values", async () => {
		const { default: genDesignTokens } = await import("../css");
		await genDesignTokens();

		expect(Bun.write).toHaveBeenCalledOnce();
		const output = (Bun.write as ReturnType<typeof vi.fn>).mock
			.calls[0]?.[1] as string;
		expect(output).toContain("Auto-generated");
		expect(output).toContain("@property --transition-duration-medium");
		expect(output).toContain('syntax: "<time>"');
		expect(output).toContain("inherits: true");
		expect(output).toContain("initial-value: 0s");
		expect(output).toContain(":root {");
		expect(output).toContain("--transition-duration-medium: 0.3s;");
	});
});
