import React from 'react'
import Error from 'next/error'

import { getPage, queries } from '@data'

import Layout from '@components/layout'
import Section from '@components/sections'

const NotFoundPage = ({ data = {} }) => {
  const { site, page } = data

  if (!page) {
    return (
      <Error
        title={`"Error Page (404)" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      {page.sections?.map((section, index) => (
        <Section key={section._key} data={section} index={index} page={page} />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview = false, previewData }) {
  const excludeDrafts = !preview ? '&& !(_id in path("drafts.**"))' : ''

  const pageData = await getPage({
    filter: `_type == 'page' && _id in [${queries.errorId}, 'drafts.' + ${queries.errorId}] ${excludeDrafts}`,
    auth: {
      active: preview,
      token: previewData?.token,
    },
  })

  return {
    props: {
      data: pageData,
      preview,
    },
  }
}

export default NotFoundPage
