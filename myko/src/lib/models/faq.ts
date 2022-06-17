import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export default interface Faq {
  readonly id: string;
  readonly intro: PortableTextBlocks;
  readonly detail1: string;
  readonly longstory: PortableTextBlocks;
  readonly image?: { url: string; alt: string };
}
