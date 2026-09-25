import os
from PIL import Image, ImageDraw
import numpy as np

# Load Blastoise
actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
orig_w, orig_h = actor.size

# Target card dimensions: 184 x 253
card_w, card_h = 184, 253
actor_w = 118
actor_h = int(actor_w * orig_h / orig_w) # 118 * 1346 / 1381 = 115

resized_actor = actor.resize((actor_w, actor_h), Image.LANCZOS)
alpha = np.array(resized_actor.split()[-1])

# Let's find exact coordinates on card
# If tail touches left boundary (x = 0):
# Find leftmost pixel in resized_actor
y_idx, x_idx = np.where(alpha > 20)
min_actor_x = np.min(x_idx) # pixel inside actor

# We want min_actor_x to land at x = 0 on card
# So actor_left_on_card = -min_actor_x (or 0 if min_actor_x is ~1px)
actor_left_on_card = 0 # if container left is at 0px
# In CSS: left: calc(50% - offset); transform: translateX(-50%)
# center_on_card = card_w / 2 - offset = 92 - offset
# left_on_card = center_on_card - actor_w / 2 = 92 - offset - 59 = 33 - offset
# If left_on_card = -min_actor_x:
# offset = 33 + min_actor_x
print(f"min_actor_x in 118px sprite: {min_actor_x}px")
offset_for_tangent = 33 + min_actor_x
print(f"Offset for tail exactly tangent to left card border: {offset_for_tangent}px")

# Bottom is at bottom: 2px -> y_on_card from top:
actor_top_on_card = card_h - 2 - actor_h
print(f"Actor top on card: {actor_top_on_card}px (actor height: {actor_h}px)")

# Now let's find feet base x-coordinates:
bottom_y = np.max(y_idx)
feet_mask = (y_idx > bottom_y - 12)
feet_x_min = np.min(x_idx[feet_mask]) + (33 - offset_for_tangent)
feet_x_max = np.max(x_idx[feet_mask]) + (33 - offset_for_tangent)
feet_x_center = (feet_x_min + feet_x_max) / 2
print(f"Feet on card: x range [{feet_x_min:.1f}, {feet_x_max:.1f}], center={feet_x_center:.1f}px")
print(f"Card center is at x={card_w/2:.1f}px. Feet center is {card_w/2 - feet_x_center:.1f}px to the left of card center!")
print(f"So ground glow left should be: calc(50% - {card_w/2 - feet_x_center:.0f}px)!")

# Now let's locate the nozzles of the two cannons!
# In original 1381x1346 image, let's find the cannon barrels / nozzles.
