<script lang="ts">
import { CardSection } from "$components/shared/layout";
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
