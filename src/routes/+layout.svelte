<script lang="ts">
import {
	DesignTokens,
	OrganizationData,
	SiteProperties,
	WebSiteData,
} from "$data/shared";
import { registerProperties } from "$scripts/register-design-tokens";
import { registerServiceWorker } from "$scripts/register-service-worker";
import "$styles/index.css";
import { onMount } from "svelte";

onMount(() => {
	registerProperties();
	document.documentElement.classList.add("document-loaded");
	registerServiceWorker();
});

let { children } = $props();
</script>

<svelte:head>
	<!-- Basic Meta -->
	<meta name="author" content={SiteProperties.author}>
	<meta name="referrer" content="strict-origin-when-cross-origin">
	<meta name="format-detection" content="telephone=no">

	<!-- Theme & Mobile -->
	<meta name="theme-color" content={DesignTokens.color.primary[500]}>
	<meta name="mobile-web-app-capable" content="yes">
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	>
	<meta name="apple-mobile-web-app-title" content={SiteProperties.siteName}>

	<!-- Open Graph -->
	<meta property="og:type" content="website">
	<meta property="og:site_name" content={SiteProperties.siteName}>
	<meta property="og:locale" content="en_US">
	<meta property="og:image" content={`${SiteProperties.siteUrl}/icon-512.png`}>
	<meta property="og:image:width" content="512">
	<meta property="og:image:height" content="512">
	<meta property="og:image:alt" content={SiteProperties.siteDescription}>

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:image" content={`${SiteProperties.siteUrl}/icon-512.png`}>

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${OrganizationData}<\/script>`}
	{@html `<script type="application/ld+json">${WebSiteData}<\/script>`}
</svelte:head>

{@render children()}
