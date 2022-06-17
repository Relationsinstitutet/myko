export default {
  name: 'faq',
  type: 'document',
  title: 'FAQ',
  fields: [
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
  ],
}
