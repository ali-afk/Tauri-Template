<script lang="ts">
import type { Item, LoadPriority } from "$types/component-props";

let { item, loadPriority }: { item: Item; loadPriority: LoadPriority } =
	$props();
</script>

<div class="card center--column">
	<img
		src={item.image.url}
		alt={item.name}
		width={item.image.dimensions.width}
		height={item.image.dimensions.height}
		fetchpriority={loadPriority}
		loading={loadPriority === "high" ? "eager" : "lazy"}
		decoding="async"
	>
	<h3 class="center--column">{item.name}</h3>
	{#if item.link}
		<a href={item.link} class="btn" target="_blank" rel="noopener noreferrer"
			>Details</a
		>
	{/if}
</div>

<style>
div {
	--_background: var(--bg-card);
	flex: 0 1 300px;
	padding: var(--space-4);
	min-height: 180px;
}

img {
	height: clamp(180px, 20vw, 250px);
	object-fit: contain;
}

h3 {
	font-size: var(--fs-4);
	line-height: var(--lh-2);
	margin-bottom: var(--space-3);
	flex-grow: 1;
}

a {
	--_background: var(--color-status-info);
	font: var(--fw-regular) var(--fs-2) / var(--lh-3) var(--font-body);

	&:hover {
		box-shadow: initial;
	}
}

@media screen and (max-width: 768px) { /* DesignTokens.breakpoint[2] */
	div {
		flex: 0 1 150px;
		min-height: 120px;
	}

	img {
		height: clamp(120px, 30vw, 160px);
	}

	h3 {
		margin-top: var(--space-3);
		font-size: var(--fs-2);
	}
}
</style>
