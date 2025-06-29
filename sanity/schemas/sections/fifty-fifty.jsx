import React from 'react'
import { defineType, defineField } from 'sanity'
import { SquareSplitHorizontalIcon } from '@phosphor-icons/react'

import { customPortableText } from '@s/lib/custom-portable-text'
import { customImage } from '@s/lib/custom-image'
import { customBoolean } from '@s/components/custom-boolean'

export default defineType({
  title: 'Fifty Fifty',
  name: 'fiftyFifty',
  type: 'object',
  icon: () => <SquareSplitHorizontalIcon weight="duotone" />,
  fieldsets: [
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      fieldset: 'settings',
      description:
        'For internal organization and anchor links where applicable.',
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden?',
      type: 'boolean',
      description: 'Hide this section from the public site.',
      initialValue: false,
      fieldset: 'settings',
      components: {
        input: customBoolean,
      },
    }),

    defineField({
      title: 'Left Column',
      name: 'leftColumn',
      type: 'object',
      fields: [
        defineField({
          title: 'Column Content Type',
          name: 'columnContentType',
          type: 'string',
          options: {
            layout: 'radio',
            list: [
              { title: 'Text', value: 'text' },
              { title: 'Image', value: 'image' },
              { title: 'Accordion', value: 'accordion' },
            ],
          },
        }),

        defineField({
          title: 'Text Block',
          name: 'textBlock',
          hidden: ({ parent }) => parent?.columnContentType !== 'text',
          ...customPortableText({}),
        }),

        defineField({
          title: 'Image',
          name: 'image',
          hidden: ({ parent }) => parent?.columnContentType !== 'image',
          ...customImage({}),
        }),

        defineField({
          title: 'Accordion',
          name: 'accordion',
          type: 'accordion',
          hidden: ({ parent }) => parent?.columnContentType !== 'accordion',
        }),
      ],
    }),

    defineField({
      title: 'Right Column',
      name: 'rightColumn',
      type: 'object',
      fields: [
        defineField({
          title: 'Column Content Type',
          name: 'columnContentType',
          type: 'string',
          options: {
            layout: 'radio',
            list: [
              { title: 'Text', value: 'text' },
              { title: 'Image', value: 'image' },
              { title: 'Accordion', value: 'accordion' },
            ],
          },
        }),

        defineField({
          title: 'Text Block',
          name: 'textBlock',
          hidden: ({ parent }) => parent?.columnContentType !== 'text',
          ...customPortableText({}),
        }),

        defineField({
          title: 'Image',
          name: 'image',
          hidden: ({ parent }) => parent?.columnContentType !== 'image',
          ...customImage({}),
        }),

        defineField({
          title: 'Accordion',
          name: 'accordion',
          type: 'accordion',
          hidden: ({ parent }) => parent?.columnContentType !== 'accordion',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      hidden: 'hidden',
      leftColumn: 'leftColumn.columnContentType',
      rightColumn: 'rightColumn.columnContentType',
      leftImage: 'leftColumn.image.asset',
      rightImage: 'rightColumn.image.asset',
    },
    prepare({ title, hidden, leftColumn, rightColumn, leftImage, rightImage }) {
      return {
        title: `Fifty Fifty: ${title} ${hidden ? ' (Hidden)' : ''}`,
        subtitle: `Left: ${leftColumn} | Right: ${rightColumn}`,
        media: leftImage || rightImage || SquareSplitIcon,
      }
    },
  },
})
