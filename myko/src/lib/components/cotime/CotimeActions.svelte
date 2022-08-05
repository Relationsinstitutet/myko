<script lang="ts">
  import { isAuthenticated } from '$lib/auth/store';
  import { formatTime } from '$lib/dateFormat';
  import type { Cotime } from '$lib/models/activity';
  import type StartedActivityData from '$lib/models/startedActivity';

  import BookingControls from '$lib/components/BookingControls.svelte';
  import StartActivityButton from '$lib/components/StartActivityButton.svelte';

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
    width: fit-content;
    height: fit-content;
    margin: unset;
    margin-left: -5px;
    background: hsla(330, 70%, 86%, 0.8);
    border-radius: 35%;
    box-shadow: 0 0 1em 0.35em #f4c2db;
  }

  p {
    all: unset;
    font-size: var(--12px);
    font-weight: 700;
    color: var(--grey-900);
    letter-spacing: 0.02em;
  }
</style>
