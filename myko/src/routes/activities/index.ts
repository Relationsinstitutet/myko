import { createReadClient } from '$lib/sanityClient';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function getActivitiesQuery() {
  return /* groq */ `*[
    _type == "activity"
  ] {
    name,
    slug
  }`;
}

// Fetch all activities
export const get: RequestHandler<{}, ResponseBody> = async () => {
  const client = await createReadClient();
  const data = await client.fetch(/* groq */ `{
    "activities": ${getActivitiesQuery()},
  }`);

  if (data) {
    return {
      status: 200,
      body: data,
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
};
