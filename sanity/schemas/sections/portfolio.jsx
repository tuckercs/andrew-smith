import React from 'react'
import { defineType, defineField } from 'sanity'
import { BriefcaseIcon, InfoIcon } from '@phosphor-icons/react'

import { customPortableText } from '@s/lib/custom-portable-text'
import { customImage } from '@s/lib/custom-image'
import { customBoolean } from '@s/components/custom-boolean'

export default defineType({
  title: 'Portfolio',
  name: 'portfolio',
  type: 'object',
  icon: () => <BriefcaseIcon weight="duotone" />,
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
      title: 'Marquee Title',
      name: 'marqueeTitle',
      type: 'string',
      description: 'Title for the portfolio marquee section',
    }),

    defineField({
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [
        defineField({
          title: 'Image',
          name: 'image',
          ...customImage({
            title: 'Portfolio Image',
            description: 'Image for the portfolio section',
          }),
        }),
      ],
      description: 'Images for the portfolio section',
    }),

    defineField({
      title: 'Bio',
      name: 'bio',
      ...customPortableText({
        title: 'Bio',
        description: 'Biography text for the portfolio section',
      }),
    }),

    defineField({
      title: 'Accordion Items',
      name: 'accordion',
      type: 'array',
      of: [
        defineField({
          title: 'Accordion Item',
          name: 'accordionItem',
          type: 'object',
          fields: [
            defineField({
              title: 'Title',
              name: 'title',
              type: 'string',
              description: 'Title for this accordion item',
            }),
            defineField({
              title: 'Content',
              name: 'content',
              ...customPortableText({
                title: 'Content',
                description: 'Content for this accordion item',
              }),
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title = '(missing title)' }) {
              return {
                title,
                media: BriefcaseIcon,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [
        defineField({
          title: 'Link',
          name: 'link',
          type: 'object',
          fields: [
            defineField({
              title: 'Title',
              name: 'title',
              type: 'string',
              description: 'Title for this link',
            }),
            defineField({
              title: 'Link',
              name: 'link',
              type: 'string',
              description: 'URL or mailto: link for this link',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true
                  if (value.startsWith('mailto:')) return true
                  try {
                    new URL(value)
                    return true
                  } catch {
                    return 'Please enter a valid URL or mailto: link'
                  }
                }),
            }),
            defineField({
              title: 'Color',
              name: 'color',
              type: 'color',
              description: 'Color for this link',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              color: 'color',
            },
            prepare({ title = '(missing title)', color }) {
              return {
                title,
                media: color
                  ? () => (
                      <div
                        style={{
                          backgroundColor: color.hex,
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                        }}
                      />
                    )
                  : BriefcaseIcon,
              }
            },
          },
        }),
      ],
      description: 'Links for the portfolio section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      marqueeTitle: 'marqueeTitle',
      hidden: 'hidden',
    },
    prepare({ title, marqueeTitle, hidden }) {
      return {
        title: `Portfolio: ${title || marqueeTitle} ${hidden ? ' (Hidden)' : ''}`,
        subtitle: 'Portfolio section',
        media: BriefcaseIcon,
      }
    },
  },
})
