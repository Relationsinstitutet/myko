<script lang="ts">
  import { isAuthenticated } from '$lib/auth/store';
  import { formatTime } from '$lib/dateFormat';
  import type { Cotime } from '$lib/models/activity';
  import type StartedActivityData from '$lib/models/startedActivity';

  import BookingControls from './BookingControls.svelte';
  import StartActivityButton from './StartActivityButton.svelte';

  export let cotime: Cotime;
  export let onActivityStarted: (event: CustomEvent<StartedActivityData>) => void;
</script>

<div class="innerWrapper">
  {#each cotime.events as event}
    <div>
      <BookingControls eventId={event.id} bind:userIsAttending={event.userIsAttending}
        >{formatTime(cotime.date, event.time)}</BookingControls
      >
      <!-- {#if $isAuthenticated && event.userIsAttending}
        <StartActivityButton
          on:activityStarted={onActivityStarted}
          data={{ eventId: event.id }}
          enabled={event.isStartable}
        >
          Starta
        </StartActivityButton>
      {/if} -->
    </div>
  {/each}
</div>

<style>
.innerWrapper {
    display: flex;
}
</style>
