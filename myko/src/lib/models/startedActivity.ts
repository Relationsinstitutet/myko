import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export default interface StartedActivityData {
  readonly instructions: PortableTextBlocks;
  readonly videoConferencingLink?: string;
  readonly audioFile?: string;
}

export type ActivityStarted = {
  readonly activityStarted: StartedActivityData;
};
