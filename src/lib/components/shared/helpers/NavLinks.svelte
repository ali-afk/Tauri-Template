<script lang="ts">
import { fly } from "svelte/transition";
import { page } from "$app/state";
import { standard } from "$scripts/transition";

let { isHidden }: { isHidden: boolean } = $props();
let isMenuOpen = $state(false);

// initalised null because false passes the !isMobile check before document loads, making links visible.
let isMobile = $state<boolean | null>(null);

$effect(() => {
	const mediaQuery = window.matchMedia("(max-width: 768px)");
	isMobile = mediaQuery.matches;

	const getIsMobile = (e: MediaQueryListEvent) => {
		isMobile = e.matches;
	};
	mediaQuery.addEventListener("change", getIsMobile);

	return () => mediaQuery.removeEventListener("change", getIsMobile);
});

$effect(() => {
	page.url.pathname;
	isMenuOpen = false;
});

$effect(() => {
	if (isHidden) isMenuOpen = false;
});
</script>

{#snippet links()}
	<ul id="links" class="center" transition:standard={fly} role="list">
		<!-- Add your navigation links here -->
		<!-- Example:
		<li class="lift">
			<a
				aria-current={page.url.pathname === '/about' ? 'page' : undefined}
				href="/about"
			>About</a>
		</li>
		-->
	</ul>
{/snippet}

<!-- null check ensures we don't render before document loads -->
{#if isMobile !== null && (isMenuOpen || !isMobile)}
	{@render links()}
{/if}

{#if isMobile}
	<button
		aria-label="Navigation menu"
		aria-controls="links"
		aria-expanded={isMenuOpen}
		onclick={() => isMenuOpen = !isMenuOpen}
		class="btn avatar"
	>
		<svg
			width="16px"
			height="16px"
			class:active={isMenuOpen}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M4 18L20 18" stroke-width="2" stroke-linecap="round" />
			<path d="M4 12L20 12" stroke-width="2" stroke-linecap="round" />
			<path d="M4 6L20 6" stroke-width="2" stroke-linecap="round" />
		</svg>
	</button>
{/if}

<style>
#links {
	gap: var(--space-6);

	a {
		font-size: var(--fs-5);

		&:hover,
		&:focus-visible {
			text-decoration-color: unset; /* Forces link decoration color = link color instead of global value */
		}

		&.cta {
			--_background: var(--color-primary-700);
			font-size: var(--fs-4);
		}
	}
}

button {
	--_background: var(--color-primary-300);

	svg {
		transition-property: transform;
		stroke: var(--text-main);

		&.active {
			transform: rotate(90deg);
		}
	}
}

@media (max-width: 768px) {
	#links {
		gap: var(--space-5);
		background-color: var(--bg-main);
		border-radius: var(--border-radius);
		padding: var(--space-5) var(--space-4);

		box-shadow: var(--shadow-strong);
		flex-direction: column;

		position: absolute;
		inset: 50% calc(var(--space-4) + var(--space-2)) auto auto;

		a {
			font-size: var(--fs-4);
		}
	}
}
</style>
