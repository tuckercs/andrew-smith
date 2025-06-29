import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { imageBuilder } from '@lib/sanity'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useAtomValue } from 'jotai'

import { atoms } from '@data'

/*  ------------------------------ */
/*  Generic helper functions
/*  ------------------------------ */

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function toSlug(string) {
  return string
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

// use a Portal for overlays
export function InPortal({ id, children }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return ReactDOM.createPortal(children, document.querySelector(`#${id}`))
}

// reference a previous state after update
export function usePrevious(value) {
  const prev = useRef()

  useEffect(() => {
    prev.current = value
  })

  return prev.current
}

// client-side mount
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

// copy text to clipboard hook
export function useCopyText() {
  const [isCopying, setIsCopying] = useState(false)

  // This is the function we wrote earlier
  async function handleCopyText(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  // onClick handler function for the copy button
  const copyText = (text) => {
    handleCopyText(text)
      .then(() => {
        setIsCopying(true)
        setTimeout(() => {
          setIsCopying(false)
        }, 1000)
      })
      .catch(() => {
        setIsCopying(false)
      })
  }

  return [isCopying, copyText]
}

// autoplay looper
export function useAutoplay(callback, delay) {
  const [isRunning, setIsRunning] = useState(false)
  const stop = useCallback(() => setIsRunning(false), [setIsRunning])
  const play = useCallback(() => setIsRunning(true), [setIsRunning])
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!isRunning) return
    let id = 0

    const tick = () => {
      if (!isRunning) return clearTimeout(id)
      savedCallback.current()
      requestAnimationFrame(() => (id = setTimeout(tick, delay)))
    }
    requestAnimationFrame(() => (id = setTimeout(tick, delay)))

    return () => {
      if (id) clearTimeout(id)
      stop()
    }
  }, [isRunning, delay, stop])

  return { play, stop, isRunning }
}

// conditionally wrap a component with another
export const ConditionalWrapper = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children
}

// simple debounce function
export function debounce(fn, ms) {
  let timer
  return (_) => {
    clearTimeout(timer)
    timer = setTimeout((_) => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

// delay with promise
export function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms))
  }
}

// check if value is unique
export const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

// see if an object is found in another array of objects
export function hasObject(recs, vals) {
  if (!recs) return false

  return recs.some(function (obj) {
    for (var x in obj) if (x in vals && obj[x] != vals[x]) return false
    return true
  })
}

// keep number counters within a range
export function clampRange(value, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value
}

// Maps a value to a new range
export function map(value, start1, stop1, start2, stop2) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

// wrap incremental
export function wrap(index, length) {
  if (index < 0) {
    index = length + (index % length)
  }
  if (index >= length) {
    return index % length
  }
  return index
}

// sort ascending
export function sortAsc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) {
      return 1
    }
    if (b[field] > a[field]) {
      return -1
    }
    return 0
  })
}

// sort descending
export function sortDesc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) {
      return -1
    }
    if (b[field] > a[field]) {
      return 1
    }
    return 0
  })
}

