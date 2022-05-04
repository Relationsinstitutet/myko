import { client } from '$lib/sanityClient';

/**
 * @param {string} slug
 * @returns string
 */
function getActivity(slug) {
  const eventsQuery = `*[
    _type == "event" &&
    activity._ref == ^._id &&
    published == true] {
      _id,
      date
  }`;

  return /* groq */ `*[
    _type == "activity" &&
    slug.current == "${slug}"
  ][0] {
    description,
    duration,
    "events": ${eventsQuery},
    image,
    instant,
    name,
    prerequisites
  }`;
}

// Fetch activity details
export async function get({ params: { slug } }) {
  const data = await client.fetch(/* groq */ `{
		"activity": ${getActivity(slug)}
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
