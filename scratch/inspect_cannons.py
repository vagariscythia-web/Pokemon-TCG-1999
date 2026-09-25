from PIL import Image
import numpy as np

# Load image
actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
w, h = actor.size

# Let's inspect where the nozzles are in the original image (1381x1346)
# Left cannon (viewer's left / Blastoise's right cannon):
# It points towards the right / center, or left-up?
# Let's crop around the two cannons and check:
# Left cannon is on the left side of Blastoise's back/shoulder: x in [150, 450], y in [50, 350]
# Right cannon is on the right side of Blastoise's back/shoulder: x in [800, 1150], y in [50, 350]

crop_l = actor.crop((150, 50, 450, 350))
crop_l.save('scratch/nozzle_l_crop.png')

crop_r = actor.crop((800, 50, 1150, 350))
crop_r.save('scratch/nozzle_r_crop.png')

print("Cropped cannons saved to scratch/")
