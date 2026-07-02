import {
	type AppSettings,
	type AppSettingsKey,
	type AppSettingsKeyKind,
	commands,
} from "$tauri/bindings";
import { handleResult } from "$tauri/utils";

export async function readSettings() {
	return handleResult(await commands.readSettings());
}

export async function readSettingsField(key: AppSettingsKeyKind) {
	return handleResult(await commands.readSettingsField(key));
}

export async function writeSettings(settings: AppSettings) {
	return handleResult(await commands.writeSettings(settings));
}

export async function writeSettingsField(value: AppSettingsKey) {
	return handleResult(await commands.writeSettingsField(value));
}
