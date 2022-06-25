<script lang="ts">
  import { formatTime } from '$lib/dateFormat';
  import type { Event } from '$lib/models/activity';

  let showAttendees = false;

  export let date: string;
  export let event: Event;
</script>

<div class="event">
  <button on:click={() => (showAttendees = !showAttendees)} class="cotime-btn"
    >{formatTime(date, event.time)}</button
  ><span class:visible={showAttendees} class="attendee-list">
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
  }

  .attendee-list {
    visibility: hidden;
    /* min-height: 1em;
    min-width: 4em;*/
    width: fit-content;
    height: fit-content;
    padding: 2px 6px;
    border-radius: 8px;
    background-color: white;
    color: var(--ocean-800);
    font-size: 0.725rem;
    letter-spacing: 0.5px;

    position: absolute;
    z-index: 1;
    top: 100%;
    right: 50%;
    transform: translateX(50%);

    margin-top: 7px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.3s;
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
