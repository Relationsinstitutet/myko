import type { SanityActivityType } from '$lib/models/activity';
import type { SanityFullEventType } from '$lib/models/event';
import { activityWithNearestEventQuery, createReadClient, notDraft } from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function getAllEvents() {
  const eventsQuery = `*[
    _type == "${sanitySchemaNames.event}" && ${notDraft}
  ] | order(date asc) {
    _id,
    date,
    activity->{
      name,
      "slug": slug.current
    }
  }`;

  return `${eventsQuery}`;
}

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const activity = await client.fetch<SanityActivityType>(activityWithNearestEventQuery);
  const events = await client.fetch<SanityFullEventType[]>(getAllEvents());

  if (activity) {
    return {
      status: 200,
      body: {
        nextUpcomingCotime: computeNextCotime(activity, undefined),
        events: events.map((e) => {
          const [date, time] = e.date.split('T');
          return { ...e, date, time };
        }),
      },
    };
  }

  return {
    status: 200,
    body: {},
  };
};
