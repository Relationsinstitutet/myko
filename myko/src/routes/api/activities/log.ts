import { createReadClient } from '$lib/sanityClient';
import { sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  _createdAt: string;
  activitySlug: string;
};

// Fetch activity log
export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const limit = 10;
  const client = await createReadClient();
  const activityLogQuery = `*[
    _type == "${sanitySchemaNames.activitylog}"
  ] | order(_createdAt desc) [0..${limit - 1}] {
    _createdAt,
    "activitySlug": activity->slug.current
  }`;

  const entries = await client.fetch<SanityResultType[]>(activityLogQuery);

  const body = entries.map((e) => {
    return {
      date: e._createdAt,
      activity: e.activitySlug,
    };
  });
  return {
    status: 200,
    body: { body },
  };
};
