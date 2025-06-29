import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'

import { useScrollRestoration } from '@lib/helpers'

import { atoms } from '@data'

export const transitionSpeed = 200
export const transitionCompleteDelay = 200

gsap.registerPlugin(ScrollToPlugin)

const RouterTransition = ({ children }) => {
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useAtom(atoms.showMenuAtom)

  const [isPageTransition, setIsPageTransition] = useAtom(
    atoms.pageTransitionAtom
  )
  const [isHasTransition, setIsHashTransition] = useAtom(
    atoms.hashTransitionAtom
  )

  useEffect(() => {
    // Handle url hashes
    const handleHashChangeComplete = (url = '', shallow) => {
      const hash = url
        ? new URL(url, window.location.origin).hash?.slice(1)
        : null

      if (hash) {
        setIsHashTransition(true)
        setTimeout(
          () => {
            gsap.to(window, {
              duration: 1,
              scrollTo: { y: `#section-${hash}`, offsetY: 60 },
              ease: 'expo.out',
              onComplete: () => {
                // move focus
                document.getElementById(`section-${hash}`)?.focus?.({
                  preventScroll: true,
                  focusVisible: false,
                })

                // end hash transition
                setIsHashTransition(false)
              },
            })
          },
          shallow ? 0 : transitionCompleteDelay * 2
        )
      }
    }

    // Transition Start
    const handleRouteChangeStart = (_, { shallow }) => {
      // Do not transition if only changing URL parameters
      if (shallow) return

      // Otherwise, kick off transition
      setIsPageTransition(true)

      // Close menu if open
      setMenuOpen(false)
    }

    // Transition End
    const handleRouteChangeComplete = (url, { shallow }) => {
      setTimeout(() => {
        // End transition after animations are complete
        setIsPageTransition(false)

        // Re-handle url hashes
        setTimeout(
          () => handleHashChangeComplete(url, shallow),
          transitionSpeed
        )
      }, transitionSpeed)
    }

    // Transition Error
    const handleRouteChangeError = () => {
      setIsPageTransition(false)
    }

    // scroll to hash on initial load
    setTimeout(() => handleHashChangeComplete(router.asPath), transitionSpeed)

    // Attach listeners
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('hashChangeComplete', handleHashChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)

    // Remove listeners on unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('hashChangeComplete', handleHashChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  // Reset/preserve scroll position on history change
  useScrollRestoration(router, transitionSpeed)

  return <>{children}</>
}

export default RouterTransition
