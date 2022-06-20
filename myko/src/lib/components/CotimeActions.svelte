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
      {#if $isAuthenticated && event.userIsAttending && event.isStartable}
        <StartActivityButton
          on:activityStarted={onActivityStarted}
          data={{ eventId: event.id }}
          enabled={event.isStartable}
        >
          Starta {formatTime(cotime.date, event.time)}
        </StartActivityButton>
      {:else}
        <BookingControls eventId={event.id} bind:userIsAttending={event.userIsAttending}
          >{formatTime(cotime.date, event.time)}</BookingControls
        >
      {/if}
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
    justify-content: start;
  }

  .helpText {
    max-width: fit-content;
    height: 16px;
    margin: unset;
  }

  p {
    all: unset;
    font-size: var(--12px);
    font-weight: 700;
    color: var(--grey-800);
  }
</style>
