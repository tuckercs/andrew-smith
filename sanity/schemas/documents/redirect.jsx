import React from 'react'
import { defineType, defineField } from 'sanity'
import { ShuffleIcon } from '@phosphor-icons/react'

import { PathInput } from '@s/lib/path-input'

export default defineType({
  title: 'Redirect',
  name: 'redirect',
  type: 'document',
  icon: () => <ShuffleIcon weight="duotone" />,
  fields: [
    defineField({
      title: 'From (path)',
      name: 'from',
      type: 'string',
      components: {
        input: PathInput,
      },
      description: 'Supports wildcards (*). Example: products/*',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'To (path)',
      name: 'to',
      type: 'string',
      components: {
        input: PathInput,
      },
      description: 'Supports wildcards (*). Example: events/*',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Is this a permanent redirect (308)?',
      name: 'isPermanent',
      type: 'boolean',
      description: (
        <>
          Learn about{' '}
          <a
            href="https://vercel.com/guides/does-vercel-support-permanent-redirects"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--card-fg-color)',
              textDecoration: 'underline',
            }}
          >
            redirects on Vercel
          </a>
        </>
      ),
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      to: 'to',
      from: 'from',
      isPermanent: 'isPermanent',
    },
    prepare({ from, to, isPermanent }) {
      return {
        title: from && to ? `/${from} → /${to}` : 'New Redirect',
        subtitle: isPermanent ? '308 (permanent)' : '307 (temporary)',
        media: () => <ShuffleIcon weight="duotone" />,
      }
    },
  },
})
