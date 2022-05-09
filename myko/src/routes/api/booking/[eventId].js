import sanityClient from '@sanity/client';
import { createWriteClient } from '$lib/sanityClient';
import _ from '$lib/env';

// Register booking for user authenticated via Bearer token
export async function post({ params: { eventId }, request }) {
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

  const data = await createWriteClient()
    .patch(eventId)
    .setIfMissing({ attendees: [] })
    .insert('after', 'attendees[-1]', [
      { _type: 'webusers', _ref: '069ed43a-9670-4c1e-9abe-a2e0f6bd701f' },
    ])
    .commit({
      autoGenerateArrayKeys: true,
    });

  if (data) {
    console.log(data);
    return {
      status: 200,
      body: data,
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
}
