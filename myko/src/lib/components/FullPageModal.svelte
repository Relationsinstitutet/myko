<script lang="ts">
  import { createTransition } from 'svelte-reduced-motion';
  import { fly } from './transitions';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const accessibleTransition = createTransition(fly);

  function done() {
    shown = false;
    dispatch('done');
  }

  function completed() {
    dispatch('closed');
  }

  export let shown: boolean;
</script>

{#if shown}
  <div
    in:accessibleTransition={{ y: '100%', duration: 2000 }}
    out:accessibleTransition={{ y: '-100%', duration: 2000 }}
    on:outroend={completed}
    class="modal"
  >
    <div class="modal-content">
      <slot />
      <div class="help-text">När du är klar:</div>
      <button class="done-btn secondary" on:click={done}>Mata Myko!</button>
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
    width: 100%;
    height: 100%;
  }

  .done-btn {
    font-weight: 500;
    display: block;
    position: fixed;
    bottom: 0;
    right: 8px;
    margin-bottom: 55px;
    transition: margin-bottom 250ms ease-in-out;
  }

  .done-btn:hover,
  :focus {
    margin-bottom: 60px;
  }

  .help-text {
    display: block;
    position: fixed;
    bottom: 0;
    right: 16px;
    margin-bottom: 100px;
    font-size: 0.85em;
    background: hsla(330, 70%, 95%, 0.8);
    border-radius: 35%;
    box-shadow: 0 0.5em 1.75em 1em #fbe9f2;
  }

  @media (min-width: 45rem) {
    .done-btn {
      margin-right: 24px;
    }

    .help-text {
      margin-right: 24px;
    }
  }
</style>
