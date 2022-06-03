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
  import StartedActivityModal from '$lib/components/StartedActivityModal.svelte';
  import type StartedActivityData from '$lib/models/startedActivity';

  const currentSlug = get(page).params.slug;
  const currentPage = get(page).url.pathname;

  let authClient: Client;
  let startedActivityData: StartedActivityData;
  let showStartedActivityModal = false;

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

  function activityStarted(e: CustomEvent<StartedActivityData>) {
    startedActivityData = e.detail;
    showStartedActivityModal = true;
  }

  // populated with data from the endpoint
  export let activity: IActivityWithEvents;
</script>

<svelte:head>
  <title>{activity.name}</title>
</svelte:head>

{#if showStartedActivityModal}
  <StartedActivityModal data={startedActivityData} bind:shown={showStartedActivityModal} />
{/if}

<Activity {activity} />
<div class="wrapper">
  {#if activity.instant}
    {#if $isAuthenticated}
      <StartActivityButton
        on:activityStarted={activityStarted}
        data={{ activityId: activity.id }}
        enabled
      >
        Gör direkt
      </StartActivityButton>
    {:else}
      <button on:click={login}> Logga in </button> för att göra aktiviteten direkt.
    {/if}
  {/if}

  {#if activity.events.length > 0}
    <ul>
      {#each activity.events as event}
        <li>
          {event.date}
          <BookingControls eventId={event.id} bind:userIsAttending={event.userIsAttending} />
          {#if $isAuthenticated && event.userIsAttending}
            <StartActivityButton
              on:activityStarted={activityStarted}
              data={{ eventId: event.id }}
              enabled={event.isStartable}
            >
              Starta
            </StartActivityButton>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .wrapper {
    background-color: var(--peach-300);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 48px;
    padding-left: 48px;
    padding-right: 48px;
    padding-bottom: 64px;
  }
</style>
