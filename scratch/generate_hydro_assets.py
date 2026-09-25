import xml.etree.ElementTree as ET

def test_svgs():
    # Left Jet SVG
    svg_jet_l = '''<svg xmlns="http://www.w3.org/2000/svg" width="60" height="115" viewBox="0 0 60 115">
      <defs>
        <linearGradient id="hydroOuterL" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0284c7" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="#0ea5e9" stop-opacity="0.9"/>
          <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="hydroCoreL" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95"/>
          <stop offset="45%" stop-color="#7dd3fc" stop-opacity="0.92"/>
          <stop offset="80%" stop-color="#bae6fd" stop-opacity="0.96"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <!-- Outer Turbulent Expanding Torrent -->
      <path d="M22 115 C21 95, 17 78, 14 60 C12 44, 9 26, 7 8 C14 6, 21 4, 30 3 C39 4, 46 6, 53 8 C51 26, 48 44, 46 60 C43 78, 39 95, 38 115 Z" fill="url(#hydroOuterL)" filter="drop-shadow(0 0 6px rgba(14,165,233,0.7))"/>
      <!-- Inner Pressurized Core Stream -->
      <path d="M25 113 C24 94, 21 76, 19 58 C17 42, 15 24, 13 9 C18 7, 23 6, 30 5 C37 6, 42 7, 47 9 C45 24, 43 42, 41 58 C39 76, 36 94, 35 113 Z" fill="url(#hydroCoreL)"/>
      <!-- White-Hot Cavitation Spine -->
      <path d="M27 110 C26 90, 24 72, 23 52 C22 36, 21 20, 21 12 C24 10, 27 9, 30 8.5 C33 9, 36 10, 39 12 C39 20, 38 36, 37 52 C36 72, 34 90, 33 110 Z" fill="#ffffff" opacity="0.9"/>
      <!-- Core Centerline Filament -->
      <path d="M30 112 C29.5 88, 29 62, 30 36 C30.5 22, 30 12, 30 6" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.98"/>
      <!-- Frothing Helical Swirls / Spiral Cavitation Vortexes -->
      <path d="M21 98 Q36 88, 41 74 Q24 64, 18 48 Q37 38, 45 20" fill="none" stroke="#e0f2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
      <path d="M39 92 Q23 80, 19 66 Q36 54, 42 36 Q25 24, 21 12" fill="none" stroke="#bae6fd" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
      <!-- Tearing Spray Droplets -->
      <circle cx="12" cy="52" r="2.0" fill="#7dd3fc" opacity="0.9"/>
      <circle cx="48" cy="40" r="2.4" fill="#bae6fd" opacity="0.95"/>
      <circle cx="10" cy="26" r="1.8" fill="#e0f2fe" opacity="0.85"/>
      <circle cx="50" cy="18" r="2.2" fill="#ffffff" opacity="0.95"/>
    </svg>'''

    # Splash Crown SVG
    svg_splash_crown = '''<svg xmlns="http://www.w3.org/2000/svg" width="130" height="90" viewBox="0 0 130 90">
      <defs>
        <radialGradient id="splashRad" cx="50%" cy="80%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8"/>
        </radialGradient>
      </defs>
      <!-- Multi-Lobed Tsunami Splash Crown -->
      <path d="M65 82 C55 82, 40 80, 25 76 C20 70, 16 58, 12 44 C15 48, 20 54, 25 58 C25 45, 27 30, 31 16 C35 25, 39 36, 42 46 C45 32, 50 18, 55 6 C58 20, 61 36, 65 48 C69 36, 72 20, 75 6 C80 18, 85 32, 88 46 C91 36, 95 25, 99 16 C103 30, 105 45, 105 58 C110 54, 115 48, 118 44 C114 58, 110 70, 105 76 C90 80, 75 82, 65 82 Z" fill="url(#splashRad)" filter="drop-shadow(0 0 10px rgba(56,189,248,0.85))"/>
      <!-- Inner Foam Rim -->
      <path d="M65 78 C52 78, 38 72, 28 62 C34 50, 42 38, 50 24 C55 40, 60 52, 65 58 C70 52, 75 40, 80 24 C88 38, 96 50, 102 62 C92 72, 78 78, 65 78 Z" fill="#ffffff" opacity="0.8"/>
      <!-- Detached Crown Spray Droplets -->
      <circle cx="55" cy="3" r="2.6" fill="#ffffff"/>
      <circle cx="75" cy="3" r="2.6" fill="#ffffff"/>
      <circle cx="31" cy="12" r="2.4" fill="#e0f2fe"/>
      <circle cx="99" cy="12" r="2.4" fill="#e0f2fe"/>
      <circle cx="10" cy="40" r="2.2" fill="#bae6fd"/>
      <circle cx="120" cy="40" r="2.2" fill="#bae6fd"/>
    </svg>'''

    # Water Deluge Cascade SVG
    svg_deluge = '''<svg xmlns="http://www.w3.org/2000/svg" width="144" height="96" viewBox="0 0 144 96">
      <defs>
        <linearGradient id="delugeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="25%" stop-color="#bae6fd" stop-opacity="0.8"/>
          <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Cascading Water Sheet -->
      <path d="M12 4 Q72 16, 132 4 C136 28, 138 60, 134 88 C118 94, 98 84, 82 92 C64 86, 46 94, 30 88 C20 92, 14 86, 10 88 C6 60, 8 28, 12 4 Z" fill="url(#delugeGrad)" filter="blur(0.8px)"/>
      <!-- Frothing Cascade Streamlines -->
      <path d="M32 8 Q34 45, 30 84" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.75" fill="none"/>
      <path d="M52 12 Q56 50, 50 86" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.85" fill="none"/>
      <path d="M72 14 Q74 52, 72 88" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.9" fill="none"/>
      <path d="M92 12 Q88 50, 94 86" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.85" fill="none"/>
      <path d="M112 8 Q110 45, 114 84" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.75" fill="none"/>
      <!-- Frothing Bubbles at Bottom Crest -->
      <ellipse cx="72" cy="88" rx="58" ry="6" fill="#ffffff" opacity="0.45" filter="blur(1.5px)"/>
      <circle cx="42" cy="85" r="2.2" fill="#ffffff" opacity="0.85"/>
      <circle cx="62" cy="87" r="2.8" fill="#ffffff" opacity="0.9"/>
      <circle cx="82" cy="86" r="2.5" fill="#ffffff" opacity="0.85"/>
      <circle cx="102" cy="84" r="2.0" fill="#ffffff" opacity="0.8"/>
    </svg>'''

    # Left Muzzle Blast SVG (angled along -32 deg)
    svg_muzzle_l = '''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <radialGradient id="muzzleRadL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95"/>
          <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.8"/>
          <stop offset="90%" stop-color="#0284c7" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Hydro-Compression Blast Core -->
      <circle cx="32" cy="32" r="26" fill="url(#muzzleRadL)"/>
      <circle cx="32" cy="32" r="16" fill="#ffffff" opacity="0.85" filter="blur(1px)"/>
      <circle cx="32" cy="32" r="8" fill="#ffffff" opacity="1"/>
      <!-- High-Pressure Nozzle Rings -->
      <ellipse cx="32" cy="32" rx="28" ry="18" fill="none" stroke="#bae6fd" stroke-width="2" transform="rotate(-32 32 32)" opacity="0.8"/>
      <ellipse cx="32" cy="32" rx="20" ry="12" fill="none" stroke="#ffffff" stroke-width="2.5" transform="rotate(-32 32 32)" opacity="0.9"/>
      <!-- Flared Vapor Spikes along barrel vector -->
      <path d="M32 32 L16 8 L24 16 Z" fill="#ffffff" opacity="0.9"/>
      <path d="M32 32 L8 22 L18 26 Z" fill="#bae6fd" opacity="0.85"/>
      <path d="M32 32 L26 4 L34 14 Z" fill="#ffffff" opacity="0.9"/>
      <!-- Recoil Spray Flecks -->
      <circle cx="14" cy="12" r="2.2" fill="#ffffff"/>
      <circle cx="48" cy="46" r="1.8" fill="#7dd3fc"/>
      <circle cx="18" cy="48" r="1.6" fill="#38bdf8"/>
    </svg>'''

    # Right Muzzle Blast SVG (angled along +45 deg)
    svg_muzzle_r = '''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <radialGradient id="muzzleRadR" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95"/>
          <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.8"/>
          <stop offset="90%" stop-color="#0284c7" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Hydro-Compression Blast Core -->
      <circle cx="32" cy="32" r="26" fill="url(#muzzleRadR)"/>
      <circle cx="32" cy="32" r="16" fill="#ffffff" opacity="0.85" filter="blur(1px)"/>
      <circle cx="32" cy="32" r="8" fill="#ffffff" opacity="1"/>
      <!-- High-Pressure Nozzle Rings -->
      <ellipse cx="32" cy="32" rx="28" ry="18" fill="none" stroke="#bae6fd" stroke-width="2" transform="rotate(45 32 32)" opacity="0.8"/>
      <ellipse cx="32" cy="32" rx="20" ry="12" fill="none" stroke="#ffffff" stroke-width="2.5" transform="rotate(45 32 32)" opacity="0.9"/>
      <!-- Flared Vapor Spikes along barrel vector -->
      <path d="M32 32 L48 8 L40 16 Z" fill="#ffffff" opacity="0.9"/>
      <path d="M32 32 L56 22 L46 26 Z" fill="#bae6fd" opacity="0.85"/>
      <path d="M32 32 L38 4 L30 14 Z" fill="#ffffff" opacity="0.9"/>
      <!-- Recoil Spray Flecks -->
      <circle cx="50" cy="12" r="2.2" fill="#ffffff"/>
      <circle cx="16" cy="46" r="1.8" fill="#7dd3fc"/>
      <circle cx="46" cy="48" r="1.6" fill="#38bdf8"/>
    </svg>'''

    for name, s in [('Left Jet', svg_jet_l), ('Splash Crown', svg_splash_crown), ('Deluge', svg_deluge), ('Muzzle L', svg_muzzle_l), ('Muzzle R', svg_muzzle_r)]:
        root = ET.fromstring(s)
        print(f'[PASS] {name} SVG parsed successfully! Root tag: {root.tag}')

if __name__ == '__main__':
    test_svgs()
