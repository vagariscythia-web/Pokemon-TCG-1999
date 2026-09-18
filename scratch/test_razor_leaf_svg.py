# Razor Leaf SVG blade
# Sharp, curved, aerodynamic leaf blade with central vein and glowing cutting rim

razor_leaf_svg = """
<svg width="42" height="42" viewBox="0 0 50 50" class="overflow-visible select-none pointer-events-none">
  <defs>
    <linearGradient id="razorLeafBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#bef264" />
      <stop offset="60%" stopColor="#22c55e" />
      <stop offset="100%" stopColor="#14532d" />
    </linearGradient>
    <linearGradient id="razorEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
      <stop offset="60%" stopColor="#bef264" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
    </linearGradient>
  </defs>

  <!-- Outer Speed Blur Glow -->
  <path
    d="M 5 25 C 10 10, 35 5, 45 15 C 40 35, 25 45, 5 25 Z"
    fill="#4ade80"
    opacity="0.35"
    filter="blur(3px)"
  />

  <!-- Main Razor Leaf Blade (Serrated curved cutting silhouette) -->
  <path
    d="M 6 25 C 10 12, 28 6, 44 14 C 41 22, 38 27, 43 32 C 32 38, 20 44, 6 25 Z"
    fill="url(#razorLeafBladeGrad)"
    stroke="#14532d"
    strokeWidth="1.2"
  />

  <!-- High-Frequency Razor Edge Highlight -->
  <path
    d="M 8 23 C 14 12, 28 8, 43 14"
    fill="none"
    stroke="url(#razorEdgeGlow)"
    strokeWidth="2"
    strokeLinecap="round"
  />

  <!-- Sharp Central Leaf Spine -->
  <path
    d="M 8 25 Q 24 22, 42 16"
    fill="none"
    stroke="#ffffff"
    strokeWidth="1.2"
    strokeLinecap="round"
    opacity="0.9"
  />

  <!-- Lateral Serrated Blade Veins -->
  <path d="M 18 24 L 23 16" stroke="#bbf7d0" strokeWidth="0.8" opacity="0.85" />
  <path d="M 28 22 L 34 14" stroke="#bbf7d0" strokeWidth="0.8" opacity="0.85" />
  <path d="M 22 24 L 25 32" stroke="#15803d" strokeWidth="0.8" opacity="0.75" />
</svg>
"""

print("Razor Leaf SVG length:", len(razor_leaf_svg))
