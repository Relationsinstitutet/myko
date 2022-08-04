<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime } from '$lib/models/activity';

  import type { Client } from '$lib/auth/client';
  import createClient from '$lib/auth/client';
  import { isAuthenticated, user } from '$lib/auth/store';
  import Paginated from '$lib/components/Paginated.svelte';
  import { formatDate, formatTime } from '$lib/dateFormat';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  type CompletedActivity = {
    readonly date: string;
    readonly time: string;
    readonly activityName: string;
  };

  let authClient: Client;
  let eventsUserIsAttending: {
    readonly id: string;
    readonly date: string;
    readonly time: string;
    readonly activity: {
      readonly name: string;
      readonly slug: string;
    };
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

  export let nextUpcomingCotime: Cotime | undefined = undefined;
</script>

<svelte:head>
  <title>Samtid</title>
</svelte:head>
<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}
  <h1>När det är samtid</h1>
  <!-- {#if events.length < 1}
  Finns inga schemalagda samtider just nu. 
  {:else} -->
  <ul class="plain-list">
    {#each eventsUserIsAttending as event}
      <li>
        <a href="/activities/{event.activity.slug}">
          {formatDate(event.date, { day: 'numeric', month: 'numeric' })}
          {formatTime(event.date, event.time)}

          {event.activity.name}
        </a>
      </li>
    {/each}
  </ul>

  {#if $isAuthenticated}
    <h1>Aktiviteter du ska vara med på</h1>
    {#if eventsUserIsAttending.length < 1}
      Inget inbokat än.
    {:else}
      <ul class="plain-list">
        {#each eventsUserIsAttending as event}
          <li>
            <a href="/activities/{event.activity.slug}">
              {formatDate(event.date, { day: 'numeric', month: 'numeric' })}
              {event.activity.name}
            </a>
          </li>
        {/each}
      </ul>
    {/if}

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
</main>

<style>
  main {
    background-color: var(--peach-300);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 48px;
    padding-bottom: 256px;
  }

  ul {
    list-style: none;
    padding-left: unset;
  }

  li {
    position: relative;
    font-family: 'Roboto Mono', monospace;
    line-height: var(--48px);
  }

  li a {
    color: var(--grey-700);
    text-decoration: none;
    background-image: linear-gradient(
      90deg,
      var(--grey-600),
      var(--grey-500),
      var(--peach-700),
      var(--peach-300)
    );
    background-size: 180% 2px;
    background-repeat: no-repeat;
    background-position: left bottom;
    transition: background-position 750ms ease;
  }

  li a:hover,
  :focus {
    color: var(--grey-900);
    font-weight: normal;
    background-position: right bottom;
  }

  ::marker {
    all: unset;
  }

  .plain-list {
    list-style: none;
    padding-left: unset;
    display: flex;
    flex-direction: column;
  }
</style>
