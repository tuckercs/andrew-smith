import React from 'react'
import { useRouter } from 'next/router'

import { getPage, getAllDocSlugs, queries } from '@data'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import Section from '@components/sections'

const Page = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }
  return (
    !router.isFallback && (
      <Layout site={data.site} page={data.page}>
        {data.page.sections
          ?.filter((section) => !section.isHidden)
          .map((section, index) => (
            <div key={section._key}>
              <Section data={section} index={index} />
            </div>
          ))}
      </Layout>
    )
  )
}

export async function getStaticProps({ context, params }) {
  const slug = params.slug.join('/')
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const isPreview = context?.draftMode ?? false

  const pageData = await getPage({
    filter: `_type == 'page' && slug.current in ${JSON.stringify(slugs)}`,
    fields: ``,
    auth: {
      active: isPreview,
      token: isPreview ? process.env.SANITY_VIEWER_TOKEN : null,
    },
  })

  // throw 404 if no page data generated
  if (!pageData.page) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: pageData,
      isPreview,
    },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const allPages = await getAllDocSlugs({
    filter: `_type == 'page' && !(_id in [${queries.homeId}, ${queries.errorId}]) `,
  })

  return {
    paths:
      allPages
        ?.filter((page) => !!page.slug)
        .map((page) => {
          let slugs = page.slug.split('/').filter((e) => e)

          return {
            params: {
              slug: slugs,
            },
          }
        }) || [],
    fallback: false,
  }
}

export default Page
