<script lang="ts">
import { page } from "$app/state";
import { Meta } from "$components";
</script>

<Meta title={page.status.toString()} />

<section class="center--page">
	<h1 class="title--page">{page.status}</h1>
	<p>{page.error?.message || "Unknown Error Occurred"}</p>
	<a href="/" class="btn">Return Home</a>
</section>

<style>
p {
	font-size: var(--fs-4);
	color: var(--text-mute);
}

a {
	--_background: var(--color-status-info);
}
</style>
