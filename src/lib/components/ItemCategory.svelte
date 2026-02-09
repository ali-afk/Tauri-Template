<script lang="ts">
/** Renders a named category of items in a card grid.
 *  Delegates to ItemCard for each item with computed load priority.
 *  First 4 items get "high" priority (above the fold). */
import { CardSection } from "$components/layout";
import { getLoadPriority } from "$scripts/utils";
import type { ItemCategory } from "$types/component-props";
import ItemCard from "./ItemCard.svelte";

let { category }: { category: ItemCategory } = $props();
</script>

<CardSection title={category.name} headingLevel="2">
	{#each category.items as item, i}
		<ItemCard {item} loadPriority={getLoadPriority(i, 4)} />
	{/each}
</CardSection>
