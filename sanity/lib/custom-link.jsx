// custom-link.jsx
import { defineField } from 'sanity'
import {
  LinkSimpleHorizontalIcon,
  ArrowSquareOutIcon,
  FilePdfIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from '@phosphor-icons/react'

export const customLink = ({ hasDisplayTitle = true, ...props } = {}) => {
  return {
    type: 'object',
    icon: LinkSimpleHorizontalIcon,
    fields: [
      defineField({
        name: 'type',
        title: 'Link Type',
        type: 'string',
        options: {
          layout: 'radio',
          list: [
            { title: 'Internal', value: 'internal' },
            { title: 'External URL', value: 'external' },
            { title: 'File Download (PDF)', value: 'file' },
            { title: 'Email', value: 'email' },
            { title: 'Phone', value: 'phone' },
          ],
        },
        validation: (Rule) => Rule.required(),
      }),
      ...(hasDisplayTitle
        ? [
            defineField({
              name: 'title',
              title: 'Display Text',
              type: 'string',
            }),
          ]
        : []),
      defineField({
        name: 'internal',
        title: 'Internal Page',
        type: 'reference',
        to: [{ type: 'page' }],
        hidden: ({ parent }) => parent?.type !== 'internal',
      }),
      defineField({
        name: 'hash',
        title: 'Section Scroll Hash',
        type: 'string',
        hidden: ({ parent }) => parent?.type !== 'internal',
      }),
      defineField({
        name: 'url',
        title: 'External URL',
        type: 'url',
        hidden: ({ parent }) => parent?.type !== 'external',
        validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      }),
      defineField({
        name: 'file',
        title: 'PDF File',
        type: 'file',
        options: { accept: 'application/pdf' },
        hidden: ({ parent }) => parent?.type !== 'file',
      }),
      defineField({
        name: 'email',
        title: 'Email Address',
        type: 'string',
        hidden: ({ parent }) => parent?.type !== 'email',
        validation: (Rule) => Rule.email(),
      }),
      defineField({
        name: 'phone',
        title: 'Phone Number',
        type: 'string',
        hidden: ({ parent }) => parent?.type !== 'phone',
      }),
    ],
    preview: {
      select: {
        type: 'type',
        title: 'title',
        internalSlug: 'internal.slug.current',
        url: 'url',
        email: 'email',
        phone: 'phone',
        fileName: 'file.asset.originalFilename',
      },
      prepare({ type, title, internalSlug, url, email, phone, fileName }) {
        const types = {
          internal: {
            subtitle: internalSlug ? `/${internalSlug}` : '(no slug)',
            icon: LinkSimpleHorizontalIcon,
          },
          external: { subtitle: url, icon: ArrowSquareOutIcon },
          email: { subtitle: `mailto:${email}`, icon: EnvelopeSimpleIcon },
          phone: { subtitle: `tel:${phone}`, icon: PhoneIcon },
          file: {
            subtitle: fileName || '(no file selected)',
            icon: FilePdfIcon,
          },
        }
        return {
          title: title || types[type]?.subtitle || '(no title)',
          subtitle: types[type]?.subtitle,
          media: types[type]?.icon,
        }
      },
    },
    ...props,
  }
}
