export default async function handler(req, res) {
  const token = process.env.SANITY_VIEWER_TOKEN

  if (!token) {
    return res.status(401).send('Missing SANITY_VIEWER_TOKEN')
  }

  // Set Next.js draft mode cookie
  res.setDraftMode({ enable: true })

  // Set custom token cookie (HttpOnly not supported in JS-only APIs, so we pass via previewData instead)
  res.writeHead(307, {
    Location: req.query.redirect || '/',
  })

  res.end()
}
