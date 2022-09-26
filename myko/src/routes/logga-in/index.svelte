<script lang="ts">
  import { goto } from '$app/navigation';
  import createClient from '$lib/auth/client';

  import { onMount } from 'svelte';

  onMount(async () => {
    const client = await createClient();
    const appStateFromBeforeLogin = await client.handleLoginCallback();

    let returnTo = '/';
    if (appStateFromBeforeLogin) {
      // successful login, update login state
      // TODO log something?
      returnTo = appStateFromBeforeLogin.returnTo ?? returnTo;
    }

    // TODO log unsolicited request to redirect URI?

    // Use replaceState to redirect the user away and remove the querystring parameters
    return goto(returnTo, { replaceState: true });
  });
</script>

<main>
  <p>Loggar in...</p>
</main>

<style>
  p {
    font-size: var(--20px);
    color: var(--ocean-800);
    letter-spacing: 0.5px;
  }
</style>
