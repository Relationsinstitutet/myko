<script lang="ts">

// import PortableText from '@portabletext/svelte';
import type { Faq } from '$lib/models/faq';
// import type IActivity from '$lib/models/activity';

// export let activity: IActivity;

export let  faq: Faq;

</script>

<main>
  <h1>Vad är nu detta</h1>
  <!-- <h1>{activity.name}</h1> -->

  <!-- <h1>{faq.name}</h1> -->
  <!-- <h2>{faq.detail1}</h2> -->

  <!-- <div>{faq.duration}</div> -->

  <!-- <PortableText blocks={faq.intro} /> -->

  <!-- {#if faq.image}
    <img loading="lazy" src={faq.image.url} alt={faq.image.alt} />
  {/if} -->


</main>

<style>
main {
  background-color: var(--ocean-100);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-top: 48px;
  padding-left: 48px;
  padding-right: 48px;
  padding-bottom: 256px;
  font-family: 'Lato', sans-serif;
  color: var(--grey-800);
}

h1 {
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  text-transform: uppercase;
  font-size: var(--24px);
  color: var(--grey-800);
  margin-top: 1em;
  margin-bottom: var(--30px);
}

</style>
