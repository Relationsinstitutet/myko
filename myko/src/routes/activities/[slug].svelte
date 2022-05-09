<script>
  import Activity from '$lib/components/Activity.svelte';
  import BookingControls from '$lib/components/BookingControls.svelte';

  // populated with data from the endpoint
  export let activity;
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
