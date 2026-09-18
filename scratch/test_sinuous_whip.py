# Let's design a true sinuous, tapered living whip lash:
# Left Whip:
# Starts at left (0, 45), undulating whip wave to tip at (165, 45).
# Taper: thick at base (8px), slender at tip (2.5px).

whip_left = """
<svg width="160" height="70" viewBox="0 0 160 70" class="overflow-visible select-none pointer-events-none">
  <!-- Outer Chlorophyll Glow -->
  <path
    d="M 5 38 C 40 18, 75 58, 115 28 C 130 18, 145 22, 158 35"
    fill="none"
    stroke="#22c55e"
    strokeWidth="12"
    strokeLinecap="round"
    opacity="0.25"
    filter="blur(4px)"
  />

  <!-- Main Tapered Vine Lash Body -->
  <path
    d="M 5 38 C 40 18, 75 58, 115 28 C 130 18, 145 22, 158 35"
    fill="none"
    stroke="url(#vineGradLeft)"
    strokeWidth="7"
    strokeLinecap="round"
  />

  <!-- High-Incandescence Spine Core Line -->
  <path
    d="M 12 36 C 42 19, 75 56, 115 28 C 130 19, 145 23, 156 34"
    fill="none"
    stroke="url(#vineCoreGrad)"
    strokeWidth="2.2"
    strokeLinecap="round"
  />

  <!-- Himeno Leaf Bud 1 (Near Base, Sprouting Upward) -->
  <g transform="translate(42, 24) rotate(-32)">
    <path d="M 0 0 C -6 -10, -2 -18, 6 -20 C 10 -14, 8 -6, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q 3 -10, 6 -20" fill="none" stroke="#bbf7d0" strokeWidth="0.8" />
  </g>

  <!-- Himeno Leaf Bud 2 (Mid Vine, Sprouting Downward from Wave Crest) -->
  <g transform="translate(85, 52) rotate(42)">
    <path d="M 0 0 C -5 -9, -1 -16, 5 -18 C 9 -12, 7 -5, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="1" />
    <path d="M 0 0 Q 2 -9, 5 -18" fill="none" stroke="#bbf7d0" strokeWidth="0.7" />
  </g>

  <!-- Himeno Leaf Bud 3 (Near Tip, Snapping Thorn Barb) -->
  <g transform="translate(132, 22) rotate(-55)">
    <path d="M 0 0 C -4 -7, 0 -13, 5 -14 C 8 -9, 6 -4, 0 0 Z" fill="url(#vineLeafGrad)" stroke="#14532d" strokeWidth="0.8" />
  </g>

  <!-- Stinging Whiplash Barb at Tip -->
  <ellipse cx="158" cy="35" rx="4" ry="2.2" fill="#86efac" stroke="#14532d" strokeWidth="1" transform="rotate(35 158 35)" />
  <circle cx="159" cy="35" r="1.5" fill="#ffffff" />
</svg>
"""

print("Sinuous whip length:", len(whip_left))
