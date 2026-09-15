import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    text = f.read()

kf_names = [
    'gbaGastlySleepGasCloud', 'gbaWeezingSmogEruptLeft', 'gbaWeezingSmogEruptRight',
    'gbaWeezingToxicSmogManifest', 'gbaPoisonGasCloud', 'gbaPoisonGasCloud2',
    'gbaMagmarSmogPlume1', 'gbaMagmarSmogPlume2', 'gbaSleepingGasSwirl', 'gbaParasSporeCloud'
]

for name in kf_names:
    m = re.search(rf"@keyframes\s+{name}\s*\{{([^}}]+(?:\{{[^}}]*\}}[^}}]*)*)\}}", text)
    if m:
        print(f"\n==========================================")
        print(f"@keyframes {name}")
        print(f"==========================================")
        print(m.group(0)[:600])
