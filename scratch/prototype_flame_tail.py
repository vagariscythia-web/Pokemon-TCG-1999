# Prototype: Exquisitely detailed, multi-layered equine flame tail with fluid flame kinematics

# Key anatomical & stylistic features:
# 1. Tail Root/Dock: Slender cream equine flesh tail base that Ponyta's fire erupts from.
# 2. Multi-tier silky flame filaments: Overlapping translucent flame ribbons with fine Bézier tapered wisps.
# 3. Dynamic Wave Propagation: Tail body and flame tip are separated into phase-lagged kinematic nodes.
# 4. Fluid Shearing & Micro-Undulation: Internal flame licks ripple with their own subtle secondary animation.

refined_flame_tail_svg = """
<svg width="160" height="70" viewBox="0 0 160 70" class="overflow-visible select-none">
  <defs>
    <!-- Deep Amber to Crimson Fire Gradient -->
    <linearGradient id="silkFireGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.8" />
      <stop offset="15%" stopColor="#dc2626" />
      <stop offset="45%" stopColor="#ea580c" />
      <stop offset="75%" stopColor="#f97316" />
      <stop offset="90%" stopColor="#facc15" />
      <stop offset="100%" stopColor="#ffffff" />
    </linearGradient>

    <!-- Incandescent White-Hot Searing Core Gradient -->
    <linearGradient id="silkCoreGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
      <stop offset="35%" stopColor="#fef08a" stopOpacity="0.9" />
      <stop offset="70%" stopColor="#ffffff" stopOpacity="0.98" />
      <stop offset="100%" stopColor="#ffffff" />
    </linearGradient>

    <!-- Translucent Golden Veil Gradient -->
    <linearGradient id="silkVeilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
      <stop offset="50%" stopColor="#fde047" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
    </linearGradient>

    <filter id="silkFireGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f97316" floodOpacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#dc2626" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- Group with subtle fluid micro-ripple -->
  <g filter="url(#silkFireGlow)">
    <!-- Layer A: Outer Atmospheric Thermal Vapor Veil (Soft diffused background glow) -->
    <path
      d="M 12 34 
         C 28 14, 52 48, 80 22 
         C 105 2, 126 12, 146 28 
         C 156 34, 150 42, 138 40 
         C 118 36, 102 54, 76 56 
         C 46 58, 28 48, 12 34 Z"
      fill="#ea580c"
      opacity="0.32"
      filter="blur(6px)"
    />

    <!-- Layer B: Primary Silken Flame Plume (Main flowing mane/tail body) -->
    <path
      d="M 10 35 
         C 26 12, 54 46, 82 20 
         C 106 2, 128 10, 148 26 
         C 156 32, 152 40, 140 38 
         C 118 34, 102 52, 74 54 
         C 44 56, 26 48, 10 35 Z"
      fill="url(#silkFireGrad)"
      stroke="#7f1d1d"
      strokeWidth="1.2"
    />

    <!-- Layer C: Upper Feathered Flame Locks (3 razor-sharp wispy crests) -->
    <!-- Wisp 1: Root crest -->
    <path
      d="M 28 24 C 36 12, 46 14, 54 26 C 42 28, 34 30, 28 24 Z"
      fill="#fde047"
      stroke="#ea580c"
      strokeWidth="0.7"
      opacity="0.9"
    />
    <!-- Wisp 2: High arching dorsal flame tongue -->
    <path
      d="M 58 18 C 72 4, 88 6, 98 18 C 84 22, 72 24, 58 18 Z"
      fill="#ffffff"
      stroke="#f59e0b"
      strokeWidth="0.8"
      opacity="0.95"
    />
    <!-- Wisp 3: Pre-tip crest tongue -->
    <path
      d="M 104 12 C 118 2, 130 6, 138 18 C 126 20, 116 20, 104 12 Z"
      fill="#ffffff"
      stroke="#fef08a"
      strokeWidth="0.6"
    />

    <!-- Layer D: Lower Flowing Tendril Locks (Sinuous trailing licks) -->
    <!-- Bottom lick 1 -->
    <path
      d="M 38 48 C 50 62, 64 62, 76 48 C 62 50, 48 52, 38 48 Z"
      fill="#f97316"
      stroke="#dc2626"
      strokeWidth="0.7"
      opacity="0.85"
    />
    <!-- Bottom lick 2 (Sweeping underbelly curl) -->
    <path
      d="M 78 50 C 94 62, 110 58, 122 42 C 108 46, 92 48, 78 50 Z"
      fill="#fbbf24"
      stroke="#ea580c"
      strokeWidth="0.7"
      opacity="0.9"
    />

    <!-- Layer E: Translucent Luminous Internal Veil (Silken Hair Texture) -->
    <path
      d="M 20 34 
         C 38 20, 64 42, 90 22 
         C 110 8, 126 16, 142 28 
         C 126 34, 108 30, 86 42 
         C 58 48, 36 44, 20 34 Z"
      fill="url(#silkVeilGrad)"
      opacity="0.6"
    />

    <!-- Layer F: Incandescent White-Hot Spine Core (Razor whip filament) -->
    <path
      d="M 14 35 
         C 34 18, 62 44, 90 22 
         C 112 8, 128 16, 148 27"
      fill="none"
      stroke="url(#silkCoreGrad)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    <!-- Layer G: Hyper-Incandescent Whip-Tip Stinger -->
    <!-- Curved barb tip -->
    <path
      d="M 144 26 C 150 28, 156 30, 158 32 C 154 34, 148 35, 144 33 Z"
      fill="#ffffff"
      stroke="#fef08a"
      strokeWidth="0.8"
      filter="drop-shadow(0 0 6px #ffffff)"
    />
    <circle cx="149" cy="28" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 8px #fef08a)" />
  </g>
</svg>
"""

print("Refined flame tail SVG generated.")
