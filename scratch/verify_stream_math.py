import math

# Test coordinates and angles
left_x = 32
origin_x = 14
top_x_L = left_x + origin_x # 46
top_y = 18
length = 127
angle_deg = 22.5
rad = math.radians(angle_deg)

end_x_L = top_x_L + length * math.sin(rad)
end_y_L = top_y + length * math.cos(rad)

right_x = 124
top_x_R = right_x + origin_x # 138
end_x_R = top_x_R - length * math.sin(rad)
end_y_R = top_y + length * math.cos(rad)

print(f"Left Stream: start=({top_x_L}, {top_y}), end=({end_x_L:.1f}, {end_y_L:.1f})")
print(f"Right Stream: start=({top_x_R}, {top_y}), end=({end_x_R:.1f}, {end_y_R:.1f})")
print(f"Impact target: (92, 135) - Delta L: {abs(end_x_L - 92):.2f}, {abs(end_y_L - 135):.2f}")
print(f"Impact target: (92, 135) - Delta R: {abs(end_x_R - 92):.2f}, {abs(end_y_R - 135):.2f}")
