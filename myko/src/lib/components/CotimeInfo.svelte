<script lang="ts">
  import { formatDate, formatTime } from '$lib/dateFormat';

  import type { Cotime } from '$lib/models/activity';

  export let cotime: Cotime;
</script>

<div class="cotime">
  <div class="header">Nästa samtid</div>
  <div class="date">
    {formatDate(cotime.date)}
    <span class="times">
      {#each cotime.events as event, i}
        {formatTime(cotime.date, event.time)}{#if i < cotime.events.length - 1}<span
            class="separator">|</span
          >{/if}
      {/each}
    </span>
  </div>
</div>

<style>
  .cotime {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Roboto Mono', monospace;
    margin-bottom: 48px;
  }

  .header {
    font-style: normal;
    font-weight: 500;
    font-size: var(--12px);
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    color: var(--grey-600);
    margin-bottom: 8px;
  }

  .date {
    background: var(--ocean-100);
    border-radius: 5px;
    font-size: var(--14px);
    padding: 4px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .times {
    margin-left: 0.5em;
    font-weight: bold;
  }

  .separator {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
</style>
