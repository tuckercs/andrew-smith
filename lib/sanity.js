import { createClient } from '@sanity/client'
import sanityImage from '@sanity/image-url'

const options = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-12-01',
  token: process.env.SANITY_VIEWER_TOKEN,
}

export const sanityClient = createClient(options)
export const imageBuilder = sanityImage(sanityClient)

export function getSanityClient(
  { auth, useCdn } = {
    useCdn: process.env.NODE_ENV === 'production',
  },
) {
  if (auth?.active && auth?.token) {
    return createClient({
      ...options,
      useCdn: false,
      token: auth.token,
      perspective: 'previewDrafts',
      stega: {
        studioUrl: '/admin',
      },
    })
  } else {
    return createClient({
      ...options,
      useCdn,
      perspective: 'published',
    })
  }
}
