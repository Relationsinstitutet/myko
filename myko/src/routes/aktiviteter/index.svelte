<script lang="ts">
  import createClient from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';

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
      const response = await fetch('/aktiviteter', {
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
<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  <ul>
    {#each activities as activity}
      <li>
        {#if activity.eventSummaries.find((event) => event.userIsAttending)}
          <span class="dot" />
        {/if}
        <a href="/aktiviteter/{activity.slug}">{activity.name}</a>
        <span>
          {#if activity.eventSummaries.length > 0}
          {#each Array(activity.eventSummaries.reduce(
            (totalEventAttendees, event) => totalEventAttendees + event.numAttendees,
            0
          )) as _, row}
          <span class="totalEventAttendeesDot" />
          {row }
            {/each}

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

  .dot::before {
    content: '';
    display: inline-block;
    top: 1.2em;
    left: -3.2em;
    height: 0.7em;
    width: 0.7em;
    background-color: var(--ocean-800);
    border-radius: 50%;
    margin-left: -1.25em;
  }

  .dot + a::before {
    content: '';
    position: fixed;
    border-top: solid 2px var(--ocean-800);
    border-radius: 40% 75% 65% 20% / 67% 50% 34% 0;
    height: 1.2em;
    width: 0;
    opacity: 0;
    transition: width 250ms ease, opacity 150ms;
  }

  .dot + a::after {
    content: 'hej!';
    position: fixed;
    color: var(--ocean-800);
    font-size: var(--14px);
    font-weight: bold;
    letter-spacing: 1px;
    opacity: 0;
    transition: margin-left 350ms, opacity 50ms ease-in;
  }

  .dot:hover + a::before {
    opacity: 1;
    width: 210px;
  }

  .dot:hover + a::after {
    margin-left: 4em;
    opacity: 1;
    transition-duration: 500ms;
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

  .totalEventAttendeesDot {
    content: '';
    display: inline-block;
    top: 1.2em;
    /* left: -3.2em; */
    height: 0.5em;
    width: 0.5em;
    background-color: var(--ocean-600);
    border-radius: 50%;
  }

  ::marker {
    all: unset;
  }

  @media (prefers-reduced-motion) {
    li a:hover,
    :focus {
      background-position: right bottom;
    }
    .dot + a::before {
      transition: opacity 500ms ease-in-out;
    }
    .dot + a::after {
      margin-left: 108%;
      transition: opacity 500ms ease-in-out;
    }
    .dot:hover + a::after {
      transition-duration: 0ms;
    }
  }
</style>
