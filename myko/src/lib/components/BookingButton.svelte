<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';

  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
    authClient.updateState();
  });

  const currentPath = get(page).url.pathname;

  async function handleClick() {
    console.log('Booking button pressed');
    // if (get(isAuthenticated)) {
    console.log('Logged in, make booking');

    // const accessToken = await authClient.getUserAccessToken();
    fetch(`/api/booking/${eventId}`, {
      method: 'POST',
      headers: {
        // Authorization: `Bearer ${accessToken}`,
      },
    });
    // } else {
    // console.log('Not logged in, redirect to login');
    // authClient.login(currentPath);
    // }
  }

  export let eventId: string;
</script>

<button on:click={handleClick}>Boka</button>
