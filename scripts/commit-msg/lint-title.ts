export const types = [
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
	"merge",
	"experimental",
	"test",
];

const pattern = new RegExp(
	`^(${types.join("|")})(\\+(${types.join("|")}))*: .+`,
);

const msgFile = Bun.argv[2];
if (!msgFile) {
	throw Error("msgFile does not exist");
}

let commitMsg = await Bun.file(msgFile).text();

// Strip fixup! / squash! prefixes for validation
commitMsg = commitMsg.replace(/^(fixup! |squash! )/, "");

if (!pattern.test(commitMsg)) {
	console.error("--------------------------------------------------------");
	console.error("❌ INVALID COMMIT FORMAT");
	console.error(`Expected: <type>: <summary>  OR  <type>+<type>: <summary>`);
	console.error(`Allowed: ${types.join(", ")}`);
	console.error("--------------------------------------------------------");
	process.exit(1);
}
