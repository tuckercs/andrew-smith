# Display font

The site title uses **Goldman Bold**, an angular display face licensed under the SIL Open Font License 1.1. Its license and copyright notice are included in `goldman-OFL.txt`. The font is hosted locally.

CSS `size-adjust: 79.25%` preserves the title's visual capital height. The existing body, subheading, and monospace fonts are unchanged.

The brand icons and default sharing card also use Goldman Bold. Regenerate them with `scripts/generate-brand-assets.py`. Page-specific sharing images still work.

Source: [Google Fonts Goldman Bold](https://github.com/google/fonts/blob/9710da1eacb3be272583c3224dcb70f9da6eadbb/ofl/goldman/Goldman-Bold.ttf).

The complete font was compressed to WOFF2 using fontTools and Brotli without modifying its glyphs. No additional runtime or build dependency is required.
