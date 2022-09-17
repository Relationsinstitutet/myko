import { getUserDataFromToken } from '$lib/auth/client';
import parseBearerToken from '$lib/auth/util';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = parseBearerToken(event.request.headers.get('Authorization'));
  if (token) {
    const userdata = await getUserDataFromToken(token);
    if (userdata) {
      event.locals.user = userdata;
    }
  }

  const response = await resolve(event);
  return response;
};
