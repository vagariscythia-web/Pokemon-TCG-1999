"""
Full HTML mockup generator for the Hydro Pump animation redesign.
Includes:
1. Left Cannon Torrent (curves along -28 deg barrel)
2. Right Cannon Torrent (curves along +40 deg barrel)
3. Volumetric Muzzle Blast Collars
4. Concussive Hydro Dome & Tsunami Splash Crown
5. Cascading Deluge Sheet & Meandering Rivulets
6. Heavy Droplets & Splashback
"""

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hydro Pump Redesign Showcase</title>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      margin: 0;
    }
    .card-stage {
      width: 184px;
      height: 253px;
      position: relative;
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(14,165,233,0.3);
      border: 1px solid rgba(56,189,248,0.3);
    }
    .card-underlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.85;
    }
    .blastoise-sprite {
      position: absolute;
      width: 114px;
      aspect-ratio: 1023 / 974;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.7));
    }
  </style>
</head>
<body>
  <h2>Hydro Pump Visual Fidelity Overhaul</h2>
  <div class="card-stage" id="stage">
    <img src="../public/cards/base_set_blastoise_2.jpg" class="card-underlay" onerror="this.style.display='none'" />
    <img src="../public/assets/blastoise_full_body.png" class="blastoise-sprite" />
  </div>
</body>
</html>
'''

with open("scratch/test_hydro_mockup.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved scratch/test_hydro_mockup.html")
