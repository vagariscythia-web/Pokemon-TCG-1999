import json

# 1. Revert GameBoard.tsx
with open("src/components/GameBoard.tsx", "r", encoding="utf-8") as f:
    gb = f.read()

gb_target = """    // Stare's shutdown lasts through the opponent's next turn, so this can be true on a turn the
    // player is otherwise allowed to use the power. Also checks Goop Gas Attack.
    if (GameEngine.isPowerDisabled(inPlay, state.turn)) {"""

gb_revert = """    // Stare's shutdown lasts through the opponent's next turn, so this can be true on a turn the
    // player is otherwise allowed to use the power. Also checks Goop Gas Attack.
    if (GameEngine.isPowerDisabled(inPlay, state.turn, state)) {"""

if gb_target in gb:
    gb = gb.replace(gb_target, gb_revert, 1)
    with open("src/components/GameBoard.tsx", "w", encoding="utf-8") as f:
        f.write(gb)
    print("GameBoard.tsx reverted successfully.")
else:
    print("GameBoard.tsx target not found!")

# 2. Revert index.css
with open("src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("scratch/edit_3218.json", "r", encoding="utf-8") as f:
    e3218 = json.load(f)

css_target = json.loads(e3218["ReplacementContent"])
css_revert = json.loads(e3218["TargetContent"])

if css_target in css:
    css = css.replace(css_target, css_revert, 1)
    with open("src/index.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("index.css reverted successfully.")
else:
    print("index.css target not found!")

# 3. Revert BattleFXOverlay.tsx
with open("src/components/BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
    fx = f.read()

# 3a. L3075: Remove alias constants
alias_target = "const CONFUSE_RAY_ARM_A = CONFUSE_SPIRAL_EXTENDED;\nconst CONFUSE_RAY_INNER_A = CONFUSE_SPIRAL_BASE;\n"
if alias_target in fx:
    fx = fx.replace(alias_target, "", 1)
    print("BattleFXOverlay.tsx L3075 aliases removed.")
elif "const CONFUSE_RAY_ARM_A = CONFUSE_SPIRAL_EXTENDED;" in fx:
    # try CRLF or individual replace
    fx = fx.replace("const CONFUSE_RAY_ARM_A = CONFUSE_SPIRAL_EXTENDED;\r\nconst CONFUSE_RAY_INNER_A = CONFUSE_SPIRAL_BASE;\r\n", "")
    fx = fx.replace("const CONFUSE_RAY_ARM_A = CONFUSE_SPIRAL_EXTENDED;\n", "")
    fx = fx.replace("const CONFUSE_RAY_INNER_A = CONFUSE_SPIRAL_BASE;\n", "")
    print("BattleFXOverlay.tsx L3075 aliases removed (fallback).")
else:
    print("BattleFXOverlay.tsx L3075 aliases not found!")

# 3b. L3081: restore single line returns
drowzee_multi = "    if (name.includes('confuse ray') || name.includes('confusion'))\n      return 'drowzee_confuse_ray';"
drowzee_single = "    if (name.includes('confuse ray') || name.includes('confusion')) return 'drowzee_confuse_ray';"
if drowzee_multi in fx:
    fx = fx.replace(drowzee_multi, drowzee_single, 1)
    print("BattleFXOverlay.tsx Drowzee single-line restored.")

lapras_multi = "    if (name.includes('confuse ray'))\n      return 'lapras_aurora_ray';"
lapras_single = "    if (name.includes('confuse ray')) return 'lapras_aurora_ray';"
if lapras_multi in fx:
    fx = fx.replace(lapras_multi, lapras_single, 1)
    print("BattleFXOverlay.tsx Lapras single-line restored.")

# 3c. L3085: Flamethrower fontSize: '48px'
flame_target = "style={{ animation: 'gbaFlamethrowerStream 1.2s ease-out forwards', fontSize: '48px' }}"
flame_revert = "style={{ animation: 'gbaFlamethrowerStream 1.2s ease-out forwards' }}"
if flame_target in fx:
    fx = fx.replace(flame_target, flame_revert, 1)
    print("BattleFXOverlay.tsx Flamethrower fontSize removed.")
else:
    print("BattleFXOverlay.tsx Flamethrower target not found!")

# 3d. L3214: Revert confuse_ray_spiral block
with open("scratch/edit_3214.json", "r", encoding="utf-8") as f:
    e3214 = json.load(f)

fx_target = json.loads(e3214["ReplacementContent"])
fx_revert = json.loads(e3214["TargetContent"])

if fx_target in fx:
    fx = fx.replace(fx_target, fx_revert, 1)
    print("BattleFXOverlay.tsx L3214 confuse_ray_spiral reverted successfully.")
else:
    print("BattleFXOverlay.tsx L3214 target not found, checking CRLF...")
    fx_target_crlf = fx_target.replace("\n", "\r\n")
    fx_revert_crlf = fx_revert.replace("\n", "\r\n")
    if fx_target_crlf in fx:
        fx = fx.replace(fx_target_crlf, fx_revert_crlf, 1)
        print("BattleFXOverlay.tsx L3214 confuse_ray_spiral reverted successfully (CRLF).")
    else:
        print("BattleFXOverlay.tsx L3214 still not found!")

with open("src/components/BattleFXOverlay.tsx", "w", encoding="utf-8") as f:
    f.write(fx)

print("All revert operations finished.")
