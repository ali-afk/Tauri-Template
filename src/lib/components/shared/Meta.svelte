<script lang="ts">
import type { Snippet } from "svelte";
import { AppProperties } from "$data/shared";

type Props = {
	title: string;
	children?: Snippet;
};

let { title, children }: Props = $props();

let fullTitle = $derived(`${title} | ${AppProperties.appName}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if children}
		{@render children()}
	{/if}
</svelte:head>
