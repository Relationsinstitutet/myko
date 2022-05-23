<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';

  import { onMount } from 'svelte';

  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
  });

  async function startActivity() {
    const accessToken = await authClient.getUserAccessToken();
    const response = await fetch('/api/activities/start', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Start failed');
      return;
    }
  }

  export let enabled: boolean = false;
  export let data: { eventId: string } | { activityId: string };
</script>

<button on:click={startActivity} disabled={!enabled}><slot /></button>
