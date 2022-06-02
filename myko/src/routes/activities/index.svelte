<script lang="ts">
  import createClient from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';
  import CotimeInfo from '$lib/components/CotimeInfo.svelte';

  import type { Cotime, IActivitySummary } from '$lib/models/activity';
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
      const response = await fetch('/activities', {
        headers,
      });

      const parsedJson = await response.json();
      activities = parsedJson.activities;
    }
  });

  // populated with data from the endpoint
  export let activities: IActivitySummary[];
  export let nextUpcomingCotime: Cotime | undefined = undefined;
</script>

<svelte:head>
  <title>Aktiviteter</title>
</svelte:head>

{#if nextUpcomingCotime}
  <CotimeInfo cotime={nextUpcomingCotime} />
{/if}

<h1>Aktivititer</h1>

<ul>
  {#each activities as activity}
    <li>
      {#if activity.eventSummaries.find((event) => event.userIsAttending)}
        <span class="dot" />
      {/if}
      <a href="/activities/{activity.slug}">{activity.name}</a>
      <span>
        {#if activity.eventSummaries.length > 0}
          ({activity.eventSummaries.reduce(
            (totalEventAttendees, event) => totalEventAttendees + event.numAttendees,
            0
          )})
        {/if}
      </span>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
  }

  .dot {
    display: inline-block;
    height: 15px;
    width: 15px;
    background-color: #bbb;
    border-radius: 50%;
  }
</style>
