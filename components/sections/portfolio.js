import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Marqy } from 'marqy'
import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'

import BlockContent, { blockComponents } from '@components/block-content'
import Image from '@components/image'
import Icon from '@components/icon'
import Accordion from '@components/accordion'

import { toSlug } from '@lib/helpers'

const Portfolio = ({ data }) => {
  const { marqueeTitle, images, portableText, accordion, title, links } = data

  console.log(data)

  const [currentIndex, setCurrentIndex] = useState(0)

  const [sliderRef, slider] = useEmblaCarousel({
    axis: 'x',
    loop: true,
    duration: 20,
    align: 'center',
    slidesToScroll: 1,
  })

  // Update current index when carousel scrolls
  const onSelect = useCallback(() => {
    if (!slider) return
    setCurrentIndex(slider.selectedScrollSnap())
  }, [slider])

  useEffect(() => {
    if (!slider) return
    onSelect()
    slider.on('select', onSelect)
    return () => slider.off('select', onSelect)
  }, [slider, onSelect])

  const prevIndex = useCallback(() => {
    if (!slider) return
    slider.scrollPrev()
  }, [slider])

  const nextIndex = useCallback(() => {
    if (!slider) return
    slider.scrollNext()
  }, [slider])

  useEffect(() => {
    if (!slider) return

    const interval = setInterval(() => {
      nextIndex()
    }, 10000)

    return () => clearInterval(interval)
  }, [slider, nextIndex])

  console.log(data)

  return (
    <section
      id={`section-${toSlug(title || 'portfolio')}`}
      className="site-grid-container min-h-screen"
    >
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-10 bg-white/75 py-10">
        <Marqy pauseOnHover speed={0.25}>
          {links.map((link) => (
            <div
              key={link.id}
              className="mx-20 lowercase"
              style={{ color: link.color.hex }}
            >
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-h2 opacity-100 hover:opacity-50 hover:text-black transition-all"
              >
                {link.title}
              </a>
            </div>
          ))}
        </Marqy>
      </div>

      <div className="col-span-full sm:col-span-7 px-10 py-20 sm:px-10 sm:py-20">
        {marqueeTitle && (
          <h1 className="text-h1  mb-20 sm:mb-6">{marqueeTitle}</h1>
        )}
        {portableText && (
          <div className="text-body">
            <BlockContent
              blocks={portableText}
              blockComponents={blockComponents}
            />
          </div>
        )}
        <div className="w-full site-grid-container">
          <div className="col-span-full">
            {accordion &&
              accordion.length > 0 &&
              accordion.map((item) => (
                <Accordion title={item.title} key={item.title}>
                  <BlockContent
                    blocks={item.portableText}
                    blockComponents={blockComponents}
                  />
                </Accordion>
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-full sm:col-span-4 sm:col-start-9 mt-40 sm:mt-0">
        <div className="w-full sm:hidden flex items-center justify-between pr-10 pl-0">
          <div className="flex">
            <div
              onClick={() => prevIndex()}
              role="button"
              className={cx(
                'cursor-pointer w-30 h-35 flex justify-center items-center',
                {},
              )}
            >
              <span>
                <Icon
                  name="Arrow"
                  viewBox="0 0 12 8"
                  color="currentColor"
                  className={cx('w-15 transition-transform rotate-180', {})}
                />
              </span>
            </div>
            <div
              onClick={() => nextIndex()}
              role="button"
              className={cx(
                'cursor-pointer w-30 h-35 flex justify-center items-center',
                {},
              )}
            >
              <span>
                <Icon
                  name="Arrow"
                  viewBox="0 0 12 8"
                  color="currentColor"
                  className={cx('w-15 transition-transform', {})}
                />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-body">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
        <div ref={sliderRef} className="overflow-hidden w-full">
          <div className=" flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_auto] mx-10 overflow-hidden transition-opacity w-full max-w-500"
              >
                <Image src={image} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full hidden sm:flex items-center justify-between pr-10 pl-0">
          <div className="flex">
            <div
              onClick={() => prevIndex()}
              role="button"
              className={cx(
                'cursor-pointer w-30 h-35 flex justify-center items-center',
                {},
              )}
            >
              <span>
                <Icon
                  name="Arrow"
                  viewBox="0 0 12 8"
                  color="currentColor"
                  className={cx('w-15 transition-transform rotate-180', {})}
                />
              </span>
            </div>
            <div
              onClick={() => nextIndex()}
              role="button"
              className={cx(
                'cursor-pointer w-30 h-35 flex justify-center items-center',
                {},
              )}
            >
              <span>
                <Icon
                  name="Arrow"
                  viewBox="0 0 12 8"
                  color="currentColor"
                  className={cx('w-15 transition-transform', {})}
                />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-body">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block col-span-full mt-auto">
        <Marqy pauseOnHover speed={0.25}>
          {links.map((link) => (
            <div
              key={link.id}
              className="mx-20 lowercase"
              style={{ color: link.color.hex }}
            >
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-h2 opacity-100 hover:opacity-50 hover:text-black transition-all"
              >
                {link.title}
              </a>
            </div>
          ))}
        </Marqy>
      </div>
    </section>
  )
}

export default Portfolio
