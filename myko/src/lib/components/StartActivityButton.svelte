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
  <div class="lds-default">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
{:else}
  <div class="wrapper">
    <button on:click={startActivity} disabled={!enabled}><slot /></button>
  </div>
{/if}

<style>
  .lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-default div {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--ocean-800);
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }
  .lds-default div:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
  }
  .lds-default div:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
  }
  .lds-default div:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
  }
  .lds-default div:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
  }
  .lds-default div:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
  }
  .lds-default div:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
  }
  .lds-default div:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
  }
  .lds-default div:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
  }
  .lds-default div:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
  }
  .lds-default div:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
  }
  .lds-default div:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
  }
  .lds-default div:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
  }
  @keyframes lds-default {
    0%,
    20%,
    80%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
</style>
