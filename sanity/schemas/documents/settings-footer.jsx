import React from 'react'
import { defineType, defineField } from 'sanity'
import { AnchorSimpleIcon } from '@phosphor-icons/react'

import { customLink } from '@s/lib/custom-link'

export default defineType({
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  icon: () => <AnchorSimpleIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'Primary Footer Links',
      name: 'primaryLinks',
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
        title: 'Footer Settings',
      }
    },
  },
})
