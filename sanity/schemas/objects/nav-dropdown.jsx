import React from 'react'
import { defineType, defineField } from 'sanity'
import { ArrowBendRightDownIcon, InfoIcon } from '@phosphor-icons/react'

import { customLink } from '@s/lib/custom-link'

export default defineType({
  title: 'Dropdown',
  name: 'navDropdown',
  type: 'object',
  icon: () => <ArrowBendRightDownIcon />,
  fields: [
    defineField({
      description: (
        <>
          <strong>Note:</strong> Dropdowns will only appear when used in header
          navigation menus
        </>
      ),
      name: 'dropdownNote',
      type: 'note',
      options: {
        icon: () => <InfoIcon size={20} weight="duotone" />,
      },
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Dropdown button text',
    }),
    defineField({
      title: 'Links',
      name: 'links',
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
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({ title = '(missing title)', links = [] }) {
      return {
        title,
        subtitle: `${links.length} link(s)`,
        media: ArrowBendRightDownIcon,
      }
    },
  },
})
