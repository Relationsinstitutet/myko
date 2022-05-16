import { getUserDataFromToken } from '$lib/auth/client';
import type { Handle } from '@sveltejs/kit';

function parseBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring('Bearer '.length);
    return token;
  }

  return null;
}

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
