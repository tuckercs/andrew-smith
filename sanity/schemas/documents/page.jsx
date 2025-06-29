import React from 'react'
import { defineType, defineField } from 'sanity'
import { BrowserIcon, WarningIcon } from '@phosphor-icons/react'

import { PathInput } from '@s/lib/path-input'

export async function isUnique(slug) {
  const protectedSlugs = []

  // check if slug is not protected
  return !protectedSlugs.includes(slug)
}

export default defineType({
  title: 'Page',
  name: 'page',
  type: 'document',
  icon: () => <BrowserIcon weight="duotone" />,
  groups: [
    { title: 'Content', name: 'content', default: true },
    { title: 'SEO / Share', name: 'seo-share' },
  ],
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique,
      },
      components: {
        input: PathInput,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      title: 'Content Sections',
      name: 'sections',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'mediaBlock' },
        { type: 'fiftyFifty' },
        {
          title: 'Reusable Section',
          type: 'reference',
          to: [{ type: 'pageSection' }],
          options: {
            disableNew: true,
          },
        },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: 'general',
              title: 'General',
              of: ['textBlock', 'mediaBlock', 'fiftyFifty'],
            },
            {
              name: 'reusable',
              title: 'Reusable',
              of: ['reference'],
            },
          ],
          views: [
            { name: 'list' },
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/preview-${schemaTypeName}.png`,
            },
          ],
        },
      },
      group: 'content',
    }),
    defineField({
      title: 'SEO / Share',
      name: 'seo',
      type: 'seo',
      group: 'seo-share',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
    },
    prepare({ title = '(missing title)', slug = {} }) {
      const path = `/${slug.current}`

      return {
        title,
        subtitle: slug.current ? path : '(missing slug)',
        media: () => <BrowserIcon weight="duotone" />,
      }
    },
  },
})
