import { ImageIcon } from '@phosphor-icons/react'
import { defineField } from 'sanity'
import { customImage } from '@s/lib/custom-image'
import { customVideo } from '@s/lib/custom-video'

export const customMedia = (options = {}) => {
  const {
    name = 'media',
    title = 'Media',
    imageOptions = {},
    videoOptions = {},
    hideImage = false,
    hideVideo = false,
    hideCarousel = false,
    ...props
  } = options

  const typeOptions = [
    !hideImage && { title: 'Image', value: 'image' },
    !hideVideo && { title: 'Video', value: 'video' },
    !hideCarousel && { title: 'Image Carousel', value: 'carousel' },
  ].filter(Boolean)

  return {
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'type',
        title: 'Media Type',
        type: 'string',
        options: {
          layout: 'radio',
          list: typeOptions,
        },
        validation: (Rule) => Rule.required(),
      }),
      !hideImage &&
        defineField({
          name: 'image',
          title: 'Image',
          ...customImage({
            ...imageOptions,
            name: 'image',
            title: 'Image',
          }),
          hidden: ({ parent }) => parent?.type !== 'image',
          validation: (Rule) =>
            Rule.custom((value, context) =>
              context?.parent?.type === 'image' && !value?.asset
                ? 'Image is required'
                : true,
            ),
        }),
      !hideVideo &&
        defineField({
          name: 'video',
          title: 'Video',
          ...customVideo({
            ...videoOptions,
            name: 'video',
            title: 'Video',
          }),
          hidden: ({ parent }) => parent?.type !== 'video',
          validation: (Rule) =>
            Rule.custom((value, context) =>
              context?.parent?.type === 'video' && !value?.video
                ? 'Video file is required'
                : true,
            ),
        }),
      !hideCarousel &&
        defineField({
          name: 'carousel',
          title: 'Images',
          type: 'array',
          of: [
            {
              ...customImage({
                ...imageOptions,
                name: 'carouselItem',
                title: 'Image',
                validation: null,
              }),
            },
          ],
          hidden: ({ parent }) => parent?.type !== 'carousel',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const isCarousel = context?.parent?.type === 'carousel'
              const isEmpty = !value || value.length === 0
              return isCarousel && isEmpty
                ? 'You must add at least one image'
                : true
            }),
        }),
    ].filter(Boolean),
    preview: {
      select: {
        type: 'type',
        image: 'image.asset',
        videoPoster: 'video.poster.asset',
        carouselFirst: 'carousel.0.asset',
      },
      prepare({ type, image, videoPoster, carouselFirst }) {
        let media = ImageIcon
        if (type === 'image' && image) media = image
        else if (type === 'video' && videoPoster) media = videoPoster
        else if (type === 'carousel' && carouselFirst) media = carouselFirst

        return {
          title: `Media (${type || 'unset'})`,
          subtitle: `Type: ${type || 'unknown'}`,
          media,
        }
      },
    },
    ...props,
  }
}
