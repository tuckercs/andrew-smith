import React from 'react'
import { defineType, defineField } from 'sanity'
import { NavigationArrowIcon } from '@phosphor-icons/react'

import { customLink } from '@s/lib/custom-link'

export default defineType({
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  icon: () => <NavigationArrowIcon weight="duotone" />,
  groups: [
    { title: 'Desktop', name: 'desktop', default: true },
    { title: 'Mobile', name: 'mobile' },
  ],
  fields: [
    defineField({
      title: 'Exposed Header Links',
      name: 'exposedLinks',
      type: 'array',
      of: [
        defineField({
          ...customLink({}),
          title: 'Link',
          name: 'link',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
})
