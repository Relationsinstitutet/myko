import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export default interface IActivity {
  readonly name: string;
  readonly description: PortableTextBlocks;
  readonly duration: string;
  readonly prerequisites: [string];
  readonly image: { url: string; alt: string };
}

export type IActivityWithEvents = IActivity & { events: [{ _id: string; date: string }] };
