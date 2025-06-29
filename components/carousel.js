import React, { useState, useCallback, useEffect, useId } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { m, AnimatePresence } from 'framer-motion'
import cx from 'classnames'

import { newLineToBreak, usePrevious } from '@lib/helpers'
import Icon from '@components/icon'

import Image from '@components/image'

const Carousel = ({
  arrows = false,
  hero = false,
  hasData = false,
  options = {
    axis: 'x',
    loop: true,
    duration: 20,
    align: 'center',
    hasDrag: false,
    slidesToScroll: 1,
  },
  className,
  slides,
  children,
  ...rest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageCaption, setImageCaption] = useState(null)
  const [sliderRef, slider] = useEmblaCarousel({
    axis: options.axis,
    loop: options.loop,
    duration: options.duration,
    align: options.align,
    skipSnaps: false,
    containScroll: options.loop ? 'trimSnaps' : 'keepSnaps',
    watchDrag: options.hasDrag,
    dragFree: false,
    slidesToScroll: options.slidesToScroll,
  })

  const prevIndex = useCallback(() => {
    slider?.scrollPrev()
    setCurrentIndex(slider?.selectedScrollSnap())
  }, [slider])
  const nextIndex = useCallback(() => {
    slider?.scrollNext()
    setCurrentIndex(slider?.selectedScrollSnap())
  }, [slider])

  useEffect(() => {
    setImageCaption(slides[currentIndex].photo.caption)
  }, [currentIndex, slides])

  const arrowDisplay = (
    <div
      className={cx('', {
        'absolute -mt-30 w-full flex justify-start': !hero,
        'sm:sticky mt-10 sm:-mt-30 sm:bottom-0 w-full flex justify-between':
          hero,
      })}
    >
      <div
        onClick={() => prevIndex()}
        role="button"
        className={cx(
          'z-100 cursor-pointer w-40 sm:w-30 h-30 flex justify-center bg-grey',
          {}
        )}
      >
        <Icon
          name="Arrow"
          viewBox="0 0 12 8"
          color="#000"
          className={cx('w-15 transition-transform rotate-180', {})}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {imageCaption && hero && (
          <div className="w-full site-grid-container gap-x-20 sm:text-white uppercase">
            <div className="col-span-full mx-10 sm:mx-0 sm:mr-20 sm:col-start-7 sm:col-span-6">
              <m.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, duration: 0.25 }}
                exit={{ opacity: 0, duration: 0.25 }}
                className="pt-5"
              >
                {imageCaption}
              </m.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div
        onClick={() => nextIndex()}
        role="button"
        className={cx(
          'z-100 cursor-pointer w-40 sm:w-30 h-30 flex justify-center bg-grey',
          {}
        )}
      >
        <Icon
          name="Arrow"
          viewBox="0 0 12 8"
          color="#000"
          className={cx('w-15 transition-transform', {})}
        />
      </div>
    </div>
  )
  const display = (
    <div className="grid grid-cols-6 gap-x-20 mt-20 text-12">
      <div className="col-span-full sm:col-span-3">
        <AnimatePresence mode="wait" initial={false}>
          {slides[currentIndex]?.title && (
            <m.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, duration: 0.25 }}
              exit={{ opacity: 0, duration: 0.25 }}
              className="mb-20 sm:mb-0"
            >
              <h4>{slides[currentIndex]?.title}</h4>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {slides[currentIndex]?.notes && (
            <m.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, duration: 0.25 }}
              exit={{ opacity: 0, duration: 0.25 }}
              className="mb-25 sm:mb-0"
            >
              {newLineToBreak({
                text: slides[currentIndex]?.notes,
                className: 'text-12 mb-2 w-2/3',
              })}
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <div className="col-span-full sm:col-span-3 sm:col-start-4 grid grid-cols-3 gap-x-20">
        <div className="col-span-3 grid grid-cols-3 gap-x-20 pt-10 border-t border-black/25">
          <div className="col-span-1">
            <span>CLIENT</span>
          </div>
          <div className="col-span-2">
            <AnimatePresence mode="wait" initial={false}>
              {slides[currentIndex]?.client && (
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, duration: 0.25 }}
                  exit={{ opacity: 0, duration: 0.25 }}
                >
                  <span>{slides[currentIndex]?.client}</span>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-x-20 pt-10 mt-10 border-t border-black/25">
          <div className="col-span-1">
            <span>SERVICES</span>
          </div>
          <div className="col-span-2">
            <AnimatePresence mode="wait" initial={false}>
              {slides[currentIndex]?.services && (
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, duration: 0.25 }}
                  exit={{ opacity: 0, duration: 0.25 }}
                >
                  {newLineToBreak({
                    text: slides[currentIndex]?.services,
                    className: 'text-12 mb-2',
                  })}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {slides[currentIndex]?.credits && (
          <div className="col-span-3 grid grid-cols-3 gap-x-20 pt-10 mt-10 border-t border-black/25">
            <div className="col-span-1">
              <span>CREDITS</span>
            </div>
            <div className="col-span-2">
              <AnimatePresence mode="wait">
                {slides[currentIndex]?.credits && (
                  <m.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, duration: 0.25 }}
                    exit={{ opacity: 0, duration: 0.25 }}
                  >
                    <div>
                      {newLineToBreak({
                        text: slides[currentIndex]?.credits,
                        className: 'text-12 mb-2',
                      })}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section id="carousel">
      <div className={cx('relative', className)} {...rest}>
        <div
          ref={sliderRef}
          className={cx('overflow-hidden', {
            'cursor-grab active:cursor-grabbing': options.hasDrag,
          })}
        >
          <div
            className={cx('relative flex h-full will-change-transform', {
              'touch-pan-y': options.axis === 'x',
              'touch-pan-x flex-col': options.axis === 'y',
            })}
          >
            {slides.map((slide, index) => {
              return (
                <div
                  key={index}
                  className={cx(
                    'mx-20 relative flex-grow-0 flex-shrink-0 w-full min-h-full overflow-hidden transition-opacity'
                  )}
                >
                  <Image className="z-50" src={slide.photo} alt={slide.alt} />
                </div>
              )
            })}
          </div>
          {arrows && !hero && arrowDisplay}
        </div>
        {arrows && hero && arrowDisplay}
        {hasData && display}
      </div>
    </section>
  )
}

export default Carousel
