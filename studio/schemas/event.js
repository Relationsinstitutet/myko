import React from 'react'
import moment from 'moment';

export default {
  name: 'event',
  type: 'document',
  title: 'Event',
  fields: [
    {
      name: 'activity',
      type: 'reference',
      to: [{type: 'activity'}]
    },
    {
      name: 'date',
      type: 'datetime',
      title: 'Date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      }
    },
    {
      name: 'published',
      type: 'boolean',
      title: 'Published'
    },
    {
        name: 'attendees',
        type: 'array',
        title: 'Attendees',
        of: [{type: 'webusers'}],
    }
  ],
  preview: {
    select: {
      title: 'activity.name',
      published: 'published',
      date: 'date',
    },
    prepare({ title, date, published }) {
      return {
        title: title,
        subtitle: moment(date).format('YYYY-MM-DD hh:mm:ss'),
        media: <span style={{fontSize: '1.5rem'}}>{published ? '✅' : '🚧'}</span>
      }
    }
  }
}
