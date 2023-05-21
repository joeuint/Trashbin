<script lang="ts">
  import Alert from "../../../components/Alert.svelte";
  import type { PageServerData } from "./$types";
  import type { ActionData } from "./$types";
  import { enhance } from "$app/forms";

  export let form: ActionData;

  export let data: PageServerData;

  let pasteContent: HTMLElement;

  let wordWrapButton: HTMLButtonElement;

  function toggleWordWrap() {
    if (pasteContent.classList.contains("break-words")) {
      pasteContent.classList.remove("break-words");
      wordWrapButton.classList.replace("bg-emerald-600", "bg-red-600");
    } else {
      pasteContent.classList.add("break-words");
      wordWrapButton.classList.replace("bg-red-600", "bg-emerald-600");
    }
  }
</script>

{#if data.encrypted && !form?.post}
  <!-- content here -->
  <h1 class="text-3xl font-semibold">Encrypted</h1>
  <p>Please enter your password to continue...</p>
  <form method="post" use:enhance>
    <input type="password" name="decryptPassword" id="decryptPassword" />
  </form>
{:else}
  {#if data.burn || form?.burn}
    <!-- content here -->
    <Alert styling="burn"
      >This document has been deleted and can no longer be accessed!</Alert
    >
  {/if}
  <button
    class="bg-red-600 motion-safe:transition-colors motion-safe:duration-300 p-1 rounded-lg"
    on:click={toggleWordWrap}
    bind:this={wordWrapButton}>Word Wrap</button
  >
  <h1 class="text-2xl font-semibold">
    Paste: {data.post?.id || form?.post.id || ""}
  </h1>
  <code
    class="bg-neutral-800 block p-4 h-[80vh] text-lg whitespace-break-spaces rounded-lg border border-zinc-700 overflow-y-scroll"
    bind:this={pasteContent}
    >{data.post?.content || form?.post.content || ""}</code
  >
{/if}
