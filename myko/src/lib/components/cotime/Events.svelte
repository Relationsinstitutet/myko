<script lang="ts">
  import type { Event } from '$lib/models/activity';
  import EventInfo from '$lib/components/cotime/EventInfo.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let isAnyExpanded = false;
  function toggle(index: number) {
    // radio-button like behavior: make all others non-expanded
    eventInfoExpanded.forEach((_, i, array) => {
      if (i === index) {
        return;
      }
      array[i] = false;
    });

    if (isAnyExpanded && eventInfoExpanded.every((v) => v === false)) {
      isAnyExpanded = false;
      dispatch('closed');
    } else if (!isAnyExpanded && eventInfoExpanded.some((v) => v === true)) {
      isAnyExpanded = true;
      dispatch('expanded');
    }
  }

  export let date: string;
  export let events: Event[];
  let eventInfoExpanded: boolean[] = new Array(events.length);
</script>

{#each events as event, i}
  <EventInfo
    {date}
    {event}
    bind:expanded={eventInfoExpanded[i]}
    on:toggled={() => toggle(i)}
  />{#if i < events.length - 1}<span class="separator">|</span>{/if}
{/each}
