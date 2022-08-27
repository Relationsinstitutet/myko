import { createWriteClient } from '$lib/sanityClient';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';
import type { SanityClient } from '@sanity/client';
import { sanitySchemaNames } from '$lib/util';

async function checkIfRegisteredUser(eventId: string, userId: string, writeClient: SanityClient) {
  const event = await writeClient.getDocument(eventId); // TODO what eventId does not exist?
  const listOfAttendees = event?.attendees ?? [];

  return !!listOfAttendees.find((e: Record<string, unknown>) => e['_ref'] === userId);
}

export const get: RequestHandler<{ eventId: string }, ResponseBody> = async ({
  params: { eventId },
  locals,
}) => {
  const userdata = locals.user;
  if (!userdata) {
    return {
      status: 401,
    };
  }

  const writeClient = await createWriteClient();
  const registered = await checkIfRegisteredUser(eventId, userdata.userId, writeClient);
  return {
    status: 200,
    body: { registered },
  };
};

// Register booking for user authenticated via Bearer token
export const post: RequestHandler<{ eventId: string }, ResponseBody> = async ({
  params: { eventId },
  locals,
}) => {
  console.log(`eventId: ${eventId}`);

  const userdata = locals.user;
  if (!userdata) {
    return {
      status: 401,
    };
  }

  const writeClient = await createWriteClient();

  if (await checkIfRegisteredUser(eventId, userdata.userId, writeClient)) {
    console.log('Already registered - doing nothing');
    return {
      status: 200,
      body: {},
    };
  }

  await writeClient.createOrReplace({
    _type: sanitySchemaNames.webuser,
    _id: userdata.userId,
    email: userdata.email,
    nickname: userdata.nickname,
  });

  const data = await writeClient
    .patch(eventId)
    .setIfMissing({ attendees: [] })
    .insert('after', 'attendees[-1]', [{ _type: sanitySchemaNames.webuser, _ref: userdata.userId }])
    .commit({ autoGenerateArrayKeys: true });

  if (data) {
    return {
      status: 200,
      body: {},
    };
  }

  return {
    status: 500,
    body: 'Internal Server Error',
  };
};

export const del: RequestHandler<{ eventId: string }, ResponseBody> = async ({
  params: { eventId },
  locals,
}) => {
  const userdata = locals.user;
  if (!userdata) {
    return {
      status: 401,
    };
  }

  const writeClient = await createWriteClient();
  const attendeeToRemove = [`attendees[_ref=="${userdata.userId}"]`];
  const data = await writeClient
    .patch(eventId)
    .unset(attendeeToRemove)
    .commit({ autoGenerateArrayKeys: true });

  if (data) {
    return {
      status: 200,
      body: {},
    };
  }

  return {
    status: 500,
    body: 'Internal Server Error',
  };
};
