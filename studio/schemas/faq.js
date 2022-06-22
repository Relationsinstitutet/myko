export default {
  name: 'faq',
  type: 'document',
  title: 'Faq',
  fields: [
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'intro',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              title: 'Question'
            },
            {
              name: 'answer',
              type: 'array',
              title: 'Answer',
              of: [{type: 'block'}]
            }
          ]
        }
      ]
    },
    {
      name: 'descriptionTitle',
      type: 'string',
    },
    {
      name: 'description',
      type: 'array',
      of: [{type: 'block'}]
    },
  ]
}
