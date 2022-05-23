<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import Activity from '$lib/components/Activity.svelte';
  import BookingControls from '$lib/components/BookingControls.svelte';
  import StartActivityButton from '$lib/components/StartActivityButton.svelte';
  import type { IActivityWithEvents } from '$lib/models/activity';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';

  const currentSlug = get(page).params.slug;
  const currentPage = get(page).url.pathname;

  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
    await authClient.updateState();

    if (get(isAuthenticated)) {
      // if user is logged-in, include token in request to get
      // booking status of the logged-in user for each event
      const accessToken = await authClient.getUserAccessToken();
      const response = await fetch(`/activities/${currentSlug}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });

      const parsedJson = await response.json();
      activity = parsedJson.activity;
    }
  });

  function login() {
    authClient.login(currentPage);
  }

  // populated with data from the endpoint
  export let activity: IActivityWithEvents;
</script>

<svelte:head>
  <title>{activity.name}</title>
</svelte:head>

<Activity {activity} />

{#if activity.instant}
  {#if $isAuthenticated}
    <StartActivityButton data={{ activityId: activity.id }} enabled={true}>
      Gör direkt
    </StartActivityButton>
  {:else}
    <button on:click={login}> Logga in </button> för att göra aktiviteten direkt.
  {/if}
{/if}

{#if activity.events.length > 0}
  <h2>Tillfällen</h2>
  <ul>
    {#each activity.events as event}
      <li>
        {event.date}
        <BookingControls eventId={event.id} userIsAttending={event.userIsAttending} />
        {#if $isAuthenticated}
          <StartActivityButton data={{ eventId: event.id }} enabled={event.isStartable}>
            Starta
          </StartActivityButton>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
