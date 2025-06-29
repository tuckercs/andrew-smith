import { defineCliConfig } from 'sanity/cli'
const path = require('path')

export default defineCliConfig({
  api: {
    projectId: 'mpjno11g',
    dataset: 'production',
    useCdn: false,
  },
  vite: {
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        '@branding': path.resolve(__dirname, './sanity/branding'),
        '@desk': path.resolve(__dirname, './sanity/desk'),
        '@s/lib': path.resolve(__dirname, './sanity/lib'),
        '@schemas': path.resolve(__dirname, './sanity/schemas'),
      },
    },
  },
})
