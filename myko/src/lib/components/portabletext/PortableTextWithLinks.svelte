<script lang="ts">
  import PortableText from '@portabletext/svelte';
  import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
  import PortableTextLink from './PortableTextLink.svelte';

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
