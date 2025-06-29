export const getRoute = ({ type, slug, hash, query }) => {
  // append static base paths based on the page type
  const basePath = {
    post: 'blog',
  }[type ?? '']

  // combine our base path with the slug
  const routePath = [basePath, slug].filter(Boolean).join('/')

  // construct the hash fragment if one exists
  const hashFragment = hash ? `#${hash}` : ''

  // construct the query string if one exists
  const queryString = query
    ? `?${Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join('&')}`
    : ''

  // return the full route path
  return `/${routePath}${queryString}${hashFragment}`
}
