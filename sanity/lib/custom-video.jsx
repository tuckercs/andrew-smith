import React from 'react'
import { defineField } from 'sanity'
import { VideoIcon } from '@phosphor-icons/react'

import { customImage } from '@s/lib/custom-image'

import { customBoolean } from '@s/components/custom-boolean'

export const customVideo = ({
  hasControls = true,
  fields = [],
  ...props
} = {}) => {
  return {
    type: 'object',
    icon: () => <VideoIcon weight="duotone" />,
    fieldsets: [
      { title: 'Settings', name: 'settings', options: { columns: 1 } },
    ],
    fields: [
      defineField({
        title: 'Video File',
        name: 'video',
        type: 'mux.video',
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const isRequired = context?.parent?.type === 'video'
            if (isRequired && !value) return 'Video file is required'
            return true
          }),
      }),
      defineField({
        name: 'poster',
        title: 'Poster',
        description: '(optional)',
        ...customImage({ hasSize: false }),
      }),
      ...(hasControls
        ? [
            defineField({
              title: 'Show play/pause controls?',
              name: 'showControls',
              type: 'boolean',
              fieldset: 'settings',
              description: 'Note: If disabled, video will autoplay',
              initialValue: true,
              validation: (Rule) => Rule.required(),
              components: {
                input: customBoolean,
              },
            }),
            defineField({
              title: 'Autoplay?',
              name: 'autoplay',
              type: 'boolean',
              fieldset: 'settings',
              hidden: ({ parent }) => !parent?.showControls,
              description: 'Note: Autoplay is disabled on mobile devices',
              initialValue: false,
              components: {
                input: customBoolean,
              },
            }),
          ]
        : []),
      ...fields,
    ],
    ...props,
  }
}
