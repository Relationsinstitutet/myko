<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type IActivity from '$lib/models/activity';

  export let activity: IActivity;
</script>

<main>
  <div class="activity">
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
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono:wght@400;700&display=swap');

  main {
    /* Font sizes */
    --14px: 0.875rem;
    --16px: 1rem;
    --18px: 1.125rem;
    --20px: 1.25rem;
    --24px: 1.5rem;
    --30px: 1.875rem;
    --36px: 2.25rem;
    --48px: 3rem;
    --60px: 3.75rem;
    --72px: 4.5rem;

    /* Grey colors */
    --grey-900: hsla(0, 0%, 13%, 1); /* Typography */
    --grey-800: hsla(0, 0%, 23%, 1); /* Typography */
    --grey-700: hsla(0, 0%, 32%, 1);
    --grey-600: hsla(0, 0%, 38%, 1); /* Typography */
    --grey-500: hsla(0, 0%, 49%, 1);
    --grey-400: hsla(0, 0%, 62%, 1);
    --grey-300: hsla(0, 0%, 69%, 1);
    --grey-200: hsla(0, 0%, 81%, 1);
    --grey-100: hsla(0, 0%, 88%, 1);
    --grey-050: hsla(0, 0%, 97%, 1);

    /* Ocean colors */
    --ocean-800: hsla(185, 97%, 23%, 1);
    --ocean-600: hsla(185, 99%, 29%, 1);
    --ocean-400: hsla(187, 54%, 51%, 1);
    --ocean-100: hsla(152, 43%, 93%, 1);

    /* Peach colors */
    --peach-700: hsla(358, 93%, 79%, 1);
    --peach-500: hsla(30, 100%, 85%, 1);
    --peach-300: hsla(28, 100%, 90%, 1);
    --peach-100: hsla(49, 100%, 96%, 1);

    /* Purple colors */
    --purple-700: hsla(311, 26%, 49%, 1);
    --purple-500: hsla(314, 23%, 59%, 1);
    --purple-400: hsla(332, 49%, 70%, 1);
    --purple-200: hsla(341, 50%, 85%, 1);

    background-color: var(--peach-300);
    /* height: 100vh; */
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 48px;
    padding-left: 48px;
    padding-right: 48px;
  }

  .activity {
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
