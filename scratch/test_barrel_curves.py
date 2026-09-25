from PIL import Image, ImageDraw
import math

# Create canvas for 184x253 card
card_w, card_h = 184, 253
canvas = Image.new('RGBA', (card_w, card_h), (15, 23, 42, 255))

# Paste Blastoise
blastoise = Image.open('public/assets/blastoise_full_body.png').convert('RGBA')
bw = 114
bh = int(bw * (974 / 1023))
blastoise = blastoise.resize((bw, bh), Image.LANCZOS)
bx = (card_w - bw) // 2
by = card_h - 4 - bh
canvas.paste(blastoise, (bx, by), blastoise)

draw = ImageDraw.Draw(canvas)

# Left nozzle: X=62, Y=151. Barrel angle: -28 deg
# Right nozzle: X=143, Y=153. Barrel angle: +40 deg
lx, ly = 62, 151
rx, ry = 143, 153

# Option A: Barrel-aligned streams curving into target
# Left stream: starts at (62, 151), goes along -25 deg to (40, 100), then curves to (75, 45)
# Right stream: starts at (143, 153), goes along +35 deg to (165, 100), then curves to (110, 45)

# Let's draw curved bezier paths using PIL
def draw_bezier(points, color, width):
    # quadratic bezier
    p0, p1, p2 = points
    prev = p0
    for t_i in range(1, 21):
        t = t_i / 20.0
        x = (1-t)**2 * p0[0] + 2*(1-t)*t * p1[0] + t**2 * p2[0]
        y = (1-t)**2 * p0[1] + 2*(1-t)*t * p1[1] + t**2 * p2[1]
        draw.line([prev, (x, y)], fill=color, width=width)
        prev = (x, y)

# Left stream: p0=(62, 151), p1=(30, 80), p2=(76, 45)
draw_bezier([(lx, ly), (35, 75), (76, 45)], (14, 165, 233, 255), 14)
draw_bezier([(lx, ly), (35, 75), (76, 45)], (255, 255, 255, 255), 6)

# Right stream: p0=(143, 153), p1=(175, 80), p2=(110, 45)
draw_bezier([(rx, ry), (170, 75), (110, 45)], (14, 165, 233, 255), 14)
draw_bezier([(rx, ry), (170, 75), (110, 45)], (255, 255, 255, 255), 6)

# Central impact zone
draw.ellipse([65, 25, 125, 65], outline=(255, 255, 255, 255), width=3)

canvas.save("scratch/test_barrel_aligned_curves.png")
print("Saved test_barrel_aligned_curves.png")
