import { createReadClient, urlFor } from '$lib/sanityClient';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function getActivity(slug: string): string {
  const eventsQuery = `*[
    _type == "event" &&
    activity._ref == ^._id &&
    visible == true] {
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
export const get: RequestHandler<{ slug: string }, ResponseBody> = async ({ params: { slug } }) => {
  const client = await createReadClient();
  const data = await client.fetch(/* groq */ `{
    "activity": ${getActivity(slug)}
  }`);

  if (data) {
    if (!data.activity) {
      return {
        status: 404,
      };
    }

    if (data.activity.image) {
      const imageUrl = urlFor(client, data.activity.image).url();
      data.activity.image = {
        url: imageUrl,
        alt: data.activity.image.alt,
      };
    }

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
