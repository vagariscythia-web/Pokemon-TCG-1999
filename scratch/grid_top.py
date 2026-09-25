from PIL import Image, ImageDraw
import numpy as np

im = Image.open('public/assets/blastoise_hydro_pump_actor.png')
w, h = im.size
print(f"Image size: {w}x{h}")

# Let's inspect the top region (y < 400)
# Let's save a visualization with a grid over the top part
top_crop = im.crop((0, 0, w, 500))
draw = ImageDraw.Draw(top_crop)

for x in range(0, w, 100):
    draw.line([(x, 0), (x, 500)], fill=(255, 255, 0, 100), width=1)
    draw.text((x+2, 10), str(x), fill=(255, 255, 0, 255))

for y in range(0, 500, 50):
    draw.line([(0, y), (w, y)], fill=(255, 255, 0, 100), width=1)
    draw.text((10, y+2), str(y), fill=(255, 255, 0, 255))

top_crop.save('scratch/top_grid.png')
print("Saved scratch/top_grid.png")
