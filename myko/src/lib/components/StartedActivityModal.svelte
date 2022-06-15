<script lang="ts">
  import type StartedActivityData from '$lib/models/startedActivity';
  import PortableText from '@portabletext/svelte';
  import { fly } from './transitions';
  import { goto } from '$app/navigation';

  function done() {
    shown = false;
  }

  function completed() {
    goto('/');
  }

  export let shown: boolean;
  export let data: StartedActivityData;
</script>

{#if shown}
  <div transition:fly={{ y: '100%', duration: 2000 }} on:outroend={completed} class="modal">
    <div class="modal-content">
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

      <button class="done-btn" on:click={done}>Jag är klar!</button>
    </div>

  </div>
{/if}

<style>
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

  .modal {
    font-family: 'Lato', sans-serif;
    color: var(--grey-800);
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .modal-content {
    background-color: #fefefe;
    margin: 0;
    padding: 20px;
    border: 1px solid #888;
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }

  .done-btn {
    display: block;
    position: absolute;
    bottom: 5%;
  }
</style>
