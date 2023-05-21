<script lang='ts'>
    export let page: string;
</script>

<nav class="flex justify-between text-gray-100 px-2 py-3 items-center border-b border-zinc-700 bg-neutral-950/30">
    <div class="ml-2 sm:ml-10">
        <div class="text-3xl font-semibold">TrashBin</div>
    </div>
    <div class="mr-2 sm:mr-10 flex gap-x-4 font-medium text-gray-100/60">
        <a href="/" class="motion-safe:hover:text-gray-100 motion-safe:transition-colors" class:text-gray-100="{page === '/'}">Home</a>
        <a href="/about" class="motion-safe:hover:text-gray-100 motion-safe:transition-colors" class:text-gray-100="{page === '/about'}">About</a>
        <a href="/tos" class="motion-safe:hover:text-gray-100 motion-safe:transition-colors" class:text-gray-100="{page === '/tos'}">ToS</a>
    </div>
</nav>