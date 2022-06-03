<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type IActivity from '$lib/models/activity';

  export let activity: IActivity;
</script>

<main>
  <h1>{activity.name}</h1>

  <PortableText blocks={activity.description} />

  <div>{activity.duration}</div>

  <ul>
    {#each activity.prerequisites as prereq}
      <li>{prereq}</li>
    {/each}
  </ul>
  {#if activity.image}
    <img loading="lazy" src={activity.image.url} alt={activity.image.alt} />
  {/if}
</main>

<style>
  main {
    background-color: var(--peach-300);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 48px;
    padding-left: 48px;
    padding-right: 48px;
    font-family: 'Lato', sans-serif;
    color: var(--grey-800);
    margin-block-end: var(--36px);
  }

  h1 {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--24px);
    color: var(--grey-800);
    margin-top: 2em;
    margin-bottom: var(--30px);
  }

  /* the h2's in the portabletext blocks are styled in app.html */
</style>
