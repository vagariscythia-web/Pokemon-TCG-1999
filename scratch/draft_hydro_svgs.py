"""
Design the complete SVGs for:
1. Left Cannon Torrent
2. Right Cannon Torrent
3. Muzzle Water Collars
4. Impact Concussion & Tsunami Crown
5. Deluge Cascade & Splashes
"""

# Let's define the Left Torrent SVG (oriented from nozzle at (62, 151) curving to (78, 48))
# In local SVG coordinates (width: 80, height: 130):
# Nozzle anchor: (56, 126) -> Left barrel axis is -28 deg (pointing up-left)
# Stream leaves at -28 deg towards (20, 60), then curves back to (72, 8)
left_torrent_svg = '''
<svg width="80" height="130" viewBox="0 0 80 130" style="overflow: visible;">
  <defs>
    <linearGradient id="streamGradL_new" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#0369a1" stopOpacity="0.95" />
      <stop offset="25%" stopColor="#0284c7" stopOpacity="0.92" />
      <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.90" />
      <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.95" />
      <stop offset="100%" stopColor="#bae6fd" stopOpacity="1.0" />
    </linearGradient>
    <linearGradient id="streamCoreL_new" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
      <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.95" />
      <stop offset="80%" stopColor="#e0f2fe" stopOpacity="0.98" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="1.0" />
    </linearGradient>
    <filter id="streamGlowL_new" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Outer Fluid Hydrodynamic Mantle -->
  <path d="M50 126 C46 112, 34 94, 24 76 C14 58, 12 38, 22 22 C28 14, 40 8, 56 6 C64 5, 72 8, 76 14 C78 20, 72 26, 64 24 C52 22, 42 26, 36 34 C30 46, 32 62, 42 78 C52 94, 60 110, 62 126 Z"
        fill="url(#streamGradL_new)" filter="url(#streamGlowL_new)" />

  <!-- Secondary Turbulent Swell (adds volumetric fluid thickness) -->
  <path d="M48 124 C42 108, 30 90, 20 72 C12 54, 10 34, 26 18 C36 8, 50 6, 68 8 C72 12, 68 18, 58 18 C44 18, 32 24, 28 38 C24 52, 30 70, 40 86 C50 102, 58 116, 58 124 Z"
        fill="#0ea5e9" opacity="0.85" />

  <!-- Inner High-Velocity Pressurized Core -->
  <path d="M52 122 C48 106, 38 88, 28 72 C20 56, 18 38, 30 24 C38 14, 52 12, 66 12 C64 16, 56 18, 48 18 C38 18, 30 26, 28 38 C26 50, 34 68, 44 84 C52 100, 56 114, 56 122 Z"
        fill="url(#streamCoreL_new)" />

  <!-- Incandescent White-Water Cavitation Spine -->
  <path d="M54 120 C50 106, 40 88, 32 72 C24 56, 22 40, 34 26 C40 18, 50 14, 62 14"
        fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.95" />
  <path d="M54 120 C50 106, 40 88, 32 72 C24 56, 22 40, 34 26 C40 18, 50 14, 62 14"
        fill="none" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" opacity="1.0" />

  <!-- Braided Helical Water Ribbons -->
  <path d="M48 116 Q32 98, 42 82 Q54 66, 30 48 Q18 34, 38 20"
        fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
  <path d="M58 110 Q42 92, 28 76 Q18 58, 38 42 Q52 28, 62 16"
        fill="none" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" opacity="0.75" />

  <!-- Dynamic Centrifugal Droplets and Spray Beads -->
  <circle cx="16" cy="62" r="3.2" fill="#7dd3fc" opacity="0.95" />
  <circle cx="12" cy="44" r="2.8" fill="#bae6fd" opacity="0.9" />
  <circle cx="18" cy="28" r="3.5" fill="#ffffff" opacity="0.95" />
  <circle cx="26" cy="14" r="2.6" fill="#e0f2fe" opacity="0.9" />
  <circle cx="48" cy="6" r="3.0" fill="#ffffff" opacity="0.95" />
</svg>
'''

print("Left torrent SVG drafted.")
