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

# Blastoise at left: calc(50% - 34px), bottom: 2px
actor_left = (card_w // 2 - 34) - actor_w // 2 # 92 - 34 - 59 = -1px
actor_top = card_h - 2 - actor_h
img.paste(resized_actor, (actor_left, actor_top), resized_actor)

# Ground glow at left: calc(50% - 38px), bottom: 0px, width: 112px
glow_x = card_w // 2 - 38
draw.ellipse([glow_x - 56, card_h - 26, glow_x + 56, card_h], outline=(56, 189, 248, 255), width=2)

# Left stream:
# left: calc(50% - 54px) => x = 38px, bottom: 105px => y = 253 - 105 = 148px
# Angle: +28 deg, length = 112px
l_x, l_y = 38, 148
draw.ellipse([l_x-3, l_y-3, l_x+3, l_y+3], fill=(255, 255, 0, 255))
# Calculate endpoint of left stream:
angle_l = math.radians(28)
tip_l_x = l_x + 112 * math.sin(angle_l) # 38 + 52.6 = 90.6
tip_l_y = l_y - 112 * math.cos(angle_l) # 148 - 98.9 = 49.1
draw.line([(l_x, l_y), (tip_l_x, tip_l_y)], fill=(56, 189, 248, 255), width=6)
draw.ellipse([tip_l_x-4, tip_l_y-4, tip_l_x+4, tip_l_y+4], fill=(255, 255, 255, 255))

# Right stream:
# In Image 2, when Blastoise was at -16px, right stream was at calc(50% + 28px).
# Since Blastoise moved 18px left to -34px, right stream moves 18px left to calc(50% + 10px)!
# x = 92 + 10 = 102px, bottom: 98px => y = 253 - 98 = 155px
# Angle: +30 deg (as in Image 2), length = 136px
r_x, r_y = 102, 155
draw.ellipse([r_x-3, r_y-3, r_x+3, r_y+3], fill=(255, 255, 0, 255))
angle_r = math.radians(30)
tip_r_x = r_x + 136 * math.sin(angle_r) # 102 + 68 = 170
tip_r_y = r_y - 136 * math.cos(angle_r) # 155 - 117.8 = 37.2
draw.line([(r_x, r_y), (tip_r_x, tip_r_y)], fill=(56, 189, 248, 255), width=6)
draw.ellipse([tip_r_x-4, tip_r_y-4, tip_r_x+4, tip_r_y+4], fill=(255, 255, 255, 255))

# Where does left stream arrive?
# tip_l_x = 90.6, tip_l_y = 49.1
# THAT IS (91px, 49px) - virtually dead center of the card illustration!
print(f"Left stream nozzle: ({l_x}, {l_y}) -> tip arrives at: ({tip_l_x:.1f}, {tip_l_y:.1f})")
print(f"Right stream nozzle: ({r_x}, {r_y}) -> tip arrives at: ({tip_r_x:.1f}, {tip_r_y:.1f})")

# Target Blast Dome: should be centered EXACTLY at tip_l (91px, 50px)!
draw.ellipse([tip_l_x-30, tip_l_y-30, tip_l_x+30, tip_l_y+30], outline=(255, 255, 255, 255), width=2)

img.save('scratch/compare_streams.png')
print("Saved scratch/compare_streams.png")
