import noiseprint, os

print("📂 Noiseprint package path:", noiseprint.__file__)

# ندور عن أي ملف فيه reset_default_graph داخل مجلد noiseprint
base = os.path.dirname(noiseprint.__file__)
print("🔍 Scanning folder:", base)

for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith(".py"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                for i, line in enumerate(fh, start=1):
                    if "reset_default_graph" in line:
                        print(f"⚠️ Found in {path} (line {i}): {line.strip()}")
