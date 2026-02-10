<script lang="ts">
import { registerDesignTokens } from "$scripts/register-design-tokens";
import "$styles/index.css";
import { onMount } from "svelte";

onMount(() => {
	registerDesignTokens();
	document.documentElement.classList.add("document-loaded");
});

let { children } = $props();
</script>

{@render children()}
