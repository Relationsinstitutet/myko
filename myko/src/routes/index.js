import { client } from '$lib/sanityClient';

function getActivitiesQuery() {
  return /* groq */ `*[
    _type == "activity"
  ] {
    name,
    slug
  }`;
}

// Fetch all activities
export async function get() {
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
}
