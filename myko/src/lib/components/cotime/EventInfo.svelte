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

  .visible {
    visibility: visible !important;
    opacity: 1 !important;
  }

  .attendee-list {
    visibility: hidden;
    min-height: 1em;
    min-width: 4em;
    background-color: white;
    border-radius: 5px;

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
</style>
