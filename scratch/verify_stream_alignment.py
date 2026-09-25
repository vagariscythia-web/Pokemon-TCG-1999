from PIL import Image, ImageDraw
import math

# Load Blastoise card if possible or create canvas
card_w, card_h = 184, 253
canvas = Image.new('RGBA', (card_w, card_h), (10, 15, 30, 255))

# Try pasting Blastoise
try:
    blastoise = Image.open('public/assets/blastoise_full_body.png').convert('RGBA')
    bw = 114
    bh = int(bw * (974 / 1023))
    blastoise = blastoise.resize((bw, bh), Image.LANCZOS)
    bx = (card_w - bw) // 2
    by = card_h - 4 - bh
    canvas.paste(blastoise, (bx, by), blastoise)
    print(f"Pasted Blastoise at ({bx}, {by}), size ({bw}, {bh})")
except Exception as e:
    print(f"Could not load Blastoise: {e}")

draw = ImageDraw.Draw(canvas)

# Nozzles
cx = card_w // 2 # 92
lx = cx - 30 # 62
ly = card_h - 102 # 151

rx = cx + 51 # 143
ry = card_h - 100 # 153

draw.ellipse([lx - 3, ly - 3, lx + 3, ly + 3], fill=(0, 255, 255, 255))
draw.ellipse([rx - 3, ry - 3, rx + 3, ry + 3], fill=(0, 255, 255, 255))

# Target hits
hit_lx, hit_ly = 76, 48
hit_rx, hit_ry = 112, 48

# Draw stream centerlines
draw.line([lx, ly, hit_lx, hit_ly], fill=(56, 189, 248, 255), width=8)
draw.line([rx, ry, hit_rx, hit_ry], fill=(56, 189, 248, 255), width=8)

# Draw stream core lines
draw.line([lx, ly, hit_lx, hit_ly], fill=(255, 255, 255, 255), width=3)
draw.line([rx, ry, hit_rx, hit_ry], fill=(255, 255, 255, 255), width=3)

# Draw impact zone
draw.ellipse([80, 36, 108, 60], outline=(255, 255, 255, 255), width=2)

canvas.save("scratch/blastoise_stream_alignment.png")
print("Saved stream alignment to scratch/blastoise_stream_alignment.png")
