<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
  import PortableTextLink from '$lib/components/portabletext/PortableTextLink.svelte';

  export let blocks: PortableTextBlocks;
</script>

<PortableText
  {blocks}
  serializers={{
    marks: {
      link: PortableTextLink,
    },
  }}
/>
