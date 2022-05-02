<script>
  import PortableText from '@portabletext/svelte';
  import { urlFor } from '$lib/sanityClient';

  export let activity;
</script>

<div class="activity">
  <h2>{activity.name}</h2>
  <div>{activity.duration}</div>

  <ul>
    {#each activity.prerequisites as prereq}
      <li>{prereq}</li>
    {/each}
  </ul>
  <PortableText blocks={activity.description} />

  {#if activity.image}
    <img loading="lazy" src={urlFor(activity.image).url()} alt={activity.image.alt} />
  {/if}
</div>

<style>
  .activity {
    border: 1px solid grey;
  }
</style>
