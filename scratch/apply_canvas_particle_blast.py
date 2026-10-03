import re

with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CSS Keyframes: Remove old hcGooSplashBlob1..5, add hcHydraulicBoilCore
old_goo_kfs_start = "/* Gooey Splashing Fluid Droplets (Demo 3 Metaball Yüzey Gerilimi — SIFIR RÜZGAR GÜLÜ / SIFIR YILDIZ!) */"
old_goo_kfs_end = "/* High-Pressure Hydraulic Shock Blast (Difüz Buhar Şok Halkası) */"

start_pos = code.find(old_goo_kfs_start)
end_pos = code.find(old_goo_kfs_end)
assert start_pos != -1 and end_pos != -1

new_kfs = """/* Anisotropic Hydraulic Boil Core (Canlı Türbülanslı Köpüren Çarpışma Göbeği) */
    @keyframes hcHydraulicBoilCore {
      0% { opacity: 0; transform: scale(0.2); }
      18% { opacity: 1; transform: scale(1.18); filter: drop-shadow(0 0 16px #38bdf8); }
      45% { opacity: 0.95; transform: scale(1.05); }
      70% { opacity: 0.75; transform: scale(1.28); }
      100% { opacity: 0; transform: scale(1.55); filter: blur(5px); }
    }

    """

code = code[:start_pos] + new_kfs + code[end_pos:]

# 2. Update Dark Blastoise Render Function:
# Replace the old Layer 3 (with 5 static blobs) and old Layer 5 (28 hardcoded DOM divs)
# with the Anisotropic Hydraulic Boil Core and High-Density Micro-Canvas Physical Particle System (90+ fine-grained particles)
old_render_start = "id: 'darkblastoise_hydrocannon_master',"
old_render_end = "whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';"

r_start = code.find(old_render_start)
r_end = code.find(old_render_end, r_start)
r_end += len(old_render_end)
assert r_start != -1 and r_end != -1

