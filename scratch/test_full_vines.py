# Let's build the complete overhead downward cracking vines with Himeno leaves along the arch:

left_vine_svg = """
<svg width="120" height="120" viewBox="0 0 125 125" class="overflow-visible select-none pointer-events-none">
  <!-- Outer Chlorophyll Halo -->
  <path
    d="M 18 118 C 12 75, 22 22, 52 12 C 70 8, 85 24, 102 70"
    fill="none"
    stroke="#22c55e"
    strokeWidth="14"
    strokeLinecap="round"
    opacity="0.3"
    filter="blur(4px)"
  />

  <!-- Main Tapered Vine Body -->
  <path
    d="M 18 118 C 12 75, 22 22, 52 12 C 70 8, 85 24, 102 70"
    fill="none"
    stroke="url(#vineGradLeft)"
    strokeWidth="8.5"
    strokeLinecap="round"
  />

  <!-- High-Incandescence Spine Core Line -->
  <path
    d="M 20 114 C 15 74, 24 24, 52 14 C 69 10, 83 25, 100 68"
    fill="none"
    stroke="url(#vineCoreGrad)"
    strokeWidth="2.4"
    strokeLinecap="round"
  />

  <!-- Himeno Leaf Bud 1 (Along lower trunk, pointing outwards left) -->
  <g transform="translate(14, 72) rotate(-75)">
    <path d="M 0 0 C -6 -10, -2 -18, 6 -20 C 10 -14, 8 -6, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q 3 -10, 6 -20" fill="none" stroke="#bbf7d0" strokeWidth="0.8" />
  </g>

  <!-- Himeno Leaf Bud 2 (Overhead crest, pointing upwards) -->
  <g transform="translate(48, 12) rotate(-15)">
    <path d="M 0 0 C -5 -9, -1 -16, 5 -18 C 9 -12, 7 -5, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q 2 -9, 5 -18" fill="none" stroke="#bbf7d0" strokeWidth="0.7" />
  </g>

  <!-- Himeno Leaf Bud 3 (Down-crack section, pointing outwards) -->
  <g transform="translate(86, 38) rotate(48)">
    <path d="M 0 0 C -4 -7, 0 -13, 5 -14 C 8 -9, 6 -4, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="0.8" />
  </g>

  <!-- Whip Barb / Piercing Bud at Tip -->
  <ellipse cx="102" cy="70" rx="4" ry="2.5" fill="#86efac" stroke="#14532d" strokeWidth="1" transform="rotate(65 102 70)" />
  <circle cx="103" cy="71" r="1.5" fill="#ffffff" />
</svg>
"""

right_vine_svg = """
<svg width="120" height="120" viewBox="0 0 125 125" class="overflow-visible select-none pointer-events-none">
  <!-- Outer Chlorophyll Halo -->
  <path
    d="M 107 118 C 113 75, 103 22, 73 12 C 55 8, 40 24, 23 70"
    fill="none"
    stroke="#16a34a"
    strokeWidth="14"
    strokeLinecap="round"
    opacity="0.3"
    filter="blur(4px)"
  />

  <!-- Main Tapered Vine Body -->
  <path
    d="M 107 118 C 113 75, 103 22, 73 12 C 55 8, 40 24, 23 70"
    fill="none"
    stroke="url(#vineGradRight)"
    strokeWidth="8.5"
    strokeLinecap="round"
  />

  <!-- High-Incandescence Spine Core Line -->
  <path
    d="M 105 114 C 110 74, 101 24, 73 14 C 56 10, 42 25, 25 68"
    fill="none"
    stroke="url(#vineCoreGrad)"
    strokeWidth="2.4"
    strokeLinecap="round"
  />

  <!-- Himeno Leaf Bud 1 (Along lower trunk, pointing outwards right) -->
  <g transform="translate(111, 72) rotate(75)">
    <path d="M 0 0 C 6 -10, 2 -18, -6 -20 C -10 -14, -8 -6, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q -3 -10, -6 -20" fill="none" stroke="#bbf7d0" strokeWidth="0.8" />
  </g>

  <!-- Himeno Leaf Bud 2 (Overhead crest, pointing upwards) -->
  <g transform="translate(77, 12) rotate(15)">
    <path d="M 0 0 C 5 -9, 1 -16, -5 -18 C -9 -12, -7 -5, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q -2 -9, -5 -18" fill="none" stroke="#bbf7d0" strokeWidth="0.7" />
  </g>

  <!-- Himeno Leaf Bud 3 (Down-crack section, pointing outwards) -->
  <g transform="translate(39, 38) rotate(-48)">
    <path d="M 0 0 C 4 -7, 0 -13, -5 -14 C -8 -9, -6 -4, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="0.8" />
  </g>

  <!-- Whip Barb / Piercing Bud at Tip -->
  <ellipse cx="23" cy="70" rx="4" ry="2.5" fill="#86efac" stroke="#14532d" strokeWidth="1" transform="rotate(-65 23 70)" />
  <circle cx="22" cy="71" r="1.5" fill="#ffffff" />
</svg>
"""

print("Left vine SVG generated, length:", len(left_vine_svg))
print("Right vine SVG generated, length:", len(right_vine_svg))
