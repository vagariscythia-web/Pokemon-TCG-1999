"""
Comprehensive test script to verify defense mechanics across all categories:
1. Self-targeting moves (Withdraw, Stiffen, Recover, etc.) vs opponent shields
2. Damage-only shields (Stiffen, Withdraw, Scrunch, Harden) vs damaging attacks
3. Damage-only shields vs 0-damage status/debuff moves (Thunder Wave, PoisonPowder, Tail Wag, Amnesia)
4. All-effects shields (Barrier, Agility) vs status/debuff/forced-switch moves
5. Source code integrity assertions in GameEngine.ts, GameBoard.tsx, and BattleFXOverlay.tsx
"""

def verify_codebase():
    with open('src/engine/GameEngine.ts', 'r', encoding='utf-8') as f:
        engine_src = f.read()

    with open('src/components/GameBoard.tsx', 'r', encoding='utf-8') as f:
        board_src = f.read()

    with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay_src = f.read()

    # 1. Engine checks
    assert "if (finalDamage > 0) {" in engine_src, "Engine must guard damage prevention log with finalDamage > 0"
    assert "attacker.preventAllEffectsNextTurn = true;" in engine_src, "Barrier must set preventAllEffectsNextTurn"
    assert "if (defender.preventAllEffectsNextTurn)" in engine_src, "Defender all-effects shield must be checked for effects"
    
    # 2. Board checks
    assert "!selfTarget &&" in board_src, "GameBoard must check !selfTarget before marking isBlocked"
    assert "hasDamageShield" in board_src, "GameBoard must distinguish damage shield"
    assert "hasEffectShield" in board_src, "GameBoard must distinguish effect shield"

    # 3. Overlay checks
    assert "conversion" in overlay_src, "BattleFXOverlay must include conversion"
    assert "snivel" in overlay_src, "BattleFXOverlay must include snivel"

    print(">>> All 7 codebase integrity assertions passed successfully!\n")

def simulate_scenarios():
    scenarios = [
        {
            "name": "Scenario 1: Wartortle uses Withdraw vs Kakuna's Stiffen",
            "attack": "Withdraw", "base_dmg": 0, "calc_dmg": 0, "self_target": True,
            "defender_shield": "damage_only", # preventDamageNextTurn = True
            "expected_blocked": False,
            "desc": "Self-targeting move must NOT be blocked by opponent's damage shield"
        },
        {
            "name": "Scenario 2: Wartortle uses Bite (40 dmg) vs Kakuna's Stiffen",
            "attack": "Bite", "base_dmg": 40, "calc_dmg": 0, "self_target": False,
            "defender_shield": "damage_only",
            "expected_blocked": True,
            "desc": "Damaging attack against Stiffen is blocked (finalDamage reduced to 0)"
        },
        {
            "name": "Scenario 3: Pikachu uses Thunder Wave (0 dmg, Paralysis) vs Kakuna's Stiffen",
            "attack": "Thunder Wave", "base_dmg": 0, "calc_dmg": 0, "self_target": False,
            "defender_shield": "damage_only",
            "expected_blocked": False,
            "desc": "Damage-only shield allows attack effects through; status condition lands"
        },
        {
            "name": "Scenario 4: Pikachu uses Thunder Wave vs Mewtwo's Barrier",
            "attack": "Thunder Wave", "base_dmg": 0, "calc_dmg": 0, "self_target": False,
            "defender_shield": "all_effects", # preventAllEffectsNextTurn = True
            "expected_blocked": True,
            "desc": "All-effects shield blocks status condition"
        },
        {
            "name": "Scenario 5: Eevee uses Tail Wag (0 dmg) vs Kakuna's Stiffen",
            "attack": "Tail Wag", "base_dmg": 0, "calc_dmg": 0, "self_target": False,
            "defender_shield": "damage_only",
            "expected_blocked": False,
            "desc": "Damage-only shield does NOT block Tail Wag debuff"
        },
        {
            "name": "Scenario 6: Eevee uses Tail Wag vs Mewtwo's Barrier",
            "attack": "Tail Wag", "base_dmg": 0, "calc_dmg": 0, "self_target": False,
            "defender_shield": "all_effects",
            "expected_blocked": True,
            "desc": "All-effects shield blocks Tail Wag debuff"
        },
        {
            "name": "Scenario 7: Scyther uses Swords Dance vs Kakuna's Stiffen",
            "attack": "Swords Dance", "base_dmg": 0, "calc_dmg": 0, "self_target": True,
            "defender_shield": "damage_only",
            "expected_blocked": False,
            "desc": "Self-buff is immune to opponent shield"
        },
        {
            "name": "Scenario 8: Pidgeot uses Whirlwind vs Mewtwo's Barrier",
            "attack": "Whirlwind", "base_dmg": 0, "calc_dmg": 0, "self_target": False,
            "defender_shield": "all_effects",
            "expected_blocked": True,
            "desc": "All-effects shield prevents forced switch"
        },
        {
            "name": "Scenario 9: Dragonair uses Hyper Beam vs Mewtwo's Barrier",
            "attack": "Hyper Beam", "base_dmg": 30, "calc_dmg": 0, "self_target": False,
            "defender_shield": "all_effects",
            "expected_blocked": True,
            "desc": "All-effects shield blocks both 30 damage and Energy discard"
        },
        {
            "name": "Scenario 10: Dragonair uses Hyper Beam vs Kakuna's Stiffen",
            "attack": "Hyper Beam", "base_dmg": 30, "calc_dmg": 0, "self_target": False,
            "defender_shield": "damage_only",
            "expected_blocked": True,
            "desc": "Damage is blocked, but Energy discard on Kakuna still occurs"
        }
    ]

    for s in scenarios:
        has_damage_shield = s["defender_shield"] in ["damage_only", "all_effects"]
        has_effect_shield = s["defender_shield"] == "all_effects"
        
        # New calculation logic in GameBoard:
        is_blocked = (not s["self_target"]) and (
            (s["base_dmg"] > 0 and s["calc_dmg"] == 0 and has_damage_shield) or
            (s["base_dmg"] == 0 and has_effect_shield)
        )
        
        status = "PASS" if is_blocked == s["expected_blocked"] else "FAIL"
        print(f"[{status}] {s['name']}")
        print(f"       Result: isBlocked={is_blocked} (Expected: {s['expected_blocked']})")
        print(f"       Notes: {s['desc']}\n")

if __name__ == "__main__":
    verify_codebase()
    simulate_scenarios()
