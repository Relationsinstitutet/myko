export function userIsAttendee(userId: string, attendees: { _ref: string }[]): boolean {
  return attendees.find((attendee) => attendee._ref == userId) !== undefined;
}
