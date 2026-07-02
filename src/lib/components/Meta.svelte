<script lang="ts">
import type { Snippet } from "svelte";
import { AppMetadata } from "$data/stores/config";

type Props = {
	title: string;
	children?: Snippet;
};

let { title, children }: Props = $props();

let fullTitle = $derived(`${title} | ${$AppMetadata?.name}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if children}
		{@render children()}
	{/if}
</svelte:head>
