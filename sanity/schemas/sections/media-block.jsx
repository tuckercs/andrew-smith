import React from 'react'
import { defineType, defineField } from 'sanity'
import { ImagesIcon, ImageIcon, FilmStripIcon } from '@phosphor-icons/react'

import { customMedia } from '@s/lib/custom-media'
import { customPortableText } from '@s/lib/custom-portable-text'

import { customBoolean } from '@s/components/custom-boolean'

export default defineType({
  name: 'mediaBlock',
  title: 'Media Block',
  type: 'object',
  icon: () => <ImagesIcon weight="duotone" />,
  fieldsets: [
    {
      title: 'Settings',
      name: 'settings',
      options: { columns: 1 },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'isHero',
      title: 'Hero Section?',
      type: 'boolean',
      description: 'Use this media block as a full-width hero section',
      initialValue: false,
      fieldset: 'settings',
      components: {
        input: customBoolean,
      },
    }),
    defineField({
      name: 'hasOverlayText',
      title: 'Add Overlay Text?',
      description:
        'Add text overlay to the media block. Will not be added to carousel sections.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'settings',
      components: {
        input: customBoolean,
      },
    }),
    defineField({
      ...customMedia({
        name: 'media',
        title: 'Media',
      }),
    }),

    defineField({
      name: 'overlayText',
      title: 'Overlay Text',
      ...customPortableText({}),
      hidden: ({ parent }) => !parent?.hasOverlayText,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'media',
      isHero: 'isHero',
      hasOverlayText: 'hasOverlayText',
      hidden: 'hidden',
    },
    prepare({ title, media = {}, isHero, hasOverlayText, hidden }) {
      const mediaType = media.type || 'unset'

      const subtitleParts = [
        isHero ? 'Hero Layout' : 'Page Layout',
        hasOverlayText ? 'Has Overlay Text' : 'No Overlay Text',
      ]

      let previewMedia = () => <ImagesIcon weight="duotone" />

      if (mediaType === 'image' && media.image?.asset) {
        previewMedia = media.image.asset
      } else if (mediaType === 'carousel' && media.carousel?.[0]?.asset) {
        previewMedia = media.carousel[0].asset
      } else if (mediaType === 'video' && media.video?.poster?.asset) {
        previewMedia = media.video.poster.asset
      }

      return {
        title: `Media Block (${title || mediaType}) ${hidden ? ' (Hidden)' : ''}`,
        subtitle: subtitleParts.join(' · '),
        media: previewMedia,
      }
    },
  },
})
