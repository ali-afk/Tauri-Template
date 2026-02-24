<script lang="ts">
import { page } from "$app/state";
import { NavLinks } from "$components/shared/helpers";
import { Logo } from "$data/shared";

let headerHeight = $state(0);
let y = $state(0);
let lastY = 0;
let isHidden = $state(false);

// Runs whenever 'y' changes
$effect(() => {
	const delta = y - lastY;
	const threshold = 30;

	if (y < headerHeight) {
		isHidden = false;
	} else if (delta > threshold) {
		isHidden = true;
	} else if (delta < -threshold) {
		isHidden = false;
	}

	lastY = y;
});
</script>

<svelte:window bind:scrollY={y} />

<header
	bind:clientHeight={headerHeight}
	class="sticky-header"
	class:hidden={isHidden}
>
	<nav class="wrapper row">
		<a
			class="logo"
			href="/"
			aria-current={page.url.pathname === '/' ? 'page' : undefined}
		>
			<img
				src={Logo.url}
				alt="Home"
				fetchpriority="high"
				width={Logo.dimensions.width}
				height={Logo.dimensions.height}
			>
		</a>
		<NavLinks {isHidden} />
	</nav>
</header>

<style>
header {
	padding: var(--space-2) var(--space-5);
}

nav {
	position: relative;

	.logo {
		margin-right: auto;

		img {
			width: clamp(8rem, 6rem + 5vw, 12rem);
		}
	}
}
</style>
