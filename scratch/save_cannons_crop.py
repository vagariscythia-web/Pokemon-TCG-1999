from PIL import Image, ImageDraw

actor = Image.open('public/assets/blastoise_hydro_pump_actor.png')
# Let's save a clear cropped view of the head and both cannons with pixel axes
w, h = actor.size
crop = actor.crop((100, 0, 1300, 600))
crop.save('scratch/cannons_head_crop.png')
print("Saved scratch/cannons_head_crop.png")
