import type { Cotime } from './models/activity';
import type { SanityEventType } from './models/event';

export enum sanitySchemaNames {
  activity = 'activity',
  activitylog = 'activitylog',
  event = 'event',
  faq = 'faq',
  webuser = 'webuser',
  reference = 'reference',
}

export function userIsAttendee(userId: string, attendees: { _id: string }[] | null): boolean {
  if (!userId || !attendees) {
    return false;
  }
  return attendees.find((attendee) => attendee._id == userId) !== undefined;
}

export function eventIsStartable(userId: string | undefined, startDate: string): boolean {
  if (!userId) {
    return false;
  }

  // event is "startable" if user is logged in and it's less than the specified time left before the event start time
  const gracePeriodSeconds = 60 * 10;
  const parsedStartDate = Date.parse(startDate);
  const now = new Date().valueOf();
  const diffSeconds = (parsedStartDate - now) / 1000;
  return diffSeconds < gracePeriodSeconds;
}

export function computeNextCotime(
  activity: { events: SanityEventType[]; name: string; slug: string },
  userId: string | undefined
): Cotime {
  // group all events on the same day as the next upcoming event
  const nextDate = activity.events[0].date.split('T')[0];
  const upcomingEvents = activity.events.filter((event) => event.date.startsWith(nextDate));

  return {
    activity: { name: activity.name, slug: activity.slug },
    date: nextDate,
    events: upcomingEvents.map((event) => {
      return {
        id: event._id,
        time: event.date.split('T')[1],
        ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
        isStartable: eventIsStartable(userId, event.date),
        attendees: event.attendees,
      };
    }),
  };
}
