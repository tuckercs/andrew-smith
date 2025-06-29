import groq from 'groq'

// Construct our "home" and "error" page GROQ
export const homeId = groq`*[_type=="generalSettings"][0].home->_id`
export const errorId = groq`*[_type=="generalSettings"][0].error->_id`

// Construct our "page" GROQ
export const page = groq`
  "type": _type,
  "slug": select(
    _id == ${homeId} => null,
    slug.current
  )
`

// Construct our "link" GROQ
export const link = groq`
  _key,
  type,
  title,
  label,
  // resolve the correct target based on type
  type == "internal" => {
    "page": internal->{
      ${page},
      "hash": ^.hash
    }
  },
  type == "external" => {
    "url": url
  },
  type == "file" => {
    "download": file.asset->{
      _type,
      url,
      originalFilename
    }
  },
  type == "email" => {
    "email": email
  },
  type == "phone" => {
    "phone": phone
  },
  // optional icon
  icon->{
    _id,
    title,
    svg,
    viewBox
  }
`

// Construct our "image meta" GROQ
export const imageMeta = groq`
  asset,
  crop,
  hotspot,
  ...(asset->{
    "alt": coalesce(^.alt, altText),
    "id": assetId,
    "type": mimeType,
    "aspectRatio": metadata.dimensions.aspectRatio
  }),
  customRatio,
  style,
  bleed,
  caption
`

// Construct our "video meta" GROQ
export const videoMeta = groq`
  video {
    asset -> {
      playbackId,
      assetId,
      filename
      }
  },
  showControls,
  autoplay,
  poster{ ${imageMeta} }
`

// Construct our combined "graphic meta" GROQ
export const graphicMeta = groq`
  _key,
  type,
  type == 'video' => {
    video { ${videoMeta} }
  },
  type == 'image' => {
    "type": type,
    image { ${imageMeta} }
  },
  type == 'carousel' => {
    "type": type,
    carousel[] {
      ${imageMeta}
    }
  }
`
// Construct our "portable text content" GROQ
export const ptContent = groq`
  ...,
  markDefs[]{
    ...,
    _type == 'link' => {
      ...(@.link[0]{
        ${link}
      }),
      '_key': @._key
    }
  },
  _type == 'photo' => {
    ${imageMeta}
  },
  _type == 'video' => {
    ${videoMeta},
    openModal,
    videoModal{
      src,
      width,
      height
    }
  },
  _type == 'codeBlock' => {
    code
  },
  _type == 'label' => {
    text,
    style
  }
`

// Construct our page "sections" GROQ
export const pageSections = {
  global: groq`
    _type,
    _key,
    title,
    "isHidden": hidden
  `,

  pageHero: groq`
    _type == 'pageHero' => {
      style,
      headline,
      subhead,
      ...(select(
        style == 'basic' => {},
        style == 'media' => {
          graphic[0]{ ${graphicMeta} }
        },
      ))
    }
  `,

  textBlock: groq`
  _type == 'textBlock' => {
    "grid": {
      columnStartMobile,
      columnSpanMobile,
      columnStartDesktop,
      columnSpanDesktop,
    },
    portableText[]{
      ${ptContent}
    }
  }`,

  portfolio: groq`
  _type == 'portfolio' => {
    marqueeTitle,
    images[]{
      ${imageMeta} 
    },
    portableText[]{
        ${ptContent}
      },
    accordion[]{
      title,
      portableText[]{
        ${ptContent}
      },
    },
    links[]{
      title,
      link,
      color
    }
  }`,

  fiftyFifty: groq`
  _type == 'fiftyFifty' => {
    title,
    leftColumn{
      columnContentType,
      portableText[]{
        ${ptContent}
      },
      image{ ${imageMeta} },
      accordion
    },
    rightColumn{
      columnContentType,
      portableText[]{
        ${ptContent}
      },
      image{ ${imageMeta} },
      accordion
    }
  }`,

  mediaBlock: groq`
  _type == 'mediaBlock' => {
    isHero,
    hasOverlayText,
    media{ ${graphicMeta} },
    overlayText[]{
      ${ptContent}
    }
  }`,
}

// Construct our "site" GROQ
export const site = groq`
  "site": {
    ...(*[_type == "generalSettings"][0]{
      "title": siteTitle,
      "liveDomain": liveSiteDomain,
      "devDomain": devSiteDomain,
      gtmId,
      gaId
    }),
    "cookieConsent": *[_type == "cookieSettings"][0]{
      enabled,
      message[]{
        ${ptContent}
      }
    },
    "header": *[_type == "headerSettings"][0]{
      exposedLinks[]{
        ${link},
      },
    },
    "footer": *[_type == "footerSettings"][0]{
      hidePrimaryFooter,
      primaryNavMenus[]->{
        title,
        links[]{
          ${link}
        }
      },
      secondaryNavMenu->{
        links[]{
          ${link}
        }
      },
      socialLinks[]{
        ${link}
      },
      showNewsletter,
      newsletter{
        cioSiteId,
        cioApiKey,
        title,
        submitIcon->{
          _id,
          title,
          svg,
          viewBox
        },
        successMessage
      },
      copyrightNotice
    },
    "seo": *[_type == "seoSettings"][0]{
      metaTitle,
      metaDesc,
      shareTitle,
      shareDesc,
      shareGraphic,
      "favicon": favicon.asset->url,
      "faviconLegacy": faviconLegacy.asset->url,
      touchIcon
    },
    "announcement": *[_type == "announcementSettings"][0]{
      enabled,
      message,
      link{
        ${link}
      }
    },
  }
`
