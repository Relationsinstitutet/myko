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

  // export let activity: IActivity;
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
    background-color: var(--ocean-100);
  }

  ul {
    list-style: none;
    padding-left: unset;
  }

  .top-menu {
    background-color: var(--ocean-100);
    height: 3em;
  }

  .top-menu button {
    background: var(--grey-050);
    box-shadow: 2px 2px 9px -2px rgb(108 97 97 / 50%);
    border-radius: 4px;
    font-family: 'Lato', sans-serif;
    font-weight: 800;
    text-align: center;
    color: var(--ocean-800);
    padding: 8px;
    border: 0;
  }

  .user-menu {
    position: absolute;
    top: 10px;
    right: 10px;
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
      var(--ocean-800),
      var(--ocean-400),
      var(--ocean-100),
      var(--ocean-100)
    );
    background-size: 250% 1.5px;
    background-repeat: no-repeat;
    background-position: left bottom;
    transition: background-position 1s ease;
  }

  a:hover {
    background-position: right bottom;
    /*background-size: 250% 2px;*/
  }

  @media (min-width: 22rem) {
    main {
      padding-left: 48px;
      padding-right: 48px;
    }
  }
</style>
