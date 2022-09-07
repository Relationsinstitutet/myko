import type {
  ActivityEvent,
  Cotime,
  IActivitySummary,
  SanityActivityType,
} from '$lib/models/activity';
import {
  activityWithNearestEventQuery,
  attendeesQuery,
  createReadClient,
  eventsForActivityFilter,
  notDraft,
} from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames, userIsAttendee } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  activities: SanityActivityType[];
  activityWithNearestEvent: SanityActivityType;
};

type Response = {
  activities: IActivitySummary[];
  nextUpcomingCotime?: Cotime;
};

function getActivitiesQuery() {
  const eventAttendeesQuery = `*[
    ${eventsForActivityFilter}
  ] | order(date asc) {
      _id,
      "attendees": ${attendeesQuery},
      date,
      "numAttendees": coalesce(count(attendees), 0)
  }`;

  return `*[
    _type == "${sanitySchemaNames.activity}" &&
    listable == true &&
    ${notDraft}
  ] | order(orderRank) {
    name,
    "events": ${eventAttendeesQuery},
    "slug": slug.current,
    subactivities[]->{
        name,
        "events": ${eventAttendeesQuery}
      }
  }`;
}

const summarizeSubactivityEvents = (
  subactivity: { events: ActivityEvent[] },
  userId: string | undefined
) => {
  return subactivity.events.map((event) => summarizeEvent(event, userId));
};

const summarizeEvent = (event: ActivityEvent, userId: string | undefined) => {
  return {
    numAttendees: event.numAttendees,
    ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
  };
};

// Fetch all activities
export const get: RequestHandler<Record<string, string>, ResponseBody> = async ({ locals }) => {
  const client = await createReadClient();
  const data = await client.fetch<SanityResultType>(`{
    "activities": ${getActivitiesQuery()},
    "activityWithNearestEvent": ${activityWithNearestEventQuery}
  }`);

  if (data) {
    let userId: string | undefined;
    if (locals.user) {
      // grab user id from token to return booking status for specific user
      userId = locals.user.userId;
    }

    const activitySummaries: IActivitySummary[] = data.activities.map((activity) => {
      /* if the activity has subactivities:
       * count attendees for those and check if user is attending an event for any of them instead
       */
      const eventSummaries = activity.subactivities
        ? activity.subactivities
            .map((subactivity) => summarizeSubactivityEvents(subactivity, userId))
            .flat()
        : activity.events.map((event) => summarizeEvent(event, userId));

      return {
        name: activity.name,
        eventSummaries,
        slug: activity.slug,
      };
    });

    const body: Response = {
      activities: activitySummaries,
      ...(data.activityWithNearestEvent.events.length > 0 && {
        nextUpcomingCotime: computeNextCotime(data.activityWithNearestEvent, userId),
      }),
    };
    return {
      status: 200,
      body,
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
};
