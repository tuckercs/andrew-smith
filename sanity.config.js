import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'

import { colorInput } from '@sanity/color-input'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from '@schemas/index'

import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'
import { noteField } from 'sanity-plugin-note-field'
import { muxInput } from 'sanity-plugin-mux-input'

import { Logo } from './sanity/branding/logo'
import { deskStructure, defaultDocumentNode } from './sanity/desk'
import { PreviewAction } from './sanity/desk/actions/preview-action'
import saveAction from './sanity/lib/save-action'
import { apiVersion, dataset, projectId } from './sanity/env'

export const canCreate = ['page', 'pageSection', 'redirect', 'video']

export const canPreview = ['page']

export const singletons = [
  'generalSettings',
  'headerSettings',
  'footerSettings',
  'announcementSettings',
  'cookieSettings',
  'seoSettings',
]

export default defineConfig({
  basePath: '/admin',
  name: 'andrew-smith',
  title: 'Andrew Smith',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (defaultActions, { schemaType }) => {
      let newActions = [...defaultActions]

      const publishIndex = defaultActions.findIndex(
        ({ action }) => action === 'publish',
      )
      if (publishIndex !== -1) {
        newActions[publishIndex] = saveAction(defaultActions[publishIndex])
      }

      if (canPreview.includes(schemaType)) {
        newActions.push(PreviewAction)
      }

      return newActions
    },
  },
  plugins: [
    // Structure
    structureTool({
      structure: deskStructure,
      defaultDocumentNode,
    }),
    presentationTool({
      title: 'Preview',
      previewUrl: {
        previewMode: {
          enable: '/api/draft/enable',
          disable: '/api/draft/disable',
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: '/',
            filter: `_type == "page" && slug.current == 'home'`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug`,
          },
        ],
      },
    }),
    muxInput(),
    vercelDeployTool(),

    // Inputs
    codeInput(),
    colorInput(),
    noteField(),
  ],
  studio: {
    components: {
      logo: Logo,
    },
  },
})
