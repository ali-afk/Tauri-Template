import type { AppMetadata } from "../../tauri/bindings.js";
import { commands } from "../../tauri/bindings.js";
import { createNativeMetadataService } from "./native-metadata-adapter.js";

vi.mock("../../tauri/bindings.js", () => ({
	commands: {
		appMetadata: vi.fn(),
		readSettings: vi.fn(),
		readSettingsField: vi.fn(),
		writeSettings: vi.fn(),
		writeSettingsField: vi.fn(),
	},
}));

const METADATA: AppMetadata = {
	version: "2.0.0",
	name: "Tauri Template",
	description: "A desktop app template",
	url: "https://example.com",
	contacts: { email: "hi@example.com", github: "https://github.com/example" },
};
const ERROR = { status: "error", error: { type: "Config", data: "boom" } } as const;

describe(createNativeMetadataService, () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("appMetadata delegates to commands.appMetadata", async () => {
		vi.mocked(commands.appMetadata).mockResolvedValue({ status: "ok", data: METADATA });

		const result = await createNativeMetadataService().appMetadata();

		expect(commands.appMetadata).toHaveBeenCalledOnce();
		expect(result).toEqual({ status: "ok", data: METADATA });
	});

	it("propagates command errors unchanged", async () => {
		vi.mocked(commands.appMetadata).mockResolvedValue(ERROR);

		const result = await createNativeMetadataService().appMetadata();

		expect(result).toEqual(ERROR);
	});
});
