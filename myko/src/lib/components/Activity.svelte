<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type IActivity from '$lib/models/activity';

  export let activity: IActivity;
</script>

<h1>{activity.name}</h1>

<div>{activity.duration}</div>

<ul>
  {#each activity.prerequisites as prereq}
    <li>{prereq}</li>
  {/each}
</ul>

<PortableText blocks={activity.description} />

{#if activity.image}
  <img loading="lazy" src={activity.image.url} alt={activity.image.alt} />
{/if}

<style>
  h1 {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--24px);
    color: var(--grey-800);
    margin-top: 1em;
    margin-bottom: var(--30px);
  }

  /* the h2's in the portabletext blocks are styled in app.html */
</style>
