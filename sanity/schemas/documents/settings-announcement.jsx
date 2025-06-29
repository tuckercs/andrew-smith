import React from 'react'
import { defineType, defineField } from 'sanity'
import { MegaphoneIcon } from '@phosphor-icons/react'

import { customLink } from '@s/lib/custom-link'

export default defineType({
  title: 'Announcement Bar Settings',
  name: 'announcementSettings',
  type: 'document',
  icon: () => <MegaphoneIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'Enable Announcement Bar?',
      name: 'enabled',
      type: 'boolean',
    }),

    defineField({
      title: 'Message',
      name: 'message',
      type: 'string',
      description: 'Your announcement bar message',
      hidden: ({ parent }) => !parent?.enabled,
    }),

    defineField({
      title: 'Link',
      name: 'link',
      description:
        'The link for clicking the announcement bar. If no link is provided, the announcement bar will not be clickable.',
      hidden: ({ parent }) => !parent?.enabled,
      ...customLink({
        hasDisplayTitle: false,
      }),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Announcement Bar Settings',
      }
    },
  },
})
