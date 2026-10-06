"""Render brand artwork from the bundled, open-source display font.

Optional regeneration tool; install fonttools[woff] and Pillow, then run
`python scripts/generate-brand-assets.py` from the repository root.
The website does not need these Python packages at build or runtime.
"""

from io import BytesIO
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont


PUBLIC = Path(__file__).resolve().parents[1] / 'public'
font = TTFont(PUBLIC / 'fonts' / 'Goldman-Bold.woff2')
font.flavor = None
ttf = BytesIO()
font.save(ttf)
font_data = ttf.getvalue()
cap_ratio = font['OS/2'].sCapHeight / font['head'].unitsPerEm


def display_font(cap_height):
    return ImageFont.truetype(BytesIO(font_data), round(cap_height / cap_ratio))


def draw_word(draw, text, top, width, cap_height):
    face = display_font(cap_height)
    left, upper, right, lower = draw.textbbox((0, 0), text, font=face)
    draw.text(((width - (right - left)) / 2 - left, top - upper),
              text, font=face, fill='black')


# Render at 4x for clean small browser icons.
icon = Image.new('RGB', (1000, 1000), 'white')
draw = ImageDraw.Draw(icon)
for index, char in enumerate('AFS'):
    draw_word(draw, char, 60 + index * 300, 1000, 272)

icon.resize((250, 250), Image.Resampling.LANCZOS).save(PUBLIC / 'favicon.png')
icon.resize((180, 180), Image.Resampling.LANCZOS).save(PUBLIC / 'apple-touch-icon.png')
icon.save(PUBLIC / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])

# Outline the same glyphs so the SVG icon has no font-loading dependency.
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 68 / font['OS/2'].sCapHeight
paths = []
for index, char in enumerate('AFS'):
    name = cmap[ord(char)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    advance = font['hmtx'][name][0]
    x = (250 - advance * scale) / 2
    y = 15 + index * 75 + 68
    paths.append(f'<path transform="translate({x:g} {y:g}) scale({scale:g} {-scale:g})" '
                 f'd="{pen.getCommands()}"/>')
(PUBLIC / 'favicon.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" '
    'viewBox="0 0 250 250"><rect width="250" height="250" fill="white"/>'
    '<g fill="black">' + ''.join(paths) + '</g></svg>\n'
)

# Keep the full name legible in social sharing previews.
card = Image.new('RGB', (2400, 1260), '#f5f5f5')
draw = ImageDraw.Draw(card)
for index, word in enumerate(['ANDREW', 'PETER', 'FUERST', 'SMITH']):
    draw_word(draw, word, 88 + index * 288, 2400, 200)
card.resize((1200, 630), Image.Resampling.LANCZOS).save(PUBLIC / 'OG.png')
