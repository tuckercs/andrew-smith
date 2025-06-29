import React, { useState } from 'react'
import NextImage from 'next/image'
import cx from 'classnames'

import { buildSrc } from '@lib/helpers'

const Image = ({
  alt,
  src,
  width,
  height,
  fill,
  quality = 95,
  containerClassName,
  objectFit = 'cover', // New prop for object fit
  noAnimation,
  onLoadingComplete = () => {},
  ...rest
}) => {
  const isStatic = typeof src === 'string' ? true : false

  // calculate image aspect ratio
  const imgAspectRatio =
    typeof width === 'number' && typeof height === 'number'
      ? (height / width) * 100
      : !isStatic
        ? 100 / (src?.customRatio || src?.aspectRatio)
        : null

  // calculate image dimensions
  const imgWidth = width ?? 2000
  const imgHeight =
    (height ?? imgAspectRatio)
      ? Math.round(imgWidth * imgAspectRatio) / 100
      : null

  // build image URL
  const imgUrl = isStatic
    ? src
    : buildSrc(src, { width: imgWidth, height: imgHeight, quality })

  // calculate alt text
  const imgAlt = alt ?? src?.alt
  const fallBackAlt = 'A decorative image from Usal Project'
  const imgAltText = imgAlt ? `${imgAlt} - ${fallBackAlt}` : fallBackAlt

  // define the loader
  const loader = !isStatic
    ? {
        loader: ({ width, quality }) => {
          return (
            buildSrc(src, {
              width,
              height: Math.round(width * imgAspectRatio) / 100,
              quality,
            }) + `&width=${width}`
          )
        },
      }
    : {}

  // handle loading state
  const [isLoaded, setIsLoaded] = useState(false)
  const handleOnLoad = () => {
    setIsLoaded(true)
    onLoadingComplete()
  }

  // Determine object position based on hotspot (default is centered)
  const objectPosition = src?.hotspot
    ? `${src.hotspot.x * 100}% ${src.hotspot.y * 100}%`
    : '50% 50%' // center if no hotspot data

  return (
    <div
      className={cx(
        'block transition-opacity duration-200 ease-linear',
        containerClassName,
        {
          'opacity-0': !isLoaded && !noAnimation,
          'absolute inset-0': fill,
        },
      )}
    >
      <NextImage
        alt={imgAltText}
        src={imgUrl}
        quality={quality}
        fill={fill}
        onLoadingComplete={handleOnLoad}
        style={{
          objectFit, // apply object fit (cover, contain, fill)
          objectPosition, // apply object position based on hotspot
        }}
        {...(!fill ? { width: imgWidth, height: imgHeight } : {})}
        {...loader}
        {...rest}
      />
    </div>
  )
}

export default React.memo(Image)