// convert cents to dollars, optional trailing zeros if round amount
export function centsToPrice(cents, trailing = false) {
  const price = cents / 100

  if (!trailing && price % 1 === 0) {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  } else {
    const parts = price.toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${parts.join('.')}`
  }
}

// pad numbers with leading zeros
export function zeroPad(num, size) {
  num = num.toString()
  while (num.length < size) num = '0' + num
  return num
}

// generate all combos from multiple arrays
export function cartesian(...arrays) {
  return [...arrays].reduce(
    (a, b) =>
      a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
    [[]],
  )
}

// walk through data and find matching value
export function walk({ data, condition, output }) {
  if (data === null) return

  if (condition(data)) {
    output(data)
  }

  if (typeof data === 'array') {
    data.forEach((x) => walk({ data: x, condition, output }))
  } else if (typeof data === 'object') {
    const values = Object.values(data)
    for (let i = 0; i < values.length; i++) {
      walk({ data: values[i], condition, output })
    }
  }
}

const applyTemplateTagStyling = (string) => {
  const regex = /\{dark\}(.*?)\{\/dark\}/
  const match = string.match(regex)
  if (match) return <span className="text-[#999]">{match[1]}</span>
  return string
}

export function newLineToBreak({ text, className }) {
  if (!text) return

  return text.split('\n').map((fragment, i) => {
    return i === 0
      ? applyTemplateTagStyling(fragment)
      : [
          <br key={i} className={className} />,
          applyTemplateTagStyling(fragment),
        ]
  })
}

export function newLineToParagraph({ text, className }) {
  if (!text) return

  return text.split('\n').map((fragment, i) => {
    return (
      <p key={i} className={className}>
        {fragment}
      </p>
    )
  })
}

export function smartTruncate(input, targetLength = 60) {
  const words = input.split(/[\r\n ]+/)
  let output = ''

  while (output.length < targetLength && words.length) {
    output = `${output} ${words.shift()}`.trim()
  }

  if (!/[.!?:;—–-]$/.test(output)) {
    output = `${output}…`
  }

  return output
}

/*  ------------------------------ */
/*  Client helpers
/*  ------------------------------ */

export const isBrowser = typeof window !== 'undefined'

export function isMobileSafari() {
  if (!isBrowser) return

  return navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
    ? true
    : false
}

export function useWindowSize() {
  function getSize() {
    return {
      width: isBrowser ? window.innerWidth : 0,
      height: isBrowser ? window.innerHeight : 0,
      heightFixed: isBrowser ? document.documentElement.clientHeight : 0,
      pageYOffset: isBrowser ? window.pageYOffset : 0,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)
  const isPageTransition = useAtomValue(atoms.pageTransitionAtom)

  useEffect(() => {
    if (!isBrowser) return

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  // recalculate after page transition for safe measure
  useEffect(() => {
    if (!isPageTransition) {
      setWindowSize(getSize())
    }
  }, [isPageTransition])

  return windowSize
}

// update multiple url params easily
export function useParams(fallback) {
  const router = useRouter()
  const currentPath = [].concat(router.query?.slug).join('/')
  const hasQuery = Object.keys(router.query).length
  let currentParams = fallback

  // if query params present, update the current parameters
  if (hasQuery) {
    currentParams = fallback.map((param) =>
      router.query[param.name]
        ? { ...param, value: router.query[param.name] }
        : param,
    )
  }

  // update the query params on change
  const setCurrentParams = useCallback(
    (params) => {
      const urlParams = params
        .filter(
          (p) => p.value !== fallback.find((fb) => fb.name === p.name).value,
        )
        .reduce(
          (r, { name, value }) => (
            (r[name] = typeof value === 'string' ? value?.split(',') : value), r
          ),
          {},
        )

      const qs = queryString.stringify(urlParams, {
        arrayFormat: 'comma',
      })

      router.replace(`${currentPath}${qs ? `?${qs}` : ''}`, undefined, {
        shallow: true,
      })
    },
    [router],
  )

  return [currentParams, setCurrentParams]
}

// restore previous scroll position after page change
export function useScrollRestoration(router, delay) {
  const restorePosition = useRef({})

  const saveScrollPosition = (url, pos) => {
    restorePosition.current = {
      ...restorePosition.current,
      [url]: pos,
    }
  }

  const updateScrollPosition = (url, restore, shouldRestore) => {
    const position = restore.current[url]

    // if we have a saved position and it's a history change, restore position, otherwise set to 0
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: position && shouldRestore ? position : 0 })
      })
    }, delay)
  }

  useEffect(() => {
    let shouldScrollRestore = false
    window.history.scrollRestoration = 'manual'

    const onBeforeUnload = (event) => {
      saveScrollPosition(router.asPath, window.scrollY)
      delete event['returnValue']
    }

    const onRouteChangeStart = () => {
      saveScrollPosition(router.asPath, window.scrollY)
    }

    const onRouteChangeComplete = (url, { shallow }) => {
      // Bail if we're just changing URL parameters
      if (shallow) return

      updateScrollPosition(url, restorePosition, shouldScrollRestore)

      // reset if we should restore the scroll position
      shouldScrollRestore = false
    }

    // save scroll position on route change
    window.addEventListener('beforeunload', onBeforeUnload)
    router.events.on('routeChangeStart', onRouteChangeStart)

    // restore scroll position after route change completes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // if it's a history change, set to restore scroll position to "true"
    router.beforePopState((state) => {
      shouldScrollRestore = true
      state.options.scroll = false
      return true
    })

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      router.beforePopState(() => true)
    }
  }, [])
}

/*  ------------------------------ */
/*  Image helpers
/*  ------------------------------ */

export function buildSrc(image, { width, height, format, quality }) {
  let imgSrc = imageBuilder.image(image)

  if (width) {
    imgSrc = imgSrc.width(Math.round(width))
  }

  if (height) {
    imgSrc = imgSrc.height(Math.round(height))
  }

  if (format) {
    imgSrc = imgSrc.format(format)
  }

  if (quality) {
    imgSrc = imgSrc.quality(quality)
  }

  return imgSrc.fit('max').auto('format').url()
}

export function buildSrcSet(image, { srcSizes, aspect, format, quality }) {
  const sizes = srcSizes.map((width) => {
    let imgSrc = buildSrc(image, {
      ...{ width },
      height: aspect && Math.round(width * aspect) / 100,
      ...{ format },
      ...{ quality },
    })

    if (format) {
      imgSrc = imgSrc.format(format)
    }

    return `${imgSrc} ${width}w`
  })

  return sizes.join(',')
}
