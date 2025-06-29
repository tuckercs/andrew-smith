import React, { useEffect, useState } from 'react'
import groq from 'groq'
import { useClient } from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Card, Flex, Heading, Spinner, Stack } from '@sanity/ui'
import pupa from 'pupa'
import { tw } from 'twind'
import spacetime from 'spacetime'

export const SeoPreview = ({ document, schemaType }) => {
  const documentSeo = document?.displayed?.seo
  const [defaultSeo, setDefaultSeo] = useState(undefined)
  const sanityClient = useClient({ apiVersion: '2023-01-01' })

  const builder = imageUrlBuilder(sanityClient)
  const urlFor = (source) => {
    return builder.image(source)
  }

  // fetch our default SEO Data
  useEffect(() => {
    async function fetchDefaultSeo() {
      const data = await sanityClient.fetch(groq`
        *[_type == "seoSettings"][0]{
          metaTitle,
          metaDesc,
          shareTitle,
          shareDesc,
          shareGraphic,
          "favicon": favicon.asset->url,
          "faviconLegacy": faviconLegacy.asset->url,
          "siteTitle": *[_type == "generalSettings"][0].siteTitle,
          "liveSiteDomain": *[_type == "generalSettings"][0].liveSiteDomain
        }
      `)

      setDefaultSeo(data)
    }

    if (!defaultSeo) fetchDefaultSeo()
  })

  // micro template for string variable replacement
  const template = {
    page: {
      title: document?.displayed?.title,
    },
    site: {
      title: defaultSeo?.siteTitle,
    },
  }

  // define our meta title and description
  const metaTitle = documentSeo?.metaTitle ?? defaultSeo?.metaTitle
  const metaDesc = documentSeo?.metaDesc ?? defaultSeo?.metaDesc
  const displayMetaTitle = pupa(metaTitle ?? '', template, {
    ignoreMissing: true,
  })
  const displayMetaDesc = pupa(metaDesc ?? '', template, {
    ignoreMissing: true,
  })

  // define our share title and description
  const shareTitle = documentSeo?.shareTitle ?? defaultSeo?.shareTitle
  const shareDesc = documentSeo?.shareDesc ?? defaultSeo?.shareDesc
  const shareGraphic = documentSeo?.shareGraphic ?? defaultSeo?.shareGraphic
  const displayShareTitle = pupa(shareTitle ?? '', template, {
    ignoreMissing: true,
  })
  const displayShareDesc = pupa(shareDesc ?? '', template, {
    ignoreMissing: true,
  })
  const displayShareGraphic = shareGraphic
    ? urlFor(shareGraphic.asset).width(1200).height(630).url()
    : null

  return (
    <>
      <PreviewContainer title="Google Search Results" isLoading={!defaultSeo}>
        <GoogleSearchPreview
          title={displayMetaTitle}
          description={displayMetaDesc}
          document={document?.displayed}
          defaultSeo={defaultSeo}
        />
      </PreviewContainer>

      <PreviewContainer title="Twitter Card" isLoading={!defaultSeo}>
        <TwitterCardPreview
          title={displayShareTitle}
          description={displayShareDesc}
          graphic={displayShareGraphic}
          document={document?.displayed}
          defaultSeo={defaultSeo}
        />
      </PreviewContainer>

      <PreviewContainer title="Facebook Card" isLoading={!defaultSeo}>
        <FacebookCardPreview
          title={displayShareTitle}
          description={displayShareDesc}
          graphic={displayShareGraphic}
          document={document?.displayed}
          defaultSeo={defaultSeo}
        />
      </PreviewContainer>
    </>
  )
}

const PreviewContainer = ({ title, isLoading, children }) => {
  return (
    <Stack>
      <Card padding={4} borderBottom>
        <Heading as="h2" size={1}>
          {title}
        </Heading>
      </Card>
      <Card padding={4} tone="transparent" borderBottom>
        {isLoading ? (
          <Flex justify="center" padding={4}>
            <Spinner muted />
          </Flex>
        ) : (
          <Card
            padding={4}
            radius={4}
            border
            style={{
              backgroundColor: '#fff',
            }}
          >
            {children}
          </Card>
        )}
      </Card>
    </Stack>
  )
}

const GoogleSearchPreview = ({ title, description, document, defaultSeo }) => {
  return (
    <div>
      <div className={tw`flex items-center`} style={{ fontSize: '14px' }}>
        <span
          className={tw`inline-block rounded-full w-6 h-6 border mr-2`}
          style={{
            padding: '0 3px',
            backgroundColor: '#f1f3f4',
            borderColor: '#ecedef',
            lineHeight: '22px',
          }}
        >
          <span
            className={tw`inline-block align-middle`}
            style={{
              marginBottom: '4px',
            }}
          >
            {defaultSeo?.favicon && (
              <img
                src={defaultSeo?.favicon}
                className={tw`block w-4 h-4`}
                alt=""
              />
            )}
          </span>
        </span>
        <span
          className={tw`overflow-hidden whitespace-nowrap`}
          style={{
            color: '#202124',
            maxWidth: '200px',
            textOverflow: 'ellipsis',
          }}
        >
          {defaultSeo?.liveSiteDomain.split('://')[1]}
        </span>
        <span
          className={tw`inline-block text-center`}
          style={{
            width: '16px',
            color: '#202124',
          }}
        >
          {' '}
          ·{' '}
        </span>
        <span
          className={tw`inline-block`}
          style={{
            color: '#4d5156',
          }}
        >
          {defaultSeo?.liveSiteDomain}
          {document?.slug?.current && ` › ${document?.slug?.current}`}
        </span>

        <span
          className={tw`ml-2 inline-block fill-current`}
          style={{
            width: '18px',
            height: '18px',
            color: '#4d5156',
          }}
        >
          <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </span>
      </div>
      <div
        className={tw`my-1 text-xl font-normal hover:underline`}
        style={{
          color: '#1a0dab',
        }}
      >
        {title}
      </div>
      <p
        className={tw`text-sm max-w-prose`}
        style={{
          color: '#4d5156',
        }}
      >
        {description}
      </p>
    </div>
  )
}

