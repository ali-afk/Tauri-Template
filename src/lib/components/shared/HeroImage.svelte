<script lang="ts">
import type { Image } from "$types/component-props";

interface Props {
	image: Image;
	title: string;
	alt: string;
	renderTitle?: boolean;
}

let { image, title, renderTitle = false }: Props = $props();
</script>

{#snippet hero()}
	<img
		src={image.url}
		alt={title}
		fetchpriority="high"
		width={image.dimensions.width}
		height={image.dimensions.height}
	>
{/snippet}

<section>
	{#if renderTitle}
		<h1 class="title--page" class:rendered-title={renderTitle}>{title}</h1>
		{@render hero()}
	{:else}
		<h1>{@render hero()}</h1>
	{/if}
</section>

<style>
section {
	isolation: isolate;
	background-color: var(--bg-card);
	padding-block: var(--space-6);
	position: relative;
	overflow: hidden;
}

.rendered-title {
	z-index: 999;
	position: absolute;
	inset: 0;
}

img {
	max-height: 80dvh;
	object-fit: contain;
	box-shadow: var(--shadow-strong);
	border-radius: var(--border-radius);
	background-color: var(--color-primary-100);
}
</style>
