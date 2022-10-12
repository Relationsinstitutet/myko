import type { SanityActivityType } from '$lib/models/activity';
import type { SanityFullEventType } from '$lib/models/event';
import {
  activityWithNearestEventQuery,
  allFutureEventsQuery,
  createReadClient,
} from '$lib/sanityClient';
import { computeNextCotime } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const data = await client.fetch<{
    activity: SanityActivityType;
    events: SanityFullEventType[];
  }>(`{
    "activity": ${activityWithNearestEventQuery},
    "events": ${allFutureEventsQuery()}
  }`);

  if (data) {
    return {
      status: 200,
      body: {
        ...(data.activity && { nextUpcomingCotime: computeNextCotime(data.activity, undefined) }),
        events: data.events.map((e) => {
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
