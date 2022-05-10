import { createWriteClient } from '$lib/sanityClient';
import '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';
import type { SanityClient } from '@sanity/client';

async function checkIfRegisteredUser(eventId: string, userId: string, writeClient: SanityClient) {
  const event = await writeClient.getDocument(eventId); // TODO what eventId does not exist?
  console.log(event);
  const listOfAttendees = event?.attendees ?? [];
  console.log(`List of attendees: ${JSON.stringify(listOfAttendees)}`);

  return !!listOfAttendees.find((e: { [key: string]: any }) => e['_ref'] == userId);
}

export const get: RequestHandler<{ eventId: string }, {}> = async ({
  params: { eventId },
  request,
}) => {
  const userId = '069ed43a-9670-4c1e-9abe-a2e0f6bd701f';
  const writeClient = createWriteClient();
  const registered = await checkIfRegisteredUser(eventId, userId, writeClient);
  return {
    status: 200,
    body: { registered },
  };
};

// Register booking for user authenticated via Bearer token
export const post: RequestHandler<{ eventId: string }, {}> = async ({
  params: { eventId },
  request,
}) => {
  // const auth = request.headers.get('Authorization');
  //
  // // TODO can the userid be extracted directly from the access token?
  // const userinfoResponse = await fetch('https://relationsinstitutet.eu.auth0.com/userinfo', {
  //   headers: {
  //     Authorization: auth,
  //   },
  // });
  // const userinfo = await userinfoResponse.json();
  // console.log(userinfo.sub);
  console.log(`eventId: ${eventId}`);

  // TODO add user with id from `userinfo.sub` to event with id `eventId` in Sanity

  const writeClient = await createWriteClient();
  const userId = '069ed43a-9670-4c1e-9abe-a2e0f6bd701f';

  if (await checkIfRegisteredUser(eventId, userId, writeClient)) {
    console.log('Already registered - doing nothing');

    const data = await writeClient
      .patch(eventId)
      // .setIfMissing({ attendees: [] })
      .unset(['attendees'])
      .commit({
        autoGenerateArrayKeys: true,
        visibility: 'sync',
      });

    if (data) {
      console.log('This is what came back after probable unset:');
      console.log(data);

      return {
        status: 200,
        body: {},
      };
    }
  }

  console.log('Registering user on event');

  const data = await writeClient
    .patch(eventId)
    .setIfMissing({ attendees: [] })
    .insert('after', 'attendees[-1]', [{ _type: 'webusers', _ref: userId }])
    .commit({
      autoGenerateArrayKeys: true,
      visibility: 'sync',
    });

  if (data) {
    console.log(data);
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
