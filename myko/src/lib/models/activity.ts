import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityEventType } from './event';

export default interface IActivity {
  readonly id: string;
  readonly name: string;
  readonly description: PortableTextBlocks;
  readonly duration: string;
  readonly prerequisites: string[];
  readonly image?: { url: string; alt: string };
  readonly instant: boolean;
}

export type IActivityWithCotime = IActivity & {
  readonly cotime?: Cotime;
};

export type Event = {
  readonly id: string;
  readonly userIsAttending?: boolean;
  readonly time: string;
  readonly isStartable: boolean;
  readonly attendees: {
    readonly displayName: string;
  }[];
};

export type Cotime = {
  readonly activity: {
    readonly name: string;
    readonly slug: string;
  };
  readonly date: string;
  readonly events: Event[];
};

export interface IActivitySummary {
  readonly name: string;
  readonly eventSummaries: IEventSummary[];
  readonly slug: string;
}

export interface IEventSummary {
  readonly userIsAttending?: boolean;
  readonly numAttendees: number;
}

export type ActivityEvent = SanityEventType & {
  readonly numAttendees: number;
};

export type SanityActivityType = {
  readonly name: string;
  readonly events: ActivityEvent[];
  readonly slug: string;
  readonly subactivities?: {
    readonly name: string;
    readonly events: ActivityEvent[];
  }[];
};
