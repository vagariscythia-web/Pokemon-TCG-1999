import math
from PIL import Image, ImageDraw

w, h = 184, 253
img = Image.new('RGBA', (w, h), (15, 23, 42, 255))
draw = ImageDraw.Draw(img)

# Card center
cx = w // 2 # 92
cy = h // 2 # 126

# Target area
target_x, target_y = 92, 55
draw.rectangle([cx - 50, target_y - 30, cx + 50, target_y + 40], outline=(56, 189, 248, 128))

# Left Cannon Nozzle
left_x = cx - 30 # 62
left_y = 253 - 102 # 151
draw.ellipse([left_x - 4, left_y - 4, left_x + 4, left_y + 4], fill=(255, 255, 255, 255))

# Right Cannon Nozzle
right_x = cx + 51 # 143
right_y = 253 - 100 # 153
draw.ellipse([right_x - 4, right_y - 4, right_x + 4, right_y + 4], fill=(255, 255, 255, 255))

# Target impact points
# Left stream hits around X=76, Y=50
# Right stream hits around X=108, Y=50
left_hit_x, left_hit_y = 76, 50
right_hit_x, right_hit_y = 108, 50

draw.line([left_x, left_y, left_hit_x, left_hit_y], fill=(14, 165, 233, 255), width=6)
draw.line([right_x, right_y, right_hit_x, right_hit_y], fill=(14, 165, 233, 255), width=6)

# Angles
angle_l = math.degrees(math.atan2(left_hit_x - left_x, left_y - left_hit_y))
angle_r = math.degrees(math.atan2(right_hit_x - right_x, right_y - right_hit_y))

print(f"Left stream angle: {angle_l:.1f} deg (dx={left_hit_x - left_x}, dy={left_hit_y - left_y})")
print(f"Right stream angle: {angle_r:.1f} deg (dx={right_hit_x - right_x}, dy={right_hit_y - right_y})")
print(f"Distance between hits at top: {right_hit_x - left_hit_x}px")

img.save("scratch/test_stream_geometry.png")
print("Saved geometry test to scratch/test_stream_geometry.png")
