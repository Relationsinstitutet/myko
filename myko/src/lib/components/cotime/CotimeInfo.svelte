<script lang="ts">
  import { formatDate } from '$lib/dateFormat';

  import type { Cotime } from '$lib/models/activity';
  import EventInfo from '$lib/components/cotime/EventInfo.svelte';

  function toggle(index: number) {
    // radio-button like behavior: make all others non-expanded
    eventInfoExpanded.forEach((_, i, array) => {
      if (i === index) {
        return;
      }
      array[i] = false;
    });
  }
  export let cotime: Cotime;
  export let showActivityNameWhenSelected = true;
  let eventInfoExpanded: boolean[] = new Array(cotime.events.length);
</script>

<div class="cotime">
  {#if showActivityNameWhenSelected && eventInfoExpanded.some((v) => v === true)}
    <a href="/activities/{cotime.activity.slug}">{cotime.activity.name}</a>
  {:else}
    <div class="header">Nästa samtid</div>
  {/if}
  <div class="date">
    {formatDate(cotime.date)}
    <span class="times">
      {#each cotime.events as event, i}
        <EventInfo
          date={cotime.date}
          {event}
          bind:expanded={eventInfoExpanded[i]}
          on:toggled={() => toggle(i)}
        />{#if i < cotime.events.length - 1}<span class="separator">|</span>{/if}
      {/each}
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
    margin-bottom: 48px;
  }

  .header {
    font-style: normal;
    font-weight: 500;
    font-size: var(--12px);
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    color: var(--grey-600);
    margin-bottom: 8px;
  }

  .date {
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
