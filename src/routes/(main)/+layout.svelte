<script lang="ts">
import { Header } from "$components/shared";

let { children } = $props();
</script>

<Header />
<main>{@render children()}</main>

<style>
</style>
