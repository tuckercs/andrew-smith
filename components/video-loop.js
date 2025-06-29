import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import cx from 'classnames'

import { buildSrc, isBrowser } from '@lib/helpers'

import Icon from '@components/icon'
import PlayPause from '@components/play-pause'
import Volume from '@components/volume'
import Link from '@components/link'

const VideoLoop = ({
  src,
  mobileSrc,
  width,
  height,
  poster,
  isStopped = false,
  showControls = false,
  showProgress = false,
  onReady = () => {},
  onPlay = () => {},
  onPause = () => {},
  threshold = 0,
  rootMargin,
  ...rest
}) => {
  const videoRef = useRef()
  const progressRafId = useRef(0)

  const posterSrc = poster ? buildSrc(poster, { width, height }) : null

  const [isPaused, setIsPaused] = useState(isStopped)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [forceControls, setForceControls] = useState(false)

  const { observe, inView } = useInView({ threshold, rootMargin })

  // set isMobile state
  const [isMobile, setIsMobile] = useState(null)
  useEffect(() => {
    if (isBrowser) {
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  const playSrc = isMobile && mobileSrc ? mobileSrc : src

  const handleOnReady = useCallback(() => {
    onReady(videoRef.current)
  }, [videoRef.current])

  const play = useCallback(() => {
    videoRef.current?.play().catch((error) => {
      setForceControls(true)
      videoRef.current?.pause()
    })
  }, [videoRef.current])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [videoRef.current])

  // handle on play event
  const handleOnPlay = useCallback(() => {
    setIsPaused(false)
    progressRafId.current = requestAnimationFrame(updateProgress)

    onPlay()
  }, [videoRef.current])

  // handle on pause event
  const handleOnPause = useCallback(() => {
    setIsPaused(true)
    cancelAnimationFrame(progressRafId.current)

    onPause()
  }, [videoRef.current])

  // update progress
  const updateProgress = useCallback(() => {
    const { currentTime, duration } = videoRef?.current || {}

    setProgress(currentTime / duration)

    progressRafId.current = requestAnimationFrame(updateProgress)
  }, [videoRef.current])

  // play/pause video when in view
  useEffect(() => {
    if (inView && !isStopped) {
      play()
    } else {
      pause()
    }
  }, [inView, isStopped])

  // handle progress animation
  useEffect(() => {
    if (!isPaused) {
      progressRafId.current = requestAnimationFrame(updateProgress)
    }

    return () => {
      if (!isPaused) {
        cancelAnimationFrame(progressRafId.current)
      }
    }
  }, [])

  if (!src) return null

  return (
    <>
      <video
        ref={(node) => {
          observe(node)
          videoRef.current = node
        }}
        controls={false}
        loop={true}
        muted={isMuted}
        playsInline
        onCanPlay={handleOnReady}
        onPlay={handleOnPlay}
        onPause={handleOnPause}
        poster={posterSrc}
        {...rest}
      >
        <source src={playSrc} type="video/mp4" />
      </video>

      {(showControls || forceControls || showProgress) && (
        <div className="absolute bottom-0 left-0 right-0 z-1 flex justify-between items-center gap-x-20">
          {(showControls || forceControls) && (
            <div>
              <PlayPause
                onClick={() => (isPaused ? play() : pause())}
                isPaused={isPaused}
                className="shrink-0"
              />
              <Volume
                onClick={() => setIsMuted(!isMuted)}
                isMuted={isMuted}
                className="shrink-0"
              />
            </div>
          )}

          {showProgress && (
            <div className="relative h-4 w-100 shrink-0 overflow-hidden rounded-full bg-white bg-opacity-15 sm:w-[calc(100%-170px)]">
              <span
                className="absolute inset-0 block origin-left scale-x-0 bg-white transition-transform duration-100 ease-linear"
                style={{
                  transform: `scaleX(${progress})`,
                }}
              />
            </div>
          )}

          {(showControls || forceControls) && (
            <div className={cx('clean-btn h-30 w-30')}>
              <div className="content-button h-full w-full flex justify-center">
                <Link external={true} href={playSrc}>
                  <Icon
                    name={'ArrowOut'}
                    viewBox={'0 0 256 256'}
                    color="#000"
                    className={cx('w-18', {})}
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default VideoLoop
