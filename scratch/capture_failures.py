import subprocess

res = subprocess.run(["node", ".tmpverify/run.mjs"], capture_output=True, text=True, encoding="utf-8")
lines = res.stdout.splitlines()
for idx, line in enumerate(lines):
    if "FAIL" in line:
        print(f"--- {line} ---")
        for j in range(max(0, idx - 1), min(len(lines), idx + 5)):
            print(lines[j])
        print()
