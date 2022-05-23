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
      name: 'videoconferencing',
      type: 'url',
      title: 'Video conference link',
      description: 'e.g. Zoom meeting link'
    },
    {
      name: 'visible',
      type: 'boolean',
      title: 'Visible'
    },
    {
        name: 'attendees',
        type: 'array',
        title: 'Attendees',
        of: [{type: 'webuser'}],
        readOnly: true
    }
  ],
  preview: {
    select: {
      title: 'activity.name',
      visible: 'visible',
      date: 'date',
    },
    prepare({ title, date, visible }) {
      return {
        title: title,
        subtitle: moment(date).format('YYYY-MM-DD hh:mm:ss'),
        media: <span style={{fontSize: '1.5rem'}}>{visible ? '✅' : '🚧'}</span>
      }
    }
  }
}
