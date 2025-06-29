import React from 'react'
import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@phosphor-icons/react'

import { generateGraphic } from '@s/lib/helpers'

const crops = [
  { title: 'Original', value: 0 },
  { title: '1 : 1 (square)', value: 1 },
  { title: '5 : 7 (portrait)', value: 0.7142857143 },
  { title: '16 : 9 (landscape)', value: 1.7777777778 },
  { title: '5 : 4 (standard)', value: 1.25 },
]

export const customImage = ({ hasSize = true, fields, ...props } = {}) => {
  return {
    type: 'image',
    options: { hotspot: true },
    icon: () => <ImageIcon weight="duotone" />,
    fields: [
      ...(hasSize
        ? [
            defineField({
              title: 'Display Size (aspect ratio)',
              name: 'customRatio',
              type: 'number',
              options: { list: crops },
              initialValue: 0,
              hidden: ({ parent }) => {
                const isSvg = parent?.asset?._ref?.endsWith('-svg')
                return !parent?.asset || isSvg
              },
              validation: (Rule) =>
                Rule.custom((field, context) => {
                  const isVisible = context?.parent?.type === 'image'
                  const hasAsset = context?.parent?.asset
                  const isSvg = hasAsset?._ref?.endsWith('-svg')

                  if (!isVisible || !hasAsset || isSvg) return true
                  if (field === undefined) return 'Display size is required'
                  return true
                }),
            }),
          ]
        : []),
      ...(fields || []),
      defineField({
        title: 'Alternative text (this instance only)',
        name: 'alt',
        type: 'string',
        description: 'Recommended for SEO and accessibility',
        hidden: ({ parent }) => !parent?.asset,
        validation: (Rule) => Rule.warning('Add alt text for accessibility'),
      }),
    ],
    preview: {
      select: {
        asset: 'asset',
        alt: 'asset.altText',
        customAlt: 'alt',
        customRatio: 'customRatio',
        caption: 'caption',
      },
      prepare(photo) {
        const { alt, customAlt, customRatio, caption } = photo
        const crop = crops.find((crop) => crop.value === customRatio)
        return {
          title: customAlt ?? alt ?? '(alt text missing)',
          subtitle: hasSize ? `Display Size – ${crop?.title}` : caption,
          media: generateGraphic({
            graphic: {
              _type: 'photo',
              ...photo,
            },
            icon: ImageIcon,
          }),
        }
      },
    },
    ...props,
  }
}
