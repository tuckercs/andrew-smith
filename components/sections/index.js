import React from 'react'

import TextBlock from './text-block'
import FiftyFifty from './fifty-fifty'
import MediaBlock from './media-block'

const Section = ({ data, ...rest }) => {
  const SectionType =
    {
      textBlock: TextBlock,
      fiftyFifty: FiftyFifty,
      mediaBlock: MediaBlock,
    }[data?._type] || null

  return <SectionType data={data} {...rest} />
}

export const sectionComponents = {
  // ... existing components ...
  textBlock: TextBlock,
  fiftyFifty: FiftyFifty,
  mediaBlock: MediaBlock,
}

export default Section
