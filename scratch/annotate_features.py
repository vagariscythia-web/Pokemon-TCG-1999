from PIL import Image, ImageDraw

actor = Image.open('public/assets/blastoise_hydro_pump_actor.png').convert('RGBA')
draw = ImageDraw.Draw(actor)

# Mark the two nozzles:
# Left nozzle opening: (455, 140)
draw.ellipse([455-20, 140-20, 455+20, 140+20], outline=(255, 0, 0, 255), width=6)
draw.text((455+25, 140), "LEFT NOZZLE (455, 140)", fill=(255, 0, 0, 255))

# Right nozzle opening: (759, 189)
draw.ellipse([759-20, 189-20, 759+20, 189+20], outline=(0, 255, 0, 255), width=6)
draw.text((759+25, 189), "RIGHT NOZZLE (759, 189)", fill=(0, 255, 0, 255))

# Also mark tail:
draw.ellipse([13-10, 950-10, 13+10, 950+10], fill=(255, 255, 0, 255))
draw.text((30, 950), "TAIL TIP (13, 950)", fill=(255, 255, 0, 255))

actor.save('scratch/annotated_blastoise_features.png')
print("Saved annotated_blastoise_features.png")
