# Prototype SVG geometry for Flame Tail and Smash Kick

# 1. Flame Tail SVG:
# Width: 150px, Height: 75px
# Sinuous equine flame tail with multiple flame plumes, incandescent core, and whipping tip.
flame_tail_svg = """
<svg width="150" height="75" viewBox="0 0 150 75" className="overflow-visible select-none pointer-events-none">
  <defs>
    <linearGradient id="flameTailBodyGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#7f1d1d" />
      <stop offset="20%" stopColor="#dc2626" />
      <stop offset="55%" stopColor="#ea580c" />
      <stop offset="80%" stopColor="#f97316" />
      <stop offset="95%" stopColor="#facc15" />
      <stop offset="100%" stopColor="#ffffff" />
    </linearGradient>
    <linearGradient id="flameTailCoreGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.2" />
      <stop offset="40%" stopColor="#fef08a" stopOpacity="0.9" />
      <stop offset="85%" stopColor="#ffffff" stopOpacity="0.98" />
    </linearGradient>
    <filter id="flameTailGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f97316" floodOpacity="0.85" />
      <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#dc2626" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- Outer Thermal Blur Halo -->
  <path
    d="M 10 38 C 30 15, 65 60, 95 25 C 115 8, 130 18, 145 32 C 128 48, 105 38, 75 58 C 45 70, 25 55, 10 38 Z"
    fill="#f97316"
    opacity="0.35"
    filter="blur(5px)"
  />

  <!-- Main Sinuous Equine Flame Tail Plume -->
  <path
    d="M 8 38 C 28 12, 68 55, 96 22 C 114 6, 130 16, 146 32 C 126 50, 102 38, 74 58 C 42 70, 24 55, 8 38 Z"
    fill="url(#flameTailBodyGrad)"
    stroke="#7f1d1d"
    strokeWidth="1.5"
    filter="url(#flameTailGlow)"
  />

  <!-- Upper Fiery Flame Tongue 1 -->
  <path
    d="M 38 24 C 50 10, 62 14, 72 26 C 58 28, 48 30, 38 24 Z"
    fill="#fef08a"
    stroke="#ea580c"
    strokeWidth="0.8"
  />

  <!-- Upper Fiery Flame Tongue 2 (Crest) -->
  <path
    d="M 82 20 C 95 4, 110 8, 118 20 C 105 22, 94 24, 82 20 Z"
    fill="#ffffff"
    stroke="#f59e0b"
    strokeWidth="0.8"
  />

  <!-- Lower Billowing Flame Lobe -->
  <path
    d="M 45 56 C 58 68, 75 66, 88 50 C 72 52, 58 54, 45 56 Z"
    fill="#f97316"
    stroke="#dc2626"
    strokeWidth="0.8"
  />

  <!-- Incandescent Searing Spine Core Line -->
  <path
    d="M 14 38 C 36 22, 70 50, 98 25 C 116 12, 128 20, 144 32"
    fill="none"
    stroke="url(#flameTailCoreGrad)"
    strokeWidth="3.2"
    strokeLinecap="round"
  />

  <!-- White-Hot Whipping Barb Tip -->
  <circle cx="145" cy="32" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #fef08a)" />
  <circle cx="145" cy="32" r="1.8" fill="#ffffff" />
</svg>
"""

