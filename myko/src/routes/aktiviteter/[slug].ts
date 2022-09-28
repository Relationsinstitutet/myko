import {
  attendeesQuery,
  createReadClient,
  eventsForActivityFilter,
  notDraft,
  urlFor,
} from '$lib/sanityClient';
import { computeNextCotime, sanitySchemaNames } from '$lib/util';
import type { IActivityWithCotime } from '$lib/models/activity';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';
import type { SanityEventType } from '$lib/models/event';

type SanityResultType = {
  _id: string;
  description: PortableTextBlocks;
  durationMinutes: number;
  events: SanityEventType[];
  image?: SanityImageSource & { alt: string };
  instant: boolean;
  name: string;
  prerequisites: string[];
  slug: string;
};

function getActivity(slug: string): string {
  const eventsQuery = `*[
    ${eventsForActivityFilter}
  ] | order(date asc) {
    _id,
    "attendees": ${attendeesQuery},
    date
  }`;

  return `*[
    _type == "${sanitySchemaNames.activity}" &&
    slug.current == "${slug}" &&
    ${notDraft}
  ][0] {
    _id,
    description,
    durationMinutes,
    "events": ${eventsQuery},
    image,
    instant,
    name,
    prerequisites,
    "slug": slug.current
  }`;
}

// Fetch activity details
export const get: RequestHandler<{ slug: string }, ResponseBody> = async ({
  params: { slug },
  locals,
}) => {
  const client = await createReadClient();
  const activity = await client.fetch<SanityResultType>(getActivity(slug));

  if (activity) {
    let userId: string | undefined;
    if (locals.user) {
      // grab user id from token to return booking status for specific user
      userId = locals.user.userId;
    }

    const activityData: IActivityWithCotime = {
      id: activity._id,
      description: activity.description,
      durationMinutes: activity.durationMinutes,
      ...(activity.image && {
        image: {
          url: urlFor(client, activity.image).url(),
          alt: activity.image.alt,
        },
      }),
      ...(activity.events.length > 0 && { cotime: computeNextCotime(activity, userId) }),
      name: activity.name,
      prerequisites: activity.prerequisites,
      instant: activity.instant,
    };
    return {
      status: 200,
      body: { activity: activityData },
    };
  }

  return {
    status: 404,
  };
};
