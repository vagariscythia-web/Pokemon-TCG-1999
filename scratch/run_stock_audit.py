import re
import sys

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_text = f.read()

block_iter = list(re.finditer(r"\{fx\.type === ['\"]([^'\"]+)['\"]", tsx_text))

with open('scratch/stock_audit_results.txt', 'w', encoding='utf-8') as out:
    out.write("=== FULL STOCK ASSET AUDIT ===\n")
    for i, match in enumerate(block_iter):
        fx_name = match.group(1)
        start_pos = match.start()
        end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(tsx_text)
        block_code = tsx_text[start_pos:end_pos]
        
        img_matches = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', block_code)
        if img_matches:
            out.write(f"\n[Move: {fx_name}]\n")
            for img in img_matches:
                src = img.split('/')[-1]
                out.write(f"  Asset: {src}\n")
            # Extract sizing & classes
            for line in block_code.splitlines():
                line_str = line.strip()
                if any(k in line_str for k in ['w-[', 'h-[', 'max-w-[', 'w-16', 'w-20', 'w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'left:', 'right:', 'top:', 'bottom:']):
                    out.write(f"    {line_str}\n")
print("Saved to scratch/stock_audit_results.txt")
