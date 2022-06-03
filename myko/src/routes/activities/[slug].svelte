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
    <!-- <h2>Tillfällen</h2> -->
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
  @import url('https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono:wght@400;700&display=swap');

  .wrapper {
    /* Font sizes */
    --14px: 0.875rem;
    --16px: 1rem;
    --18px: 1.125rem;
    --20px: 1.25rem;
    --24px: 1.5rem;
    --30px: 1.875rem;
    --36px: 2.25rem;
    --48px: 3rem;
    --60px: 3.75rem;
    --72px: 4.5rem;

    /* Grey colors */
    --grey-900: hsla(0, 0%, 13%, 1); /* Typography */
    --grey-800: hsla(0, 0%, 23%, 1); /* Typography */
    --grey-700: hsla(0, 0%, 32%, 1);
    --grey-600: hsla(0, 0%, 38%, 1); /* Typography */
    --grey-500: hsla(0, 0%, 49%, 1);
    --grey-400: hsla(0, 0%, 62%, 1);
    --grey-300: hsla(0, 0%, 69%, 1);
    --grey-200: hsla(0, 0%, 81%, 1);
    --grey-100: hsla(0, 0%, 88%, 1);
    --grey-050: hsla(0, 0%, 97%, 1);

    /* Ocean colors */
    --ocean-800: hsla(185, 97%, 23%, 1);
    --ocean-600: hsla(185, 99%, 29%, 1);
    --ocean-400: hsla(187, 54%, 51%, 1);
    --ocean-100: hsla(152, 43%, 93%, 1);

    /* Peach colors */
    --peach-700: hsla(358, 93%, 79%, 1);
    --peach-500: hsla(30, 100%, 85%, 1);
    --peach-300: hsla(28, 100%, 90%, 1);
    --peach-100: hsla(49, 100%, 96%, 1);

    /* Purple colors */
    --purple-700: hsla(311, 26%, 49%, 1);
    --purple-500: hsla(314, 23%, 59%, 1);
    --purple-400: hsla(332, 49%, 70%, 1);
    --purple-200: hsla(341, 50%, 85%, 1);

    background-color: var(--peach-300);
    /* height: 100vh; */
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
