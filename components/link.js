import React from 'react'
import NextLink from 'next/link'
import { getRoute } from '@lib/routes'

const Link = React.forwardRef(function Link(
  { data, as, href, external, shallow = false, className, children, ...rest },
  ref,
) {
  // fallback to direct href if no link object is passed
  const type = data?.type ?? null

  let finalHref = href ?? null
  let isExternal = external ?? false

  if (type === 'internal') {
    finalHref = getRoute(data.page)
    isExternal = false
  } else if (type === 'external') {
    finalHref = data.url
    isExternal = true
  } else if (type === 'file') {
    finalHref = data.download?.url
    isExternal = true
  } else if (type === 'email') {
    finalHref = `mailto:${data.email}`
    isExternal = true
  } else if (type === 'phone') {
    finalHref = `tel:${data.phone}`
    isExternal = true
  }

  if (!finalHref) return children

  const LinkComponent = !isExternal ? NextLink : (as ?? 'a')
  const scrollProp = !isExternal ? { scroll: false } : {}
  const shallowProp = !isExternal ? { shallow } : {}

  return (
    <LinkComponent
      ref={ref}
      href={finalHref}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={className}
      {...scrollProp}
      {...shallowProp}
      {...rest}
    >
      {children}
    </LinkComponent>
  )
})

export default Link
