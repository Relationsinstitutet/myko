<script lang="ts">
  import type StartedActivityData from '$lib/models/startedActivity';
  import PortableText from '@portabletext/svelte';

  function close() {
    shown = false;
  }

  export let shown: boolean;
  export let data: StartedActivityData;
</script>

<div class="modal">
  <div class="modal-content">
    <span class="close" on:click={close}>&times;</span>

    <h1>Jippi! 🎉</h1>
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
</div>

<style>
  h1 {
    text-align: center;
  }

  .modal {
    font-family: Arial, sans-serif;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
