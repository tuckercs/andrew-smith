import React from 'react'
import cx from 'classnames'

import { toSlug } from '@lib/helpers'

import MuxVideo from '@components/mux-video'
import Image from '@components/image'
import Carousel from '@components/carousel'

const MediaBlock = ({ data }) => {
  const { title, isHero, hasOverlayText, media, overlayText } = data
  const { type, video, image, carousel } = media

  return (
    <section
      id={`section-${toSlug(title || 'media-block')}`}
      className={cx('site-grid-container', {
        'section-y-spacing section-x-spacing': !isHero,
        'section-y-spacing pt-0': isHero,
      })}
    >
      {type === 'video' && (
        <div className="col-span-full">
          <MuxVideo
            playbackId={video?.video?.asset?.playbackId}
            autoplay={video?.autoplay}
            poster={video?.poster}
            showControls={video?.showControls}
            layout={isHero ? 'fill' : 'responsive'}
          />
        </div>
      )}
      {type === 'image' && (
        <div className={cx('col-span-full', { 'h-dvh relative': isHero })}>
          <Image src={image} fill={isHero} />
        </div>
      )}
      {/* {type === 'carousel' && <Carousel data={carousel} />} */}
    </section>
  )
}

export default MediaBlock
