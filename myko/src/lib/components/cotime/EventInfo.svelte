<script lang="ts">
  import { formatTime } from '$lib/dateFormat';
  import type { Event } from '$lib/models/activity';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function clicked() {
    expanded = !expanded;
    dispatch('toggled');
  }

  export let date: string;
  export let event: Event;
  export let expanded = false;
</script>

<div class="event">
  <button on:click={clicked} class="cotime-btn">{formatTime(date, event.time)}</button><span
    class:visible={expanded}
    class="attendee-list"
    on:click={clicked}
  >
    {#if event.attendees.length < 1}
      Ingen än.
    {:else}
      <ul>
        {#each event.attendees as attendee}
          <li>{attendee.displayName}</li>
        {/each}
      </ul>
    {/if}
  </span>
</div>

<style>
  .event {
    position: relative;
    display: inline-block;
  }

  .cotime-btn {
    background: var(--grey-050);
    padding: 0.15rem 0.5rem;
    border-radius: 8px;
    box-shadow: none;
  }

  .cotime-btn:hover {
    box-shadow: inset 0.5px 0.7px 0.8px hsla(185, 99%, 29%, 0.25),
      inset 1.5px 2.2px 3px -1px hsla(187, 54%, 51%, 0.4);
  }

  .visible {
    visibility: visible !important;
    opacity: 1 !important;
    transform: translateX(50%) translateY(0) !important;
  }

  .attendee-list {
    visibility: hidden;
    min-height: 1em;
    min-width: 4em;
    /*Scroll if it gets too long? but would need to combine styling + accessibility
    max-height: 10em;
    overflow: auto;*/

    padding: 2px 6px;
    border-radius: 8px;
    background-color: white;
    color: var(--ocean-800);
    font-size: 0.725rem;
    letter-spacing: 0.5px;
    box-shadow: 0.5px 0.7px 1.2px hsla(30, 55%, 23%, 0.2), 0.8px 1.5px 4px hsla(360, 54%, 38%, 0.3);
    position: absolute;
    top: 100%;
    right: 50%;
    transform: translateX(50%) translateY(-10px);
    margin-top: 8px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 300ms, transform 400ms;
  }

  /* arrow */
  .attendee-list::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent #555 transparent;
  }

  .attendee-list > ul {
    width: 100%;
    list-style: none;
  }

  ::marker {
    all: unset;
  }
</style>
