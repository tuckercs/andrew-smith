import React from 'react'
import capitalize from 'lodash.capitalize'
import { CircleIcon } from '@phosphor-icons/react'

export const decodeAssetUrl = (id) => {
  const pattern = /^(?:image|file)-([a-f\d]+)-(?:(\d+x\d+)-)?(\w+)$/
  const [, assetId, dimensions, format] = pattern.exec(id)

  const [width, height] = dimensions
    ? dimensions.split('x').map((v) => parseInt(v, 10))
    : []

  return {
    assetId,
    dimensions: { width, height },
    format,
  }
}

export const excludeAddedReferences = ({ parent }) => {
  const addedRefs = parent?.map((ref) => ref._ref).filter(Boolean)

  return {
    filter: '!(_id in $ids)',
    params: {
      ids: addedRefs,
    },
  }
}

export const generateGraphic = ({ graphic, icon }) => {
  if (!graphic) return icon ?? null

  // if graphic is array, destructure first item, otherwise destructure graphic
  const graphicInstance = Array.isArray(graphic) ? graphic[0] : graphic

  const { _type } = graphicInstance

  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString))
    } catch (e) {
      return false
    }
  }

  if (_type === 'video' && !isValidUrl(graphicInstance.src)) {
    return icon ?? null
  }

  const media = {
    photo: graphicInstance.asset ? graphicInstance : icon,
    video: () => {
      const { src } = graphicInstance

      return (
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            overflow: 'hidden',
          }}
        >
          <video
            controls={false}
            loop={true}
            muted={true}
            autoPlay
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      )
    },
  }[_type]

  return media
}

export const generateSvg = (shape, viewBox) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox ?? '0 0 100 100'}
      fill="currentColor"
      width="1em"
      height="1em"
      dangerouslySetInnerHTML={{
        __html: shape,
      }}
    />
  )
}

export const generateSwatch = (color) => {
  if (!color) return null

  return (
    <CircleIcon
      color={color}
      weight="fill"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,.4), 0 0 0 1px rgba(0,0,0,.15)',
        borderRadius: '50%',
      }}
    />
  )
}

export const generateBlockPreview = (content, index) => {
  if (!content) return {}

  function extractText(block) {
    return block?.children
      .filter((child) => child._type === 'span')
      .map((span) => span.text)
      .join('')
  }

  const firstBlock = content.filter((item) => item._type === 'block')[
    index ?? 0
  ]
  const secondBlock = content.filter((item) => item._type === 'block')[
    index ? index + 1 : 1
  ]

  const title =
    extractText(firstBlock) ?? capitalize(content[index ?? 0]?._type)
  const subtitle = extractText(secondBlock) ?? null

  return { title, subtitle }
}

export const getSectionName = (type) => {
  return (
    {
      // common
      pageHero: 'Hero',
      pageBasic: 'Basic Content',
      pageCardsGrid: 'Cards Grid',
      pageBentoBox: 'Bento Box',
      pageLogoStrip: 'Logo Strip',

      // features
      pageFeatures: 'Features',
      pageFeatureCallout: 'Feature Callout',

      // templates
      pageTemplatesCallout: 'Templates Callout',
      pageTemplatesGallery: 'Templates Gallery',

      // integrations
      pageIntegrationsTabs: 'Integrations Tabs',
      pageIntegrationsGrid: 'Integrations Grid',
      pageIntegrationsCallout: 'Integrations Callout',

      // other document lists
      pageChangelogFeed: 'Changelog Feed',
      pageTestimonialsCarousel: 'Testimonials Carousel',
      pageCreatorSpotlight: 'Creator Spotlight',
      pagePressList: 'Press List',

      // pricing
      pagePlanCards: 'Pricing Plan Cards',
      pagePlanDetails: 'Pricing Plan Details',
    }[type] || type
  )
}
