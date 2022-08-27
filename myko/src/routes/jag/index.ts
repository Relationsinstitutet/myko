import type { SanityActivityType } from '$lib/models/activity';
import { activityWithNearestEventQuery, createReadClient } from '$lib/sanityClient';
import { computeNextCotime } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const activity = await client.fetch<SanityActivityType>(activityWithNearestEventQuery);

  if (activity) {
    return {
      status: 200,
      body: { nextUpcomingCotime: computeNextCotime(activity, undefined) },
    };
  }

  return {
    status: 200,
    body: {},
  };
};
