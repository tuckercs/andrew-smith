import { EditIcon, EarthGlobeIcon } from '@sanity/icons'

import { pagesMenu } from '@desk/pages'
import { settingsMenu } from '@desk/settings'

import { canCreate, canPreview, singletons } from '../../sanity.config'

import { SeoPreview } from './views/seo-preview'

const hiddenDocTypes = (listItem) =>
  ![
    ...canCreate,
    ...singletons,
    'media.tag', // for media plugin
    'mux.videoAsset', // for mux plugin
  ].includes(listItem.getId())

export const deskStructure = (S, context) =>
  S.list()
    .title('Website')
    .items([
      pagesMenu(S, context),
      S.divider(),
      settingsMenu(S, context),
      S.divider(),
      // Filter out docs already defined above
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])

export const defaultDocumentNode = (S, { schemaType }) => {
  return S.document().views([
    // edit view
    S.view.form().icon(EditIcon),

    // seo/share preview
    ...(canPreview.includes(schemaType)
      ? [
          S.view
            .component(SeoPreview)
            .title('SEO / Share Preview')
            .icon(EarthGlobeIcon),
        ]
      : []),
  ])
}
