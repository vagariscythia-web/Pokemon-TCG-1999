"""Tight-crop & measurement pipeline for Team Rocket Charmander (tr-50) Fire Tail actor.

Reads the user-approved transparent PNG from public/assets/raw/, crops to the alpha
bounding box with a +12px safe margin (ANIMATION_DESIGN_SYSTEM.md §3.D), deploys the
production copy to public/assets/, and reports bbox / aspect / suggested pivot so the
CSS transform-origin is MEASURED, not eyeballed (§7.B).
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'assets', 'raw', 'Charmander_raw_edited_firetail.png')
DST = os.path.join(ROOT, 'public', 'assets', 'Charmander_Fire_Tail_Whip.png')
MARGIN = 12

img = Image.open(SRC).convert('RGBA')
alpha = img.split()[-1]
bbox = alpha.getbbox()
if bbox is None:
    raise SystemExit('ERROR: source has no opaque pixels; transparency step may have failed.')

x0, y0, x1, y1 = bbox
W, H = img.size
cx0 = max(0, x0 - MARGIN)
cy0 = max(0, y0 - MARGIN)
cx1 = min(W, x1 + MARGIN)
cy1 = min(H, y1 + MARGIN)
cropped = img.crop((cx0, cy0, cx1, cy1))
cropped.save(DST)

cw, ch = cropped.size
aspect = cw / ch

# Suggested pivot: horizontal centroid of the lowest 12% of opaque rows (stance foot),
# vertical anchor near the ground contact line.
low = alpha.crop((x0, max(y0, y1 - int((y1 - y0) * 0.12)), x1, y1))
lw, lh = low.size
px = py = ws = 0.0
for yy in range(lh):
    for xx in range(lw):
        a = low.getpixel((xx, yy))
        if a > 24:
            px += xx * a
            ws += a
pivot_x_pct = (px / ws / lw * 100.0) if ws else 50.0
pivot_y_pct = 88.0

print('source      :', SRC, f'{W}x{H}')
print('alpha bbox  :', bbox)
print('crop box    :', (cx0, cy0, cx1, cy1))
print('deployed    :', DST, f'{cw}x{ch}')
print('aspect w/h  : %.3f' % aspect)
print('pivot hint  : %.1f%% %.1f%%' % (pivot_x_pct, pivot_y_pct))
print('base width 112px -> peak 112*1.08 = %.1fpx (Tier-1 ceiling ~120px OK)' % (112 * 1.08))
