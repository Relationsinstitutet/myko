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
    align-items: center;
  }

  ul {
    list-style: none;
    padding-left: unset;
  }

  li {
    font-family: 'Roboto Mono', monospace;
    line-height: var(--48px);
    max-width: 23rem;
    display: flex;
    align-items: end;
  }

  li * {
    margin-right: auto;
  }

  li span {
    margin-right: 0;
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
    background-size: 180% 1.5px;
    background-repeat: no-repeat;
    background-position: right bottom;
    transition: background-position 350ms ease;
    line-height: normal;
    margin-top: 0.8rem;
    margin-bottom: 0.85rem;
    white-space: nowrap;
    max-width: 63%;
    margin-left: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  li a:hover,
  :focus {
    color: var(--grey-900);
    background-position: left bottom;
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
