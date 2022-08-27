<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime } from '$lib/models/activity';
  import { formatDate, formatTime } from '$lib/dateFormat';
  import type { SanityFullEventType } from '$lib/models/event';

  // populated with data from the endpoint
  export let nextUpcomingCotime: Cotime | undefined = undefined;
  export let events: SanityFullEventType[];
</script>

<svelte:head>
  <title>Samtid</title>
</svelte:head>
<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}
  <h1>När det är samtid</h1>

  <ul class="plain-list">
    {#each events as event}
      <li>
        {formatDate(event.date, { day: 'numeric', month: 'numeric' })}
        <a href="/aktiviteter/{event.activity.slug}"> {event.activity.name} </a>
        <span class="time">{formatTime(event.date, event.time)}</span>
      </li>
    {/each}
  </ul>
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

  .time {
    font-weight: 700;
  }
</style>
