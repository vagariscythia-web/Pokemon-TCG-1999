import re

# Read current generate_cinema_masterpieces.py
with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Ensure static root SVG is placed right after <body> in html
# We check if root SVG is present
root_svg_block = """  <!-- Static Global SVG Filter Defs (Exact Demo 2 & Demo 3 Architecture) -->
  <svg width="0" height="0" style="position: absolute; pointer-events: none;">
    <defs>
      <!-- 1. Liquid Gooey / Metaball Filter (Surface Tension & Organic Splash) -->
      <filter id="liquidGooFilter" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" 
          values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 24 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>

      <!-- 2. Water Jet Turbulence Filter (Anisotropic High-Pressure Ripple - Demo 2 Standard) -->
      <filter id="waterJetTurbulenceFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence id="waterTurbulenceElem" type="turbulence" baseFrequency="0.02 0.09" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>"""

if 'id="waterJetTurbulenceFilter"' not in code:
    code = code.replace('<body>', '<body>\n\n' + root_svg_block)
    print("Injected static root SVG filters.")

# 2. Keyframes for Dark Blastoise
old_kfs_start = "/* 4. DARK BLASTOISE HYDROCANNON ADVANCED HYDRAULIC TORRENTS KEYFRAMES */"
old_kfs_end = "@keyframes hcAerosolMistPlume {"

start_idx = code.find(old_kfs_start)
end_idx = code.find(old_kfs_end)
assert start_idx != -1 and end_idx != -1

new_kfs = """/* 4. DARK BLASTOISE HYDROCANNON ADVANCED HYDRAULIC TORRENTS KEYFRAMES */
    /* Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar Tahliyesi) */
    @keyframes hcMuzzleVaporBlowout {
      0% { opacity: 0; transform: scale(0.2); }
      18% { opacity: 0.95; transform: scale(1.15); filter: drop-shadow(0 0 14px #38bdf8); }
      50% { opacity: 0.65; transform: scale(1.45) translateY(6px); }
      100% { opacity: 0; transform: scale(1.85) translateY(12px); filter: blur(4px); }
    }

    /* Hydrodynamic Column Left: Doğrusal +21.0 deg eksen boyunca hedefe (92px, 135px) çakılan sıvı sütun (Demo 2 Mimarisi) */
    @keyframes hcHydroStreamL {
      0% { opacity: 0; transform: rotate(21.0deg) scaleY(0.06); }
      14% { opacity: 1; transform: rotate(21.0deg) scaleY(1.02); }
      35% { opacity: 1; transform: rotate(21.0deg) scaleY(1.0); }
      68% { opacity: 0.9; transform: rotate(21.0deg) scaleY(0.98); }
      85% { opacity: 0.45; transform: rotate(21.0deg) scaleY(0.95); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(21.0deg) scaleY(0.92); filter: blur(4px); }
    }

    /* Hydrodynamic Column Right: Doğrusal -21.0 deg eksen boyunca hedefe (92px, 135px) çakılan sıvı sütun (Demo 2 Mimarisi) */
    @keyframes hcHydroStreamR {
      0% { opacity: 0; transform: rotate(-21.0deg) scaleY(0.06); }
      14% { opacity: 1; transform: rotate(-21.0deg) scaleY(1.02); }
      35% { opacity: 1; transform: rotate(-21.0deg) scaleY(1.0); }
      68% { opacity: 0.9; transform: rotate(-21.0deg) scaleY(0.98); }
      85% { opacity: 0.45; transform: rotate(-21.0deg) scaleY(0.95); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(-21.0deg) scaleY(0.92); filter: blur(4px); }
    }

    /* Gooey Splashing Fluid Droplets (Demo 3 Metaball Yüzey Gerilimi — SIFIR RÜZGAR GÜLÜ / SIFIR YILDIZ!) */
    @keyframes hcGooSplashCenter {
      0% { transform: scale(0.2); opacity: 0; }
      18% { transform: scale(1.15); opacity: 1; }
      55% { transform: scale(1.0); opacity: 0.95; }
      100% { transform: scale(1.4); opacity: 0; filter: blur(4px); }
    }
    @keyframes hcGooSplashBlob1 {
      0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
      20% { transform: translate(-22px, -18px) scale(1.1); opacity: 1; }
      70% { transform: translate(-34px, -26px) scale(0.85); opacity: 0.8; }
      100% { transform: translate(-42px, -30px) scale(0.2); opacity: 0; }
    }
    @keyframes hcGooSplashBlob2 {
      0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
      20% { transform: translate(22px, -18px) scale(1.1); opacity: 1; }
      70% { transform: translate(34px, -26px) scale(0.85); opacity: 0.8; }
      100% { transform: translate(42px, -30px) scale(0.2); opacity: 0; }
    }
    @keyframes hcGooSplashBlob3 {
      0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
      20% { transform: translate(-26px, 14px) scale(1.05); opacity: 1; }
      70% { transform: translate(-38px, 24px) scale(0.8); opacity: 0.8; }
      100% { transform: translate(-48px, 32px) scale(0.2); opacity: 0; }
    }
    @keyframes hcGooSplashBlob4 {
      0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
      20% { transform: translate(26px, 14px) scale(1.05); opacity: 1; }
      70% { transform: translate(38px, 24px) scale(0.8); opacity: 0.8; }
      100% { transform: translate(48px, 32px) scale(0.2); opacity: 0; }
    }
    @keyframes hcGooSplashBlob5 {
      0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
      20% { transform: translate(0px, -28px) scale(1.2); opacity: 1; }
      70% { transform: translate(0px, -42px) scale(0.9); opacity: 0.85; }
      100% { transform: translate(0px, -52px) scale(0.2); opacity: 0; }
    }

    /* High-Pressure Hydraulic Shock Blast (Difüz Buhar Şok Halkası) */
    @keyframes hcVaporCondensationShock {
      0% { opacity: 0; transform: scale(0.18); }
      22% { opacity: 0.95; transform: scale(1.0); filter: drop-shadow(0 0 20px #38bdf8); }
      60% { opacity: 0.6; transform: scale(1.55); }
      100% { opacity: 0; transform: scale(2.2); filter: blur(8px); }
    }

    """