new_render = """id: 'darkblastoise_hydrocannon_master',
        badge: 'badge-hydro',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Çift Namlulu Su Mermisi)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'preview_advanced_vfx.html Demo 2 (Su Jeti) & Demo 4 (Micro-Canvas Yüksek Yoğunluklu Akışkan Parçacık) standartlarında kökten yenilendi: Statik root filter ile çalışan anizotropik su sütunları, canlı kaynayan türbülanslı çarpışma göbeği ve 90 adet fiziksel balistik su zerresi.',
        breakdown: '<strong>Demo 2 & 4 İleri Düzey Hidrodinamiği:</strong> Nozul çıkışında süpersonik buhar konisi $\\\\rightarrow$ statik root filter ile anizotropik dalgalanan ikiz hidrolik sütunlar (21° eksenle (92px, 135px) odak noktasına tam V-çarpışması) $\\\\rightarrow$ odaklı çarpışma noktasında feTurbulence ile canlı kaynayan hidrolik köpük göbeği $\\\\rightarrow$ difüz buhar patlaması $\\\\rightarrow$ Micro-Canvas ile gerçek hava sürtünmesi ve yerçekimine sahip 90 fine-grained kavitasyon damlacığı $\\\\rightarrow$ doğal çağlayan su perdesi.',
        duration: 2100,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar Tahliyesi)
            // Left Cannon: (47px, 18px) -> blowout at left: 29px, top: 2px
            // Right Cannon: (137px, 18px) -> blowout at left: 119px, top: 2px
            const muzzles = document.createElement('div');
            muzzles.style.cssText = 'position:absolute; inset:0; z-index:26; pointer-events:none;';
            muzzles.innerHTML = `
              <!-- Left Muzzle Vapor Blowout -->
              <div style="position:absolute; top:2px; left:29px; width:36px; height:32px; border-radius:50%; background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 40%, rgba(2,132,199,0.2) 75%, transparent 100%); opacity:0; animation:hcMuzzleVaporBlowout 0.45s ease-out 0.08s forwards; filter:blur(2px);"></div>

              <!-- Right Muzzle Vapor Blowout -->
              <div style="position:absolute; top:2px; left:119px; width:36px; height:32px; border-radius:50%; background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 40%, rgba(2,132,199,0.2) 75%, transparent 100%); opacity:0; animation:hcMuzzleVaporBlowout 0.45s ease-out 0.08s forwards; filter:blur(2px);"></div>
            `;
            stage.appendChild(muzzles);

            // Layer 2: Dual Collimated Hydrodynamic Water Streams (Exact Demo 2 Architecture)
            // Left Stream: starts at (47px, 18px), length 126px, angle +21 deg -> terminates exactly at (92px, 135px)
            // Right Stream: starts at (137px, 18px), length 126px, angle -21 deg -> terminates exactly at (92px, 135px)
            const torrents = document.createElement('div');
            torrents.style.cssText = 'position:absolute; inset:0; z-index:22; pointer-events:none;';
            torrents.innerHTML = `
              <!-- Left Stream (width: 30px, length: 126px, transform-origin: 15px 0) -->
              <div style="position:absolute; top:18px; left:32px; width:30px; height:126px; transform-origin:15px 0; opacity:0; animation:hcHydroStreamL 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards;">
                <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.88) 35%, rgba(2,132,199,0.95) 100%); border-radius:15px 15px 6px 6px; box-shadow:0 0 16px rgba(56,189,248,0.65), inset 0 0 10px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                  <!-- Inner High-Velocity Cavitation Core Line -->
                  <div style="position:absolute; top:4px; left:10px; width:10px; height:116px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
                </div>
              </div>

              <!-- Right Stream (width: 30px, length: 126px, transform-origin: 15px 0) -->
              <div style="position:absolute; top:18px; left:122px; width:30px; height:126px; transform-origin:15px 0; opacity:0; animation:hcHydroStreamR 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards;">
                <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.88) 35%, rgba(2,132,199,0.95) 100%); border-radius:15px 15px 6px 6px; box-shadow:0 0 16px rgba(56,189,248,0.65), inset 0 0 10px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                  <!-- Inner High-Velocity Cavitation Core Line -->
                  <div style="position:absolute; top:4px; left:10px; width:10px; height:116px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
                </div>
              </div>
            `;
            stage.appendChild(torrents);

            // Layer 3: Anisotropic Hydraulic Boil Core (Tam (92px, 135px) Çarpışma Noktasında Canlı Kaynayan Sıvı Göbek)
            // (feTurbulence ile sürekli dalgalanan, sıfır rüzgar gülü, sıfır statik daire içeren canlı akışkan taç)
            const boilStage = document.createElement('div');
            boilStage.style.cssText = 'position:absolute; top:110px; left:67px; width:50px; height:50px; z-index:24; pointer-events:none; opacity:0; animation:hcHydraulicBoilCore 1.05s cubic-bezier(0.18, 0.88, 0.32, 1) 0.22s forwards; filter:url(#waterJetTurbulenceFilter);';
            boilStage.innerHTML = `
              <div style="width:100%; height:100%; border-radius:44% 56% 52% 48% / 48% 44% 56% 52%; background:radial-gradient(circle at 45% 45%, #ffffff 0%, rgba(186,230,253,0.95) 25%, rgba(56,189,248,0.85) 60%, rgba(2,132,199,0.3) 85%, transparent 100%); box-shadow:0 0 18px rgba(56,189,248,0.7), inset 0 0 12px #ffffff;"></div>
            `;
            stage.appendChild(boilStage);

            // Layer 4: High-Pressure Radial Vapor Condensation Shock (Difüz Sis Halkası)
            const shockContainer = document.createElement('div');
            shockContainer.style.cssText = 'position:absolute; top:90px; left:12px; width:160px; height:90px; z-index:23; pointer-events:none; opacity:0; animation:hcVaporCondensationShock 1.1s cubic-bezier(0.18, 0.9, 0.28, 1) 0.22s forwards;';
            shockContainer.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.6) 30%, rgba(2,132,199,0.2) 65%, transparent 100%); filter:blur(4px);"></div>
            `;
            stage.appendChild(shockContainer);

            // Layer 5: High-Density Micro-Canvas Physical Water Particle Emitter (Demo 4 Parity)
            // 90 adet gerçek zamanlı Newtonian fizik simülasyonlu fine-grained kavitasyon damlası
            const particleCanvas = document.createElement('canvas');
            particleCanvas.width = 184;
            particleCanvas.height = 253;
            particleCanvas.style.cssText = 'position:absolute; inset:0; z-index:25; pointer-events:none;';
            stage.appendChild(particleCanvas);
            const pCtx = particleCanvas.getContext('2d');

            class FluidDroplet {
              constructor(ox, oy, isSputter) {
                this.x = ox + (Math.random() - 0.5) * 8;
                this.y = oy + (Math.random() - 0.5) * 6;
                const angle = Math.random() * Math.PI * 2;
                const speed = isSputter ? (1.5 + Math.random() * 4.2) : (2.5 + Math.random() * 6.5);
                this.vx = Math.cos(angle) * speed;
                // Jetlerin tepeden çarpmasıyla momentum sekmesi (yukarı ve yana balistik sıçrama)
                this.vy = Math.sin(angle) * speed * 0.85 - (Math.random() * 2.2);
                this.gravity = 0.14 + Math.random() * 0.08;
                this.drag = 0.965;
                this.radius = 0.8 + Math.random() * 1.6;
                this.alpha = 1.0;
                this.decay = 0.015 + Math.random() * 0.015;
                const r = Math.random();
                this.color = r > 0.55 ? '#ffffff' : (r > 0.3 ? '#bae6fd' : '#38bdf8');
              }
              update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.vx *= this.drag;
                this.vy *= this.drag;
                this.alpha -= this.decay;
              }
              draw(c) {
                if (this.alpha <= 0) return;
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                c.fillStyle = this.color;
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                c.fill();
                c.restore();
              }
            }

            const droplets = [];
            // Wave 1: Çarpışma anında (0.22s) 60 adet patlayan mikro damlacık
            setTimeout(() => {
              for (let i = 0; i < 60; i++) {
                droplets.push(new FluidDroplet(92, 135, false));
              }
            }, 220);

            // Wave 2: Su akışı sürerken (0.42s) 30 adet sürekli kavitasyon sıçraması
            setTimeout(() => {
              for (let i = 0; i < 30; i++) {
                droplets.push(new FluidDroplet(92, 135, true));
              }
            }, 420);

            let animId;
            let startSim = performance.now();
            function renderDroplets() {
              pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
              let activeCount = 0;
              for (let i = 0; i < droplets.length; i++) {
                const d = droplets[i];
                if (d.alpha > 0) {
                  d.update();
                  d.draw(pCtx);
                  activeCount++;
                }
              }
              if (activeCount > 0 || (performance.now() - startSim < 1800)) {
                animId = requestAnimationFrame(renderDroplets);
              }
            }
            animId = requestAnimationFrame(renderDroplets);

            // Layer 6: Cascading Caustic Deluge Waterfall / Sheet (Darbe noktasından (135px) aşağı çağlayan su perdesi)
            const deluge = document.createElement('div');
            deluge.style.cssText = 'position:absolute; bottom:0; left:8px; right:8px; height:118px; z-index:21; pointer-events:none; opacity:0; animation:hcCausticWaterVeilFlow 1.45s ease-out 0.36s forwards;';
            deluge.innerHTML = `
              <svg width="168" height="118" viewBox="0 0 168 118" style="overflow:visible;">
                <!-- Volumetric Translucent Water Veil Body -->
                <path d="M 12 0 C 26 30, 14 65, 20 118 C 45 118, 75 118, 95 118 C 115 118, 145 118, 154 118 C 160 65, 148 30, 156 0 Z" fill="url(#gradWaterVeilSheet)" opacity="0.65"/>
                
                <!-- Soft Diffuse Flow Streaks -->
                <rect x="26" y="0" width="34" height="118" fill="url(#gradFlowStreamSoft)" opacity="0.45" style="filter:blur(5px);"/>
                <rect x="108" y="0" width="34" height="118" fill="url(#gradFlowStreamSoft)" opacity="0.45" style="filter:blur(5px);"/>
                <rect x="66" y="0" width="36" height="118" fill="url(#gradFlowStreamCenter)" opacity="0.65" style="filter:blur(3px);"/>

                <defs>
                  <linearGradient id="gradWaterVeilSheet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8"/>
                    <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.55"/>
                    <stop offset="75%" stop-color="#0284c7" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#0369a1" stop-opacity="0.1"/>
                  </linearGradient>
                  <linearGradient id="gradFlowStreamSoft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                  <linearGradient id="gradFlowStreamCenter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                    <stop offset="60%" stop-color="#e0f2fe" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(deluge);

            // Layer 7: Fine-Grained Gravitational Droplets
            for (let i = 0; i < 16; i++) {
              const fdrop = document.createElement('div');
              const left = 18 + (i * 4.4);
              const delay = 0.40 + (i * 0.035);
              const size = 1.8 + (i % 3) * 1.2;
              fdrop.style.cssText = `position:absolute; top:125px; left:${left}%; width:${size}px; height:${size * 1.5}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 65%, #0284c7 100%); z-index:22; opacity:0; animation:hcFineGrainVelocityCascade 0.72s cubic-bezier(0.45, 0.05, 0.9, 1) ${delay.toFixed(3)}s forwards; pointer-events:none; box-shadow:0 0 4px #7dd3fc;`;
              stage.appendChild(fdrop);
            }

            // Layer 8: Runoff Drip Tears descending from veil edge
            for (let i = 0; i < 8; i++) {
              const drip = document.createElement('div');
              const left = 16 + i * 9.5;
              const delay = 0.50 + i * 0.06;
              const size = 2.5 + (i % 2) * 1.5;
              drip.style.cssText = `position:absolute; bottom:25px; left:${left}%; width:${size}px; height:${size * 1.6}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 60%, #0284c7 100%); z-index:22; opacity:0; animation:hcRunoffDripTear 0.85s cubic-bezier(0.4, 0, 0.9, 1) ${delay.toFixed(2)}s forwards; pointer-events:none;`;
              stage.appendChild(drip);
            }
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;"></div>';"""

code = code[:r_start] + new_render + code[r_end:]

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/generate_cinema_masterpieces.py successfully with Micro-Canvas 90 Droplets and Live Turbulent Boil Core!")
