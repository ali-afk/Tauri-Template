<script lang="ts">
import { AppMetadata } from "@tauri-template/ui/data/stores/config";
import "@tauri-template/ui/styles/index.css";
import { onMount } from "svelte";
import { getMetadataService } from "@tauri-template/infrastructure";
import { handleResult } from "@tauri-template/ui/tauri/utils";

// Guards child rendering — shows loading screen until IPC resolves
let isInitialized = $state(false);
async function initialiseAppMetadata() {
	const metadata = handleResult(await getMetadataService().appMetadata());
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
