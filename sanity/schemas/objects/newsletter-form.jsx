import React from 'react'
import { defineType, defineField } from 'sanity'
import { EnvelopeOpenIcon } from '@phosphor-icons/react'

export default defineType({
  title: 'Newsletter Form',
  name: 'newsletterForm',
  type: 'object',
  icon: () => <EnvelopeOpenIcon />,
  fields: [
    defineField({
      title: 'Customer.io Site ID',
      name: 'cioSiteId',
      type: 'string',
      description: (
        <>
          Use your Tracking API credentials. You can find these under{' '}
          <a
            href="https://fly.customer.io/settings/api_credentials"
            target="_blank"
            style={{
              color: 'var(--card-fg-color)',
              textDecoration: 'underline',
            }}
          >
            Account Settings &gt; API Credentials
          </a>
        </>
      ),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Customer.io API Key',
      name: 'cioApiKey',
      type: 'string',
      description: (
        <>
          Use your Tracking API credentials. You can find these under{' '}
          <a
            href="https://fly.customer.io/settings/api_credentials"
            target="_blank"
            style={{
              color: 'var(--card-fg-color)',
              textDecoration: 'underline',
            }}
          >
            Account Settings &gt; API Credentials
          </a>
        </>
      ),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Text displayed above the form',
    }),

    defineField({
      title: 'Success Message',
      name: 'successMessage',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title = 'Newsletter Form' }) {
      return {
        title,
        media: EnvelopeOpen,
      }
    },
  },
})
