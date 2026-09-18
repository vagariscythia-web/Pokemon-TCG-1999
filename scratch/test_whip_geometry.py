# Let's test the overhead downward whip curves:
# Left Vine: Base at (20, 120), loops up to (45, 15), whips forward-down to (95, 75).
# Right Vine: Base at (110, 120), loops up to (85, 15), whips forward-down to (35, 75).
# The bodies stay on their respective sides (Left: x in [15..60], Right: x in [70..115]).
# Only the tips (front 1/4) reach into the center (x=95 for left, x=35 for right)!

left_path = "M 18 118 C 12 75, 22 22, 52 12 C 70 8, 85 24, 102 70"
right_path = "M 112 118 C 118 75, 108 22, 78 12 C 60 8, 45 24, 28 70"

print("Left path:", left_path)
print("Right path:", right_path)

# Let's inspect the bounding box and width/height:
# Left vine: width around 120, height around 130
# ViewBox: 0 0 130 130
