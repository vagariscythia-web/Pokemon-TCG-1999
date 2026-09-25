import math
from PIL import Image, ImageDraw

card_w, card_h = 184, 253
img = Image.new('RGBA', (card_w, card_h), (9, 13, 22, 255))
draw = ImageDraw.Draw(img)

# Load Blastoise
actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
orig_w, orig_h = actor.size
actor_w = 118
actor_h = int(actor_w * orig_h / orig_w) # 115
resized_actor = actor.resize((actor_w, actor_h), Image.LANCZOS)

# 1. Blastoise Actor:
# left: calc(50% - 34px); transform: translateX(-50%); bottom: 2px
actor_center_x = card_w // 2 - 34 # 92 - 34 = 58
actor_left = actor_center_x - actor_w // 2 # 58 - 59 = -1
actor_bottom = 2
actor_top = card_h - actor_bottom - actor_h

# 2. Ground Glow:
# left: calc(50% - 38px); transform: translateX(-50%); bottom: 0px; width: 112px; height: 26px
glow_center_x = card_w // 2 - 38 # 54
glow_w, glow_h = 112, 26
draw.ellipse([glow_center_x - glow_w//2, card_h - glow_h, glow_center_x + glow_w//2, card_h], fill=(56, 189, 248, 60), outline=(56, 189, 248, 180), width=2)

# Paste actor
img.paste(resized_actor, (actor_left, actor_top), resized_actor)

# 3. Card Center Reference Line
draw.line([(card_w // 2, 0), (card_w // 2, card_h)], fill=(255, 255, 255, 60), width=1)

# 4. Target Blast Dome:
# top: 52px; left: calc(50% - 2px) => (90, 52)
target_x = card_w // 2 - 2 # 90
target_y = 52
# Dome circle
draw.ellipse([target_x - 35, target_y - 35, target_x + 35, target_y + 35], outline=(14, 165, 233, 200), width=3)
draw.ellipse([target_x - 12, target_y - 12, target_x + 12, target_y + 12], fill=(255, 255, 255, 240))

# 5. Left Nozzle:
# left: calc(50% - 54px) => x = 38; bottom: 105px => top = 253 - 105 = 148
nozzle_l_x = card_w // 2 - 54 # 38
nozzle_l_y = card_h - 105 # 148
draw.ellipse([nozzle_l_x - 5, nozzle_l_y - 5, nozzle_l_x + 5, nozzle_l_y + 5], fill=(255, 255, 0, 255))

# 6. Right Nozzle:
# left: calc(50% - 28px) => x = 64; bottom: 101px => top = 253 - 101 = 152
nozzle_r_x = card_w // 2 - 28 # 64
nozzle_r_y = card_h - 101 # 152
draw.ellipse([nozzle_r_x - 5, nozzle_r_y - 5, nozzle_r_x + 5, nozzle_r_y + 5], fill=(255, 255, 0, 255))

# Vector Left: from (38, 148) to (90, 52)
dx_l = target_x - nozzle_l_x # 52
dy_l = target_y - nozzle_l_y # -96
angle_l = math.degrees(math.atan2(dx_l, -dy_l)) # +28.4 deg
draw.line([(nozzle_l_x, nozzle_l_y), (target_x, target_y)], fill=(56, 189, 248, 255), width=6)

# Vector Right: from (64, 152) to (90, 52)
dx_r = target_x - nozzle_r_x # 26
dy_r = target_y - nozzle_r_y # -100
angle_r = math.degrees(math.atan2(dx_r, -dy_r)) # +14.6 deg
draw.line([(nozzle_r_x, nozzle_r_y), (target_x, target_y)], fill=(56, 189, 248, 255), width=6)

print(f"Target Dome: ({target_x}, {target_y})")
print(f"Left Nozzle: ({nozzle_l_x}, {nozzle_l_y}), Angle = +{angle_l:.1f}°")
print(f"Right Nozzle: ({nozzle_r_x}, {nozzle_r_y}), Angle = +{angle_r:.1f}°")
print(f"Tail tip x: {actor_left + int(13 * actor_w / orig_w)}px (Card left boundary is 0px)")
print(f"Glow center x: {glow_center_x}px (Feet center: {(actor_left + int(123 * actor_w / orig_w) + actor_left + int(1135 * actor_w / orig_w))/2:.1f}px)")

img.save('scratch/full_convergence_verified.png')
print("Saved full_convergence_verified.png")
