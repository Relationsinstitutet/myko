<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime, IActivitySummary } from '$lib/models/activity';

  export let activities: IActivitySummary[];
  export let nextUpcomingCotime: Cotime | undefined = undefined;
</script>

<svelte:head>
  <title>Samtid</title>
</svelte:head>
<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  <ul>
    <!-- TODO: configure index.ts -->
    <!-- {#each activities as activity}
      <li>
        <a href="/activities/{activity.slug}">{activity.name}</a>
      </li>
    {/each} -->
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
    all: unset;
    list-style: none;
    padding-inline-start: 0;
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
</style>
