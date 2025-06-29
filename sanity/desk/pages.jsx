import React from 'react'
import {
  BrowserIcon,
  HouseIcon,
  PencilCircleIcon,
  MagicWandIcon,
  WarningOctagonIcon,
} from '@phosphor-icons/react'
import { EditIcon, EarthGlobeIcon } from '@sanity/icons'

import { documentReference } from '@desk/document-reference'
import { SeoPreview } from '@desk/views/seo-preview'

export const pagesMenu = (S, context) => {
  return S.listItem()
    .title('Pages')
    .id('pages')
    .child(
      S.list()
        .title('Pages')
        .items([
          documentReference(S, context, {
            title: 'Home Page',
            type: 'page',
            icon: () => <HouseIcon weight="duotone" />,
            link: {
              title: 'General Settings',
              url: 'settings;general',
            },
            query: '*[_type == "generalSettings"][0].home->{_id}',
            views: [
              S.view.form().icon(EditIcon),
              S.view
                .component(SeoPreview)
                .title('SEO / Share Preview')
                .icon(EarthGlobeIcon),
            ],
          }),
          S.listItem()
            .title('Other Pages')
            .schemaType('page')
            .child(
              S.documentTypeList('page')
                .title('Other Pages')
                .filter(
                  `_type == "page" && !(_id in [
                  *[_type == "generalSettings"][0].home._ref,
                  *[_type == "generalSettings"][0].error._ref,
                ])`,
                ),
            ),
          S.divider(),
          documentReference(S, context, {
            title: 'Error Page',
            type: 'page',
            icon: () => <WarningOctagonIcon weight="duotone" />,
            link: {
              title: 'General Settings',
              url: 'settings;general',
            },
            query: '*[_type == "generalSettings"][0].error->{_id}',
            views: [
              S.view.form().icon(EditIcon),
              S.view
                .component(SeoPreview)
                .title('SEO / Share Preview')
                .icon(EarthGlobeIcon),
            ],
          }),
          S.divider(),
          S.listItem()
            .title('Reusable Sections')
            .schemaType('pageSection')
            .child(
              S.documentTypeList('pageSection').title('Reusable Sections'),
            ),
        ]),
    )
    .icon(() => <BrowserIcon weight="duotone" />)
}
