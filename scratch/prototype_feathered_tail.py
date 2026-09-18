# Prototype an authentic, flowing, feathered equine flame tail (tüylü at kuyruğu)
# Key structural principles:
# 1. NO monolithic filled polygon block!
# 2. Starts from a sleek, slender tail dock (kuyruk kökü).
# 3. Splits into 4-5 distinct, cascading, feathered tresses of fiery hair (katmanlı saç/yele tutamları).
# 4. Each tress has its own sinuous curve, tapering to a fine curved wisp tip, with natural negative space.
# 5. Fine internal hair filament lines (Bézier stroke wisps) give authentic silken hair texture.

feathered_equine_tail_svg = """
<svg width="112" height="52" viewBox="0 0 160 75" class="overflow-visible select-none">
  <defs>
    <!-- Authentic Ponyta Incandescent Fire Gradient (Vermilion to White-Hot) -->
    <linearGradient id="pnyFireGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#991b1b" stopOpacity="0.85" />
      <stop offset="18%" stopColor="#dc2626" />
      <stop offset="45%" stopColor="#ea580c" />
      <stop offset="70%" stopColor="#f97316" />
      <stop offset="88%" stopColor="#facc15" />
      <stop offset="100%" stopColor="#ffffff" />
    </linearGradient>

    <!-- Warm Golden Hair Highlight Gradient -->
    <linearGradient id="pnyHairGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
      <stop offset="50%" stopColor="#fde047" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
    </linearGradient>

    <!-- Incandescent White Spine Line Gradient -->
    <linearGradient id="pnySpineGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
      <stop offset="35%" stopColor="#fef08a" stopOpacity="0.85" />
      <stop offset="75%" stopColor="#ffffff" stopOpacity="0.98" />
    </linearGradient>

    <filter id="pnyTailGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f97316" floodOpacity="0.85" />
      <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#dc2626" floodOpacity="0.5" />
    </filter>
  </defs>

  <g filter="url(#pnyTailGlow)">
    <!-- 1. Tail Dock Root (Slender cream-peach skin base where hair originates) -->
    <path
      d="M 4 36 C 8 33, 14 34, 18 36 C 14 39, 8 40, 4 37 Z"
      fill="#fef3c7"
      stroke="#d97706"
      strokeWidth="0.9"
    />

    <!-- 2. Tress 1: Top High-Arching Feathered Lock (Üst kabarık yele lülesi) -->
    <path
      d="M 16 35 
         C 28 18, 48 12, 70 18 
         C 58 24, 46 26, 36 32 
         C 50 25, 68 24, 86 30 
         C 72 35, 58 37, 44 40 
         C 28 42, 18 38, 16 35 Z"
      fill="url(#pnyFireGrad)"
      stroke="#991b1b"
      strokeWidth="0.8"
    />
    <!-- Fine hair filament on Tress 1 -->
    <path d="M 24 28 C 42 18, 62 20, 78 24" fill="none" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" opacity="0.9" />

    <!-- 3. Tress 2: Lower Sweeping Feathered Under-Lock (Alt dökümlü saç tutamı) -->
    <path
      d="M 16 37 
         C 28 48, 44 58, 66 56 
         C 54 52, 44 48, 38 42 
         C 52 50, 70 52, 88 44 
         C 74 42, 60 40, 46 38 
         C 30 36, 20 36, 16 37 Z"
      fill="url(#pnyFireGrad)"
      stroke="#991b1b"
      strokeWidth="0.8"
    />
    <!-- Fine hair filament on Tress 2 -->
    <path d="M 26 44 C 44 52, 64 52, 80 46" fill="none" stroke="#f97316" strokeWidth="1" strokeLinecap="round" opacity="0.85" />

    <!-- 4. Tress 3: Main S-Curved Central Plume (Orta ana dalga lülesi - extends to tip) -->
    <path
      d="M 28 36 
         C 48 28, 72 40, 98 28 
         C 118 18, 134 22, 148 30 
         C 136 34, 122 32, 108 38 
         C 86 46, 62 44, 42 38 Z"
      fill="url(#pnyHairGoldGrad)"
      stroke="#ea580c"
      strokeWidth="0.7"
      opacity="0.95"
    />

    <!-- 5. Tress 4: Whispy Feathered Tip Strands (Uçta çatallanan tüylü alev telleri) -->
    <!-- Feather strand A (Upper wisp) -->
    <path
      d="M 112 26 C 126 18, 138 20, 150 26 C 138 28, 128 30, 118 31 Z"
      fill="#ffffff"
      stroke="#facc15"
      strokeWidth="0.6"
    />
    <!-- Feather strand B (Central stinger lash) -->
    <path
      d="M 124 30 C 138 28, 148 30, 158 32 C 146 34, 136 35, 126 34 Z"
      fill="#ffffff"
      stroke="#fef08a"
      strokeWidth="0.7"
      filter="drop-shadow(0 0 6px #ffffff)"
    />
    <!-- Feather strand C (Lower trailing wisp) -->
    <path
      d="M 108 36 C 122 38, 134 38, 144 42 C 132 41, 122 40, 112 38 Z"
      fill="#fde047"
      stroke="#f97316"
      strokeWidth="0.6"
    />

    <!-- 6. Hair Texture Filament Strands (İnce tüy/kıl çizgileri) -->
    <path d="M 36 34 C 60 28, 88 36, 116 28" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
    <path d="M 50 38 C 76 38, 104 34, 132 30" fill="none" stroke="#fef08a" strokeWidth="1.0" strokeLinecap="round" opacity="0.85" />
    <path d="M 68 42 C 92 44, 118 38, 142 33" fill="none" stroke="#facc15" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />

    <!-- 7. Incandescent White Spine Filament -->
    <path
      d="M 20 36 C 46 26, 76 38, 106 28 C 124 22, 140 26, 156 32"
      fill="none"
      stroke="url(#pnySpineGrad)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    <!-- Stinger tip sparkle -->
    <circle cx="156" cy="32" r="2.2" fill="#ffffff" filter="drop-shadow(0 0 6px #fef08a)" />
  </g>
</svg>
"""

print("Feathered equine tail SVG generated successfully.")
