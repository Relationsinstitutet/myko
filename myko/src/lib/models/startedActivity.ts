import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export default interface StartedActivityData {
  readonly instructions: PortableTextBlocks;
  readonly videoConferencingLink?: string;
}

export type ActivityStarted = {
  readonly activityStarted: StartedActivityData;
};
