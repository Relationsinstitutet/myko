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
    <audio src={data.audioFile} controls />
  {/if}
</div>

<style>
  .wrapper {
    padding: 20px;
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
</style>