# 2. Smash Kick Equine Hoof & Blazing Fetlock SVG:
# Width: 95px, Height: 105px
# Powerful Ponyta/Rapidash leg descending with diamond-hard hoof, shoe, and raging fetlock flames.
smash_kick_svg = """
<svg width="95" height="105" viewBox="0 0 95 105" className="overflow-visible select-none pointer-events-none">
  <defs>
    <linearGradient id="hoofLegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="45%" stopColor="#fde047" />
      <stop offset="85%" stopColor="#eab308" />
      <stop offset="100%" stopColor="#ca8a04" />
    </linearGradient>
    <linearGradient id="hoofWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#475569" />
      <stop offset="40%" stopColor="#334155" />
      <stop offset="85%" stopColor="#1e293b" />
      <stop offset="100%" stopColor="#0f172a" />
    </linearGradient>
    <linearGradient id="hoofShoeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#94a3b8" />
      <stop offset="50%" stopColor="#f1f5f9" />
      <stop offset="100%" stopColor="#64748b" />
    </linearGradient>
    <linearGradient id="fetlockFireGrad" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#fef08a" />
      <stop offset="55%" stopColor="#f97316" />
      <stop offset="85%" stopColor="#dc2626" />
      <stop offset="100%" stopColor="#7f1d1d" />
    </linearGradient>
    <filter id="hoofFireGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f97316" floodOpacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ea580c" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- Layer A: Blazing Fetlock Plume (Raging from back of the heel) -->
  <g filter="url(#hoofFireGlow)">
    <!-- Outer Flare Silhouette -->
    <path
      d="M 52 58 C 68 45, 82 28, 80 8 C 70 20, 64 30, 56 36 C 58 22, 54 12, 46 2 C 45 16, 42 26, 36 34 C 32 24, 26 18, 18 10 C 22 24, 25 36, 32 46 Z"
      fill="url(#fetlockFireGrad)"
      stroke="#7f1d1d"
      strokeWidth="1.2"
    />
    <!-- Inner High-Incandescence Flame Tongue -->
    <path
      d="M 50 56 C 60 46, 70 32, 68 18 C 62 26, 56 34, 52 40 C 52 30, 48 22, 44 14 C 42 24, 40 32, 36 40 Z"
      fill="#ffffff"
      opacity="0.9"
    />
  </g>

  <!-- Layer B: Ponyta Muscular Leg / Pastern / Coronet Band -->
  <!-- Upper Cannon Bone Shaft -->
  <path
    d="M 28 0 L 46 0 L 48 50 C 48 56, 45 62, 42 66 L 24 66 C 22 60, 24 54, 26 50 Z"
    fill="url(#hoofLegGrad)"
    stroke="#713f12"
    strokeWidth="1.6"
  />

  <!-- Coronet Band (Flesh-to-Hoof Transition Ring) -->
  <path
    d="M 22 66 C 30 63, 38 63, 44 66 L 46 72 C 38 69, 30 69, 20 72 Z"
    fill="#fef08a"
    stroke="#713f12"
    strokeWidth="1.4"
  />

  <!-- Layer C: Solid Diamond-Hard Equine Hoof Wall -->
  <path
    d="M 18 72 C 30 68, 42 68, 48 72 L 54 94 C 54 98, 48 102, 34 102 C 18 102, 12 98, 12 94 Z"
    fill="url(#hoofWallGrad)"
    stroke="#0f172a"
    strokeWidth="1.8"
  />

  <!-- Hoof Wall Growth Texture & Light Reflection Line -->
  <path
    d="M 20 76 Q 32 73 44 76"
    fill="none"
    stroke="#64748b"
    strokeWidth="1"
    opacity="0.8"
  />
  <path
    d="M 17 84 Q 33 80 47 84"
    fill="none"
    stroke="#64748b"
    strokeWidth="1"
    opacity="0.7"
  />

  <!-- Layer D: Heavy Iron Horseshoe Rim at Ground Contact -->
  <path
    d="M 12 94 C 20 90, 42 90, 54 94 L 52 101 C 42 97, 22 97, 14 101 Z"
    fill="url(#hoofShoeGrad)"
    stroke="#0f172a"
    strokeWidth="1.4"
  />

  <!-- Horseshoe Nail Studs (Spark points) -->
  <circle cx="18" cy="97" r="1.5" fill="#ffffff" />
  <circle cx="28" cy="95" r="1.5" fill="#ffffff" />
  <circle cx="38" cy="95" r="1.5" fill="#ffffff" />
  <circle cx="48" cy="97" r="1.5" fill="#ffffff" />
</svg>
"""

print("Flame Tail SVG length:", len(flame_tail_svg))
print("Smash Kick SVG length:", len(smash_kick_svg))
