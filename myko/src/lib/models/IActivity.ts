import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export default interface IActivity {
  name: string;
  description: PortableTextBlocks;
  duration: string;
  prerequisites: [string];
  image: SanityImageSource & { alt: string };
}

export type IActivityWithEvents = IActivity & { events: [{ _id: string; date: string }] };
