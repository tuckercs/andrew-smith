import React from 'react'

import {
  GearIcon,
  NavigationArrowIcon,
  AnchorSimpleIcon,
  CookieIcon,
  GlobeSimpleIcon,
  ShuffleIcon,
  MegaphoneIcon,
} from '@phosphor-icons/react'

export const settingsMenu = (S) =>
  S.listItem()
    .title('Settings')
    .child(
      S.list()
        .title('Settings')
        .items([
          S.listItem()
            .title('General')
            .child(
              S.editor()
                .id('generalSettings')
                .schemaType('generalSettings')
                .documentId('generalSettings'),
            )
            .icon(() => <GearIcon weight="duotone" />),
          S.listItem()
            .title('Default SEO / Share')
            .child(
              S.editor()
                .id('seoSettings')
                .schemaType('seoSettings')
                .documentId('seoSettings'),
            )
            .icon(() => <GlobeSimpleIcon weight="duotone" />),
          S.divider(),
          S.listItem()
            .title('Header')
            .child(
              S.editor()
                .id('headerSettings')
                .schemaType('headerSettings')
                .documentId('headerSettings'),
            )
            .icon(() => <NavigationArrowIcon weight="duotone" />),
          S.listItem()
            .title('Footer')
            .child(
              S.editor()
                .id('footerSettings')
                .schemaType('footerSettings')
                .documentId('footerSettings'),
            )
            .icon(() => <AnchorSimpleIcon weight="duotone" />),
          S.divider(),
          S.listItem()
            .title('Announcement Bar')
            .child(
              S.editor()
                .id('announcementSettings')
                .schemaType('announcementSettings')
                .documentId('announcementSettings'),
            )
            .icon(() => <MegaphoneIcon weight="duotone" />),
          S.listItem()
            .title('Cookie Consent')
            .child(
              S.editor()
                .id('cookieSettings')
                .schemaType('cookieSettings')
                .documentId('cookieSettings'),
            )
            .icon(() => <CookieIcon weight="duotone" />),
          S.divider(),
          S.listItem()
            .title('Redirects')
            .child(S.documentTypeList('redirect').title('Redirects'))
            .icon(() => <ShuffleIcon weight="duotone" />),
        ]),
    )
    .icon(() => <GearIcon weight="duotone" />)
