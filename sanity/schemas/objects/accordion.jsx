import React from 'react'
import { defineType, defineField } from 'sanity'
import { RowsPlusBottomIcon, TabsIcon } from '@phosphor-icons/react'
import { customPortableText } from '@s/lib/custom-portable-text'

export default defineType({
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  icon: () => <TabsIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'Accordion Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Accordion Content',
      name: 'content',
      type: 'array',
      of: [
        defineField({
          title: 'Entry',
          name: 'entry',
          type: 'object',
          icon: () => <RowsPlusBottomIcon weight="duotone" />,
          fields: [
            defineField({
              title: 'Title',
              name: 'title',
              type: 'string',
            }),
            defineField({
              title: 'Content',
              name: 'content',
              ...customPortableText({}),
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title = '(missing title)' }) {
              return {
                title,
                media: Tabs,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title = '(missing title)' }) {
      return {
        title,
        media: TabsIcon,
      }
    },
  },
})
