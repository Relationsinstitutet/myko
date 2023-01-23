import type StartedActivityData from '$lib/models/startedActivity';
import { createWriteClient } from '$lib/sanityClient';
import { eventIsStartable, sanitySchemaNames } from '$lib/util';
import type { PortableTextBlocks } from '@portabletext/svelte/ptTypes';
import type { SanityClient } from '@sanity/client';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type ActivityBaseInfo = {
  _id: string;
  startedInstructions: PortableTextBlocks;
  allowsAnonymous: boolean;
  audioFile: string;
  videoFile: string;
};

type SanityActivityType = ActivityBaseInfo & {
  instant: boolean;
};

type SanityEventType = {
  date: string;
  videoconferencing: string;
  activity: ActivityBaseInfo;
};
const startedActivityProjection = `
  _id,
  startedInstructions,
  allowsAnonymous,
  "audioFile": audioFile.asset->url,
  "videoFile": videoFile.asset->url
`;

async function createActivityLogEntry(
  writeClient: SanityClient,
  userId: string | null,
  activityId: string,
  eventId?: string
) {
  const document = {
    _type: sanitySchemaNames.activitylog,
    ...(userId && { user: { _type: sanitySchemaNames.reference, _ref: userId } }),
    activity: { _type: sanitySchemaNames.reference, _ref: activityId },
    ...(eventId && { event: { _type: sanitySchemaNames.reference, _ref: eventId } }),
  };
  // TODO don't create multiple records if the user tries to start the same event multiple times?
  await writeClient.create(document);
}

async function startEvent(writeClient: SanityClient, userId: string | null, eventId: string) {
  const eventQuery = `*[
    _type == "${sanitySchemaNames.event}" && _id == "${eventId}"
  ][0] {
    date,
    videoconferencing,
    activity->{
      ${startedActivityProjection}
    }
  }`;
  const event = await writeClient.fetch<SanityEventType>(eventQuery);
  if (!event) {
    return {
      status: 404,
    };
  }

  if (!event.activity.allowsAnonymous && !userId) {
    // don't allow anonymous user
    return {
      status: 401,
    };
  }

  if (!eventIsStartable(event.date)) {
    return {
      status: 400,
      body: { message: "Event can't be started yet." },
    };
  }

  await createActivityLogEntry(writeClient, userId, event.activity._id, eventId);

  const body: StartedActivityData = {
    instructions: event.activity.startedInstructions,
    ...(event.activity.audioFile && { audioFile: event.activity.audioFile }),
    ...(event.activity.videoFile && { videoFile: event.activity.videoFile }),
    ...(event.videoconferencing && { videoConferencingLink: event.videoconferencing }),
  };

  return {
    status: 200,
    body,
  };
}

async function startActivity(writeClient: SanityClient, userId: string | null, activityId: string) {
  const activityQuery = `*[
    _type == "${sanitySchemaNames.activity}" && _id == "${activityId}"
  ][0] {
    instant,
    ${startedActivityProjection}
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

  const body: StartedActivityData = {
    instructions: activity.startedInstructions,
    ...(activity.audioFile && { audioFile: activity.audioFile }),
    ...(activity.videoFile && { videoFile: activity.videoFile }),
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
  const body = await request.json();
  const client = await createWriteClient();

  const userId = locals.user?.userId ?? null;
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
