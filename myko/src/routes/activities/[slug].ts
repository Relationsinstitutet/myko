import { createReadClient, eventsForActivityFilter, notDraft, urlFor } from '$lib/sanityClient';
import { eventIsStartable, userIsAttendee } from '$lib/util';
import type { Cotime, IActivityWithCotime } from '$lib/models/activity';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type EventType = {
  _id: string;
  attendees: { _ref: string }[];
  date: string;
};

type SanityResultType = {
  _id: string;
  description: PortableTextBlocks;
  duration: string;
  events: EventType[];
  image?: SanityImageSource & { alt: string };
  instant: boolean;
  name: string;
  prerequisites: string[];
};

function getActivity(slug: string): string {
  const eventsQuery = `*[
    ${eventsForActivityFilter}
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

function computeNextCotime(events: EventType[], userId: string | undefined): Cotime {
  // group all events on the same day as the next upcoming event
  const nextDate = events[0].date.split('T')[0];
  const upcomingEvents = events.filter((event) => event.date.startsWith(nextDate));

  return {
    date: nextDate,
    events: upcomingEvents.map((event) => {
      return {
        id: event._id,
        time: event.date.split('T')[1],
        ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
        isStartable: eventIsStartable(userId, event.date),
      };
    }),
  };
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
      duration: activity.duration,
      ...(activity.image && {
        image: {
          url: urlFor(client, activity.image).url(),
          alt: activity.image.alt,
        },
      }),
      ...(activity.events.length > 0 && { cotime: computeNextCotime(activity.events, userId) }),
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
