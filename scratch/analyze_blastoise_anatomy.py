from PIL import Image
import numpy as np

im = Image.open('public/assets/blastoise_hydro_pump_actor.png')
w, h = im.size
alpha = np.array(im.split()[-1])

# Find non-transparent pixels
y_indices, x_indices = np.where(alpha > 20)

min_x, max_x = np.min(x_indices), np.max(x_indices)
min_y, max_y = np.min(y_indices), np.max(y_indices)

print(f"Canvas size: {w}x{h}")
print(f"Opaque bbox (alpha > 20): x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")

# Let's inspect the leftmost part (tail or whatever it is)
# Find the pixels near min_x
leftmost_mask = (x_indices < min_x + 100)
print(f"Leftmost y range: [{np.min(y_indices[leftmost_mask])}, {np.max(y_indices[leftmost_mask])}]")
# What y level is the tail?
# Let's find horizontal profile along y
print("Silhouette slices:")
for y_pct in range(10, 100, 10):
    y_val = int(h * y_pct / 100)
    row = alpha[y_val, :]
    opaque = np.where(row > 20)[0]
    if len(opaque) > 0:
        print(f"y={y_val} ({y_pct}%): left={opaque[0]} ({opaque[0]/w*100:.1f}%), right={opaque[-1]} ({opaque[-1]/w*100:.1f}%), width={opaque[-1]-opaque[0]}")
    else:
        print(f"y={y_val} ({y_pct}%): empty")

# Feet base at the bottom
bottom_mask = (y_indices > max_y - 100)
print(f"Feet base x range: [{np.min(x_indices[bottom_mask])}, {np.max(x_indices[bottom_mask])}] (center={(np.min(x_indices[bottom_mask])+np.max(x_indices[bottom_mask]))/2:.1f}, {((np.min(x_indices[bottom_mask])+np.max(x_indices[bottom_mask]))/2)/w*100:.1f}%)")
