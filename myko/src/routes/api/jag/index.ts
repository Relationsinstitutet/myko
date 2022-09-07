import { createReadClient, eventGracePeriod, notDraft } from '$lib/sanityClient';
import { sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  eventsForUser: {
    _id: string;
    date: string;
    activity: {
      name: string;
      slug: string;
    };
  }[];
  completedActivities: {
    _createdAt: string;
    activityName: string;
  }[];
};

// Fetch user data summary
export const get: RequestHandler<Record<string, string>, ResponseBody> = async ({ locals }) => {
  if (!locals.user) {
    return {
      status: 401,
    };
  }

  const userId = locals.user.userId;
  const client = await createReadClient();
  const eventsForUserQuery = `*[
    _type == "${sanitySchemaNames.event}" &&
    references("${userId}") &&
    visible == true &&
    ${notDraft} &&
    dateTime(date) > dateTime(now()) - ${eventGracePeriod}
  ] | order(date asc) {
    _id,
    date,
    activity->{
      name,
      "slug": slug.current
    }
  }`;
  const completedActivitiesForUserQuery = `*[
    _type == "${sanitySchemaNames.activitylog}" &&
    references("${userId}")
  ] | order(_createdAt desc) {
    _createdAt,
    "activityName": activity->name
  }`;

  const result = await client.fetch<SanityResultType>(`{
      "eventsForUser": ${eventsForUserQuery},
      "completedActivities": ${completedActivitiesForUserQuery}
  }`);

  const eventsUserIsAttending = result.eventsForUser.map((e) => {
    const [date, time] = e.date.split('T');
    return {
      id: e._id,
      date,
      time,
      activity: e.activity,
      userIsAttending: true,
    };
  });
  const completedActivities = result.completedActivities.map((e) => {
    const [date, time] = e._createdAt.split('T');
    return {
      date,
      time,
      activityName: e.activityName,
    };
  });
  return {
    status: 200,
    body: { eventsUserIsAttending, completedActivities },
  };
};
