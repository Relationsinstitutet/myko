export enum sanitySchemaNames {
  activitylog = 'activitylog',
  webuser = 'webuser',
  reference = 'reference',
}

export function userIsAttendee(userId: string, attendees: { _ref: string }[] | null): boolean {
  if (!userId || !attendees) {
    return false;
  }
  return attendees.find((attendee) => attendee._ref == userId) !== undefined;
}

export function eventIsStartable(userId: string | undefined, startDate: string): boolean {
  if (!userId) {
    return false;
  }

  // event is "startable" if user is logged in and it's less than the specified time left before the event start time
  const gracePeriodSeconds = 60 * 10;
  const parsedStartDate = Date.parse(startDate);
  const now = new Date();
  const diffSeconds = (parsedStartDate - now) / 1000;
  return diffSeconds < gracePeriodSeconds;
}
