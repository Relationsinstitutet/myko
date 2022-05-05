import sanityClient from '@sanity/client';
import { api } from '../../../../../studio/sanity.json';
import _ from '$lib/env.js';
const { projectId, dataset } = api;

export const writeClient = sanityClient({
  projectId,
  dataset,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2021-10-21',
});

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
  // here will sanity patch thing happen

  const data = await writeClient.patch();

  // const data = {};
  if (data) {
    // console.log(data);
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
