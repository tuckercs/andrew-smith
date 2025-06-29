import React from 'react'
import { defineType, defineField } from 'sanity'
import { GearIcon, InfoIcon } from '@phosphor-icons/react'

export default defineType({
  title: 'General Settings',
  name: 'generalSettings',
  type: 'document',
  icon: () => <GearIcon weight="duotone" />,
  groups: [
    { title: 'Site Details', name: 'details', default: true },
    { title: 'Displays', name: 'displays' },
    { title: 'Analytics', name: 'analytics' },
  ],
  fields: [
    defineField({
      title: 'Home Page',
      name: 'home',
      type: 'reference',
      to: [{ type: 'page' }],
      description: 'This page will show at the root of your domain',
      group: 'displays',
    }),
    defineField({
      title: 'Error Page (404)',
      name: 'error',
      type: 'reference',
      to: [{ type: 'page' }],
      description:
        'This page will show for any URL at your domain that does not exist yet',
      group: 'displays',
    }),
    defineField({
      title: 'Site Title',
      name: 'siteTitle',
      type: 'string',
      description: 'The name of your site, usually your company/brand name',
      group: 'details',
    }),
    defineField({
      title: 'Live Site Domain',
      description: 'The production domain or subdomain for your website',
      name: 'liveSiteDomain',
      type: 'url',
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      title: 'Development Site Domain',
      description: 'The development domain or subdomain for your website',
      name: 'devSiteDomain',
      type: 'url',
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),

    defineField({
      title: 'Analytics Note',
      description: (
        <>
          If you have connected your Google Analytics account through Google Tag
          Manager, you can leave the GA ID field blank. Adding both fields will
          result in double tracking.
        </>
      ),
      name: 'analyticsNote',
      type: 'note',
      options: {
        icon: () => <InfoIcon size={20} weight="duotone" />,
      },
      group: 'analytics',
    }),

    defineField({
      title: 'Google Tag Manager (GTM)',
      description: 'To enable GTM enter your Container ID',
      name: 'gtmId',
      type: 'string',
      group: 'analytics',
    }),
    defineField({
      title: 'Google Analytics (GA)',
      description: 'To enable GA enter your Tracking ID',
      name: 'gaId',
      type: 'string',
      group: 'analytics',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'General Settings',
      }
    },
  },
})
