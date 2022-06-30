import type { SanityActivityType } from '$lib/models/activity';
import { createReadClient, eventsForActivityFilter, notDraft } from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function getActivityWithNearestEvent() {
  const eventsQuery = `*[
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
  ] {
    name,
    "events": ${eventsQuery},
    "slug": slug.current
  } [count(events) > 0] | order(events[0].date) [0]`;
}

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const activity = await client.fetch<SanityActivityType>(getActivityWithNearestEvent());

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
