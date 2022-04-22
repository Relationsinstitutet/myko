export default {
  name: 'activity',
  type: 'document',
  title: 'Activity',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Activity name'
    },
    {
      name: 'duration',
      type: 'string',
      title: 'Duration'
    },
    {
      name: 'instant',
      type: 'boolean',
      title: 'Instant' // "Gör direkt"
    },
    {
      name: 'prerequisites',
      type: 'array',
      title: 'Prerequisites',
      of: [{type: 'string'}]
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{type: 'block'}]
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          options: {
            isHighlighted: true
          }
        }
      ]
    },
    {
      name: 'slug',
      type: 'slug',
    }
  ],
}
