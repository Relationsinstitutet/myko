import type { IActivitySummary } from '$lib/models/activity';
import { createReadClient, notDraft } from '$lib/sanityClient';
import { userIsAttendee } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  activities: [
    {
      name: string;
      events: [
        {
          attendees: { _ref: string }[] | null;
          numAttendees: number;
        }
      ];
      slug: { current: string };
    }
  ];
};

function getActivitiesQuery() {
  const eventAttendeesQuery = `*[
    _type == "event" &&
    activity._ref == ^._id &&
    visible == true &&
    ${notDraft}
  ] {
      attendees,
      "numAttendees": coalesce(count(attendees), 0)
  }`;

  return `*[
    _type == "activity" && ${notDraft}
  ] | order(name asc) {
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

    return {
      status: 200,
      body: { activities: activitySummaries },
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
};
