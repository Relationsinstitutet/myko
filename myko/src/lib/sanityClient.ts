import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { api } from '../../../studio/sanity.json';
const { projectId, dataset } = api;

export const client = sanityClient({
  projectId,
  dataset,
  apiVersion: '2021-10-21',
  useCdn: true,
});

export function createWriteClient() {
  return sanityClient({
    projectId,
    dataset,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2021-10-21',
  });
}

const builder = imageUrlBuilder(client);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
