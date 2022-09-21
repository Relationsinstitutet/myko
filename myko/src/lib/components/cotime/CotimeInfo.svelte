<script lang="ts">
  import { formatDate } from '$lib/dateFormat';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { createTransition } from 'svelte-reduced-motion';
  import { fly } from '../transitions';
  import type { Cotime } from '$lib/models/activity';
  import Events from '$lib/components/cotime/Events.svelte';

  const accessibleTransitionFly = createTransition(fly);
  const accessibleTransitionFade = createTransition(fade);

  function headerTextColor(pageUrl: string): string {
    let headerTextColor = 'header-dark-text';

    if (pageUrl === '/') {
      headerTextColor = 'header-light-text';
      return headerTextColor;
    } else if (pageUrl === '/aktiviteter') {
      headerTextColor = 'header-dark-text';
      return headerTextColor;
    } else if (pageUrl === '/jag') {
      headerTextColor = 'header-dark-text';
      return headerTextColor;
    } else if (pageUrl === '/faq') {
      headerTextColor = 'header-dark-text';
      return headerTextColor;
    } else {
      return headerTextColor;
    }
  }

  export let cotime: Cotime;
  export let showActivityNameWhenSelected = true;
  let isEventsExpanded = false;
</script>

<div class="cotime {headerTextColor($page.url.pathname)}">
  {#if showActivityNameWhenSelected && isEventsExpanded}
    <a
      in:accessibleTransitionFly={{ y: '-10px', duration: 300 }}
      out:accessibleTransitionFade
      class="header-link"
      href="/aktiviteter/{cotime.activity.slug}">{cotime.activity.name}</a
    >
  {:else}
    <div
      in:accessibleTransitionFade
      out:accessibleTransitionFly={{ y: '10px', duration: 400 }}
      class="header"
    >
      Nästa samtid
    </div>
  {/if}
  <div class="date">
    {formatDate(cotime.date)}
    <span class="times">
      <Events
        events={cotime.events}
        date={cotime.date}
        on:closed={() => (isEventsExpanded = false)}
        on:expanded={() => (isEventsExpanded = true)}
      />
    </span>
  </div>
</div>

<style>
  .cotime {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Roboto Mono', monospace;
    height: 116px;
    margin-bottom: 48px;
  }

  .header {
    position: absolute;
    top: 66px;
    font-style: normal;
    font-weight: 500;
    font-size: var(--12px);
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    color: inherit;
  }

  .header-dark-text {
    color: var(--grey-600);
  }

  .header-light-text {
    color: var(--grey-050);
  }

  .header-link {
    position: absolute;
    top: 66px;
    font-style: normal;
    font-weight: 500;
    font-size: var(--12px);
    letter-spacing: 0rem;
    color: inherit;
  }

  .date {
    color: var(--grey-800);
    background: var(--ocean-100);
    border-radius: 5px;
    font-size: var(--14px);
    padding: 4px 12px;
    box-shadow: 0.7px 0.7px 2px hsla(185, 54%, 51%, 0.3);
  }

  .times {
    margin-left: 0.5em;
    font-weight: bold;
  }

  .separator {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
</style>
