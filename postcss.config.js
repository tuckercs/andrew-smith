const APP_ASSET_PREFIX_ENV = process.env.APP_ASSET_PREFIX

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
