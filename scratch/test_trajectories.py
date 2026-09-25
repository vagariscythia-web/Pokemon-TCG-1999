import math
from PIL import Image, ImageDraw

card_w, card_h = 184, 253
img = Image.new('RGBA', (card_w, card_h), (9, 13, 22, 255))
draw = ImageDraw.Draw(img)

# Load Blastoise
actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
orig_w, orig_h = actor.size
actor_w = 118
actor_h = int(actor_w * orig_h / orig_w)
resized_actor = actor.resize((actor_w, actor_h), Image.LANCZOS)

# Paste Blastoise with tail tangent to left border (left = -1px, bottom = 2px)
actor_left = -1
actor_top = card_h - 2 - actor_h
img.paste(resized_actor, (actor_left, actor_top), resized_actor)

# Card center line (X = 92)
draw.line([(card_w // 2, 0), (card_w // 2, card_h)], fill=(255, 255, 255, 40), width=1)

# Ground glow: centered at X = 54 (calc(50% - 38px)), bottom = 0
glow_x = card_w // 2 - 38
glow_w, glow_h = 112, 26
draw.ellipse([glow_x - glow_w//2, card_h - glow_h, glow_x + glow_w//2, card_h], outline=(56, 189, 248, 255), width=2)

# Blast Dome target: X = 90 (near 50%), Y = 52
target_x, target_y = 90, 52
draw.ellipse([target_x - 30, target_y - 30, target_x + 30, target_y + 30], outline=(14, 165, 233, 255), width=2)
draw.ellipse([target_x - 10, target_y - 10, target_x + 10, target_y + 10], fill=(255, 255, 255, 200))

# Left Nozzle:
# In resized_actor, let's find the nozzle:
# x in sprite is ~385 * (118/1381) = 32.9px
# actor_left + 32.9 = 31.9px
# y from bottom is 111px -> Y from top = 253 - 111 = 142px
nozzle_l_x, nozzle_l_y = 34, 142
draw.ellipse([nozzle_l_x - 4, nozzle_l_y - 4, nozzle_l_x + 4, nozzle_l_y + 4], fill=(255, 255, 0, 255))

# Right Nozzle:
# x in sprite is ~1065 * (118/1381) = 91px
# actor_left + 91 = 90px
# y from bottom is 98px -> Y from top = 253 - 98 = 155px
nozzle_r_x, nozzle_r_y = 92, 155
draw.ellipse([nozzle_r_x - 4, nozzle_r_y - 4, nozzle_r_x + 4, nozzle_r_y + 4], fill=(255, 255, 0, 255))

# Left Jet Vector: from nozzle_l to target
dx_l = target_x - nozzle_l_x
dy_l = target_y - nozzle_l_y
angle_l = math.degrees(math.atan2(dx_l, -dy_l)) # angle from vertical (+ = right, - = left)
draw.line([(nozzle_l_x, nozzle_l_y), (target_x, target_y)], fill=(56, 189, 248, 255), width=4)

# Right Jet Vector: from nozzle_r to target
dx_r = target_x - nozzle_r_x
dy_r = target_y - nozzle_r_y
angle_r = math.degrees(math.atan2(dx_r, -dy_r))
draw.line([(nozzle_r_x, nozzle_r_y), (target_x, target_y)], fill=(56, 189, 248, 255), width=4)

print(f"Left Jet: from ({nozzle_l_x}, {nozzle_l_y}) to ({target_x}, {target_y}), angle = {angle_l:.1f}°")
print(f"Right Jet: from ({nozzle_r_x}, {nozzle_r_y}) to ({target_x}, {target_y}), angle = {angle_r:.1f}°")

img.save('scratch/trajectory_test.png')
print("Saved scratch/trajectory_test.png")
