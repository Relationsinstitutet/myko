<script>
  // populated with data from the endpoint
  export let activities;
</script>

<svelte:head>
  <title>Aktiviteter</title>
</svelte:head>

<h1>Aktivititer</h1>

<ul>
  {#each activities as activity}
    <li>
      <a href="/activities/{activity.slug.current}">{activity.name}</a>
    </li>
  {/each}
</ul>
