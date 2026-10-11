import type { AppSettings, AppSettingsKey } from "../../tauri/bindings.js";
import { commands } from "../../tauri/bindings.js";
import { createNativeSettingsService } from "./native-settings-adapter.js";

vi.mock("../../tauri/bindings.js", () => ({
	commands: {
		appMetadata: vi.fn(),
		readSettings: vi.fn(),
		readSettingsField: vi.fn(),
		writeSettings: vi.fn(),
		writeSettingsField: vi.fn(),
	},
}));

const SETTINGS: AppSettings = { theme: "Dark", resolution: [1920, 1080], fullscreen: false };
const KEY: AppSettingsKey = { Theme: "Light" };
const ERROR = { status: "error", error: { type: "Config", data: "boom" } } as const;

describe(createNativeSettingsService, () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("readSettings delegates to commands.readSettings", async () => {
		vi.mocked(commands.readSettings).mockResolvedValue({ status: "ok", data: SETTINGS });

		const result = await createNativeSettingsService().readSettings();

		expect(commands.readSettings).toHaveBeenCalledOnce();
		expect(result).toEqual({ status: "ok", data: SETTINGS });
	});

	it("readSettingsField passes the key kind through", async () => {
		vi.mocked(commands.readSettingsField).mockResolvedValue({ status: "ok", data: KEY });

		const result = await createNativeSettingsService().readSettingsField("Theme");

		expect(commands.readSettingsField).toHaveBeenCalledOnce();
		expect(commands.readSettingsField).toHaveBeenCalledWith("Theme");
		expect(result).toEqual({ status: "ok", data: KEY });
	});

	it("writeSettings passes the settings object through", async () => {
		vi.mocked(commands.writeSettings).mockResolvedValue({ status: "ok", data: null });

		const result = await createNativeSettingsService().writeSettings(SETTINGS);

		expect(commands.writeSettings).toHaveBeenCalledOnce();
		expect(commands.writeSettings).toHaveBeenCalledWith(SETTINGS);
		expect(result).toEqual({ status: "ok", data: null });
	});

	it("writeSettingsField passes the tagged key through", async () => {
		vi.mocked(commands.writeSettingsField).mockResolvedValue({ status: "ok", data: null });

		const result = await createNativeSettingsService().writeSettingsField(KEY);

		expect(commands.writeSettingsField).toHaveBeenCalledOnce();
		expect(commands.writeSettingsField).toHaveBeenCalledWith(KEY);
		expect(result).toEqual({ status: "ok", data: null });
	});

	it("propagates command errors unchanged", async () => {
		vi.mocked(commands.readSettings).mockResolvedValue(ERROR);

		const result = await createNativeSettingsService().readSettings();

		expect(result).toEqual(ERROR);
	});
});
