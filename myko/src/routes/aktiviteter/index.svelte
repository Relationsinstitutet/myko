<script lang="ts">
  import createClient from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';
  import ActivityAttendance from '$lib/components/ActivityAttendance.svelte';
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import EventAttendeesDots from '$lib/components/EventAttendeesDots.svelte';

  import type { Cotime, IActivitySummary, IEventSummary } from '$lib/models/activity';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  onMount(async () => {
    const authClient = await createClient();
    await authClient.updateState();

    if (get(isAuthenticated)) {
      // if user is logged-in, include token in request to get
      // booking status of the logged-in user for each activity
      const accessToken = await authClient.getUserAccessToken();
      const headers: Record<string, string> = {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      };
      const response = await fetch('/aktiviteter', {
        headers,
      });

      const parsedJson = await response.json();
      activities = parsedJson.activities;
    }
  });

  function getTotalAttendeesForActivity(eventSummaries: IEventSummary[]) {
    return eventSummaries.reduce(
      (totalEventAttendees, event) => totalEventAttendees + event.numAttendees,
      0
    );
  }

  // populated with data from the endpoint
  export let activities: IActivitySummary[];
  export let nextUpcomingCotime: Cotime | undefined = undefined;
</script>

<svelte:head>
  <title>Aktiviteter</title>
</svelte:head>
<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  <ul>
    {#each activities as activity}
      <li>
        <ActivityAttendance userIsAttending={!!activity.eventSummaries.find((event) => event.userIsAttending)}
          numAttendees={getTotalAttendeesForActivity(activity.eventSummaries)}>
          <a href="/aktiviteter/{activity.slug}">{activity.name}</a>
        </ActivityAttendance>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    background-color: var(--peach-300);
    align-items: center;
  }

  ul {
    all: unset;
    list-style: none;
    padding-inline-start: 0;
  }

  li {
    font-family: 'Roboto Mono', monospace;
    line-height: var(--48px);
  }

  li a {
    color: var(--grey-700);
    text-decoration: none;
    background-image: linear-gradient(
      90deg,
      var(--peach-300),
      var(--peach-700),
      var(--grey-500),
      var(--grey-600)
    );
    background-size: 200% 2px;
    background-repeat: no-repeat;
    background-position: right bottom;
    transition: background-position 350ms ease;
  }

  li a:hover,
  :focus {
    color: var(--grey-900);
    background-position: left bottom;
  }

  ::marker {
    all: unset;
  }

  @media (prefers-reduced-motion) {
    li a:hover,
    :focus {
      background-position: right bottom;
    }
  }
</style>
