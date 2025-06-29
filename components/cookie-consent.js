import React, { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import BlockContent, { blockComponents } from '@components/block-content'

const CookieConsent = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (!data?.enabled) return

    const checkCookieConsent = () => {
      const consent = localStorage.getItem('cookieConsent')
      if (consent) {
        const { expires } = JSON.parse(consent)
        if (expires > Date.now()) {
          setIsVisible(false)
          setHasChecked(true)
          return
        }
      }

      setTimeout(() => {
        setIsVisible(true)
        setHasChecked(true)
      }, 2000)
    }

    checkCookieConsent()
  }, [data?.enabled])

  const handleAccept = () => {
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify({
        value: true,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      }),
    )
    setIsVisible(false)
  }

  if (!hasChecked) return null

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <m.section
          key="cookie-consent"
          id="cookie-consent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.3 },
            y: { duration: 0.4 },
          }}
          style={{
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.10)',
            borderRadius: '16px',
          }}
          className="fixed z-10 bg-pageText text-pageBg border border-pageText p-10 sm:p-20 bottom-40 left-10 right-10 sm:left-auto sm:right-20 sm:w-[450px] h-auto"
        >
          <div className="text-left">
            <h4 className="text-h4 mb-10">Cookie Policy</h4>

            <div className="mb-30">
              <BlockContent
                blocks={data.message}
                blockComponents={blockComponents}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAccept}
                className="btn-primary darkmode text-body-medium cursor-pointer px-50"
              >
                Accept All
              </button>
            </div>
          </div>
        </m.section>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
