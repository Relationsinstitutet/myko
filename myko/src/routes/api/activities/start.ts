import type StartedActivityData from '$lib/models/startedActivity';
import { createWriteClient } from '$lib/sanityClient';
import { eventIsStartable, sanitySchemaNames } from '$lib/util';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityClient } from '@sanity/client';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type SanityActivityType = {
  _id: string;
  instant: boolean;
  startedInstructions: PortableTextBlocks;
};

type SanityEventType = {
  date: string;
  activity: {
    _id: string;
    slug: string;
    startedInstructions: PortableTextBlocks;
  };
};

async function createActivityLogEntry(
  writeClient: SanityClient,
  userId: string,
  activityId: string,
  eventId?: string
) {
  const document = {
    _type: sanitySchemaNames.activitylog,
    user: { _type: sanitySchemaNames.reference, _ref: userId },
    activity: { _type: sanitySchemaNames.reference, _ref: activityId },
    ...(eventId && { event: { _type: sanitySchemaNames.reference, _ref: eventId } }),
  };
  console.log(JSON.stringify(document));
  // TODO don't create multiple records if the user tries to start the same event multiple times?
  await writeClient.create(document);
}

async function startEvent(writeClient: SanityClient, userId: string, eventId: string) {
  const eventQuery = `*[_type == "event" && _id == "${eventId}"][0] {
    date,
    activity->{
      _id,
      "slug": slug.current,
      startedInstructions
    }
  }`;
  const event = await writeClient.fetch<SanityEventType>(eventQuery);
  if (!event) {
    return {
      status: 404,
    };
  }

  if (!eventIsStartable(userId, event.date)) {
    return {
      status: 400,
      body: { message: "Event can't be started yet." },
    };
  }

  await createActivityLogEntry(writeClient, userId, event.activity._id, eventId);

  // TODO return zoom link if exists or sound link if exists
  const body: StartedActivityData = {
    instructions: event.activity.startedInstructions,
  };

  return {
    status: 200,
    body,
  };
}

async function startActivity(writeClient: SanityClient, userId: string, activityId: string) {
  const activityQuery = `*[_type == "activity" && _id == "${activityId}"][0] {
    _id,
    instant,
    startedInstructions
  }`;
  const activity = await writeClient.fetch<SanityActivityType>(activityQuery);

  if (!activity) {
    return {
      status: 404,
    };
  }

  if (!activity.instant) {
    return {
      status: 400,
      body: { message: "Activity can't be started." },
    };
  }

  await createActivityLogEntry(writeClient, userId, activity._id);

  // TODO sound link if exists
  const body: StartedActivityData = {
    instructions: activity.startedInstructions,
  };
  return {
    status: 200,
    body,
  };
}

// Start event for user authenticated via Bearer token
export const post: RequestHandler<Record<string, string>, ResponseBody> = async ({
  request,
  locals,
}) => {
  if (!locals.user) {
    return {
      status: 401,
    };
  }

  const userId = locals.user.userId;
  const body = await request.json();
  const client = await createWriteClient();

  if ('eventId' in body) {
    return await startEvent(client, userId, body.eventId);
  } else if ('activityId' in body) {
    return await startActivity(client, userId, body.activityId);
  }

  return {
    status: 400,
    body: { message: "Missing 'eventId' in request." },
  };
};
