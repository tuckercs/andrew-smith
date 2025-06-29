import React from 'react'
import { defineType, defineField } from 'sanity'
import { CookieIcon, WarningIcon } from '@phosphor-icons/react'

import { customPortableText } from '@s/lib/custom-portable-text'

import { customBoolean } from '@s/components/custom-boolean'

export default defineType({
  title: 'Cookie Consent Settings',
  name: 'cookieSettings',
  type: 'document',
  icon: () => <CookieIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'Important!',
      description:
        'This displays an "implied consent" cookie notice to users to help comply with GDPR laws. It is strongly encouraged to include a link to your cookie usage and policies.',
      name: 'cookieNote',
      type: 'note',
      options: {
        icon: () => <WarningIcon size={20} weight="duotone" />,
      },
    }),
    defineField({
      title: 'Enable Cookie Consent?',
      name: 'enabled',
      type: 'boolean',
      description: 'Enable the cookie consent notice on site.',
      initialValue: false,
      components: {
        input: customBoolean,
      },
    }),

    defineField({
      ...customPortableText({}),
      title: 'Message',
      name: 'message',
      description: 'Your cookie consent message',
      hidden: ({ parent }) => !parent?.enabled,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Cookie Consent Settings',
      }
    },
  },
})
