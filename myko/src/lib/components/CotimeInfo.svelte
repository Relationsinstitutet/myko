<script lang="ts">
  import type { Cotime } from '$lib/models/activity';

  const locale = 'sv-SE';

  function formatDate(d: string): string {
    return new Date(Date.parse(d)).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'numeric',
      weekday: 'short',
    });
  }

  function formatTime(date: string, time: string): string {
    return new Date(Date.parse(`${date}T${time}`)).toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
    });
  }

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
  }

  .header {
    text-transform: uppercase;
    letter-spacing: 0.5rem;
  }

  .date {
    background: grey;
    border-radius: 5px;
    padding: 3px;
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
