<script lang="ts">
  import { page } from '$app/stores';

  import type { Client } from '$lib/auth/client';
  import createClient from '$lib/auth/client';
  import { isAuthenticated, user } from '$lib/auth/store';
  import BookingControls from '$lib/components/BookingControls.svelte';
  import Paginated from '$lib/components/Paginated.svelte';
  import { formatDate, formatTime } from '$lib/dateFormat';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  type CompletedActivity = {
    readonly date: string;
    readonly time: string;
    readonly activityName: string;
  };

  const currentPath = get(page).url.pathname;

  let authClient: Client;
  let eventsUserIsAttending: {
    readonly id: string;
    readonly date: string;
    readonly time: string;
    readonly activityName: string;
    userIsAttending: boolean;
  }[] = [];
  let completedActivities: CompletedActivity[] = [];

  onMount(async () => {
    authClient = await createClient();
    await authClient.updateState();

    const accessToken = await authClient.getUserAccessToken();
    const response = await fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      ({ eventsUserIsAttending, completedActivities } = data);
    }
  });

  function logout() {
    authClient.logout();
  }

  function login() {
    authClient.login(currentPath);
  }

  function renderCompletedActivity(activity: CompletedActivity): string {
    const date = formatDate(activity.date, { day: 'numeric', month: 'numeric' });
    const time = formatTime(activity.date, activity.time);

    return `<li>${date} ${time}: ${activity.activityName}</li>`;
  }
</script>

<div class="top-menu">
  <div class="user-menu">
    {#if $isAuthenticated}
      {$user.nickname}
      <button on:click={logout}>Logga ut</button>
    {:else}
      <button on:click={login}>Logga in</button>
    {/if}
  </div>
</div>

{#if $isAuthenticated}
  <h1>Bokade aktiviteter</h1>
  <ul class="plain-list">
    {#if eventsUserIsAttending.length < 1}
      Inget inbokat än.
    {/if}
    {#each eventsUserIsAttending as event}
      <li>
        {formatDate(event.date, { day: 'numeric', month: 'numeric' })}
        {event.activityName}:
        <BookingControls eventId={event.id} bind:userIsAttending={event.userIsAttending}>
          {formatTime(event.date, event.time)}
        </BookingControls>
      </li>
    {/each}
  </ul>

  <h1>Genomförda aktiviteter</h1>
  {#if completedActivities.length < 1}
    Inga genomförda aktiviteter än.
  {/if}
  <ul>
    <Paginated data={completedActivities} render={renderCompletedActivity} />
  </ul>
{:else}
  <div class="unauthenticated">Logga in för att se dina bokade aktiviteter</div>
{/if}

<style>
  .top-menu {
    background-color: var(--ocean-100);
    height: 3em;
  }

  .user-menu {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .unauthenticated {
    text-align: center;
    font-size: var(--24px);
  }

  .plain-list {
    list-style: none;
  }
</style>
