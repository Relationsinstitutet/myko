import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: 'activity',
  type: 'document',
  title: 'Activity',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Activity name',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      validation: Rule => Rule.required()
    },
    {
      name: 'listable',
      type: 'boolean',
      initialValue: true,
      description: 'Whether the activity should be listed among all activities automatically'
    },
    {
      name: 'durationMinutes',
      type: 'number',
      title: 'Duration (minutes)'
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
      of: [{type: 'block'}],
      validation: Rule => Rule.required()
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
      name: 'startedInstructions',
      type: 'array',
      title: 'Started instructions',
      description: 'shown after the user has started the activity',
      of: [{type: 'block'}]
    },
    {
      name: 'audioFile',
      type: 'file',
      title: 'Audio file',
      options: {
        accept: 'audio/*'
      }
    },
    {
      name: 'videoFile',
      type: 'file',
      title: 'Video file',
      options: {
        accept: 'video/*'
      }
    },
    {
      name: 'subactivities',
      type: 'array',
      title: 'Subactivities',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'activity'},
          ]
        }
      ]
    },
    {
      name: 'visualisationTags',
      title: 'Visualisation tags',
      type: 'tags',
      options: {
        includeFromRelated: 'visualisationTags'
      }
    },
    orderRankField({ type: 'activity', hidden: false }),
  ],
}
