<script lang="ts">
/** Skip-to-content link for keyboard/AT users.
 *  Hidden off-screen by default, visible on focus-visible only.
 *  Targets #main-content — ensure main sections have this id. */
</script>

<a href="#main-content">Skip to main content</a>

<style>
a {
	position: absolute;
	z-index: 9999;

	left: -9999px;
	top: auto;

	padding: var(--space-2) var(--space-4);
	background: var(--bg-main);

	&:focus-visible {
		left: var(--space-4);
		top: var(--space-4);
	}
}
</style>
