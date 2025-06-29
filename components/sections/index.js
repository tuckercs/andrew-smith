import React from 'react'

import TextBlock from './text-block'
import FiftyFifty from './fifty-fifty'
import MediaBlock from './media-block'
import Portfolio from './portfolio'

const Section = ({ data, ...rest }) => {
  const SectionType =
    {
      textBlock: TextBlock,
      fiftyFifty: FiftyFifty,
      mediaBlock: MediaBlock,
      portfolio: Portfolio,
    }[data?._type] || null

  return <SectionType data={data} {...rest} />
}

export const sectionComponents = {
  // ... existing components ...
  textBlock: TextBlock,
  fiftyFifty: FiftyFifty,
  mediaBlock: MediaBlock,
  portfolio: Portfolio,
}

export default Section
