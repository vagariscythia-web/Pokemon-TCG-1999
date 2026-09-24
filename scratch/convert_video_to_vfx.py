import cv2
import numpy as np
from PIL import Image
import os
import sys

cap = cv2.VideoCapture(r'public/assets/raw/Mewtwo_psionic_mist.mp4')
all_frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
cap.release()

total_f = len(all_frames)
print(f'Total frames read: {total_f}')

# Sample 30 frames from 0 to 72
n_frames = 30
indices = np.linspace(0, 72, n_frames, dtype=int)
print('Sampled indices:', indices)

processed_pil = []
processed_cv = []
frame_size = 256

for idx in indices:
    f = all_frames[idx]
    crop = f[:, 420:1500]  # 1080x1080 center square
    resized = cv2.resize(crop, (frame_size, frame_size), interpolation=cv2.INTER_AREA)
    
    b = resized[:, :, 0].astype(np.float32)
    g = resized[:, :, 1].astype(np.float32)
    r = resized[:, :, 2].astype(np.float32)
    
    # Calculate luminance
    max_c = np.maximum(np.maximum(r, g), b)
    floor = min(16.0, float(max_c.min()) + 2.0)
    luma = np.maximum(0.0, max_c - floor) / (255.0 - floor)
    alpha = np.clip(np.power(luma, 0.85) * 255.0, 0, 255).astype(np.uint8)
    
    # Unmultiply color
    safe_a = np.maximum(alpha.astype(np.float32) / 255.0, 1e-4)
    unmul_b = np.clip(b / safe_a, 0, 255).astype(np.uint8)
    unmul_g = np.clip(g / safe_a, 0, 255).astype(np.uint8)
    unmul_r = np.clip(r / safe_a, 0, 255).astype(np.uint8)
    
    rgba = np.dstack([unmul_b, unmul_g, unmul_r, alpha])
    processed_cv.append(rgba)
    
    # PIL RGBA
    rgb_rgba = cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA)
    processed_pil.append(Image.fromarray(rgb_rgba))

# 1. Save horizontal sprite sheet (30 frames x 256px = 7680 x 256)
sheet_strip = np.hstack(processed_cv)
sheet_path = 'public/assets/Mewtwo_Psionic_Miasma_Sheet.png'
cv2.imwrite(sheet_path, sheet_strip)
sheet_size_kb = os.path.getsize(sheet_path) / 1024
print(f'Horizontal sprite sheet saved to {sheet_path}: {sheet_size_kb:.1f} KB')

# 2. Save 6x5 grid sprite sheet (6 columns x 5 rows = 1536 x 1280)
grid_rows = []
for r in range(5):
    grid_rows.append(np.hstack(processed_cv[r*6:(r+1)*6]))
sheet_grid = np.vstack(grid_rows)
grid_path = 'public/assets/Mewtwo_Psionic_Miasma_Grid.png'
cv2.imwrite(grid_path, sheet_grid)
grid_size_kb = os.path.getsize(grid_path) / 1024
print(f'Grid sprite sheet saved to {grid_path}: {grid_size_kb:.1f} KB')

# 3. Save animated WebP with method=0 for fast encoding
webp_path = 'public/assets/Mewtwo_Psionic_Miasma_Anim.webp'
duration_ms = int(1750 / n_frames)  # ~58ms per frame
processed_pil[0].save(
    webp_path,
    save_all=True,
    append_images=processed_pil[1:],
    duration=duration_ms,
    loop=0,
    lossless=False,
    quality=85,
    method=0
)
webp_size_kb = os.path.getsize(webp_path) / 1024
print(f'Animated WebP saved to {webp_path}: {webp_size_kb:.1f} KB')

# 4. Save preview strip (6 sample frames)
grid_frames = [processed_cv[i] for i in [0, 5, 11, 17, 23, 29]]
preview_strip = np.hstack(grid_frames)
cv2.imwrite('scratch/mewtwo_vfx_preview_strip.png', preview_strip)
print('Preview strip saved to scratch/mewtwo_vfx_preview_strip.png')
print('ALL DONE SUCCESSFULLY!')
