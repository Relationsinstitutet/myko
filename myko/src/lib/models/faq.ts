import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export type Faq = {
  readonly title: string;
  readonly intro: PortableTextBlocks;
  readonly questions: {
    readonly question: string;
    readonly answer: PortableTextBlocks;
  }[];
  readonly descriptionTitle: string;
  readonly description: PortableTextBlocks;
};
