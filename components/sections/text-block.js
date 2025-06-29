import React from 'react'

import BlockContent, { blockComponents } from '@components/block-content'

import { toSlug } from '@lib/helpers'

const colStartMap = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  7: 'col-start-7',
  8: 'col-start-8',
  9: 'col-start-9',
  10: 'col-start-10',
  11: 'col-start-11',
  12: 'col-start-12',
}

const colSpanMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
}

const textAlignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const TextBlock = ({ data }) => {
  const { grid, portableText, title, textAlignment } = data
  const {
    columnStartMobile,
    columnSpanMobile,
    columnStartDesktop,
    columnSpanDesktop,
  } = grid

  return (
    <section
      id={`section-${toSlug(title || 'text-block')}`}
      className="site-grid-container section-y-spacing"
    >
      <div
        className={[
          colStartMap[columnStartMobile],
          colSpanMap[columnSpanMobile],
          `sm:${colStartMap[columnStartDesktop]}`,
          `sm:${colSpanMap[columnSpanDesktop]}`,
          textAlignMap[textAlignment],
          'text-balance',
        ].join(' ')}
      >
        <BlockContent blocks={portableText} blockComponents={blockComponents} />
      </div>
    </section>
  )
}

export default TextBlock
