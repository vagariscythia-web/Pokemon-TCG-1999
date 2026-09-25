from PIL import Image
import numpy as np

img = Image.open('scratch/two_triangles.png')
print('two_triangles size:', img.size)

# Let's inspect the shapes
# In image 2:
# Is it the two water jets, or is it something in the center?
# Let's find out by checking where the center of the two triangular shapes is relative to the card!
# Card size is 184x253 (scaled in screenshot to 220x266 or similar).
card = Image.open('scratch/full_card2.png')
print('Card image size:', card.size)
a = np.array(card)

# Let's find the centers of the two triangular shapes in card coordinates:
# They are bright pixels in the top region y in [20, 110]
y_idx, x_idx = np.where((a[:, :, 0] > 160) & (a[:, :, 1] > 200) & (a[:, :, 2] > 230) & (np.arange(card.size[1])[:, None] < 110))
print(f'Top bright pixels: {len(x_idx)}')
# Separate into two shapes:
if len(x_idx) > 0:
    mid_x = (x_idx.min() + x_idx.max()) / 2
    l_mask = x_idx < mid_x
    r_mask = x_idx >= mid_x
    print(f'Left shape: center=({x_idx[l_mask].mean():.1f}, {y_idx[l_mask].mean():.1f}), bbox=[{x_idx[l_mask].min()}, {x_idx[l_mask].max()}] x [{y_idx[l_mask].min()}, {y_idx[l_mask].max()}]')
    print(f'Right shape: center=({x_idx[r_mask].mean():.1f}, {y_idx[r_mask].mean():.1f}), bbox=[{x_idx[r_mask].min()}, {x_idx[r_mask].max()}] x [{y_idx[r_mask].min()}, {y_idx[r_mask].max()}]')
