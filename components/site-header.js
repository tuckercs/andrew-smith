import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import cx from 'classnames'

import Icon from '@components/icon'
import Link from '@components/link'

const SiteHeader = ({ data, page, announcementHeight = 0 }) => {
  const { header } = data

  const settings = {
    hideOnScroll: true,
    scrollOffset: announcementHeight + 500,
  }

  const [hasScrolled, setHasScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setLastScrollY(currentScrollY)

      setHasScrolled(currentScrollY > settings.scrollOffset)
      setAtTop(currentScrollY <= announcementHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, announcementHeight, settings.scrollOffset])

  const headerY =
    hasScrolled && scrollDirection === 'down'
      ? -120
      : atTop
        ? announcementHeight
        : 0

  return (
    <section id="site-header" className="z-10">
      {/* Desktop Header */}
      <m.div
        initial={{ y: announcementHeight }}
        animate={{ y: headerY }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        className={cx(
          'hidden sm:fixed sm:top-0 sm:left-0 sm:right-0 sm:site-grid-container section-x-spacing py-10 sm:py-20 text-pageBg transition-colors duration-300 delay-100 ease-in-out',
          {
            'bg-pageText/10': !hasScrolled,
            'bg-pageText': hasScrolled,
          },
        )}
      >
        <div className="col-span-2">
          <Link href="/">
            <Icon name="Logo" color="currentColor" className="w-170" />
          </Link>
        </div>
        <div className="col-span-10 space-x-10 flex justify-end items-center">
          {header?.exposedLinks?.map((link) => (
            <Link data={link} key={link._key}>
              <h4 className="text-h4 mb-0 opacity-100 hover:opacity-50 transition-opacity">
                {link.title}
              </h4>
            </Link>
          ))}
        </div>
      </m.div>

      {/* Mobile Header */}
      <m.div
        initial={{ y: announcementHeight }}
        animate={{ y: headerY }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        className="sm:hidden site-grid-container py-20 section-x-spacing bg-pageText text-pageBg"
      >
        <div className="col-span-3">
          <Icon name="Logo" color="currentColor" className="w-170" />
        </div>
        <div className="col-span-3 flex justify-end">
          <Icon name="Menu" color="currentColor" className="w-20" />
        </div>
      </m.div>
    </section>
  )
}

export default React.memo(SiteHeader)
