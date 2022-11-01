import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityClientLike, SanityImageSource } from '@sanity/image-url/lib/types/types';
import { api } from '../../../studio/sanity.json';
import { sanitySchemaNames } from './util';
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

export const notDraft = `!(_id in path('drafts.**'))`;

export const eventGracePeriod = '60*60*2.5'; // 2.5 hours
// Get all events for an activity that are active:
//  * not a Sanity draft document,
//  * 'visible'=true,
//  * and with a date not passed by more than specified grace period
export const eventsForActivityFilter = `
  _type == "${sanitySchemaNames.event}" &&
  activity._ref == ^._id &&
  visible == true &&
  ${notDraft} &&
  dateTime(date) > dateTime(now()) - ${eventGracePeriod}
`;

export const attendeesQuery = `
  coalesce(
    attendees[]->{ _id, "displayName": nickname },
    []
  )`;

const eventsQuery = `*[
  ${eventsForActivityFilter}
] | order(date asc) {
    _id,
    "attendees": ${attendeesQuery},
    date,
    "numAttendees": coalesce(count(attendees), 0)
}`;

export const activityWithNearestEventQuery = `*[
    _type == "${sanitySchemaNames.activity}" && ${notDraft}
] {
    name,
    "events": ${eventsQuery},
    "slug": slug.current
  } [count(events) > 0] | order(events[0].date) [0]
`;

export const allFutureEventsQuery = (extraActivityFields: string[] = []) => `*[
    _type == "${sanitySchemaNames.event}" &&
    visible == true &&
    ${notDraft} &&
    dateTime(date) > dateTime(now()) - ${eventGracePeriod}
  ] | order(date asc) {
    _id,
    date,
    activity->{
      name,
      "slug": slug.current
      ${extraActivityFields ? ',' + extraActivityFields.join(',') : ''}
    }
  }`;
