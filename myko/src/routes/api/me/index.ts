import { createReadClient } from '$lib/sanityClient';
import { sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  eventsForUser: {
    _id: string;
    date: string;
    activityName: string;
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
    references("${userId}")
  ] | order(date asc) {
    _id,
    date,
    "activityName": activity->name
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
      activityName: e.activityName,
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
