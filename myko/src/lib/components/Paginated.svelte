<script lang="ts">
  let currentPageIndex = 0;

  let hasNext = false;
  let hasPrevious = false;
  $: {
    hasNext = (currentPageIndex + 1) * itemsPerPage < data.length;
    hasPrevious = currentPageIndex > 0;
  }

  function previous() {
    currentPageIndex--;
  }

  function next() {
    currentPageIndex++;
  }

  type T = $$Generic;
  export let data: T[];
  export let render: (item: T) => string;
  export let itemsPerPage = 10;
</script>

{#each data.slice(currentPageIndex * itemsPerPage, (currentPageIndex + 1) * itemsPerPage) as item}
  {@html render(item)}
{/each}

<button class="left" on:click={previous} disabled={!hasPrevious}>&#60;</button>
{currentPageIndex + 1} / {Math.ceil(data.length / itemsPerPage)}
<button class="right" on:click={next} disabled={!hasNext}>&#62;</button>

<style>
  button {
    font-size: var(--20px);
    margin: 0.5rem 12px;
    padding: 0.25rem 0.85rem;
    border-radius: 50%;
    transition: padding-left 500ms ease-out, padding-right 500ms ease-out;
  }

  .left:hover {
    padding-left: 0.7rem;
    padding-right: 1rem;
  }

  .right:hover {
    padding-left: 1rem;
    padding-right: 0.7rem;
  }
</style>
