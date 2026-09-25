from PIL import Image, ImageDraw

actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
w, h = actor.size

# Let's inspect left cannon nozzle
# In original image, left cannon is near top left:
# Let's crop x in [300, 550], y in [0, 250]
c_left = actor.crop((300, 0, 550, 250))
c_left_draw = ImageDraw.Draw(c_left)
# Draw relative grid
for x in range(0, 250, 20):
    c_left_draw.line([(x, 0), (x, 250)], fill=(255, 255, 0, 120))
    c_left_draw.text((x, 5), str(300+x), fill=(255, 255, 0, 255))
for y in range(0, 250, 20):
    c_left_draw.line([(0, y), (250, y)], fill=(255, 255, 0, 120))
    c_left_draw.text((5, y), str(y), fill=(255, 255, 0, 255))
c_left.save('scratch/left_cannon_grid.png')

# Right cannon: crop x in [650, 900], y in [50, 300]
c_right = actor.crop((650, 50, 900, 300))
c_right_draw = ImageDraw.Draw(c_right)
for x in range(0, 250, 20):
    c_right_draw.line([(x, 0), (x, 250)], fill=(255, 255, 0, 120))
    c_right_draw.text((x, 5), str(650+x), fill=(255, 255, 0, 255))
for y in range(0, 250, 20):
    c_right_draw.line([(0, y), (250, y)], fill=(255, 255, 0, 120))
    c_right_draw.text((5, y), str(50+y), fill=(255, 255, 0, 255))
c_right.save('scratch/right_cannon_grid.png')

print("Saved left_cannon_grid.png and right_cannon_grid.png")
