import { allFutureEventsQuery, createReadClient } from '$lib/sanityClient';
import ical from 'ical-generator';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

type Event = {
  readonly _id: string;
  readonly date: string;
  readonly activity: {
    readonly name: string;
    readonly slug: string;
    readonly durationMinutes: number;
  };
};

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const result = await client.fetch<Event[]>(allFutureEventsQuery(['durationMinutes']));

  const calendar = ical({
    name: 'Myko',
    description: 'Samtider',
    ttl: 60 * 60 * 24,
  });
  result.map((event) => {
    const startTime = new Date(Date.parse(event.date));
    const endTime = new Date(startTime.getTime() + event.activity.durationMinutes * 60 * 1000);
    calendar.createEvent({
      id: event._id,
      start: startTime,
      end: endTime,
      summary: event.activity.name,
      url: `https://myko.relationsinstitutet.org/aktiviteter/${event.activity.slug}`,
    });
  });

  return {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar',
    },
    body: calendar.toString(),
  };
};
