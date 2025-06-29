import groq from 'groq'

import { getSanityClient } from '@lib/sanity'
import { getRoute } from '@lib/routes'

import { queries } from '@data'

export default async function preview(req, res) {
  // Bail if no secret or slug defined
  if (
    req.query.secret !== process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    !req.query.type
  ) {
    return res.status(401).json({ message: 'Invalid preview request' })
  }

  const auth = {
    active: true,
    token: process.env.SANITY_API_TOKEN,
  }

  const slugFilter = req.query.slug
    ? `&& slug.current == '${req.query.slug}'`
    : ''

  // Fetch the actual page document from Sanity
  const previewPage = await getSanityClient({ auth }).fetch(groq`
    *[_type == '${req.query.type}' ${slugFilter}] | order(_updatedAt desc)[0]{
      _type,
      "slug": select(
        // set paths
        _id in [${queries.homeId}, 'drafts.' + ${queries.homeId}] => '',
        // other pages
        slug.current
      ),
      hash
    }
  `)

  // Bail if no associated document found
  if (!previewPage) {
    return res.status(401).json({ message: 'Invalid preview request' })
  }

  // Enable Preview Mode by setting the cookies and passing the sanity token for fetching
  res.setPreviewData(
    { token: process.env.SANITY_API_TOKEN },
    {
      maxAge: 60 * 60, // 1 hour expiration
    }
  )

  // Redirect to the associated page
  res.writeHead(307, {
    Location: getRoute(previewPage),
  })

  res.end()
}
