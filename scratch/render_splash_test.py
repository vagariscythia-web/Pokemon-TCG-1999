import subprocess

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120" style="background:#090d16;">
  <defs>
    <!-- Multi-tier Hydrodynamic Collision Radial Gradient -->
    <radialGradient id="hydroPlumeGrad" cx="50%" cy="88%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="20%" stop-color="#e0f2fe" stop-opacity="0.98" />
      <stop offset="42%" stop-color="#7dd3fc" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#0284c7" stop-opacity="0.90" />
      <stop offset="92%" stop-color="#0369a1" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </radialGradient>

    <!-- Aerated White-Water Foam Wash Gradient -->
    <radialGradient id="hydroFoamWash" cx="50%" cy="85%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#e0f2fe" stop-opacity="0.85" />
      <stop offset="70%" stop-color="#bae6fd" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
    </radialGradient>

    <!-- Filter for soft luminous bloom -->
    <filter id="splashGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- 1. Outer Hydrodynamic Volumetric Water Sheet (Organic Curved Sugimori Wave Lobes) -->
  <path
    d="M80 112
       C62 112, 38 102, 24 88
       C12 76, 6 60, 10 48
       C14 38, 24 44, 28 54
       C30 40, 36 26, 48 18
       C56 12, 64 20, 62 34
       C64 20, 70 8, 79 6
       C85 5, 87 16, 84 28
       C88 16, 92 5, 98 6
       C107 8, 113 20, 115 34
       C113 20, 121 12, 129 18
       C141 26, 147 40, 149 54
       C153 44, 163 38, 167 48
       C171 60, 165 76, 153 88
       C139 102, 115 112, 80 112 Z"
    fill="url(#hydroPlumeGrad)"
    filter="url(#splashGlow)"
  />

  <!-- 2. Inner Aerated White-Water Core & Continuous Rolling Wave Foam (No sharp triangles) -->
  <path
    d="M80 106
       C66 106, 48 96, 36 84
       C28 74, 25 60, 32 54
       C37 50, 42 56, 44 64
       C46 52, 52 38, 60 32
       C68 26, 74 34, 73 44
       C75 34, 78 22, 84 20
       C89 20, 91 30, 90 40
       C92 30, 96 22, 101 20
       C107 22, 110 34, 112 44
       C114 34, 120 26, 128 32
       C136 38, 142 52, 144 64
       C146 56, 151 50, 156 54
       C163 60, 160 74, 152 84
       C140 96, 122 106, 80 106 Z"
    fill="url(#hydroFoamWash)"
  />

  <!-- 3. Dynamic Curved Foam Crest Ribbons (Sugimori wave foam curl lines) -->
  <!-- Left Wing Curls -->
  <path d="M12 48 Q20 40, 28 54 Q38 28, 48 18 Q58 14, 62 34 Q70 10, 79 6"
        fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.95" />
  <!-- Center & Right Wing Curls -->
  <path d="M98 6 Q107 10, 115 34 Q119 14, 129 18 Q139 28, 149 54 Q157 40, 165 48"
        fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.95" />
  <!-- Secondary Inner Foam Crest Line -->
  <path d="M34 56 Q44 40, 60 32 Q74 26, 84 20 Q94 20, 108 32 Q124 26, 138 40 Q148 56, 154 56"
        fill="none" stroke="#e0f2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.8" />

  <!-- 4. Natural Centrifugal Droplets & Micro-Cavitation Spray (Scattered organically ahead of wavelets) -->
  <circle cx="8" cy="40" r="2.0" fill="#bae6fd" opacity="0.85" />
  <circle cx="20" cy="30" r="2.4" fill="#ffffff" opacity="0.9" />
  <circle cx="36" cy="18" r="2.2" fill="#e0f2fe" opacity="0.85" />
  <circle cx="48" cy="10" r="2.6" fill="#ffffff" opacity="0.95" />
  <circle cx="66" cy="6" r="2.0" fill="#bae6fd" opacity="0.8" />
  <circle cx="78" cy="2" r="2.4" fill="#ffffff" opacity="0.95" />
  <circle cx="98" cy="2" r="2.4" fill="#ffffff" opacity="0.95" />
  <circle cx="110" cy="6" r="2.0" fill="#bae6fd" opacity="0.8" />
  <circle cx="128" cy="10" r="2.6" fill="#ffffff" opacity="0.95" />
  <circle cx="140" cy="18" r="2.2" fill="#e0f2fe" opacity="0.85" />
  <circle cx="156" cy="30" r="2.4" fill="#ffffff" opacity="0.9" />
  <circle cx="168" cy="40" r="2.0" fill="#bae6fd" opacity="0.85" />
</svg>'''

with open('scratch/test_new_splash.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# Render to PNG with Inkscape
subprocess.run(['inkscape', 'scratch/test_new_splash.svg', '-o', 'scratch/test_new_splash.png', '-w', '320', '-h', '240'])
print('Rendered scratch/test_new_splash.png successfully.')
