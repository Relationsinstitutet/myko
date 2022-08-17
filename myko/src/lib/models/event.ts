export type SanityEventType = {
  readonly _id: string;
  readonly attendees: { _id: string; displayName: string }[];
  readonly date: string;
};

export type SanityFullEventType = {
  readonly _id: string;
  readonly date: string;
  readonly time: string;
  readonly activity: {
    readonly name: string;
    readonly slug: string;
  };
};
