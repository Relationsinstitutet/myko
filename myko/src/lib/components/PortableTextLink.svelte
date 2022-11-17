<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte';

  // Property custom marks receive from @portabletext/svelte when rendered
  export let portableText: MarkProps<{
    href?: string;
  }>;

  // Remember to make your variables reactive so that they can reflect prop changes
  $: mark = portableText.mark;
  $: target = mark.href?.startsWith('/') ? '_self' : 'external'; // treat relative link as "internal" link, letting Svelte handle it properly
</script>

{#if mark.href}
  <a href={mark.href} {target}><slot /></a>
{:else}
  <slot />
{/if}

<style>
  a {
    font-family: 'Roboto Mono', monospace;
    color: var(--grey-700);
    font-weight: 700;
  }

  @media (min-width: 45rem) {
    a {
      display: inline;
    }
  }
</style>