code = code[:start_idx] + new_kfs + code[end_idx:]

# 3. Replace Dark Blastoise Render Function
render_start = code.find("id: 'darkblastoise_hydrocannon_master',")
render_end = code.find("whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';", render_start)
render_end += len("whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';")

new_render = """id: 'darkblastoise_hydrocannon_master',
        badge: 'badge-hydro',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Çift Namlulu Su Mermisi)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'preview_advanced_vfx.html Demo 2 (Su Jeti) & Demo 3 (Gooey Yüzey Gerilimi) standartlarında kökten yenilendi: Statik root filter ile çalışan anizotropik su sütunları, 21° V-çarpışması ve rüzgar gülü yerine akışkan metaball su sıçraması.',
        breakdown: '<strong>Demo 2 & 3 İleri Düzey Hidrodinamiği:</strong> Nozul çıkışında süpersonik buhar konisi $\\\\rightarrow$ statik root filter ile anizotropik dalgalanan ikiz hidrolik sütunlar (21° eksenle (92px, 135px) odak noktasına tam V-çarpışması) $\\\\rightarrow$ odaklı çarpışma noktasında Gooey yüzey gerilimli sıvı metaball sıçraması (SIFIR rüzgar gülü, SIFIR yıldız!) $\\\\rightarrow$ difüz buhar patlaması $\\\\rightarrow$ darbe merkezinden fışkıran 28 kavitasyon damlası $\\\\rightarrow$ doğal çağlayan su perdesi.',
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
            // Uses exact .water-stream styling from preview_advanced_vfx.html with static waterJetTurbulenceFilter!
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

            // Layer 3: Organic Liquid Gooey Splash at Collision Center (92px, 135px)
            // (Demo 3 Metaball Architecture — ZERO pinwheels / ZERO star shapes!)
            const splashStage = document.createElement('div');
            splashStage.style.cssText = 'position:absolute; top:95px; left:52px; width:80px; height:80px; z-index:24; pointer-events:none; filter:url(#liquidGooFilter);';
            splashStage.innerHTML = `
              <!-- Central Expanding Liquid Blob -->
              <div style="position:absolute; top:24px; left:24px; width:32px; height:32px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 55%, #0284c7 90%, #0369a1 100%); box-shadow:0 0 10px rgba(56,189,248,0.8); opacity:0; animation:hcGooSplashCenter 0.85s cubic-bezier(0.18, 0.88, 0.32, 1) 0.22s forwards;"></div>

              <!-- Radial Splashing Fluid Droplet Blobs (Organic Viscous Necking) -->
              <div style="position:absolute; top:28px; left:28px; width:24px; height:24px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 60%, #0284c7 100%); opacity:0; animation:hcGooSplashBlob1 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) 0.22s forwards;"></div>
              <div style="position:absolute; top:28px; left:28px; width:24px; height:24px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 60%, #0284c7 100%); opacity:0; animation:hcGooSplashBlob2 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) 0.22s forwards;"></div>
              <div style="position:absolute; top:28px; left:28px; width:22px; height:22px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 60%, #0284c7 100%); opacity:0; animation:hcGooSplashBlob3 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) 0.24s forwards;"></div>
              <div style="position:absolute; top:28px; left:28px; width:22px; height:22px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 60%, #0284c7 100%); opacity:0; animation:hcGooSplashBlob4 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) 0.24s forwards;"></div>
              <div style="position:absolute; top:28px; left:28px; width:26px; height:26px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, #bae6fd 50%, #0284c7 100%); opacity:0; animation:hcGooSplashBlob5 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) 0.22s forwards;"></div>
            `;
            stage.appendChild(splashStage);

            // Layer 4: High-Pressure Radial Vapor Condensation Shock (Difüz Sis Halkası)
            const shockContainer = document.createElement('div');
            shockContainer.style.cssText = 'position:absolute; top:90px; left:12px; width:160px; height:90px; z-index:23; pointer-events:none; opacity:0; animation:hcVaporCondensationShock 1.1s cubic-bezier(0.18, 0.9, 0.28, 1) 0.22s forwards;';
            shockContainer.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(125,211,252,0.65) 30%, rgba(2,132,199,0.3) 65%, transparent 100%); filter:blur(4px);"></div>
            `;
            stage.appendChild(shockContainer);

            // Layer 5: Parabolic Gravity Droplets (Tam çarpışma noktası (92px, 135px)'ten yayılan 28 damla)
            const dropletsContainer = document.createElement('div');
            dropletsContainer.style.cssText = 'position:absolute; inset:0; z-index:25; pointer-events:none;';
            for (let i = 0; i < 28; i++) {
              const drop = document.createElement('div');
              const angleDeg = (i * 13) - 90;
              const rad = (angleDeg * Math.PI) / 180;
              const speed = 28 + (i % 5) * 8;
              const dxUp = Math.round(Math.cos(rad) * speed);
              const dyUp = Math.round(Math.sin(rad) * (speed * 0.7));
              const delay = (0.22 + (i * 0.022)).toFixed(2);
              const size = 2 + (i % 3) * 1.6;

              drop.style.cssText = `
                position: absolute;
                top: 135px;
                left: 92px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 0 6px #7dd3fc, 0 0 12px #0284c7;
                --dx-up: ${dxUp}px;
                --dy-up: ${dyUp}px;
                opacity: 0;
                animation: hcParabolicGravityDroplet 1.1s cubic-bezier(0.2, 0.85, 0.35, 1) ${delay}s forwards;
              `;
              dropletsContainer.appendChild(drop);
            }
            stage.appendChild(dropletsContainer);

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

code = code[:render_start] + new_render + code[render_end:]

# 4. In global script section, ensure GSAP runs on waterTurbulenceElem on page load
if "const waterTurbElem = document.getElementById('waterTurbulenceElem');" not in code:
    script_inject = """    // Real-Time GSAP / rAF Turbulence Engine on Page Load (Demo 2 Parity)
    window.addEventListener('DOMContentLoaded', () => {
      const waterTurbElem = document.getElementById('waterTurbulenceElem');
      if (waterTurbElem && typeof gsap !== 'undefined') {
        const waterObj = { bfX: 0.02, bfY: 0.09 };
        gsap.to(waterObj, {
          bfX: 0.038,
          bfY: 0.16,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          onUpdate: () => {
            waterTurbElem.setAttribute('baseFrequency', `${waterObj.bfX.toFixed(3)} ${waterObj.bfY.toFixed(3)}`);
          }
        });
      } else if (waterTurbElem) {
        let st = performance.now();
        const loop = () => {
          const el = (performance.now() - st) / 1000;
          const x = 0.02 + 0.015 * Math.sin(el * 6);
          const y = 0.09 + 0.06 * Math.cos(el * 8);
          waterTurbElem.setAttribute('baseFrequency', `${x.toFixed(3)} ${y.toFixed(3)}`);
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      }
    });
"""
    code = code.replace("  <script>", "  <script>\n" + script_inject)
    print("Injected global turbulence engine on page load.")

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/generate_cinema_masterpieces.py successfully.")
