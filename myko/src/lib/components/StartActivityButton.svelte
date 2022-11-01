<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import type { ActivityStarted } from '$lib/models/startedActivity';
  import { createEventDispatcher, onMount } from 'svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  const dispatch = createEventDispatcher<ActivityStarted>();

  let loading = false;
  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
  });

  async function startActivity() {
    loading = true;
    const accessToken = await authClient.getUserAccessToken();
    const response = await fetch('/api/aktiviteter/starta', {
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
  <LoadingSpinner />
{:else}
  <div class="wrapper">
    <button on:click={startActivity} disabled={!enabled}><slot /></button>
  </div>
{/if}
