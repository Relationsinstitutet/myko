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
      <div class="helpText">
        {#if $isAuthenticated && event.userIsAttending}
          <p>Du är med &#127852;</p>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .innerWrapper {
    display: flex;
  }

  .helpText {
    max-width: fit-content;
    height: 16px;
    margin: unset;
  }

  p {
    font-size: var(--12px);
    font-weight: 700;
    color: var(--grey-800);
  }

  @media (min-width: 45rem) {
  }
</style>
