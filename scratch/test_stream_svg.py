"""
Generate high-fidelity SVG paths and render a mockup of the complete Hydro Pump animation.
"""
from PIL import Image, ImageDraw
import math

w, h = 184, 253
canvas = Image.new('RGBA', (w, h), (10, 15, 30, 255))

# Paste Blastoise
blastoise = Image.open('public/assets/blastoise_full_body.png').convert('RGBA')
bw = 114
bh = int(bw * (974 / 1023))
blastoise = blastoise.resize((bw, bh), Image.LANCZOS)
bx = (w - bw) // 2
by = h - 4 - bh
canvas.paste(blastoise, (bx, by), blastoise)

draw = ImageDraw.Draw(canvas)

# Nozzle coordinates
lx, ly = 62, 151
rx, ry = 143, 153

print(f"Canvas: {w}x{h}, Blastoise at ({bx}, {by})")

# Let's test generating the exact SVG paths for the curved hydro streams
# Left stream: Starts at (62, 151), curves through (35, 75) to (76, 45)
# Right stream: Starts at (143, 153), curves through (170, 75) to (110, 45)

# If we define the left stream inside an SVG of size 80x130:
# Nozzle exit is at (55, 125)
# Control point is at (15, 45)
# Impact point is at (70, 10)
# Let's verify coordinates:
# If SVG is positioned at left: 7px, top: 35px
# Then (55, 125) maps to (7 + 55, 35 + 125) = (62, 160) -> we can adjust!

print("Testing coordinate mapping...")
