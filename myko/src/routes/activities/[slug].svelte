<script lang="ts">
  import Activity from '$lib/components/Activity.svelte';
  import BookingControls from '$lib/components/BookingControls.svelte';
  import type { IActivityWithEvents } from '$lib/models/IActivity';

  // populated with data from the endpoint
  export let activity: IActivityWithEvents;
</script>

<svelte:head>
  <title>{activity.name}</title>
</svelte:head>

<Activity {activity} />

{#if activity.events.length > 0}
  <h2>Tillfällen</h2>
  <ul>
    {#each activity.events as event}
      <li>
        {event.date}
        <BookingControls eventId={event._id} />
      </li>
    {/each}
  </ul>
{/if}
