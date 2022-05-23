import type { IActivitySummary } from '$lib/models/activity';
import { createReadClient } from '$lib/sanityClient';
import { userIsAttendee } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  activities: [
    {
      name: string;
      events: [{ attendees: [{ _ref: string }] }];
      slug: { current: string };
    }
  ];
};

function getActivitiesQuery() {
  const eventAttendeesQuery = `*[
        _type == "event" &&
        activity._ref == ^._id &&
        visible == true] {
          attendees
      }`;

  return /* groq */ `*[
    _type == "activity"
  ] {
    name,
    "events": ${eventAttendeesQuery},
    slug
  }`;
}

// Fetch all activities
export const get: RequestHandler<Record<string, string>, ResponseBody> = async ({ locals }) => {
  const client = await createReadClient();
  const data: SanityResultType = await client.fetch(/* groq */ `{
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
            numAttendees: event.attendees.length,
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
