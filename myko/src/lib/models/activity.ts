import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';

export default interface IActivity {
  readonly name: string;
  readonly description: PortableTextBlocks;
  readonly duration: string;
  readonly prerequisites: string[];
  readonly image?: { url: string; alt: string };
}

export type IActivityWithEvents = IActivity & {
  readonly events: {
    readonly id: string;
    readonly userIsAttending?: boolean;
    readonly date: string;
  }[];
};

export interface IActivitySummary {
  readonly name: string;
  readonly eventSummaries: IEventSummary[];
  readonly slug: string;
}

export interface IEventSummary {
  readonly userIsRegistered?: boolean;
  readonly numAttendees: number;
}
