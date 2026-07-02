<script lang="ts">
import { AppMetadata } from "$data/stores/config";
import "$styles/index.css";
import { onMount } from "svelte";
import { commands } from "$tauri/bindings";
import { handleResult } from "$tauri/utils";

// Guards child rendering — shows loading screen until IPC resolves
let isInitialized = $state(false);
async function initialiseAppMetadata() {
	const metadata = handleResult(await commands.appMetadata());
	AppMetadata.set(metadata);
	isInitialized = true;
}
onMount(initialiseAppMetadata);

let { children } = $props();
</script>

{#if isInitialized}
	{@render children()}
{:else}
	<section class="loading-item"></section>
{/if}
