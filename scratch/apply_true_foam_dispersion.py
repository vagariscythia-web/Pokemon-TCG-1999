import re

with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Keyframes: Replace from @keyframes hcDynamicFoamBubble up to @keyframes hcAerosolMistPlume
start_pos = code.find('@keyframes hcDynamicFoamBubble')
end_pos = code.find('@keyframes hcAerosolMistPlume')
assert start_pos != -1 and end_pos != -1, f"Positions: start={start_pos}, end={end_pos}"

new_kfs = """@keyframes hcDispersingFoamBubble {
      0% {
        opacity: 0;
        transform: translate(0, 0) scale(0.2);
      }
      18% {
        opacity: 1;
        transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.35)) scale(1.15);
        filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.75));
      }
      50% {
        opacity: 0.95;
        transform: translate(calc(var(--dx) * 0.75), calc(var(--dy) * 0.75)) scale(1.0);
      }
      75% {
        opacity: 0.75;
        transform: translate(var(--dx), var(--dy)) scale(0.85);
      }
      100% {
        opacity: 0;
        transform: translate(calc(var(--dx) * 1.25), calc(var(--dy) * 1.25 + 14px)) scale(0.1);
        filter: blur(4px);
      }
    }

    /* Core Nucleating Foam Bloom */
    @keyframes hcCoreFoamBloom {
      0% { opacity: 0; transform: scale(0.2); }
      20% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.8)); }
      50% { opacity: 0.9; transform: scale(1.28); }
      80% { opacity: 0.45; transform: scale(1.45); filter: blur(3px); }
      100% { opacity: 0; transform: scale(1.6); filter: blur(6px); }
    }

    /* Diffuse Atmospheric Vapor Flash (SIFIR STATIK BUZ MAVISI DAIRE!) */
    @keyframes hcAtmosphericVaporFlash {
      0% { opacity: 0; transform: scale(0.3); }
      20% { opacity: 0.85; transform: scale(1.1); }
      55% { opacity: 0.5; transform: scale(1.6); }
      100% { opacity: 0; transform: scale(2.2); filter: blur(10px); }
    }

    """

code = code[:start_pos] + new_kfs + code[end_pos:]

# 2. Update Dark Blastoise Render Function
render_target_start = "id: 'darkblastoise_hydrocannon_master',"
render_target_end = "whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';"

r_start = code.find(render_target_start)
r_end = code.find(render_target_end, r_start)
r_end += len(render_target_end)
assert r_start != -1 and r_end != -1, f"Render positions: {r_start}, {r_end}"

