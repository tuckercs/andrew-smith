import React from 'react'
import cx from 'classnames'

import { toSlug } from '@lib/helpers'
import BlockContent, { blockComponents } from '@components/block-content'
import Image from '@components/image'

const FiftyFifty = ({ data }) => {
  const { title, leftColumn, rightColumn, isHidden } = data

  if (isHidden) return null

  return (
    <section
      id={`section-${toSlug(title || 'fifty-fifty')}`}
      className="site-grid-container section-y-spacing section-x-spacing"
    >
      {/* Left Column */}
      <div className="col-span-6">
        {leftColumn?.columnContentType === 'text' &&
          leftColumn?.portableText && (
            <BlockContent
              blocks={leftColumn.portableText}
              blockComponents={blockComponents}
            />
          )}
        {leftColumn?.columnContentType === 'image' && leftColumn?.image && (
          <Image src={leftColumn.image} />
        )}
        {leftColumn?.columnContentType === 'accordion' &&
          leftColumn?.accordion && (
            <div>
              {/* TODO: Implement Accordion component */}
              {leftColumn.accordion}
            </div>
          )}
      </div>

      {/* Right Column */}
      <div className="col-span-6">
        {rightColumn?.columnContentType === 'text' &&
          rightColumn?.portableText && (
            <BlockContent
              blocks={rightColumn.portableText}
              blockComponents={blockComponents}
            />
          )}
        {rightColumn?.columnContentType === 'image' && rightColumn?.image && (
          <Image src={rightColumn.image} />
        )}
        {rightColumn?.columnContentType === 'accordion' &&
          rightColumn?.accordion && (
            <div>
              {/* TODO: Implement Accordion component */}
              {rightColumn.accordion}
            </div>
          )}
      </div>
    </section>
  )
}

export default FiftyFifty
