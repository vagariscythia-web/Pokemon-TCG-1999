from PIL import Image, ImageDraw
import math

blastoise = Image.open('public/assets/blastoise_full_body.png').convert('RGBA')
draw = ImageDraw.Draw(blastoise)

# Blastoise native size: 1023 x 974
# Left cannon:
# Base of tube: around (300, 200)
# Lip of tube: around (242, 98)
# dx = 242 - 300 = -58
# dy = 98 - 200 = -102
# angle from vertical = atan2(-58, -102) = -29.6 degrees (pointing up-left ~ -30 deg)

# Right cannon:
# Base of tube: around (890, 200)
# Lip of tube: around (968, 112)
# dx = 968 - 890 = +78
# dy = 112 - 200 = -88
# angle from vertical = atan2(+78, -88) = +41.5 degrees (pointing up-right ~ +42 deg)

print("Left barrel axis: -29.6 degrees")
print("Right barrel axis: +41.5 degrees")

# Let's draw the barrel axes extended from the lips
# Left barrel lip: (242, 98)
lx, ly = 242, 98
# Vector along -30 deg:
# dx = sin(-30 deg) * L = -0.5 * L
# dy = -cos(-30 deg) * L = -0.866 * L
L = 400
draw.line([lx, ly, lx - int(0.5 * L), ly - int(0.866 * L)], fill=(255, 0, 0, 255), width=8)

# Right barrel lip: (968, 112)
rx, ry = 968, 112
# Vector along +42 deg:
# dx = sin(42 deg) * L = +0.669 * L
# dy = -cos(42 deg) * L = -0.743 * L
draw.line([rx, ry, rx + int(0.669 * L), ry - int(0.743 * L)], fill=(255, 0, 0, 255), width=8)

blastoise.save("scratch/cannon_barrel_axes.png")
print("Saved cannon_barrel_axes.png")
