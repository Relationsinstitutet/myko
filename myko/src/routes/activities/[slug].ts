import { createReadClient, notDraft, urlFor } from '$lib/sanityClient';
import { eventIsStartable, userIsAttendee } from '$lib/util';
import type { IActivityWithEvents } from '$lib/models/activity';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  _id: string;
  description: PortableTextBlocks;
  duration: string;
  events: {
    _id: string;
    attendees: { _ref: string }[];
    date: string;
  }[];
  image?: SanityImageSource & { alt: string };
  instant: boolean;
  name: string;
  prerequisites: string[];
};

function getActivity(slug: string): string {
  const eventsQuery = `*[
    _type == "event" &&
    activity._ref == ^._id &&
    visible == true &&
    ${notDraft}
  ] | order(date asc) {
    _id,
    attendees,
    date
  }`;

  return `*[
    _type == "activity" &&
    slug.current == "${slug}" &&
    ${notDraft}
  ][0] {
    _id,
    description,
    duration,
    "events": ${eventsQuery},
    image,
    instant,
    name,
    prerequisites
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

    const activityData: IActivityWithEvents = {
      id: activity._id,
      description: activity.description,
      duration: activity.duration,
      ...(activity.image && {
        image: {
          url: urlFor(client, activity.image).url(),
          alt: activity.image.alt,
        },
      }),
      events: activity.events.map((event) => {
        return {
          id: event._id,
          date: event.date,
          ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
          isStartable: eventIsStartable(userId, event.date),
        };
      }),
      name: activity.name,
      prerequisites: activity.prerequisites,
      instant: activity.instant,
    };
    return {
      status: 200,
      body: {activity: activityData},
    };
  }

  return {
    status: 404,
  };
};
