<script lang="ts">
/** Section with a dynamic heading level and a grid of cards.
 *  Wraps children in a card-grid div. headingLevel controls
 *  <h1> through <h6>. Default grid class is "card-grid". */
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
		{title}
	</svelte:element>
	<div class={gridClass}>{@render children()}</div>
</section>
