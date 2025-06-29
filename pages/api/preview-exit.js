export default async function exit(req, res) {
  // clear the preview mode cookie
  res.clearPreviewData()

  // Redirect the user back to the current page.
  res.writeHead(307, { Location: req?.query?.slug ?? '/' })
  res.end()
}
