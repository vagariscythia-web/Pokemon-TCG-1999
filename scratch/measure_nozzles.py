from PIL import Image
import numpy as np

im = Image.open('public/assets/blastoise_hydro_pump_actor.png')
w, h = im.size
rgb = np.array(im.convert('RGB'))
alpha = np.array(im.split()[-1])

# Left cannon rim: in region x in [250, 450], y in [50, 250]
# Right cannon rim: in region x in [950, 1200], y in [100, 300]
# Let's inspect the bounding box of the top tips of the cannons
y_idx, x_idx = np.where((alpha > 50) & (np.arange(h)[:, None] < 300))

left_cannon_mask = (x_idx < 600)
right_cannon_mask = (x_idx > 700)

print(f"Left cannon top tip: x={x_idx[left_cannon_mask][np.argmin(y_idx[left_cannon_mask])]}, y={np.min(y_idx[left_cannon_mask])}")
print(f"Right cannon top tip: x={x_idx[right_cannon_mask][np.argmin(y_idx[right_cannon_mask])]}, y={np.min(y_idx[right_cannon_mask])}")

# Let's find the center of the nozzle opening for left and right
# Left cannon opening center is around y ~ 100-180, x ~ 300-400
# Right cannon opening center is around y ~ 150-250, x ~ 1000-1150
# Let's print the min/max in those windows
print("Left cannon x in [250, 450], y in [50, 250]:")
mask_l = (x_idx >= 250) & (x_idx <= 450) & (y_idx >= 50) & (y_idx <= 250)
print(f"x range: [{np.min(x_idx[mask_l])}, {np.max(x_idx[mask_l])}], y range: [{np.min(y_idx[mask_l])}, {np.max(y_idx[mask_l])}]")
print(f"Mean center: x={np.mean(x_idx[mask_l]):.1f}, y={np.mean(y_idx[mask_l]):.1f}")

mask_r = (x_idx >= 950) & (x_idx <= 1200) & (y_idx >= 80) & (y_idx <= 300)
print("Right cannon x in [950, 1200], y in [80, 300]:")
print(f"x range: [{np.min(x_idx[mask_r])}, {np.max(x_idx[mask_r])}], y range: [{np.min(y_idx[mask_r])}, {np.max(y_idx[mask_r])}]")
print(f"Mean center: x={np.mean(x_idx[mask_r]):.1f}, y={np.mean(y_idx[mask_r]):.1f}")
