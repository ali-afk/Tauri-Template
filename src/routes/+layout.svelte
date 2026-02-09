<script lang="ts">
import "$styles/index.css";
import { onMount } from "svelte";
import { commands } from "$bindings";
import { AppMetaData, AppSettings } from "$data/config";

// Guards child rendering — shows loading screen until IPC resolves
let isInitialized = $state(false);

/** Initialise app config from Rust backend via specta IPC.
 *  Sets AppSettings and AppMetaData writable stores.
 *  Both commands run in parallel for faster startup. */
async function initialiseAppConfig() {
	const [settingsRes, metaRes] = await Promise.all([
		commands.appSettings(),
		commands.appMetadata(),
	]);

	if (settingsRes.status === "ok" && metaRes.status === "ok") {
		AppSettings.set(settingsRes.data);
		AppMetaData.set(metaRes.data);
	} else if (settingsRes.status === "error") {
		throw new Error(
			`App Config could not be retrieved from backend: ${settingsRes.error}`,
		);
	} else if (metaRes.status === "error") {
		throw new Error(
			`App Config could not be retrieved from backend: ${metaRes.error}`,
		);
	}
	isInitialized = true;
}

onMount(initialiseAppConfig);

let { children } = $props();
</script>
{#if isInitialized}
	{@render children()}
{:else}
	<section class="loading-item"></section>
{/if}
