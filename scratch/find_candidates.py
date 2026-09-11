import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect each effect block and see if comments or descriptions mention specific Pokemon body parts
# e.g., Cloyster clamp, Scyther blades, Farfetch'd leek, Cubone bone, Machop/Machoke punch/chop, Gastly/Haunter ghost hands/tongue, etc.
sections = re.findall(r'\{/\*\s*(\d+[a-z]?\.\s*[^}]+?)\s*\*/\}[\s\S]*?(?=\{/\*|\Z)', content)

print(f"Total sections found: {len(sections)}")

body_part_candidates = []
for sec in sections:
    # First line is comment header
    lines = sec.strip().split('\n')
    header = lines[0]
    block = "\n".join(lines[1:])
    
    # Check if this block has an <img>
    has_img = '<img' in block
    
    # Keywords indicating a specific Pokemon anatomy or item drawn via SVG
    keywords = [
        'shell', 'blade', 'claw', 'tail', 'jaw', 'fang', 'horn', 'tongue', 'hand', 'wing',
        'fist', 'beak', 'foot', 'hoof', 'eye', 'head', 'face', 'leek', 'bone', 'egg', 'vine', 'needle'
    ]
    
    found_kw = [kw for kw in keywords if kw in block.lower() or kw in header.lower()]
    
    # If it has SVG but NO stock image, and is a character/move specific effect:
    if not has_img and '<svg' in block and found_kw:
        # Extract fx.type
        fx_match = re.search(r"fx\.type\s*===\s*'([^']+)'", block)
        fx_name = fx_match.group(1) if fx_match else "unknown"
        body_part_candidates.append({
            'header': header,
            'fx': fx_name,
            'keywords': found_kw,
            'snippet': block[:300].replace('\n', ' ')
        })

print(f"\nFound {len(body_part_candidates)} potential candidates where SVG draws Pokemon anatomy/signature objects:")
for c in body_part_candidates:
    print(f"- [{c['fx']}] {c['header']} (Keywords: {', '.join(c['keywords'])})")
