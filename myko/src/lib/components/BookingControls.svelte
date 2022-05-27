<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';

  const currentPath = get(page).url.pathname;

  let authClient: Client;
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
        userIsAttending = true;
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
        userIsAttending = false;
      }
    } else {
      console.log('Not logged in, redirect to login');
      authClient.login(currentPath);
    }
  }

  export let eventId: string;
  export let userIsAttending: boolean | undefined = undefined;
</script>

<button
  class:attending={userIsAttending === true}
  on:click={userIsAttending === true ? handleCancelClick : handleBookingClick}
  {disabled}
>
  <slot />
</button>

<style>
  .attending {
    background-color: greenyellow;
  }
</style>
