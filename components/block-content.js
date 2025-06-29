import React from 'react'
import { PortableText } from '@portabletext/react'
import pupa from 'pupa'
import cx from 'classnames'

import { walk } from '@lib/helpers'

import Image from '@components/image'
import Icon from '@components/icon'
import Link from '@components/link'

const BlockContent = ({ blocks, blockComponents, className }) => {
  if (!blocks || !blockComponents) return null

  // setup our walk function to replace variables
  const isText = (data) => data.text
  const replaceVariables = (data) => {
    data.text = pupa(data.text, {
      ignoreMissing: true,
    })
  }

  // replace variables in all blocks
  walk({ data: blocks, condition: isText, output: replaceVariables })

  return (
    <PortableText
      className={className}
      value={blocks}
      components={blockComponents}
    />
  )
}

export const blockComponents = {
  block: {
    normal: (props) => {
      const { children } = props.node

      // remove empty tags
      if (
        children.length === 1 &&
        children[0]._type === 'span' &&
        children[0].text.trim() === ''
      )
        return null

      return <div className="mb-5 text-body">{props.children}</div>
    },
    h1: (props) => {
      return <h1 className="text-h1">{props.children}</h1>
    },

    h2: (props) => {
      return <h2 className="text-h2">{props.children}</h2>
    },
    h2Mock: (props) => {
      return <p className="text-h2">{props.children}</p>
    },

    h3: (props) => {
      return <h3 className="text-h3 mb-12 last:mb-0">{props.children}</h3>
    },
    h3Mock: (props) => {
      return <p className="text-h3 mb-12 last:mb-0">{props.children}</p>
    },

    h4: (props) => {
      return <h4 className="text-h4">{props.children}</h4>
    },
    h4Mock: (props) => {
      return <p className="text-h4">{props.children}</p>
    },
  },
  types: {
    photo: ({ value }) => {
      return (
        <figure
          className={cx('relative my-42 first:mt-0 last:mb-0', {
            'full-bleed sm:my-80': value.bleed === 'full',
          })}
        >
          <div
            className={cx('isolate overflow-hidden rounded-12 sm:rounded-16', {
              'border border-darkGray': value.style === 'bordered',
            })}
          >
            <Image
              src={value}
              alt={value.alt || 'Image'}
              width={1800}
              sizes="(min-width: 1470px) 1300px, 100vw"
            />
          </div>
          {value.caption && (
            <figcaption className="text-small mt-12 sm:mt-16">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    horizontalRule: () => <hr />,
  },
  marks: {
    link: ({ value, children }) => {
      const { _key, type, page, url, style, size, link } = value

      const icon = link ? link[0].icon : null

      const href = {
        external: url,
        internal: page,
      }[type]

      const LinkType = Link
      const linkProps = {
        className:
          'break-words underline decoration-1 underline-offset-[6px] sm:break-normal hover:text-green transition-colors ease-linear duration-150',
      }

      return (
        <LinkType
          href={href}
          external={type === 'external'}
          {...linkProps}
          className={cx('', { flex: icon })}
        >
          {icon ? (
            <div className="mt-20 flex content-button">
              {children}
              {icon && (
                <Icon
                  name="Arrow"
                  viewBox="0 0 12 8"
                  color="#000"
                  className={cx('ml-10 w-10', {
                    'rotate-90': icon === 'arrowDown',
                  })}
                />
              )}
            </div>
          ) : (
            <span className="opacity-100 hover:opacity-50 transition-opacity">
              {children}
            </span>
          )}
        </LinkType>
      )
    },

    // ✅ alignment decorators
    alignLeft: ({ children }) => (
      <span className="block text-left">{children}</span>
    ),
    alignCenter: ({ children }) => (
      <span className="block text-center">{children}</span>
    ),
    alignRight: ({ children }) => (
      <span className="block text-right">{children}</span>
    ),
  },
  list: {
    bullet: ({ children }) => {
      return (
        <ul className="list-disc pl-15 marker:text-black/25">{children}</ul>
      )
    },
    number: ({ children }) => {
      return (
        <ol className="mb-26 ml-10 mt-20 list-decimal pl-20 marker:text-white/25 last:mb-0 sm:mb-30 sm:mt-24">
          {children}
        </ol>
      )
    },
  },
  listItem: {
    bullet: ({ children }) => <li className="text-body mb-0">{children}</li>,
    number: ({ children }) => <li className="text-body mb-0">{children}</li>,
  },
}

export default BlockContent
