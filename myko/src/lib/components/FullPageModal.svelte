<script lang="ts">
  import { fly } from './transitions';
  import { goto } from '$app/navigation';

  function done() {
    shown = false;
  }

  function completed() {
    goto('/');
  }

  export let shown: boolean;
</script>

{#if shown}
  <div transition:fly={{ y: '100%', duration: 2000 }} on:outroend={completed} class="modal">
    <div class="modal-content">
      <slot />
      <button class="done-btn" on:click={done}>Jag är klar!</button>
    </div>
  </div>
{/if}

<style>
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
    border: 1px solid #888;
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }

  .done-btn {
    /*color: #fff;
    background: var(--ocean-900);
    font-weight: 500;
    width: fit-content;
    display: block;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 2px 2px 9px -2px rgb(108 97 97 / 50%);
    border: 0;
    letter-spacing: 1px;*/
    position: absolute;
    bottom: 5%;
    margin: 0 0 0 48px;
  }

  .done-btn:hover,
  :focus {
    background: var(--ocean-800);
  }

  @media (min-width: 45rem) {
    .done-btn {
      /*margin: 0 0 0 45%;*/
    }
  }
</style>
