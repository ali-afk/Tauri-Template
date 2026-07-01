import { debug, error, info, trace, warn } from "@tauri-apps/plugin-log";

function forwardConsole(
	fnName: "log" | "debug" | "info" | "warn" | "error",
	logger: (message: string) => Promise<void>,
) {
	const original = console[fnName];
	console[fnName] = (message) => {
		original(message);
		logger(String(message));
	};
}

forwardConsole("debug", debug);
forwardConsole("error", error);
forwardConsole("info", info);
forwardConsole("log", trace);
forwardConsole("warn", warn);
