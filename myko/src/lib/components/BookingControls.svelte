<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';

  const currentPath = get(page).url.pathname;

  let authClient: Client;
  let isRegistered: boolean | null = null;
  let disabled = false;

  /**
   * Convience method that disables the button while making API request.
   * @param request
   */
  async function makeRequest(request: Request): Promise<Response> {
    disabled = true;
    const response = await fetch(request);
    disabled = false;

    return response;
  }

  onMount(async () => {
    authClient = await createClient();
    await authClient.updateState();

    if (get(isAuthenticated)) {
      const accessToken = await authClient.getUserAccessToken();
      const registeredResponse = await makeRequest(
        new Request(`/api/booking/${eventId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      const registeredResponseJson = await registeredResponse.json();
      isRegistered = registeredResponseJson.registered;
    } else {
      isRegistered = false;
    }
  });

  async function handleBookingClick() {
    if (get(isAuthenticated)) {
      console.log('Logged in, make booking');

      const accessToken = await authClient.getUserAccessToken();
      const response = await makeRequest(
        new Request(`/api/booking/${eventId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      if (response.status === 200) {
        isRegistered = true;
      }
    } else {
      console.log('Not logged in, redirect to login');
      authClient.login(currentPath);
    }
  }

  async function handleCancelClick() {
    if (get(isAuthenticated)) {
      console.log('Logged in, cancel booking');

      const accessToken = await authClient.getUserAccessToken();
      const response = await makeRequest(
        new Request(`/api/booking/${eventId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      if (response.status === 200) {
        isRegistered = false;
      }
    } else {
      console.log('Not logged in, redirect to login');
      authClient.login(currentPath);
    }
  }

  export let eventId: string;
</script>

{#if isRegistered !== null}
  <button on:click={isRegistered ? handleCancelClick : handleBookingClick} {disabled}>
    {#if isRegistered}
      Avboka
    {:else}
      Boka
    {/if}
  </button>
{:else}
  <div class="loader" />
{/if}

<style>
  .loader {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 3px solid rgba(136, 136, 255, 0.3);
    border-top-color: grey;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
