<script lang="ts">
import type { Snippet } from "svelte";
import { SiteProperties } from "$data/shared";
import type { FilePath } from "$types/component-props";

type BaseProps = {
	title: string;
	keywords?: string[];
	children?: Snippet;
};

type Props = BaseProps &
	(
		| { description: "NoIndex"; pageURI?: "/" }
		| { description: string & {}; pageURI: FilePath }
	);

let { title, description, keywords, pageURI = "/", children }: Props = $props();

// Runtime validation for development
if (import.meta.env.DEV && description === "NoIndex" && pageURI !== "/") {
	console.error(
		`[Meta] NoIndex pages must use pageURI="/" (got "${pageURI}"). Canonical URLs should not point to non-indexed pages.`,
	);
}

const globalKeywords = [
	SiteProperties.siteName,
	"SvelteKit",
	"Template",
	"Design Tokens",
	"OKLCH",
];

let fullTitle = $derived(`${title} | ${SiteProperties.siteName}`);
let fullURI = $derived(`${SiteProperties.siteUrl}${pageURI}`);
let fullKeywords = $derived(
	[...globalKeywords, keywords?.entries()].filter(Boolean).join(","),
); // Merges global and local keywords. .filter(Boolean) uses Boolean(value) to make sure the value exists (e.g skip if keywords is empty/"")
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta property="og:title" content={fullTitle}>
	<meta name="twitter:title" content={fullTitle}>
	<meta name="keywords" content={fullKeywords}>
	<meta property="og:url" content={fullURI}>
	<link rel="canonical" href={fullURI}>
	{#if description === "NoIndex"}
		<meta name="robots" content="noindex, nofollow">
	{:else}
		<meta name="description" content={description}>
		<meta property="og:description" content={description}>
		<meta name="twitter:description" content={description}>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</svelte:head>
