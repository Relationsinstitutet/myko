import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityClientLike, SanityImageSource } from '@sanity/image-url/lib/types/types';
import { api } from '../../../studio/sanity.json';
const { projectId, dataset } = api;

export async function createReadClient() {
  await import('$lib/env'); // populate secret tokens from .env
  return sanityClient({
    projectId,
    dataset,
    token: process.env.SANITY_READ_TOKEN,
    apiVersion: '2021-10-21',
    useCdn: true,
  });
}

export async function createWriteClient() {
  await import('$lib/env'); // populate secret tokens from .env
  return sanityClient({
    projectId,
    dataset,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2021-10-21',
  });
}

export function urlFor(client: SanityClientLike, source: SanityImageSource) {
  const builder = imageUrlBuilder(client);
  return builder.image(source);
}
