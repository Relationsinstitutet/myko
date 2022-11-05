<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
  import { onDestroy, onMount } from 'svelte';

  onMount(() => {
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = '//code.tidio.co/vbj0zee1lpdkildtba49hrvoe0fpeg2r.js';
    mainElement.appendChild(scriptTag);
  });

  onDestroy(() => {
    document.getElementById('tidio-chat-code')?.remove();
    document.getElementById('tidio-chat')?.remove();
  });

  export let instructions: PortableTextBlocks;
  let mainElement: HTMLElement;
</script>

<main bind:this={mainElement}>
  <h1>Bli medlem</h1>

  <PortableText blocks={instructions} />
</main>

<style>
  main {
    background-color: var(--peach-300);
    background-image: linear-gradient(
      var(--peach-100),
      var(--peach-300),
      var(--peach-500),
      var(--ocean-100)
    );
    padding-bottom: 144px;
  }
</style>
