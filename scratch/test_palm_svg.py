import re

# Let's craft an authentic Sugimori-style stout Drowzee open palm SVG.
# ViewBox: 0 0 100 100.
# Drowzee has a stout, rounded, powerful palm with 5 digits (thumb + 4 fingers) in a forward slap/thrust.

svg_palm = """
<svg width="84" height="84" viewBox="0 0 100 100" class="overflow-visible">
  <defs>
    <!-- Palm Body Gradient: Warm golden-yellow to rich amber with subtle psychic hue -->
    <linearGradient id="drowzeePalmGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="35%" stopColor="#facc15" />
      <stop offset="75%" stopColor="#eab308" />
      <stop offset="100%" stopColor="#ca8a04" />
    </linearGradient>
    
    <!-- Shading Gradient for Depth Under Palm Heel -->
    <linearGradient id="drowzeePalmShade" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stopColor="#a16207" stopOpacity="0" />
      <stop offset="100%" stopColor="#713f12" stopOpacity="0.45" />
    </linearGradient>

    <!-- Psychic Contact Edge Aura -->
    <radialGradient id="drowzeePalmPsychicGlow" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stopColor="#c084fc" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
    </radialGradient>
  </defs>

  <!-- Psychic Energy Halo around Palm -->
  <path
    d="M 28 85 C 22 75, 12 55, 14 42 C 16 30, 26 28, 30 38 C 32 25, 42 20, 47 32 C 49 18, 60 16, 64 30 C 66 18, 77 20, 80 34 C 83 45, 84 56, 80 72 C 76 85, 58 92, 45 92 C 34 92, 30 88, 28 85 Z"
    fill="none"
    stroke="#c084fc"
    strokeWidth="10"
    strokeLinejoin="round"
    opacity="0.35"
    filter="blur(4px)"
  />

  <!-- Main Unified Palm & Fingers Silhouette -->
  <!-- Thumb (left), Index, Middle, Ring, Pinky, Palm Base -->
  <path
    d="
      M 32 88
      C 22 82, 14 68, 15 54
      C 16 46, 22 44, 27 50
      C 28 44, 29 34, 34 30
      C 39 26, 44 30, 44 38
      C 46 28, 48 18, 54 16
      C 60 14, 65 20, 64 34
      C 67 22, 72 20, 77 22
      C 82 24, 83 32, 80 42
      C 83 34, 87 34, 90 38
      C 93 42, 91 50, 88 58
      C 85 72, 78 86, 64 90
      C 52 94, 38 93, 32 88 Z
    "
    fill="url(#drowzeePalmGrad)"
    stroke="#713f12"
    strokeWidth="3.2"
    strokeLinejoin="round"
    strokeLinecap="round"
  />

  <!-- Shading overlay at palm base -->
  <path
    d="M 32 88 C 22 82, 14 68, 15 54 C 20 62, 30 70, 45 74 C 60 78, 75 75, 88 58 C 85 72, 78 86, 64 90 C 52 94, 38 93, 32 88 Z"
    fill="url(#drowzeePalmShade)"
  />

  <!-- Anatomical Palm Creases & Knuckle Lines (Sugimori Inked Style) -->
  <!-- Life line / Thenar crease -->
  <path
    d="M 28 54 Q 38 62, 48 60"
    fill="none"
    stroke="#713f12"
    strokeWidth="2.2"
    strokeLinecap="round"
    opacity="0.85"
  />
  <!-- Head line / Heart line -->
  <path
    d="M 36 68 Q 52 70, 68 62"
    fill="none"
    stroke="#713f12"
    strokeWidth="2"
    strokeLinecap="round"
    opacity="0.75"
  />
  <!-- Finger separation crease accents -->
  <path d="M 44 42 L 43 50" fill="none" stroke="#713f12" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  <path d="M 64 38 L 62 48" fill="none" stroke="#713f12" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  <path d="M 78 44 L 75 52" fill="none" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />

  <!-- Subtle Specular Highlight on Palm Pad -->
  <ellipse cx="48" cy="54" rx="10" ry="6" fill="#ffffff" opacity="0.35" transform="rotate(-15 48 54)" />
</svg>
"""

print("SVG Palm template generated successfully, length:", len(svg_palm))
