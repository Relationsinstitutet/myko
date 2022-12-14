<script lang="ts">
  import EventAttendeesDots from './EventAttendeesDots.svelte';

  export let userIsAttending: boolean;
  export let numAttendees: number;
</script>

<div class="wrapper">
  {#if userIsAttending}
    <span aria-label="Jag ska vara med på detta!" class="dot"></span>
  {/if}
  <div class="connector"></div>
  <slot />
  <span class="attendee-dots">
    <EventAttendeesDots {numAttendees} />
  </span>
</div>

<style>
  .wrapper {
    position: relative;
    width: fit-content;
  }

  .dot {
    content: '';
    position: relative;
    display: inline-block;
    height: 0.7em;
    width: 0.7em;
    background-color: var(--ocean-800);
    border-radius: 50%;
    margin-left: -1.25em;
  }

  .connector {
    content: '';
    position: absolute;
    display: inline-block;
    border-top: solid 2px var(--ocean-800);
    border-radius: 40% 75% 65% 20% / 67% 50% 34% 0;
    height: 1.2em;
    width: 0;
    transition: width 250ms ease;
  }
  .dot:hover ~ .connector {
    width: 100%;
  }

  .attendee-dots::after {
    content: 'hej!';
    position: absolute;
    top: -1em;
    opacity: 0;
    color: var(--ocean-800);
    font-size: var(--14px);
    font-weight: bold;
    letter-spacing: 1px;
    transition: opacity 500ms ease-in;
  }
  .dot:hover ~ .attendee-dots::after {
    opacity: 1;
  }

  @media (prefers-reduced-motion) {
    .attendee-dots::after {
      transition: opacity 500ms ease-in-out;
    }
    .connector {
      transition: width 500ms ease-in-out;
    }
  }
</style>
