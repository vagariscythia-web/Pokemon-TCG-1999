# Let's craft the Himeno-style organic Vine Whip SVG.
# We want a dynamic S-curve whip with realistic leaf buds and nodes.

vine_left_svg = """
<svg width="140" height="90" viewBox="0 0 140 90" class="overflow-visible select-none pointer-events-none">
  <defs>
    <!-- Vine Bark Gradient: Deep Jungle Green to Vivid Emerald to Bright Lime -->
    <linearGradient id="vineGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#052e16" />
      <stop offset="25%" stopColor="#14532d" />
      <stop offset="60%" stopColor="#16a34a" />
      <stop offset="85%" stopColor="#22c55e" />
      <stop offset="100%" stopColor="#86efac" />
    </linearGradient>

    <!-- Vine Core Highlight -->
    <linearGradient id="vineCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
      <stop offset="50%" stopColor="#86efac" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
    </linearGradient>

    <!-- Leaf Gradient -->
    <linearGradient id="vineLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#bbf7d0" />
      <stop offset="40%" stopColor="#4ade80" />
      <stop offset="100%" stopColor="#15803d" />
    </linearGradient>
  </defs>

  <!-- Outer Chlorophyll Glow -->
  <path
    d="M 6 82 Q 35 15, 75 42 Q 105 60, 132 18"
    fill="none"
    stroke="#22c55e"
    strokeWidth="14"
    strokeLinecap="round"
    opacity="0.3"
    filter="blur(5px)"
  />

  <!-- Main Tapered Vine Body -->
  <path
    d="M 6 82 Q 35 15, 75 42 Q 105 60, 132 18"
    fill="none"
    stroke="url(#vineGradLeft)"
    strokeWidth="8"
    strokeLinecap="round"
  />

  <!-- High-Incandescence Spine/Core Line -->
  <path
    d="M 12 78 Q 38 18, 75 42 Q 104 58, 130 20"
    fill="none"
    stroke="url(#vineCoreGrad)"
    strokeWidth="2.5"
    strokeLinecap="round"
  />

  <!-- Leaf Bud 1 (Near Base, Sprouting Upward) -->
  <g transform="translate(32, 36) rotate(-35)">
    <path
      d="M 0 0 C -6 -10, -2 -18, 6 -20 C 10 -14, 8 -6, 0 0 Z"
      fill="url(#vineLeafGrad)"
      stroke="#14532d"
      strokeWidth="1"
    />
    <path d="M 0 0 Q 3 -10, 6 -20" fill="none" stroke="#bbf7d0" strokeWidth="0.8" />
  </g>

  <!-- Leaf Bud 2 (Mid Vine, Sprouting Downward) -->
  <g transform="translate(76, 44) rotate(42)">
    <path
      d="M 0 0 C -5 -8, -1 -15, 5 -16 C 9 -11, 7 -5, 0 0 Z"
      fill="url(#vineLeafGrad)"
      stroke="#14532d"
      strokeWidth="1"
    />
    <path d="M 0 0 Q 2 -8, 5 -16" fill="none" stroke="#bbf7d0" strokeWidth="0.7" />
  </g>

  <!-- Leaf Bud 3 (Near Tip, Dynamic Whip Barb) -->
  <g transform="translate(112, 42) rotate(-65)">
    <path
      d="M 0 0 C -4 -7, 0 -13, 5 -14 C 8 -9, 6 -4, 0 0 Z"
      fill="url(#vineLeafGrad)"
      stroke="#14532d"
      strokeWidth="0.8"
    />
  </g>

  <!-- Whip Barb / Piercing Bud at Very Tip -->
  <ellipse cx="132" cy="18" rx="4" ry="2.5" fill="#86efac" stroke="#14532d" strokeWidth="1" transform="rotate(-35 132 18)" />
  <circle cx="133" cy="17" r="1.5" fill="#ffffff" />
</svg>
"""

print("Vine Left SVG length:", len(vine_left_svg))
