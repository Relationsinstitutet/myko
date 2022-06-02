<script lang="ts">
  import { isAuthenticated } from '$lib/auth/store';
  import type { Cotime } from '$lib/models/activity';
  import type StartedActivityData from '$lib/models/startedActivity';

  import BookingControls from './BookingControls.svelte';
  import StartActivityButton from './StartActivityButton.svelte';

  export let cotime: Cotime;
  export let onActivityStarted: (event: CustomEvent<StartedActivityData>) => void;
</script>

<!-- TODO: only info about cotime at top, add "floating" buttons at bottom, show next upcoming cotime on index page -->

<div class="cotime">
  Nästa samtid
  <div>
    {cotime.date}
    {#each cotime.events as event}
      <BookingControls eventId={event.id} bind:userIsAttending={event.userIsAttending}
        >{event.time}</BookingControls
      >
      {#if $isAuthenticated && event.userIsAttending}
        <StartActivityButton
          on:activityStarted={onActivityStarted}
          data={{ eventId: event.id }}
          enabled={event.isStartable}
        >
          Starta
        </StartActivityButton>
      {/if}
    {/each}
  </div>
</div>

<style>
  .cotime {
    text-transform: uppercase;
  }
</style>
