import React from 'react'
import { defineType, defineField } from 'sanity'
import { TextAaIcon, InfoIcon, WarningIcon } from '@phosphor-icons/react'

import { customPortableText } from '@s/lib/custom-portable-text'
import { customBoolean } from '@s/components/custom-boolean'

export default defineType({
  title: 'Text Block',
  name: 'textBlock',
  type: 'object',
  icon: () => <TextAaIcon weight="duotone" />,
  fieldsets: [
    {
      name: 'settings',
      title: 'Settings',
    },
    {
      name: 'mobileGrid',
      title: 'Mobile Grid',
      options: {
        columns: 2,
      },
    },
    {
      name: 'desktopGrid',
      title: 'Desktop Grid',
      options: {
        columns: 2,
      },
    },
  ],
  fields: [
    defineField({
      title: 'Important!',
      description:
        'This site is built on a 12-column grid (6 on mobile). Please set the column start and span accordingly to match intended layout.',
      name: 'textBlockNote',
      type: 'note',
      options: {
        icon: () => <InfoIcon size={20} weight="duotone" />,
      },
    }),

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
      title: 'Column Start (Mobile)',
      name: 'columnStartMobile',
      type: 'string',
      fieldset: 'mobileGrid',
      options: {
        list: ['1', '2', '3', '4', '5', '6'],
        layout: 'dropdown',
      },
    }),
    defineField({
      title: 'Column Span (Mobile)',
      name: 'columnSpanMobile',
      type: 'string',
      fieldset: 'mobileGrid',
      options: {
        list: ['1', '2', '3', '4', '5', '6'],
        layout: 'dropdown',
      },
    }),
    defineField({
      title: 'Column Start (Desktop)',
      name: 'columnStartDesktop',
      type: 'string',
      fieldset: 'desktopGrid',
      options: {
        list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        layout: 'dropdown',
      },
    }),
    defineField({
      title: 'Column Span (Desktop)',
      name: 'columnSpanDesktop',
      type: 'string',
      fieldset: 'desktopGrid',
      options: {
        list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        layout: 'dropdown',
      },
    }),

    customPortableText({
      title: 'Text Block',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      mobileStart: 'columnStartMobile',
      mobileSpan: 'columnSpanMobile',
      desktopStart: 'columnStartDesktop',
      desktopSpan: 'columnSpanDesktop',
      hidden: 'hidden',
    },
    prepare({
      title,
      mobileStart,
      mobileSpan,
      desktopStart,
      desktopSpan,
      hidden,
    }) {
      return {
        title: `Text Block: ${title} ${hidden ? ' (Hidden)' : ''}`,
        subtitle: `Mobile: ${mobileStart}/${mobileSpan} | Desktop: ${desktopStart}/${desktopSpan}`,
        media: TextAaIcon,
      }
    },
  },
})
