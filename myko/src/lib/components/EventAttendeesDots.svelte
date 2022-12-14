<script lang="ts">
  function getRandom(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }

  function getRandomOffset(min: number, max: number) {
    return `${getRandom(min, max)}em`;
  }

  const maxAttendees = 10;

  export let numAttendees: number;
</script>

<span aria-label="Antal deltagare: {numAttendees}">
  {#each { length: Math.min(numAttendees, maxAttendees) } as _}
    <span
      class="dot"
      style="left: {getRandomOffset(0, 2)}; top: {getRandomOffset(-0.75, -0.75)};"
    />
  {/each}
</span>

<style>
  .dot {
    display: inline-block;
    content: '';
    position: relative;
    height: 0.4em;
    width: 0.4em;
    background-color: var(--ocean-600);
    border-radius: 50%;
    overflow: hidden;
  }
</style>
