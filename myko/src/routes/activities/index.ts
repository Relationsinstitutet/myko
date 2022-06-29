import type { Cotime, IActivitySummary } from '$lib/models/activity';
import { createReadClient, eventsForActivityFilter, notDraft } from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames, userIsAttendee } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type Activity = {
  name: string;
  events: {
    _id: string;
    attendees: { _id: string; displayName: string }[];
    date: string;
    numAttendees: number;
  }[];
  slug: { current: string };
};

type SanityResultType = {
  activities: Activity[];
};

type Response = {
  activities: IActivitySummary[];
  nextUpcomingCotime?: Cotime;
};

function sortActivitiesByEventDate(activities: Activity[]) {
  return activities.sort((a, b) => {
    if (a.events.length > 0) {
      if (b.events.length > 0) {
        return a.events[0].date.localeCompare(b.events[0].date);
      }

      return -1;
    }

    return 0;
  });
}

function getActivitiesQuery() {
  const eventAttendeesQuery = `*[
    ${eventsForActivityFilter}
  ] | order(date asc) {
      _id,
      attendees[]->{
        _id,
        "displayName": nickname
      },
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
    slug
  }`;
}

// Fetch all activities
export const get: RequestHandler<Record<string, string>, ResponseBody> = async ({ locals }) => {
  const client = await createReadClient();
  const data = await client.fetch<SanityResultType>(`{
    "activities": ${getActivitiesQuery()},
  }`);

  if (data) {
    let userId: string | undefined;
    if (locals.user) {
      // grab user id from token to return booking status for specific user
      userId = locals.user.userId;
    }

    const activitySummaries: IActivitySummary[] = data.activities.map((activity) => {
      return {
        name: activity.name,
        eventSummaries: activity.events.map((event) => {
          return {
            numAttendees: event.numAttendees,
            ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
          };
        }),
        slug: activity.slug.current,
      };
    });
    const sortedActivities = sortActivitiesByEventDate(data.activities);
    const activityWithNearestEvents = sortedActivities[0];

    const body: Response = {
      activities: activitySummaries,
      ...(activityWithNearestEvents.events.length > 0 && {
        nextUpcomingCotime: computeNextCotime(activityWithNearestEvents.events, userId),
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
