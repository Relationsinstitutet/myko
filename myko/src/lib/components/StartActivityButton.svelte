<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import type { ActivityStarted } from '$lib/models/startedActivity';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher<ActivityStarted>();

  let loading = false;
  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
  });

  async function startActivity() {
    loading = true;
    const accessToken = await authClient.getUserAccessToken();
    const response = await fetch('/api/activities/start', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    loading = false;

    if (!response.ok) {
      console.log('Start failed');
      return;
    }

    enabled = false;
    const jsonResponse = await response.json();
    dispatch('activityStarted', jsonResponse);
  }

  export let enabled = false;
  export let data: { eventId: string } | { activityId: string };
</script>

{#if loading}
  <div class="loader" />
{:else}
  <div class="wrapper">
    <button on:click={startActivity} disabled={!enabled}><slot /></button>
  </div>
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
