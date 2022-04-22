import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { api } from '../../../studio/sanity.json';
const { projectId, dataset } = api;

export const client = sanityClient({
  projectId,
  dataset,
  apiVersion: '2021-10-21',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
/**
 *
 * @param {import('@sanity/image-url/lib/types/types').SanityImageSource} source
 * @returns
 */
export function urlFor(source) {
  return builder.image(source);
}
