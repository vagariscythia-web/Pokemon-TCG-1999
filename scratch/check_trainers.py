import json

cards = [
    "Pokédex", "Pokedex",
    "Here Comes Team Rocket",
    "Goop Gas Attack",
    "Rocket's Sneak Attack",
    "Nightly Garbage Run",
    "Imposter Oak's Revenge",
    "Devolution Spray",
    "Scoop Up"
]

with open("src/engine/GameEngine.ts", "r", encoding="utf-8") as f:
    engine_code = f.read()

with open("src/components/GameBoard.tsx", "r", encoding="utf-8") as f:
    board_code = f.read()

print("--- Engine Check ---")
for c in cards:
    in_engine = c.lower() in engine_code.lower()
    in_board = c.lower() in board_code.lower()
    print(f"{c:26} | Engine: {in_engine} | Board: {in_board}")
