from PIL import Image, ImageDraw

# Create 184x253 card canvas
card_w, card_h = 184, 253
img = Image.new('RGBA', (card_w, card_h), (9, 13, 22, 255))

# Paste Blastoise at left: calc(50% - 34px), bottom: 2px
actor = Image.open('public/assets/blastoise_full_body.png')
actor_w = 118
actor_h = int(actor_w * actor.size[1] / actor.size[0])
resized_actor = actor.resize((actor_w, actor_h), Image.LANCZOS)
actor_left = (card_w // 2 - 34) - actor_w // 2
actor_top = card_h - 2 - actor_h
img.paste(resized_actor, (actor_left, actor_top), resized_actor)

# Draw water streams
draw = ImageDraw.Draw(img)
# Left stream: (38, 148) -> (91, 50)
draw.line([(38, 148), (91, 50)], fill=(56, 189, 248, 255), width=8)
draw.line([(38, 148), (91, 50)], fill=(255, 255, 255, 255), width=3)
# Right stream: (102, 155) -> (170, 37)
draw.line([(102, 155), (170, 37)], fill=(56, 189, 248, 255), width=8)
draw.line([(102, 155), (170, 37)], fill=(255, 255, 255, 255), width=3)

# Load the rendered new splash
splash = Image.open('scratch/test_new_splash.png')
# Size is 320x240, scale to 160x120
splash_scaled = splash.resize((160, 120), Image.LANCZOS)
# Position center of splash (80, 100) at (91, 50)
# So splash_left = 91 - 80 = 11px, splash_top = 50 - 100 = -50px (or top: 48px in DOM where transform: translate(-50%, -50%) centers it at (91, 50))
# Let's paste centered at (91, 50):
splash_left = 91 - splash_scaled.size[0] // 2
splash_top = 50 - splash_scaled.size[1] // 2
img.paste(splash_scaled, (splash_left, splash_top), splash_scaled)

img.save('scratch/preview_new_splash_composite.png')
print("Composite saved to scratch/preview_new_splash_composite.png")
