from PIL import Image
import numpy as np

# Load left cannon crop
c_left = Image.open('scratch/left_cannon_grid.png')
# Let's find the dark hole of the cannon nozzle opening
# The inner hole of the cannon is darker than the metallic shell
actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
rgb = np.array(actor.convert('RGB'))
alpha = np.array(actor.split()[-1])

# Left cannon region:
sub_l = rgb[0:250, 300:550]
sub_a = alpha[0:250, 300:550]
# Darkness / brightness
brightness_l = np.mean(sub_l, axis=-1)
# The rim/opening has dark inner shadow:
# Let's find min brightness where alpha > 200
dark_pts = np.where((sub_a > 200) & (brightness_l < 100))
print("Left cannon dark hole center:")
if len(dark_pts[0]) > 0:
    mean_y = np.mean(dark_pts[0])
    mean_x = 300 + np.mean(dark_pts[1])
    print(f"Left nozzle opening center: x={mean_x:.1f}, y={mean_y:.1f}")

# Right cannon region:
sub_r = rgb[50:300, 650:900]
sub_a_r = alpha[50:300, 650:900]
brightness_r = np.mean(sub_r, axis=-1)
dark_pts_r = np.where((sub_a_r > 200) & (brightness_r < 100))
print("Right cannon dark hole center:")
if len(dark_pts_r[0]) > 0:
    mean_y_r = 50 + np.mean(dark_pts_r[0])
    mean_x_r = 650 + np.mean(dark_pts_r[1])
    print(f"Right nozzle opening center: x={mean_x_r:.1f}, y={mean_y_r:.1f}")
