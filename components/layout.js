import React, { useEffect, useRef, useState } from 'react'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { m } from 'framer-motion'

import { isBrowser, isMobileSafari, useWindowSize } from '@lib/helpers'

import {
  transitionSpeed,
  transitionCompleteDelay,
} from '@components/router-transition'

import HeadSEO from '@components/head-seo'
import SiteHeader from '@components/site-header'
import SiteFooter from '@components/site-footer'
import Link from '@components/link'

const pageTransitionAnim = {
  show: {
    opacity: 1,
    transition: {
      duration: transitionSpeed / 1000,
      delay: transitionCompleteDelay / 1000,
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    transition: {
      duration: transitionSpeed / 1000,
      when: 'beforeChildren',
    },
  },
}

const useViewportHeight = () => {
  const { height: windowHeight } = useWindowSize()
  const [lockHeight, setLockHeight] = useState(false)
  const hasChin = isMobileSafari()

  useEffect(() => {
    if (!isBrowser) return

    document.body.style.setProperty('--dvh', `${windowHeight * 0.01}px`)

    if (!lockHeight || !hasChin) {
      document.body.style.setProperty('--vh', `${windowHeight * 0.01}px`)
      setLockHeight(hasChin)
    }
  }, [windowHeight, hasChin, lockHeight])

  return null
}

const Layout = ({ site = {}, page = {}, schema, children }) => {
  useViewportHeight()
  const { announcement } = site

  const announcementRef = useRef(null)
  const [announcementHeight, setAnnouncementHeight] = useState(0)

  useEffect(() => {
    if (announcementRef.current) {
      setAnnouncementHeight(announcementRef.current.offsetHeight || 0)
    }
  }, [announcement?.enabled, announcement?.message])

  return (
    <>
      <HeadSEO site={site} page={page} schema={schema} />

      {site.gaId && <GoogleAnalytics gaId={site.gaId} />}
      {site.gtmId && <GoogleTagManager gtmId={site.gtmId} />}

      <m.div
        initial="hide"
        animate="show"
        exit="hide"
        variants={pageTransitionAnim}
        className="flex flex-1 flex-col"
      >
        <div className="relative flex flex-1 flex-col min-h-dvh">
          {announcement?.enabled && announcement?.message && (
            <Link
              ref={announcementRef}
              data={announcement.link}
              className="flex justify-center items-center bg-info text-pageBg py-5"
            >
              <h4 className="text-h4 mb-0">{announcement.message}</h4>
            </Link>
          )}
          <SiteHeader
            data={site}
            page={page}
            announcementHeight={announcementHeight}
          />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter data={site} page={page} />
        </div>
      </m.div>
    </>
  )
}

export default React.memo(Layout)
