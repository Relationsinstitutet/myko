<script lang="ts">
  import type StartedActivityData from '$lib/models/startedActivity';
  import PortableText from '@portabletext/svelte';

  export let data: StartedActivityData;
</script>

<div class="wrapper">
  <h1>Välkommen</h1>
  <PortableText blocks={data.instructions} />

  {#if data.videoConferencingLink}
    <p>
      Klicka här för att joina mötet:
      <a href={data.videoConferencingLink}>{data.videoConferencingLink}</a>
    </p>
  {/if}

  {#if data.audioFile}
    <audio src={data.audioFile} controls controlsList="nodownload" />
  {/if}
</div>

<style>
  .wrapper {
    min-height: 100%;
    background-color: var(--peach-500);
    background-image: linear-gradient(
      var(--peach-100),
      var(--peach-300),
      var(--peach-500),
      var(--ocean-100)
    );
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
    text-align: left;
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--24px);
    color: var(--grey-800);
    margin-top: 1em;
    margin-bottom: var(--30px);
  }

  audio {
    max-width: 100%;
    margin-top: 32px;
  }

  a {
    max-width: 100%;
    margin-top: 32px;
  }

  @media (min-width: 45rem) {
    .wrapper {
      align-items: center;
    }
    h1 {
      text-align: center;
    }
    audio {
      width: 30rem;
    }
  }
</style>
