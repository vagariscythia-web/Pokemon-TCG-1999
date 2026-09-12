import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"\{fx\.type === '([^']+)' && \(([\s\S]*?)\n      \)\}"
matches = re.findall(pattern, text)

for name, body in matches:
    bl = body.lower()
    has_eye_comment = 'eye' in bl or 'pupil' in bl or 'göz' in bl
    has_cartoon_eye = ('ellipse' in body and 'circle' in body and 'fill="#ffffff"' in body)
    has_basic_ping = ('animate-ping' in body and len(body.split('\n')) < 25)
    
    if has_eye_comment or has_cartoon_eye:
        print(f"[EYE/FACIAL] {name}")
    if has_basic_ping:
        print(f"[BASIC PING] {name}")
