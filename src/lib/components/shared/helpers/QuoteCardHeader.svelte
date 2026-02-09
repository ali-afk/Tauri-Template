<script lang="ts">
import type { Snippet } from "svelte";
import type { Image, LoadPriority } from "$types/component-props";

interface Props {
	title: string;
	avatar: Image;
	children?: Snippet;
	loadPriority: LoadPriority;
}

let { title, avatar, children, loadPriority }: Props = $props();
</script>

<header class="center--column">
	<img
		class="avatar"
		src={avatar.url}
		alt=""
		width={avatar.dimensions.width}
		height={avatar.dimensions.height}
		fetchpriority={loadPriority}
		loading={loadPriority === "high" ? "eager" : "lazy"}
	>
	<h2>{title}</h2>
	{#if children}
		{@render children()}
	{/if}
</header>

<style>
header {
	justify-content: center;
	padding: var(--space-3);
	width: clamp(180px, 30%, 250px);

	img {
		width: 64px;
		height: auto;
	}

	h2 {
		font-size: var(--fs-2);
		margin-top: var(--space-2);
	}

	@media (max-width: 768px) {
		width: 100%;
		padding-block: var(--space-5);
	}
}
</style>
