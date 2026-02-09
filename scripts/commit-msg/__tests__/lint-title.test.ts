const SCRIPT = "scripts/commit-msg/lint-title.ts";

async function run(
	message: string,
): Promise<{ exitCode: number; output: string }> {
	const dir = Bun.spawnSync(["mktemp", "-d"]).stdout.toString().trim();
	const msgFile = `${dir}/msg`;
	await Bun.write(msgFile, message);
	const result = Bun.spawnSync(["bun", SCRIPT, msgFile]);
	Bun.spawnSync(["rm", "-rf", dir]);
	return {
		exitCode: result.exitCode,
		output: result.stdout.toString() + result.stderr.toString(),
	};
}

describe("lint-title.ts", () => {
	it.each([
		"fix",
		"config",
		"feat",
		"feat-rm",
		"update",
		"docs",
		"chore",
		"style",
		"content",
		"misc",
		"refactor",
	])("accepts type: %s", async (type) => {
		const { exitCode } = await run(`${type}: test message`);
		expect(exitCode).toBe(0);
	});

	it("accepts multi-type: feat+fix", async () => {
		const { exitCode } = await run("feat+fix: add feature with bugfix");
		expect(exitCode).toBe(0);
	});

	it("accepts multi-type: three types", async () => {
		const { exitCode } = await run("feat+fix+docs: feature with fix and docs");
		expect(exitCode).toBe(0);
	});

	it("accepts multi-type with feat-rm", async () => {
		const { exitCode } = await run("feat+feat-rm: add and remove feature");
		expect(exitCode).toBe(0);
	});

	it("rejects missing colon", async () => {
		const { exitCode } = await run("feat add login page");
		expect(exitCode).toBe(1);
	});

	it("rejects empty summary", async () => {
		const { exitCode } = await run("feat: ");
		expect(exitCode).toBe(1);
	});

	it("rejects invalid type", async () => {
		const { exitCode } = await run("invalid: some change");
		expect(exitCode).toBe(1);
	});

	it("rejects empty message", async () => {
		const { exitCode } = await run("");
		expect(exitCode).toBe(1);
	});

	it("strips fixup! prefix", async () => {
		const { exitCode } = await run("fixup! feat: add login page");
		expect(exitCode).toBe(0);
	});

	it("strips squash! prefix", async () => {
		const { exitCode } = await run("squash! fix: resolve crash");
		expect(exitCode).toBe(0);
	});

	it("rejects fixup! with invalid inner type", async () => {
		const { exitCode } = await run("fixup! invalid: some change");
		expect(exitCode).toBe(1);
	});

	it("rejects multi-type with invalid type", async () => {
		const { exitCode } = await run("feat+invalid: bad");
		expect(exitCode).toBe(1);
	});

	it("prints error message on invalid", async () => {
		const { output } = await run("bad");
		expect(output).toContain("INVALID COMMIT FORMAT");
	});
});
