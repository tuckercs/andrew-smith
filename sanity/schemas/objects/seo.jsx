import { defineType, defineField } from 'sanity';

export default defineType({
  title: 'SEO / Share',
  name: 'seo',
  type: 'object',
  fields: [
    defineField({
      title: 'Meta Title',
      name: 'metaTitle',
      type: 'string',
      description: 'Title used for search engines and browsers',
      validation: (Rule) =>
        Rule.max(50).warning(
          'Longer titles may be truncated by search engines'
        ),
    }),
    defineField({
      title: 'Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      description: 'Description for search engines',
      validation: (Rule) =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by search engines'
        ),
    }),
    defineField({
      title: 'Share Title',
      name: 'shareTitle',
      type: 'string',
      description: 'Title used for social sharing cards',
      validation: (Rule) =>
        Rule.max(50).warning('Longer titles may be truncated by social sites'),
    }),
    defineField({
      title: 'Share Description',
      name: 'shareDesc',
      type: 'text',
      rows: 3,
      description: 'Description used for social sharing cards',
      validation: (Rule) =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by social sites'
        ),
    }),
    defineField({
      title: 'Share Graphic',
      name: 'shareGraphic',
      type: 'image',
      description: 'Recommended size: 1200x630 (PNG or JPG)',
    }),
    defineField({
      title: 'Exclude this page from the XML Sitemap?',
      name: 'excludeFromSitemap',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
