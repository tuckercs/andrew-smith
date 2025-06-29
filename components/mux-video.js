import React, { useRef, useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { useAtom } from 'jotai'
import cx from 'classnames'
import Hls from 'hls.js'

import Icon from '@components/icon'
import Image from '@components/image'

import { atoms } from '@data'

const MuxVideo = ({
  playbackId,
  poster,
  layout = 'responsive',
  autoplay = false,
  showControls = true,
}) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const hls = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoplay && showControls)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileDevice = /android|iPad|iPhone|iPod/i.test(userAgent)
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize HLS.js and load the Mux stream
  useEffect(() => {
    if (Hls.isSupported()) {
      hls.current = new Hls()
      hls.current.loadSource(`https://stream.mux.com/${playbackId}.m3u8`)
      hls.current.attachMedia(videoRef.current)

      hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false)
        if (autoplay) {
          videoRef.current.muted = true
          videoRef.current.play().catch((error) => {
            console.warn('Autoplay failed:', error)
          })
        }
      })

      return () => {
        if (hls.current) {
          hls.current.destroy()
        }
      }
    } else {
      console.error('HLS.js is not supported in this browser.')
    }
  }, [playbackId, autoplay])

  // Play video
  const handlePlay = () => {
    videoRef.current.play()
    setIsPlaying(true)

    // Enter fullscreen on mobile when playing
    if (isMobile && videoRef.current) {
      if (videoRef.current.webkitEnterFullscreen) {
        // iOS
        videoRef.current.webkitEnterFullscreen()
      } else if (videoRef.current.requestFullscreen) {
        // Android
        videoRef.current.requestFullscreen()
      }
    }
  }

  // Pause video
  const handlePause = () => {
    videoRef.current.pause()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const toggleFullscreen = () => {
    if (!isMobile) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className={cx('w-full')}>
      {/* Video container */}
      <div
        ref={containerRef}
        onClick={showControls ? togglePlay : undefined}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cx('relative', {
          'h-dvh w-screen': layout === 'fill',
          'w-full grid grid-cols-12': layout === 'responsive',
        })}
      >
        {/* Poster Image */}
        {(!isPlaying || isLoading) && poster && (
          <div className="absolute inset-0 z-10">
            <Image
              src={poster}
              alt="Video poster"
              fill
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
        )}

        {/* Video Controls Box */}
        {showControls && (
          <div className="absolute bottom-0 right-0 flex items-center gap-12 bg-pageText/75 text-pageBg py-15 px-20 z-30">
            <m.button
              className="flex cursor-pointer hover:opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              layout
              transition={{
                duration: 0.05,
              }}
            >
              <Icon
                color="currentColor"
                viewBox={isPlaying ? '0 0 8 11' : '0 0 9 11'}
                className={cx({
                  'w-10': isPlaying,
                  'w-11': !isPlaying,
                })}
                name={isPlaying ? 'Pause' : 'Play'}
              />
            </m.button>

            <m.button
              className="flex items-center cursor-pointer hover:opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              layout
              transition={{
                duration: 0.05,
              }}
            >
              <Icon
                color="currentColor"
                className="w-15"
                name={isFullscreen ? 'Minimize' : 'Maximize'}
              />
            </m.button>
          </div>
        )}

        <video
          loop={autoplay}
          playsInline
          muted={autoplay}
          className={cx('', {
            'absolute top-0 left-0 w-full h-full object-cover bg-black pointer-events-none':
              layout === 'fill',
            'col-span-12 w-full h-auto': layout === 'responsive',
          })}
          ref={videoRef}
        />
      </div>
    </div>
  )
}

export default MuxVideo
