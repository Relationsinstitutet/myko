<script context="module" lang="ts">
  export function load({ error, status }) {
    return {
      props: {
        status: status,
        message: error.message,
      },
    };
  }
</script>

<script lang="ts">
  export let message: string;
  export let status: number;
</script>

{#if status === 404}
  Uh-oh, we couldn't find that!
{:else}
  Something went wrong!
{/if}
