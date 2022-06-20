export type SanityEventType = {
  _id: string;
  attendees: { _id: string; displayName: string }[];
  date: string;
};
