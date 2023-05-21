<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<svelte:head>
    <title>Trashbin</title>
</svelte:head>

<Navbar page={$page.url.pathname} />
<main class="md:mx-10 bg-neutral-900 p-2 px-6 border-b border-l border-r border-zinc-700 min-h-[94vh]">
    <slot />
</main>
<Footer />