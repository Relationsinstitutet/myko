import { createReadClient } from '$lib/sanityClient';
import { sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type Event = {
  _id: string;
  date: string;
  activityName: string;
};

type SanityResultType = {
    eventsForUser: Event[];
}

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

  const result = await client.fetch<SanityResultType>(`{
      "eventsForUser": ${eventsForUserQuery}
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
  return {
    status: 200,
    body: { eventsUserIsAttending },
  };
};
