<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	title: string;
	headingLevel: "1" | "2" | "3" | "4" | "5" | "6";
	gridClass?: string;
	class?: string;
	children: Snippet;
}

let {
	title,
	headingLevel,
	gridClass = "card-grid",
	class: className = "",
	children,
}: Props = $props();
</script>

<section class="wrapper {className}">
	<svelte:element this={`h${headingLevel}`} class="title--section">
		{title}:
	</svelte:element>
	<div class={gridClass}>{@render children()}</div>
</section>
