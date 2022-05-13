<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';

  let authClient: Client;
  let isRegistered = false;
  onMount(async () => {
    authClient = await createClient();
    authClient.updateState();

    const registeredResponse = await fetch(`/api/booking/${eventId}`, {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${accessToken}`,
      },
    });
    const registeredResponseJson = await registeredResponse.json();
    console.log(registeredResponseJson);

    isRegistered = registeredResponseJson.registered;
  });

  // if user is registered

  const currentPath = get(page).url.pathname;

  async function handleBookingClick() {
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
    isRegistered = true;
  }

  async function handleCancelClick() {
    console.log('Booking button pressed');
    // if (get(isAuthenticated)) {
    console.log('Logged in, make booking');

    // const accessToken = await authClient.getUserAccessToken();
    fetch(`/api/booking/${eventId}`, {
      method: 'DELETE',
      headers: {
        // Authorization: `Bearer ${accessToken}`,
      },
    });
    // } else {
    // console.log('Not logged in, redirect to login');
    // authClient.login(currentPath);
    // }
    isRegistered = false;
  }

  export let eventId: string;
</script>

{#if isRegistered}
  <button on:click={handleCancelClick}>Avboka</button>
{:else}
  <button on:click={handleBookingClick}>Boka</button>
{/if}
