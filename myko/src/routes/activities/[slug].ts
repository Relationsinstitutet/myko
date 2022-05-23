import { createReadClient, urlFor } from '$lib/sanityClient';
import { userIsAttendee } from '$lib/util';
import type { IActivityWithEvents } from '$lib/models/activity';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityResultType = {
  activity: {
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
};

function getActivity(slug: string): string {
  const eventsQuery = `*[
    _type == "event" &&
    activity._ref == ^._id &&
    visible == true] {
      _id,
      attendees,
      date
  }`;

  return /* groq */ `*[
    _type == "activity" &&
    slug.current == "${slug}"
  ][0] {
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
  const data: SanityResultType = await client.fetch(/* groq */ `{
    "activity": ${getActivity(slug)}
  }`);

  if (data) {
    if (!data.activity) {
      return {
        status: 404,
      };
    }

    let userId: string | undefined;
    if (locals.user) {
      // grab user id from token to return booking status for specific user
      userId = locals.user.userId;
    }

    const activity: IActivityWithEvents = {
      description: data.activity.description,
      duration: data.activity.duration,
      ...(data.activity.image && {
        image: {
          url: urlFor(client, data.activity.image).url(),
          alt: data.activity.image.alt,
        },
      }),
      events: data.activity.events.map((event) => {
        return {
          id: event._id,
          date: event.date,
          ...(userId && { userIsAttending: userIsAttendee(userId, event.attendees) }),
        };
      }),
      name: data.activity.name,
      prerequisites: data.activity.prerequisites,
    };
    return {
      status: 200,
      body: { activity },
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
};
