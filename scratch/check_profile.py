from PIL import Image
import numpy as np

actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
alpha = np.array(actor.split()[-1])
rgb = np.array(actor.convert('RGB'))

# Find the upper silhouette
top_y = np.zeros(actor.width)
for x in range(actor.width):
    col = np.where(alpha[:, x] > 50)[0]
    if len(col) > 0:
        top_y[x] = col[0]
    else:
        top_y[x] = actor.height

# Let's find local minima of top_y (which are peaks / high points)
print("Upper profile local peaks (highest points):")
for x in range(50, actor.width - 50, 10):
    if top_y[x] < 300:
        print(f"x={x}: y={top_y[x]}")
