card_w, card_h = 184, 253
actor_w = 118
orig_w, orig_h = 1381, 1346
actor_h = actor_w * orig_h / orig_w
s = actor_w / orig_w # 0.085445

# When tail is tangent to left border (left_on_card = -1.1px so x=13 maps to 0.0px):
left_on_card = -1.1

# Left cannon nozzle opening center (in orig img):
# Let's inspect where the nozzle opening center is precisely:
# In scratch/measure_barrel_axes.py it was around:
# Left barrel tip / opening
# Let's find exact coordinates
lx_img, ly_img = 385, 183
rx_img, ry_img = 1065, 216

lx_card = left_on_card + lx_img * s
ly_bottom = 2 + (orig_h - ly_img) * s

rx_card = left_on_card + rx_img * s
ry_bottom = 2 + (orig_h - ry_img) * s

print(f"Card center is at X = {card_w/2}px")
print(f"Left nozzle on card: X = {lx_card:.1f}px (diff from center: {lx_card - card_w/2:.1f}px), bottom = {ly_bottom:.1f}px, top = {card_h - ly_bottom:.1f}px")
print(f"Right nozzle on card: X = {rx_card:.1f}px (diff from center: {rx_card - card_w/2:.1f}px), bottom = {ry_bottom:.1f}px, top = {card_h - ry_bottom:.1f}px")
