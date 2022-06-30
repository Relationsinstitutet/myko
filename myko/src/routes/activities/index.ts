import type { Cotime, IActivitySummary, SanityActivityType } from '$lib/models/activity';
import { createReadClient, eventsForActivityFilter, notDraft } from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames, userIsAttendee } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  activities: SanityActivityType[];
};

type Response = {
  activities: IActivitySummary[];
  nextUpcomingCotime?: Cotime;
};

function sortActivitiesByEventDate(activities: SanityActivityType[]) {
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
    _type == "${sanitySchemaNames.activity}" && ${notDraft}
  ] | order(orderRank) {
    name,
    "events": ${eventAttendeesQuery},
    "slug": slug.current
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
        slug: activity.slug,
      };
    });
    const sortedActivities = sortActivitiesByEventDate(data.activities);
    const activityWithNearestEvents = sortedActivities[0];

    const body: Response = {
      activities: activitySummaries,
      ...(activityWithNearestEvents.events.length > 0 && {
        nextUpcomingCotime: computeNextCotime(activityWithNearestEvents, userId),
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
