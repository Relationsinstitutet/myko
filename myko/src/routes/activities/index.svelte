<script lang="ts">
  import createClient from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import type { IActivitySummary } from '$lib/models/activity';
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
</script>

<svelte:head>
  <title>Aktiviteter</title>
</svelte:head>

<main>
  <!-- <h1>Aktivititer</h1> -->

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
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono:wght@400;700&display=swap');

  main {
    background-color: hsla(152, 43%, 93%, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 48px;

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
    --grey-900: hsl(0 0% 13%);
    --grey-800: hsl(0 0% 23%);
    --grey-700: hsl(0 0% 23%);
    --grey-600: hsl(0 0% 23%);
    --grey-500: hsl(0 0% 23%);
    --grey-400: hsl(0 0% 23%);
    --grey-300: hsl(0 0% 23%);
    --grey-200: hsl(0 0% 23%);
    --grey-100: hsl(0 0% 23%);
    --grey-050: hsl(0 0% 23%);
  }

  /* h1 {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--20px); */

  /* grey-700 */
  /* color: hsla(0, 0%, 32%, 1); */
  /* } */

  ul {
    list-style: none;
  }

  li {
    font-family: 'Roboto Mono', monospace;
    line-height: var(--48px);
  }

  li a {
    color: var(--grey-700);
  }

  .dot {
    display: inline-block;
    height: 15px;
    width: 15px;
    background-color: #bbb;
    border-radius: 50%;
  }
</style>
