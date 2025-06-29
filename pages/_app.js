import React, { memo, useEffect } from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { LazyMotion, domMax, AnimatePresence } from 'framer-motion'
import { VisualEditing } from '@sanity/visual-editing/next-pages-router'
import { CookiesProvider } from 'react-cookie'

import 'focus-visible'
import '../styles/app.css'

import { isBrowser } from '@lib/helpers'

import RouterTransition from '@components/router-transition'
import DevGrid from '@components/dev-grid'
import CookieConsent from '@components/cookie-consent'

const Page = memo(function App({ Component, pageProps, router }) {
  const { data: { site, page } = {} } = pageProps

  return (
    <CookiesProvider>
      <JotaiProvider>
        <RouterTransition>
          {site?.cookieConsent?.enabled && (
            <CookieConsent data={site.cookieConsent} />
          )}

          <DevGrid className="text-error/30" />

          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              document.body.classList.remove('overflow-hidden')
            }}
          >
            <Component
              key={page?.ignorePageTransition ? router.route : page?.id}
              {...pageProps}
            />
          </AnimatePresence>

          <VisualEditing zIndex={1000} />
        </RouterTransition>
      </JotaiProvider>
    </CookiesProvider>
  )
})

const MyApp = ({ Component, pageProps, router }) => {
  useEffect(() => {
    if (isBrowser) {
      process.env.NODE_ENV === 'production' && console.clear()

      console.log(
        '%c🔥 Site Credits 🔥 \n\n Design & Development: \n%c Alright Studio %c\n\n👾 https://alright.studio\n🌀 https://instagram.com/alright.studio',
        'font-family:helvetica;font-size:12px;font-weight:bold;color:black;',
        'font-family:helvetica;font-size:12px;font-weight:bold;color:red;',
        'font-family:helvetica;font-size:12px;font-weight:bold;color:black;',
      )
    }
  }, [])

  return (
    <LazyMotion features={domMax}>
      <Page Component={Component} pageProps={pageProps} router={router} />
    </LazyMotion>
  )
}

export default MyApp
