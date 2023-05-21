<script lang="ts">
    import type { ActionData } from "./$types";
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
  import Alert from "../components/Alert.svelte";

    export let form: ActionData;

    let showPass: Boolean = false;
    let passwordBox: HTMLInputElement;

    function handleSubmit() {

    }

    function revealPassword() {
        const type = showPass ? 'text' : 'password';
        passwordBox.setAttribute('type', type)
    }
</script>

<h1 class="text-2xl font-semibold mb-2">New Paste</h1>
<Alert styling='info'>Paste will only be encrypted if it has a password</Alert>
<form method="post" use:enhance>
    <label for="pasteContent" class="text-xl font-medium">Content:</label>
    <textarea name="pasteContent" id="pasteContent" class="w-full h-48" required />
    <hr class="my-5 border-t-neutral-700">
    <label for="pastePassword" class="text-xl font-medium">Password:</label>
    <input class="mb-1" type="password" name="pastePassword" id="pastePassword">
    <br>
    <label for="pasteExpiry" class="text-xl font-medium">Expiry:</label>
    <input type="datetime-local" name="pasteExpiry" id="pasteExpiry">
    <input type="submit" value="Create" class="bg-emerald-500 motion-safe:hover:bg-emerald-600 motion-safe:transition-colors p-1 rounded-lg text-lg font-semibold">
</form>

{#if form?.success === true}
    <p>You're live at <a class="text-blue-500" href="/paste/{form?.id || ''}">{$page.url.hostname}/paste/{form?.id || ''}</a>!</p>
{:else if  form?.success === false}
     <p>Failed :(</p>
{/if}
