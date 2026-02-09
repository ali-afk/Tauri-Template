<script lang="ts">
import type { Snippet } from "svelte";
import { AppMetaData } from "$data/config";

type Props = {
	title: string;
	children?: Snippet;
};

let { title, children }: Props = $props();

let fullTitle = $derived(`${title} | ${$AppMetaData?.app_name}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if children}
		{@render children()}
	{/if}
</svelte:head>
