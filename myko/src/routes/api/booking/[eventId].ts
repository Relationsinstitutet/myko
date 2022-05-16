import { createWriteClient } from '$lib/sanityClient';
import type { RequestHandler } from '@sveltejs/kit';
import type { SanityClient } from '@sanity/client';

async function checkIfRegisteredUser(eventId: string, userId: string, writeClient: SanityClient) {
  const event = await writeClient.getDocument(eventId); // TODO what eventId does not exist?
  const listOfAttendees = event?.attendees ?? [];

  return !!listOfAttendees.find((e: { [key: string]: any }) => e['_ref'] == userId);
}

export const get: RequestHandler<{ eventId: string }, {}> = async ({
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
export const post: RequestHandler<{ eventId: string }, {}> = async ({
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
    _type: 'webusers',
    _id: userdata.userId,
    email: userdata.email,
    nickname: userdata.nickname,
  });

  const data = await writeClient
    .patch(eventId)
    .setIfMissing({ attendees: [] })
    .insert('after', 'attendees[-1]', [{ _type: 'webusers', _ref: userdata.userId }])
    .commit({ autoGenerateArrayKeys: true });

  if (data) {
    return {
      status: 200,
      body: {},
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
};

export const del: RequestHandler<{ eventId: string }, {}> = async ({
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
    body: new Error('Internal Server Error'),
  };
};
