import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import pupa from 'pupa'

import { imageBuilder } from '@lib/sanity'
import getConfig from 'next/config'

const HeadSEO = ({ site = {}, page = {}, schema }) => {
  const router = useRouter()
  const { publicRuntimeConfig } = getConfig()

  // micro template for string variable replacement
  const template = {
    page: {
      title: page.title,
    },
    site: {
      title: site.title,
    },
  }

  // construct our variables
  const siteTitle = site.title

  const faviconPrefix = publicRuntimeConfig?.assetPrefix
    ? `/${publicRuntimeConfig?.assetPrefix}`
    : ''
  const siteFavicon = site.seo?.favicon || `${faviconPrefix}/favicon.svg`
  const siteFaviconLegacy =
    site.seo?.faviconLegacy || `${faviconPrefix}/favicon.ico`
  const siteTouchIcon = site.seo?.touchIcon

  const metaTitle = pupa(page.seo?.metaTitle || site.seo?.metaTitle, template, {
    ignoreMissing: true,
  })
  const metaDesc = page.seo?.metaDesc || site.seo?.metaDesc

  const shareTitle = pupa(
    page.seo?.shareTitle || site.seo?.shareTitle,
    template,
    {
      ignoreMissing: true,
    }
  )
  const shareDesc = page.seo?.shareDesc || site.seo?.shareDesc

  const shareGraphic =
    page.seo?.shareGraphic?.asset || site.seo?.shareGraphic?.asset

  const pageUrl = new URL(router.asPath, site.liveDomain)
  const canonicalUrl =
    pageUrl.origin + (pageUrl.pathname !== '/' ? pageUrl.pathname : '')

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="initial-scale=1, width=device-width, viewport-fit=cover"
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Icons */}
      <link rel="icon" sizes="any" href={siteFaviconLegacy} />
      <link preload="true" rel="icon" type="image/svg+xml" href={siteFavicon} />
      {siteTouchIcon && (
        <link
          rel="apple-touch-icon"
          href={imageBuilder.image(siteTouchIcon).width(180).height(180).url()}
        />
      )}

      {/* Preconnect Domains */}
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
      {site?.typekitId && (
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* SEO Metadata */}
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}

      {/* Open Graph and social metadata */}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      {siteTitle && <meta property="og:site_name" content={siteTitle} />}

      {shareTitle && (
        <>
          <meta property="og:title" content={shareTitle} />
          <meta name="twitter:title" content={shareTitle} />
        </>
      )}

      {shareDesc && (
        <>
          <meta property="og:description" content={shareDesc} />
          <meta name="twitter:description" content={shareDesc} />
        </>
      )}

      {shareGraphic && (
        <>
          <meta
            property="og:image"
            content={imageBuilder
              .image(shareGraphic)
              .width(1200)
              .height(630)
              .url()}
          />
          <meta
            name="twitter:image"
            content={imageBuilder
              .image(shareGraphic)
              .width(1200)
              .height(630)
              .url()}
          />
        </>
      )}

      {/* Schema data (LD+JSON) */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  )
}

export default HeadSEO
