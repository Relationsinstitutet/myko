export default {
  name: 'faq',
  type: 'document',
  title: 'Faq',
  fields: [
      {
        name: 'intro',
        type: 'array',
        title: 'Intro',
        of: [{type: 'block'}]
      },
      {
        name: 'detail1',
        type: 'string',
        title: 'Detail'
      },
      {
        name: 'longstory',
        type: 'array',
        title: 'Longer story',
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
  ]
}
