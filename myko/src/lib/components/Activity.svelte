<script lang="ts">
  import type IActivity from '$lib/models/activity';
  import PortableTextWithLinks from '$lib/components/portabletext/PortableTextWithLinks.svelte';

  export let activity: IActivity;
</script>

<h1>{activity.name}</h1>

{#if activity.durationMinutes}
  <div class="duration">{activity.durationMinutes} minuter</div>
{/if}

{#if activity.prerequisites}
  <ul class="prereqs">
    {#each activity.prerequisites as prereq}
      <li>{prereq}</li>
    {/each}
  </ul>
{/if}

{#if activity.description}
  <PortableTextWithLinks blocks={activity.description} />
{/if}

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

  .duration,
  .prereqs li {
    font-weight: 700;
    color: var(--grey-600);
    letter-spacing: 1px;
    list-style: none;
  }
  .prereqs li::marker {
    all: unset;
  }
  img {
    margin-top: 1.5rem;
  }
  /* the h2's in the portabletext blocks are styled in app.html */
  @media (min-width: 45rem) {
    .duration,
    .prereqs li {
      width: 35rem;
    }
  }
</style>
