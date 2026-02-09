<script lang="ts">
import { DesignTokens } from "$data/shared";
import { cycleColorScale } from "$scripts/utils";
import type { DocumentLink } from "$types/component-props";

type LinkGroup = {
	links: DocumentLink[];
};

interface Props {
	groups: LinkGroup[];
	colorPalette?: "primary" | "secondary";
	class?: string;
}

let {
	groups,
	colorPalette = "primary",
	class: className = "",
}: Props = $props();

let colorSet = $derived(
	colorPalette === "primary"
		? DesignTokens.color.primary
		: DesignTokens.color.secondary,
);
</script>

<section class="button-grid {className}">
	{#each groups as group, i}
		<div
			class="card-grid--tight"
			style="--_background: {colorSet[cycleColorScale(i)]}"
		>
			{#each group.links as link}
				<a
					class="btn"
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					{link.label}
				</a>
			{/each}
		</div>
	{/each}
</section>

<style>
.button-grid {
	display: grid;
	gap: var(--space-4);
	margin-bottom: var(--space-6);
}

a {
	font-size: var(--fs-2);
	padding: var(--space-2) var(--space-4);
}
</style>
