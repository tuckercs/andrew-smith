/** @type {import('next').NextConfig} */
const { createClient } = require('@sanity/client')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const sanityClient = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-01-01',
})

// Fetch redirects from Sanity
async function fetchSanityRedirects() {
  const data = await sanityClient.fetch(
    `*[_type == "redirect"]{ from, to, isPermanent }`,
  )

  return data.map((redirect) => ({
    source: `/${redirect.from.replace('*', ':slug*')}`, // Convert wildcard for Next.js
    destination: `/${redirect.to.replace('*', ':slug*')}`,
    permanent: redirect.isPermanent,
  }))
}

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  async redirects() {
    const sanityRedirects = await fetchSanityRedirects()
    return sanityRedirects
  },
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self';",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://alright-marketing.vercel.app', // update this
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000', // or https://your-project.sanity.studio
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
  images: {
    domains: ['cdn.sanity.io', 'cdn.shopify.com'],
  },
})
