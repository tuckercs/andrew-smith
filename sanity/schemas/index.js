// Document types
import page from '@schemas/documents/page'
import pageSection from '@schemas/documents/page-section'

import cookieSettings from '@schemas/documents/settings-cookie'
import announcementSettings from '@schemas/documents/settings-announcement'
import footerSettings from '@schemas/documents/settings-footer'
import generalSettings from '@schemas/documents/settings-general'
import headerSettings from '@schemas/documents/settings-header'
import seoSettings from '@schemas/documents/settings-seo'

import redirect from '@schemas/documents/redirect'

// Section types
import textBlock from '@schemas/sections/text-block'
import mediaBlock from '@schemas/sections/media-block'
import fiftyFifty from '@schemas/sections/fifty-fifty'

// Object types
import navDropdown from '@schemas/objects/nav-dropdown'
import newsletterForm from '@schemas/objects/newsletter-form'
import accordion from '@schemas/objects/accordion'
import seo from '@schemas/objects/seo'

export const schemaTypes = [
  /* --------------- */
  /* 1: Document types */

  page,
  pageSection,

  generalSettings,
  footerSettings,
  headerSettings,
  announcementSettings,
  cookieSettings,
  seoSettings,

  redirect,

  /* --------------- */
  /* 2: Section types */

  textBlock,
  mediaBlock,
  fiftyFifty,

  /* ----------------------- */
  /* 3: Object types */

  navDropdown,
  newsletterForm,
  accordion,
  seo,
]
