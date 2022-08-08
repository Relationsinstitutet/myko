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
  <div
    in:fly={{ y: '100%', duration: 2000 }}
    out:fly={{ y: '-100%', duration: 2000 }}
    on:outroend={completed}
    class="modal"
  >
    <div class="modal-content">
      <slot />
      <button class="done-btn secondary" on:click={done}>Jag är klar!</button>
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
    font-weight: 500;
    display: block;
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 0 -4px 5% 0;
    transition: margin-bottom 250ms ease-in-out;
  }

  .done-btn:hover,
  :focus {
    margin-bottom: 5.15%;
  }

  @media (min-width: 45rem) {
    .done-btn {
      margin-right: 24px;
    }
  }
</style>
