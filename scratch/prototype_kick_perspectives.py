# Prototype two distinct, perspective-pure designs for Smash Kick and a refined Flame Tail

# Design 1: Smash Kick - Rear Kick (Plantar / Sole Impact View - Arkadan Tekme)
# Perspective: Clear rear view of hind leg kicking toward the camera.
# The horseshoe 'U' shape is squarely visible on the sole, frog inside, heel bulbs at top,
# leg receding in 3D depth, and fetlock fire flaring symmetrically outward like rocket exhaust.
smash_kick_rear_svg = """
<svg width="120" height="120" viewBox="0 0 120 120" class="overflow-visible select-none">
  <defs>
    <!-- Iron Horseshoe Metallic Gradient -->
    <linearGradient id="ironShoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#cbd5e1" />
      <stop offset="30%" stopColor="#94a3b8" />
      <stop offset="60%" stopColor="#64748b" />
      <stop offset="100%" stopColor="#334155" />
    </linearGradient>
    <!-- Sole & Frog Deep Horn Texture Gradient -->
    <radialGradient id="soleHornGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#1e293b" />
      <stop offset="70%" stopColor="#0f172a" />
      <stop offset="100%" stopColor="#020617" />
    </radialGradient>
    <!-- Leg Foreshortened Gradient (Receding into depth) -->
    <linearGradient id="legDepthGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.4" />
      <stop offset="50%" stopColor="#eab308" />
      <stop offset="100%" stopColor="#fef08a" />
    </linearGradient>
    <!-- Jet-Flare Fetlock Fire Gradient -->
    <radialGradient id="fetlockAuraGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#fef08a" />
      <stop offset="55%" stopColor="#f97316" />
      <stop offset="85%" stopColor="#dc2626" />
      <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
    </radialGradient>
    <filter id="kickGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f97316" floodOpacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ea580c" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- 1. Background Symmetrical Fetlock Fire Flare (Blasting around the ankle like thrusters) -->
  <g filter="url(#kickGlow)">
    <!-- Outer flame wings flaring outward and upward -->
    <path
      d="M 60 45 
         C 45 25, 20 20, 8 35 
         C 15 50, 28 55, 35 65 
         C 20 72, 10 85, 14 100 
         C 28 95, 38 85, 48 78
         C 52 92, 58 105, 60 115
         C 62 105, 68 92, 72 78
         C 82 85, 92 95, 106 100
         C 110 85, 100 72, 85 65
         C 92 55, 105 50, 112 35
         C 100 20, 75 25, 60 45 Z"
      fill="url(#fetlockAuraGrad)"
      opacity="0.95"
    />
    <!-- Inner incandescent white-gold flame core -->
    <path
      d="M 60 48 
         C 50 35, 32 32, 22 45 
         C 32 55, 42 60, 48 70 
         C 54 62, 58 55, 60 48
         C 62 55, 66 62, 72 70
         C 78 60, 88 55, 98 45
         C 88 32, 70 35, 60 48 Z"
      fill="#ffffff"
      opacity="0.9"
    />
  </g>

  <!-- 2. Receding Equine Pastern & Ankle (Visible above the heel bulbs, tapering into depth) -->
  <path
    d="M 46 0 L 74 0 L 70 42 C 67 40, 63 38, 60 38 C 57 38, 53 40, 50 42 Z"
    fill="url(#legDepthGrad)"
    stroke="#854d0e"
    strokeWidth="1.5"
  />

  <!-- 3. Equine Heel Bulbs (Ökçeler - dual anatomical fleshy pads at the rear top of the hoof) -->
  <!-- Left Heel Bulb -->
  <ellipse cx="44" cy="48" rx="14" ry="11" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
  <ellipse cx="43" cy="46" rx="9" ry="6" fill="#475569" opacity="0.6" />
  <!-- Right Heel Bulb -->
  <ellipse cx="76" cy="48" rx="14" ry="11" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
  <ellipse cx="77" cy="46" rx="9" ry="6" fill="#475569" opacity="0.6" />
  <!-- Central sulcus groove between bulbs -->
  <path d="M 60 42 Q 60 52 60 58" stroke="#0f172a" strokeWidth="2.5" fill="none" />

  <!-- 4. Hoof Sole (Plantar concave horn base) -->
  <path
    d="M 32 54 
       C 24 68, 26 95, 60 108 
       C 94 95, 96 68, 88 54 
       C 80 50, 68 54, 60 54 
       C 52 54, 40 50, 32 54 Z"
    fill="url(#soleHornGrad)"
    stroke="#020617"
    strokeWidth="2"
  />

  <!-- 5. Hoof Frog (V-shaped natural equine shock-absorbing triangular cushion in center) -->
  <path
    d="M 60 96 
       L 48 60 
       C 52 56, 56 58, 60 62 
       C 64 56, 68 58, 72 60 Z"
    fill="#1e293b"
    stroke="#0f172a"
    strokeWidth="1.2"
  />
  <path d="M 60 64 L 60 90" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

  <!-- 6. Heavy Forged Iron Horseshoe (Iconic 'U' rim firmly bolted around sole perimeter) -->
  <path
    d="M 28 50 
       C 18 68, 20 102, 60 114 
       C 100 102, 102 68, 92 50 
       L 78 52 
       C 85 68, 84 94, 60 101 
       C 36 94, 35 68, 42 52 Z"
    fill="url(#ironShoeGrad)"
    stroke="#0f172a"
    strokeWidth="2"
    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
  />

  <!-- 7. Horseshoe Nail Fullers & Square Nail Heads (6 spark contact points) -->
  <!-- Nail fuller groove left -->
  <path d="M 32 62 C 28 74, 32 88, 44 97" fill="none" stroke="#475569" strokeWidth="1.2" opacity="0.7" />
  <!-- Nail fuller groove right -->
  <path d="M 88 62 C 92 74, 88 88, 76 97" fill="none" stroke="#475569" strokeWidth="1.2" opacity="0.7" />

  <!-- Left Nail Studs -->
  <rect x="29" y="64" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />
  <rect x="30" y="76" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />
  <rect x="36" y="88" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />

  <!-- Right Nail Studs -->
  <rect x="87.5" y="64" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />
  <rect x="86.5" y="76" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />
  <rect x="80.5" y="88" width="3.5" height="3" rx="0.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />

  <!-- Horseshoe Toe Specular Metallic Highlight -->
  <path
    d="M 45 107 Q 60 112 75 107"
    fill="none"
    stroke="#ffffff"
    strokeWidth="1.8"
    strokeLinecap="round"
    opacity="0.85"
  />
</svg>
"""

