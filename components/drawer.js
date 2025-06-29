import React, { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import cx from 'classnames'

import { InPortal } from '../lib/helpers'

const Drawer = ({
  direction = 'right',
  isOpen = false,
  onClose = () => {},
  className,
  children,
}) => {
  const drawerRef = useRef()
  const [isActive, setIsActive] = useState(isOpen)

  useEffect(() => {
    setIsActive(isOpen)
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.which === 27) {
        onClose(false)
      }
    }

    if (isActive) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return (
    <InPortal id="menu">
      <>
        <FocusTrap
          active={isActive}
          focusTrapOptions={{
            fallbackFocus: () => drawerRef.current,
            allowOutsideClick: true,
          }}
        >
          <m.nav
            ref={drawerRef}
            key="drawer"
            initial="hide"
            animate={isActive ? 'show' : 'hide'}
            variants={{
              show: {
                x: '0%',
              },
              hide: {
                x: direction === 'right' ? '100%' : '-100%',
              },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              willChange: 'transform',
              transition: 'visibility 0.2s 0.8s',
              transitionDelay: '0s',
            }}
            className={cx(
              'fixed top-0 w-full z-10 text-black h-[calc(var(--dvh,1vh)*100)]',
              className,
              {
                'right-0': direction === 'right',
                'left-0': direction === 'left',
                'visible pointer-events-auto': isActive,
                'invisible pointer-events-none': !isActive,
              }
            )}
          >
            <div
              id="drawer-inner"
              className="flex flex-col relative h-full w-full p-20 bg-black"
            >
              {children}
            </div>
          </m.nav>
        </FocusTrap>
      </>
    </InPortal>
  )
}

export default Drawer
