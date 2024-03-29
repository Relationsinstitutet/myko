<script lang="ts">
  import { page } from '$app/stores';

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

  const currentPath = get(page).url.pathname;

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
    const response = await fetch('/api/jag', {
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

<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  {#if $isAuthenticated}
    <h1>Aktiviteter du ska vara med på</h1>
    {#if eventsUserIsAttending.length < 1}
      Inget inbokat än.
    {:else}
      <ul class="plain-list">
        {#each eventsUserIsAttending as event}
          <li>
            <a href="/aktiviteter/{event.activity.slug}">
              {formatDate(event.date, { day: 'numeric', month: 'numeric' })}
              {formatTime(event.date, event.time)}
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
    <div class="unauthenticated">Logga in för att se dina aktiviteter.</div>
  {/if}
</main>

<style>
  main {
    background-color: var(--ocean-100);
  }

  ul {
    list-style: none;
    padding-left: unset;
  }

  .top-menu {
    background-color: var(--ocean-100);
  }

  .top-menu button {
    background: var(--grey-050);
    box-shadow: 2px 2px 9px -2px rgb(108 97 97 / 50%);
    color: var(--ocean-800);
    padding: 4px 6px 6px;
    margin: 2px 2px 0 0;
  }

  .top-menu button:hover {
    background: #fcfcfc;
    color: var(--ocean-900);
  }

  .user-menu {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    text-align: center;
    position: absolute;
    top: 8px;
    right: 6px;
    font-family: 'Roboto Mono', monospace;
    color: var(--grey-800);
  }

  .unauthenticated {
    text-align: center;
    font-size: var(--24px);
  }

  .plain-list {
    list-style: none;
    padding-left: unset;
    display: flex;
    flex-direction: column;
  }

  a {
    text-decoration: none;
    background-image: linear-gradient(
      90deg,
      var(--ocean-100),
      var(--ocean-100),
      var(--ocean-400),
      var(--ocean-800)
    );
    background-size: 230% 1.5px;
    background-repeat: no-repeat;
    background-position: right bottom;
    transition: background-position 400ms ease;
  }

  a:hover {
    color: var(--grey-900);
    background-position: left bottom;
  }
</style>
