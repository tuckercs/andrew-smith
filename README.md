# Base v2

This is a template project built with [Next.js](https://nextjs.org/) and [Sanity CMS](https://www.sanity.io/). The project uses JavaScript, Tailwind CSS, and various modern web development tools.

## Tech Stack

- **Framework**: Next.js 13.5.6
- **Language**: JavaScript
- **CMS**: Sanity v3.91.0
- **Styling**: Tailwind CSS v4.0.7
- **Package Manager**: Yarn 4.9.2
- **State Management**: Jotai
- **Animation**: GSAP
- **Form Handling**: Formspree
- **Analytics**: Vercel Analytics

## Getting Started

1. Install dependencies:

```bash
yarn
```

2. Initialize a new Sanity instance (this will create a new Sanity project):

```bash
npx sanity@latest init
```

When prompted, you can use the default options. Once it starts creating new config files, press `Ctrl+C` to cancel - we only need the Sanity project creation.

3. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/components` - React components
- `/pages` - Next.js pages and API routes
- `/sanity` - Sanity CMS schema and configuration
- `/styles` - Global styles and Tailwind configuration
- `/public` - Static assets
- `/lib` - Utility functions and shared code

## Development

The project uses several development tools:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- PostCSS for CSS processing
- next-sitemap for sitemap generation

## Sanity Studio

The Sanity Studio is integrated into the project. You can access it at `/admin` when running the development server.

## Deployment

This project is configured for deployment on Vercel. The deployment process is automated through the Sanity Vercel Deploy plugin.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
