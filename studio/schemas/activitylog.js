export default {
  name: 'activitylog',
  type: 'document',
  title: 'Activity log',
  readOnly: true,
  fields: [
    {
      name: 'user',
      type: 'reference',
      to: [{type: 'webuser'}],
      title: 'User'
    },
    {
      name: 'activity',
      type: 'reference',
      to: [{type: 'activity'}],
      title: 'Activity'
    },
    {
      name: 'event',
      type: 'reference',
      to: [{type: 'event'}],
      title: 'Event'
    },
  ],
  preview: {
    select: {
        title: 'user.email',
        subtitle: '_createdAt'
    }
  }
}
