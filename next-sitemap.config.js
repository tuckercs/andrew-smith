/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://www.website.com',
  generateRobotsTxt: true, // (optional)
  changefreq: 'daily', // Frequency search engines should check for updates
  priority: 0.7, // Default priority of pages
  sitemapSize: 5000, // Maximum number of URLs per sitemap
  exclude: ['/admin/**', '/api/**'], // Exclude paths
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
