import groq from 'groq'
import axios from 'axios'

import { getSanityClient } from '@lib/sanity'
import * as queries from './queries'
import * as atoms from './atoms'

// SWR Fetcher
export const fetcher = (url, args) =>
  axios.get(url, args).then((res) => res.data)

// Fetch all dynamic docs
export async function getAllDocSlugs({ filter, fields = null, auth = {} }) {
  const data = await getSanityClient({ auth }).fetch(
    groq`*[${filter}]{ _id, "slug": slug.current, ${fields ?? ''} }`,
  )

  return data
}

// fetch a specific page's section types
export async function getSections(filter, auth) {
  const query = groq`
    *[${filter}] | order(_updatedAt desc)[0].sections[]{
      "type": select(_type == 'reference' => @->._type, _type),
      "isReference": _type == 'reference'
    }
  `

  const sections = await getSanityClient({ auth }).fetch(query)

  const uniqueModules = sections?.filter((value, index, self) => {
    return (
      self.findIndex(
        (v) => v.type === value.type && v.isReference === value.isReference,
      ) === index
    )
  })

  return uniqueModules
}

// Fetch a specific dynamic page with our global data
export async function getPage({ filter, fields = null, auth, useCdn }) {
  // fetch page section types first to inform our main query
  const sectionData = await getSections(filter, auth)
  const hasReferences = sectionData?.some((section) => section.isReference)

  const query = groq`
    {
      "page": *[${filter}] | order(_updatedAt desc)[0]{
        _type,
        "id": _id,
        "slug": select(
          _id == ${queries.homeId} => null,
          slug.current
        ),
        title,
        seo,
        sections[]{
          ${
            hasReferences
              ? `defined(_ref) => { ...@-> {
              ${queries.pageSections.global},
              ${sectionData
                ?.filter((section) => section.isReference)
                .map(({ type }) => queries.pageSections[type])
                .join(',')}
            }},`
              : ''
          }
          !defined(_ref) => {
            ${queries.pageSections.global},
            ${sectionData
              ?.filter((section) => !section.isReference)
              .map(({ type }) => queries.pageSections[type])
              .join(',')}
          }
        },
        ${fields ?? ''}
      },
      ${queries.site}
    }
  `

  const pageData = await getSanityClient({ auth, useCdn }).fetch(query)

  return pageData
}

export async function getSite({ auth }) {
  const siteData = await getSanityClient({ auth }).fetch(
    groq`{${queries.site}}`,
  )

  return siteData
}

export { queries, atoms }
