import React from 'react'
import Error from 'next/error'

import { getPage, queries } from '@data'

import Layout from '@components/layout'
import Section from '@components/sections'

const Home = ({ data }) => {
  const { site, page } = data

  if (!page) {
    return (
      <Error
        title={`"Home Page" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      {page.sections
        ?.filter((section) => !section.isHidden)
        .map((section, index) => (
          <div key={section._key}>
            <Section data={section} index={index} />
          </div>
        ))}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const isPreview = context?.draftMode ?? false

  const pageData = await getPage({
    filter: `_type == 'page' && _id in [${queries.homeId}]`,
    auth: {
      active: isPreview,
      token: isPreview ? process.env.SANITY_VIEWER_TOKEN : null,
    },
  })

  return {
    props: {
      data: pageData,
      isPreview,
    },
  }
}

export default Home
