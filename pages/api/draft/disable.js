export default function handler(req, res) {
  res.clearPreviewData()
  res.setDraftMode({ enable: false })
  res.writeHead(307, { Location: '/' })
  res.end()
}