const TwitterCardPreview = ({
  title,
  description,
  graphic,
  document,
  defaultSeo,
}) => {
  const author = {
    name: 'Tucker Schoos',
    handle: 'tuckercs',
    avatar:
      'https://pbs.twimg.com/profile_images/1756093315252891649/JKkH0Asg_400x400.jpg',
  }

  return (
    <div>
      <div className={tw`relative text-sm flex items-start max-w-prose mb-2`}>
        <div
          className={tw`flex-shrink-0 relative mr-4`}
          style={{
            flexBasis: '48px',
          }}
        >
          <img
            className={tw`w-12 h-12 rounded-full overflow-hidden`}
            src={author.avatar}
            alt=""
          />
        </div>

        <div className={tw`flex-1 flex flex-col`}>
          <div
            className={tw`flex items-center mb-1`}
            style={{
              fontSize: '15px',
              color: '#000',
            }}
          >
            <span className={tw`font-bold hover:underline`}>{author.name}</span>
            <span className={tw`ml-1`}>@{author.handle}</span>
            <span
              className={tw`flex-shrink-0 px-2`}
              style={{
                color: '#536471',
              }}
            >
              ·
            </span>
            <span
              className={tw`hover:underline`}
              style={{
                color: '#536471',
              }}
            >
              {spacetime.now().format('{month-short} {date}, {year}')}
            </span>
          </div>
          <p
            style={{
              fontSize: '15px',
              color: '#000',
            }}
          >
            Tweet about this...
          </p>

          <div
            className={tw`mt-3 border rounded-2xl overflow-hidden`}
            style={{
              borderColor: '#cfd9de',
            }}
          >
            <div
              className={tw`relative border-b`}
              style={{
                borderColor: '#cfd9de',
              }}
            >
              {graphic ? (
                <img src={graphic} />
              ) : (
                <span
                  className={tw`block bg-gray-100`}
                  style={{
                    paddingTop: '52.5%',
                  }}
                >
                  <span
                    className={tw`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-500 font-bold`}
                  >
                    Share Graphic not set!
                  </span>
                </span>
              )}
            </div>

            <div
              className={tw`p-3 flex flex-col`}
              style={{
                gap: '2px',
                fontSize: '15px',
                color: '#000',
              }}
            >
              <span
                style={{
                  color: '#536471',
                }}
              >
                {defaultSeo?.liveSiteDomain.split('://')[1]}
              </span>
              <span>{title}</span>
              <span>{description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FacebookCardPreview = ({
  title,
  description,
  graphic,
  document,
  defaultSeo,
}) => {
  const author = {
    name: 'Tucker Schoos',
    handle: 'tuckercs',
    avatar:
      'https://pbs.twimg.com/profile_images/1756093315252891649/JKkH0Asg_400x400.jpg',
  }

  return (
    <div>
      <div className={tw`relative text-sm flex items-start max-w-prose mb-2`}>
        <div
          className={tw`flex-shrink-0 relative mr-4`}
          style={{
            width: '42px',
            height: '42px',
            flexBasis: '42px',
          }}
        >
          <img
            className={tw`w-full h-full rounded-full overflow-hidden`}
            src={author.avatar}
            alt=""
          />

          <span
            className={tw`absolute bottom-0 right-0 rounded-full border border-white z-10`}
            style={{
              marginBottom: '-2px',
              marginRight: '-2px',
              width: '14px',
              height: '14px',
              borderWidth: '3px',
              backgroundColor: '#31a24c',
            }}
          />
        </div>

        <div className={tw`flex-1 flex flex-col`}>
          <div
            className={tw`flex flex-col mb-1`}
            style={{
              fontSize: '15px',
            }}
          >
            <span
              className={tw`font-semibold hover:underline`}
              style={{
                color: '#050505',
              }}
            >
              {author.name}
            </span>
            <span
              className={tw`hover:underline`}
              style={{
                fontSize: '13px',
                color: '#65676b',
              }}
            >
              {spacetime.now().format('{month} {date}, {year}')}
            </span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: '15px',
          color: '#050505',
        }}
      >
        What's on your mind?
      </p>

      <div
        className={tw`mt-3 overflow-hidden`}
        style={{
          marginLeft: '-1.25rem',
          marginRight: '-1.25rem',
        }}
      >
        <div className={tw`relative`}>
          {graphic ? (
            <img src={graphic} />
          ) : (
            <span
              className={tw`block bg-gray-100`}
              style={{
                paddingTop: '52.5%',
              }}
            >
              <span
                className={tw`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-500 font-bold`}
              >
                Share Graphic not set!
              </span>
            </span>
          )}
        </div>

        <div
          className={tw`p-3 border-b leading-tight`}
          style={{
            fontSize: '15px',
            backgroundColor: '#f0f2f5',
            borderColor: '#ced0d4',
            color: '#050505',
          }}
        >
          <div
            className={tw`mb-1 uppercase`}
            style={{
              color: '#536471',
              fontSize: '13px',
            }}
          >
            {defaultSeo?.liveSiteDomain.split('://')[1]}
          </div>
          <div
            className={tw`font-semibold`}
            style={{
              fontSize: '17px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#65676b',
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}