new_render = """id: 'darkblastoise_hydrocannon_master',
        badge: 'badge-hydro',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Çift Namlulu Su Mermisi)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'Gerçek Akışkan Saçılımı & Atomizasyon Sentezi: 24 adet geniş alana saçılan dinamik kavitasyon köpük küresi, 90 adet fiziksel balistik su zerresi, sıfır statik daire ve sıfır artık küre.',
        breakdown: '<strong>Gerçek Akışkan Saçılımı:</strong> Nozul çıkışında süpersonik buhar konisi $\\\\rightarrow$ statik root filter ile anizotropik dalgalanan ikiz hidrolik sütunlar (21° eksenle (92px, 135px) odak noktasına tam V-çarpışması) $\\\\rightarrow$ darbe anında geniş alana (40-75px mesafeye) 360° saçılan 24 dinamik kavitasyon köpük küresi $\\\\rightarrow$ difüz atmosferik buhar parlaması (sıfır statik daire!) $\\\\rightarrow$ Micro-Canvas ile gerçek hava sürtünmesi ve yerçekimine sahip 90 fine-grained kavitasyon damlacığı $\\\\rightarrow$ doğal çağlayan su perdesi $\\\\rightarrow$ tam DOM temizliği (sıfır artık küre!).',
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

            // Layer 3: Dynamic Wide-Dispersing Cavitation Foam Blast (24 Çok Kademeli Saçılan Köpük Küresi)
            // Center is at (92px, 135px) -> stage at left: 12px, top: 55px, width: 160px, height: 160px (center = 80px, 80px)
            // SIFIR MAKASLA KESİLMİŞ ÇERÇEVE! Pürüzsüz, parıldayan, geniş alana saçılan organik su köpükleri!
            const foamStage = document.createElement('div');
            foamStage.style.cssText = 'position:absolute; top:55px; left:12px; width:160px; height:160px; z-index:24; pointer-events:none;';

            // Central Nucleation Foam Mass
            const coreFoam = document.createElement('div');
            coreFoam.style.cssText = 'position:absolute; top:64px; left:64px; width:32px; height:32px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(224,242,254,0.95) 25%, #7dd3fc 60%, rgba(2,132,199,0.9) 85%, transparent 100%); box-shadow:0 0 16px rgba(56,189,248,0.8), inset 0 0 8px #ffffff; opacity:0; animation:hcCoreFoamBloom 0.95s cubic-bezier(0.18, 0.88, 0.32, 1) 0.20s forwards;';
            foamStage.appendChild(coreFoam);

            // 24 Dispersing Cavitation Foam Bubbles (Geniş mesafelere saçılan, patlayan ve buharlaşan köpük incileri)
            // [size, dx, dy, delay, duration]
            const dispersingBubbles = [
              // Tier 1: Large frothing cores
              [26, 49.7, -9.8, 0.20, 0.77],
              [25, -48.2, -12.4, 0.21, 0.82],
              [24, 42.6, 26.8, 0.22, 0.80],
              [24, -40.5, 24.5, 0.21, 0.79],
              // Tier 2: Medium ejected bubbles
              [18, 0.0, -52.0, 0.21, 0.85],
              [17, -24.0, -46.0, 0.22, 0.80],
              [17, 24.0, -44.0, 0.22, 0.80],
              [16, 56.0, 8.0, 0.23, 0.75],
              [16, -58.0, 6.0, 0.23, 0.75],
              [15, 32.0, 44.0, 0.24, 0.72],
              [15, -34.0, 42.0, 0.24, 0.72],
              [14, 0.0, 48.0, 0.25, 0.70],
              [14, 52.0, -28.0, 0.23, 0.76],
              [13, -54.0, -26.0, 0.23, 0.76],
              // Tier 3: Fine cavitation pearls
              [10, -18.0, -58.0, 0.22, 0.70],
              [10, 18.0, -56.0, 0.22, 0.70],
              [9, 64.0, -4.0, 0.24, 0.65],
              [9, -65.0, -2.0, 0.24, 0.65],
              [8, 44.0, 40.0, 0.25, 0.62],
              [8, -42.0, 38.0, 0.25, 0.62],
              [8, -60.0, 22.0, 0.24, 0.64],
              [7, 62.0, 20.0, 0.24, 0.64],
              [7, -32.0, -50.0, 0.23, 0.66],
              [6, 30.0, -48.0, 0.23, 0.66]
            ];

            dispersingBubbles.forEach(([sz, dx, dy, del, dur]) => {
              const b = document.createElement('div');
              b.style.cssText = `
                position: absolute;
                top: ${80 - sz / 2}px;
                left: ${80 - sz / 2}px;
                width: ${sz}px;
                height: ${sz}px;
                border-radius: 50%;
                background: radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(224,242,254,0.95) 25%, #7dd3fc 60%, rgba(2,132,199,0.9) 90%, #0369a1 100%);
                box-shadow: 0 0 10px rgba(56,189,248,0.7), inset 0 0 5px #ffffff;
                --dx: ${dx}px;
                --dy: ${dy}px;
                opacity: 0;
                animation: hcDispersingFoamBubble ${dur}s cubic-bezier(0.18, 0.88, 0.32, 1) ${del}s forwards;
              `;
              foamStage.appendChild(b);
            });
            stage.appendChild(foamStage);

            // Layer 4: Diffuse Atmospheric Vapor Flash (Sıfır Statik Buz Mavisi Daire! Saf Parlama)
            const shockContainer = document.createElement('div');
            shockContainer.style.cssText = 'position:absolute; top:85px; left:12px; width:160px; height:100px; z-index:23; pointer-events:none; opacity:0; animation:hcAtmosphericVaporFlash 1.05s ease-out 0.22s forwards;';
            shockContainer.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.45) 30%, rgba(56,189,248,0.15) 60%, transparent 80%); filter:blur(8px);"></div>
            `;
            stage.appendChild(shockContainer);

            // Automatic Hard DOM Cleanup to Guarantee ZERO Residual Spheres/Circles
            setTimeout(() => {
              if (foamStage && foamStage.parentNode) foamStage.parentNode.removeChild(foamStage);
              if (shockContainer && shockContainer.parentNode) shockContainer.parentNode.removeChild(shockContainer);
            }, 1400);

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
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcAtmosphericVaporFlash 0.7s ease-out forwards;"></div>';"""

code = code[:r_start] + new_render + code[r_end:]

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/generate_cinema_masterpieces.py successfully with True Foam Dispersion & Zero Residual Spheres!")