# Design 2: Smash Kick - 3/4 Dynamic Lateral Equine Hoof Slam (Yandan 3/4 Açı)
# Perspective: Pure side profile view. Front is clearly sloped bone & toe; back is clearly fetlock joint & trailing fire plume.
smash_kick_lateral_svg = """
<svg width="115" height="110" viewBox="0 0 115 110" class="overflow-visible select-none">
  <defs>
    <linearGradient id="latLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="50%" stopColor="#fde047" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
    <linearGradient id="latHoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#475569" />
      <stop offset="50%" stopColor="#334155" />
      <stop offset="100%" stopColor="#0f172a" />
    </linearGradient>
    <linearGradient id="latShoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#f1f5f9" />
      <stop offset="40%" stopColor="#94a3b8" />
      <stop offset="100%" stopColor="#475569" />
    </linearGradient>
    <linearGradient id="latPlumeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#fef08a" />
      <stop offset="55%" stopColor="#f97316" />
      <stop offset="85%" stopColor="#dc2626" />
      <stop offset="100%" stopColor="#7f1d1d" />
    </linearGradient>
    <filter id="latGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f97316" floodOpacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ea580c" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- 1. Trailing Fetlock Plume (Flows strictly BACKWARD and UPWARD from rear of fetlock joint) -->
  <g filter="url(#latGlow)">
    <path
      d="M 68 55 
         C 82 45, 98 32, 108 12 
         C 95 24, 88 32, 78 36 
         C 88 22, 92 10, 86 0 
         C 78 14, 72 24, 64 32 
         C 68 18, 62 8, 54 2 
         C 50 14, 48 24, 48 35 Z"
      fill="url(#latPlumeGrad)"
      stroke="#7f1d1d"
      strokeWidth="1.2"
    />
    <path
      d="M 66 52 
         C 78 42, 90 30, 96 16 
         C 86 26, 80 32, 72 36 
         C 76 25, 74 16, 68 8 
         C 64 18, 60 26, 56 34 Z"
      fill="#ffffff"
      opacity="0.88"
    />
  </g>

  <!-- 2. Anatomical Equine Leg: Slender Cannon Bone, Fetlock Joint & Sloping Pastern -->
  <!-- Cannon bone (narrowing toward ankle) -->
  <path
    d="M 30 0 L 46 0 L 46 42 C 48 46, 52 50, 54 55 L 42 62 C 38 56, 34 50, 32 42 Z"
    fill="url(#latLegGrad)"
    stroke="#854d0e"
    strokeWidth="1.5"
  />

  <!-- Distinct Fetlock Joint (Sesamoid Knuckle at rear) -->
  <circle cx="50" cy="56" r="8" fill="#d97706" stroke="#854d0e" strokeWidth="1.4" />
  <circle cx="49" cy="55" r="5" fill="#fde047" opacity="0.6" />

  <!-- Pastern (Sloping forward at 45° angle) -->
  <path
    d="M 34 56 L 46 56 L 36 76 L 22 74 Z"
    fill="url(#latLegGrad)"
    stroke="#854d0e"
    strokeWidth="1.5"
  />

  <!-- Coronet Band (Fleshy transition ring wrapping around hoof top) -->
  <path
    d="M 20 74 C 26 71, 32 72, 38 76 L 36 82 C 30 78, 24 77, 18 80 Z"
    fill="#fef08a"
    stroke="#854d0e"
    strokeWidth="1.3"
  />

  <!-- 3. Hoof Wall (True 3D Profile: 50° sloping dorsal front, vertical heel bulb in back) -->
  <path
    d="M 17 80 
       C 24 77, 32 78, 37 82 
       L 42 96 
       C 42 98, 38 100, 34 100 
       L 4 100 
       C 2 100, 1 97, 3 94 
       L 17 80 Z"
    fill="url(#latHoofGrad)"
    stroke="#0f172a"
    strokeWidth="1.8"
  />
  <!-- Hoof Wall Specular Reflection line along dorsal slope -->
  <path d="M 16 83 L 5 97" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

  <!-- 4. Iron Horseshoe Base (Solid extruded iron rim fitted along bottom base) -->
  <path
    d="M 2 100 L 36 100 C 38 100, 42 101, 42 104 C 42 106, 38 107, 34 107 L 2 107 C -1 107, -2 105, 0 102 Z"
    fill="url(#latShoeGrad)"
    stroke="#0f172a"
    strokeWidth="1.4"
  />
  <!-- Horseshoe Toe Clip in front -->
  <path d="M 2 97 L 5 97 L 4 101 L 1 101 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="0.8" />
  <!-- Horseshoe Nail Studs along bottom -->
  <circle cx="8" cy="103.5" r="1.3" fill="#ffffff" />
  <circle cx="16" cy="103.5" r="1.3" fill="#ffffff" />
  <circle cx="24" cy="103.5" r="1.3" fill="#ffffff" />
  <circle cx="32" cy="103.5" r="1.3" fill="#ffffff" />
</svg>
"""

print("Smash Kick prototypes generated.")
"""
with open('scratch/test_kick_geometry.html', 'w', encoding='utf-8') as f:
    f.write('<!-- HTML Test -->')
"""
