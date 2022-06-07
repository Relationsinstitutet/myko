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

<button on:click={previous} disabled={!hasPrevious}>&#60;</button>
{currentPageIndex + 1} / {Math.ceil(data.length / itemsPerPage)}
<button on:click={next} disabled={!hasNext}>&#62;</button>
