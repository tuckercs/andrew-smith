import React from 'react'
import { defineType, defineField } from 'sanity'
import { BroadcastIcon } from '@phosphor-icons/react'

import { getSectionName } from '@s/lib/helpers'

export default defineType({
  title: 'Reusable Section',
  name: 'pageSection',
  type: 'document',
  icon: () => <BroadcastIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'For internal purposes, to help identify your section',
      validation: (Rule) => Rule.required(),
    }),
    {
      title: 'Section',
      name: 'section',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'mediaBlock' },
        { type: 'fiftyFifty' },
        { type: 'portfolio' },
      ],
      validation: (Rule) =>
        Rule.length(1).error('You can only have one item per section'),
    },
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section',
    },
    prepare({ title = '(missing title)', section }) {
      return {
        title,
        subtitle: getSectionName(section?.[0]?._type),
        media: () => <BroadcastIcon weight="duotone" />,
      }
    },
  },
})
