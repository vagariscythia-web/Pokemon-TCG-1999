import re

with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Keyframes: Replace hcTurbulentRivuletCascade with hcTurbulentFanningCascade and hcCohesiveCausticVeil
old_kfs_start = '/* Anisotropic Turbulent Cascading Rivulets (Sıfır Statik Tül! Akışkan Su Kordonları) */'
old_kfs_end = '/* Fine-Grained High-Velocity Gravitational Droplet Cascade */'

start_pos = code.find(old_kfs_start)
end_pos = code.find(old_kfs_end)
assert start_pos != -1 and end_pos != -1, f"Keyframe positions: start={start_pos}, end={end_pos}"

new_kfs = """/* Anisotropic Wide-Fanning Turbulent Cascade (Geniş Yelpazelenen Akışkan Şelale Perdesi) */
    @keyframes hcTurbulentFanningCascade {
      0% {
        opacity: 0;
        transform: rotate(var(--angle)) scaleY(0.08) scaleX(0.7) translateY(-8px);
      }
      18% {
        opacity: 0.95;
        transform: rotate(var(--angle)) scaleY(1.02) scaleX(1.0) translateY(0);
        filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.8));
      }
      50% {
        opacity: 0.90;
        transform: rotate(calc(var(--angle) * 1.12)) scaleY(1.0) scaleX(1.25) translateY(8px);
      }
      75% {
        opacity: 0.65;
        transform: rotate(calc(var(--angle) * 1.22)) scaleY(0.96) scaleX(1.45) translateY(20px);
        filter: blur(1.5px);
      }
      100% {
        opacity: 0;
        transform: rotate(calc(var(--angle) * 1.32)) scaleY(0.92) scaleX(1.65) translateY(36px);
        filter: blur(4px);
      }
    }

    /* Cohesive Caustic Fluid Matrix (Kordonlar arası boşlukları birleştiren canlı su zemin perdesi) */
    @keyframes hcCohesiveCausticMatrix {
      0% {
        opacity: 0;
        transform: scaleY(0.1) scaleX(0.6) translateY(-10px);
      }
      20% {
        opacity: 0.75;
        transform: scaleY(1.02) scaleX(1.0) translateY(0);
        filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.6));
      }
      52% {
        opacity: 0.65;
        transform: scaleY(1.0) scaleX(1.15) translateY(10px);
      }
      78% {
        opacity: 0.40;
        transform: scaleY(0.95) scaleX(1.28) translateY(22px);
        filter: blur(2px);
      }
      100% {
        opacity: 0;
        transform: scaleY(0.90) scaleX(1.40) translateY(38px);
        filter: blur(5px);
      }
    }

    """

code = code[:start_pos] + new_kfs + code[end_pos:]

# 2. Update Dark Blastoise Render Function
render_target_start = "id: 'darkblastoise_hydrocannon_master',"
render_target_end = 'whiff.innerHTML = \'<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcAtmosphericVaporFlash 0.7s ease-out forwards;"></div>\';'

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
        desc: 'Geniş Yelpazelenen Akışkan Çağlayan & Atomizasyon Sentezi: 24 adet saçılan kavitasyon köpüğü, 145 adet balistik damlacık & geniş açılı drenaj çizgisi, 9 kollu genişleyen türbülanslı su perdesi.',
        breakdown: '<strong>Geniş Yelpazelenen Hidrodinamik Çağlayan:</strong> Nozul çıkışında süpersonik buhar konisi $\\\\rightarrow$ anizotropik ikiz hidrolik sütunlar (21° eksenle tam V-çarpışması) $\\\\rightarrow$ darbe anında geniş alana (40-75px) 360° saçılan 24 dinamik kavitasyon köpük küresi $\\\\rightarrow$ difüz atmosferik buhar parlaması $\\\\rightarrow$ Micro-Canvas ile 90 balistik kavitasyon damlası ve ±32° açıyla kartın her iki yanına yelpazelenen 55 dikey drenaj çizgisi $\\\\rightarrow$ darbe noktasından aşağıya yelpaze gibi genişleyerek (±32° eksende) inen 9 kollu türbülanslı su kordonu ve birleştirici akışkan örtü (sıfır çizgi boşluğu, sıfır statik tül) $\\\\rightarrow$ 156px genişliğinde kart tabanında çalkalanan 12 mikro köpük sıçraması $\\\\rightarrow$ tam DOM temizliği.',
        duration: 2100,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar Tahliyesi)
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
            const torrents = document.createElement('div');
            torrents.style.cssText = 'position:absolute; inset:0; z-index:22; pointer-events:none;';
            torrents.innerHTML = `
              <!-- Left Stream (width: 30px, length: 126px, transform-origin: 15px 0) -->
              <div style="position:absolute; top:18px; left:32px; width:30px; height:126px; transform-origin:15px 0; opacity:0; animation:hcHydroStreamL 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards;">
                <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.88) 35%, rgba(2,132,199,0.95) 100%); border-radius:15px 15px 6px 6px; box-shadow:0 0 16px rgba(56,189,248,0.65), inset 0 0 10px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                  <div style="position:absolute; top:4px; left:10px; width:10px; height:116px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
                </div>
              </div>

              <!-- Right Stream (width: 30px, length: 126px, transform-origin: 15px 0) -->
              <div style="position:absolute; top:18px; left:122px; width:30px; height:126px; transform-origin:15px 0; opacity:0; animation:hcHydroStreamR 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards;">
                <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.88) 35%, rgba(2,132,199,0.95) 100%); border-radius:15px 15px 6px 6px; box-shadow:0 0 16px rgba(56,189,248,0.65), inset 0 0 10px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                  <div style="position:absolute; top:4px; left:10px; width:10px; height:116px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
                </div>
              </div>
            `;
            stage.appendChild(torrents);

            // Layer 3: Dynamic Wide-Dispersing Cavitation Foam Blast (24 Çok Kademeli Saçılan Köpük Küresi)
            const foamStage = document.createElement('div');
            foamStage.style.cssText = 'position:absolute; top:55px; left:12px; width:160px; height:160px; z-index:24; pointer-events:none;';

            // Central Nucleation Foam Mass
            const coreFoam = document.createElement('div');
            coreFoam.style.cssText = 'position:absolute; top:64px; left:64px; width:32px; height:32px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(224,242,254,0.95) 25%, #7dd3fc 60%, rgba(2,132,199,0.9) 85%, transparent 100%); box-shadow:0 0 16px rgba(56,189,248,0.8), inset 0 0 8px #ffffff; opacity:0; animation:hcCoreFoamBloom 0.95s cubic-bezier(0.18, 0.88, 0.32, 1) 0.20s forwards;';
            foamStage.appendChild(coreFoam);

            // 24 Dispersing Cavitation Foam Bubbles
            const dispersingBubbles = [
              [26, 49.7, -9.8, 0.20, 0.77],
              [25, -48.2, -12.4, 0.21, 0.82],
              [24, 42.6, 26.8, 0.22, 0.80],
              [24, -40.5, 24.5, 0.21, 0.79],
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

            // Layer 4: Diffuse Atmospheric Vapor Flash (Sıfır Statik Daire)
            const shockContainer = document.createElement('div');
            shockContainer.style.cssText = 'position:absolute; top:85px; left:12px; width:160px; height:100px; z-index:23; pointer-events:none; opacity:0; animation:hcAtmosphericVaporFlash 1.05s ease-out 0.22s forwards;';
            shockContainer.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.45) 30%, rgba(56,189,248,0.15) 60%, transparent 80%); filter:blur(8px);"></div>
            `;
            stage.appendChild(shockContainer);

            // Layer 5: High-Density Micro-Canvas Physical Water Particle Emitter + Wide-Fanning Drainage Streaks
            // 90 adet Newton balistik damlası + 55 adet geniş yelpazeli (±32°) dikey drenaj su çizgisi
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

            // High-Velocity Wide-Fanning Drainage Stream Streaks (±32° açıyla her iki yana genişleyen su çizgileri)
            class FluidDrainageStreak {
              constructor(ox, oy) {
                this.x = ox + (Math.random() - 0.5) * 44;
                this.y = oy + Math.random() * 8;
                // Geniş yelpazelenme açısı (±32 derece)
                const spreadAngle = (Math.random() - 0.5) * 1.12;
                const speed = 4.0 + Math.random() * 5.4;
                this.vx = Math.sin(spreadAngle) * speed * 1.45;
                this.vy = Math.cos(spreadAngle) * speed;
                this.length = 10 + Math.random() * 18;
                this.gravity = 0.20;
                this.drag = 0.985;
                this.alpha = 0.95;
                this.decay = 0.020 + Math.random() * 0.016;
                this.width = 1.0 + Math.random() * 1.6;
                const r = Math.random();
                this.color = r > 0.55 ? '#ffffff' : (r > 0.25 ? '#bae6fd' : '#38bdf8');
              }
              update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.vx *= this.drag;
                this.alpha -= this.decay;
              }
              draw(c) {
                if (this.alpha <= 0) return;
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                c.strokeStyle = this.color;
                c.lineWidth = this.width;
                c.lineCap = 'round';
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(this.x + this.vx * 1.2, this.y + this.length);
                c.stroke();
                c.restore();
              }
            }

            const particles = [];
            // Wave 1: Çarpışma anında (0.22s) 60 adet patlayan mikro damlacık
            setTimeout(() => {
              for (let i = 0; i < 60; i++) {
                particles.push(new FluidDroplet(92, 135, false));
              }
            }, 220);

            // Wave 2: Geniş yelpazeyle her iki yana ve aşağı akan drenaj çizgileri (0.28s) 55 adet
            setTimeout(() => {
              for (let i = 0; i < 55; i++) {
                particles.push(new FluidDrainageStreak(92, 135));
              }
            }, 280);

            // Wave 3: Su akışı sürerken (0.42s) 30 adet kavitasyon sıçraması
            setTimeout(() => {
              for (let i = 0; i < 30; i++) {
                particles.push(new FluidDroplet(92, 135, true));
              }
            }, 420);

            let animId;
            let startSim = performance.now();
            function renderParticles() {
              pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
              let activeCount = 0;
              for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha > 0) {
                  p.update();
                  p.draw(pCtx);
                  activeCount++;
                }
              }
              if (activeCount > 0 || (performance.now() - startSim < 1800)) {
                animId = requestAnimationFrame(renderParticles);
              }
            }
            animId = requestAnimationFrame(renderParticles);

            // Layer 6: Wide-Fanning Turbulent Hydrodynamic Cascade (GENİŞ YELPAZELENEN ŞELALE PERDESİ)
            // Sağa ve sola genişleyen (±26° ila ±32°), birbiri üzerine binen 9 adet türbülanslı su kordonu
            // + Kordonlar arasındaki boşlukları kapatan birleştirici türbülanslı su tabanı (sıfır çizgi boşluğu!)
            const cascadeStage = document.createElement('div');
            cascadeStage.style.cssText = 'position:absolute; inset:0; z-index:21; pointer-events:none;';

            // 1. Cohesive Caustic Fluid Matrix (Kordonlar arası boşlukları birleştiren yumuşak akışkan örtü)
            const matrixSheet = document.createElement('div');
            matrixSheet.style.cssText = `
              position: absolute;
              top: 135px;
              left: 20px;
              width: 144px;
              height: 116px;
              transform-origin: 50% 0;
              opacity: 0;
              animation: hcCohesiveCausticMatrix 1.15s cubic-bezier(0.18, 0.88, 0.32, 1) 0.25s forwards;
            `;
            matrixSheet.innerHTML = `
              <div style="width:100%; height:100%; border-radius:12px 12px 4px 4px; background:linear-gradient(to bottom, rgba(224,242,254,0.75) 0%, rgba(56,189,248,0.48) 32%, rgba(2,132,199,0.30) 70%, transparent 100%); filter:url(#waterJetTurbulenceFilter); box-shadow:0 0 16px rgba(56,189,248,0.4);"></div>
            `;
            cascadeStage.appendChild(matrixSheet);

            // 2. 9 Braided, Overlapping, Wide-Fanning Turbulent Streamers (Birbirine binen geniş açılı kordonlar)
            // [left, width, height, angle, delay, duration]
            const fanningRivulets = [
              // Center Main Torrents (Spine)
              [80, 24, 116, 0, 0.24, 1.02],
              // Inner Swell Left & Right
              [74, 20, 114, -7, 0.25, 0.98],
              [90, 20, 114, 7, 0.25, 0.98],
              // Mid Flank Wings Left & Right
              [66, 18, 110, -15, 0.27, 0.94],
              [100, 18, 110, 15, 0.27, 0.94],
              // Outer Lateral Expansions (Sağa ve sola yelpaze gibi açılan kanatlar)
              [60, 16, 106, -24, 0.28, 0.90],
              [108, 16, 106, 24, 0.28, 0.90],
              // Extreme Outer Splash Ribbons (En dış kenar sıçrama kordonları)
              [54, 14, 102, -32, 0.30, 0.86],
              [116, 14, 102, 32, 0.30, 0.86]
            ];

            fanningRivulets.forEach(([left, width, height, angle, delay, duration]) => {
              const rEl = document.createElement('div');
              rEl.style.cssText = `
                position: absolute;
                top: 135px;
                left: ${left}px;
                width: ${width}px;
                height: ${height}px;
                transform-origin: 50% 0;
                --angle: ${angle}deg;
                opacity: 0;
                animation: hcTurbulentFanningCascade ${duration}s cubic-bezier(0.18, 0.88, 0.32, 1) ${delay}s forwards;
              `;
              rEl.innerHTML = `
                <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.85) 28%, rgba(2,132,199,0.75) 72%, transparent 100%); border-radius:8px 8px 4px 4px; box-shadow:0 0 10px rgba(56,189,248,0.5), inset 0 0 6px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                  <div style="position:absolute; top:2px; left:22%; width:56%; height:88%; border-radius:4px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 38%, rgba(125,211,252,0.4) 78%, transparent 100%); opacity:0.88; filter:blur(0.8px);"></div>
                </div>
              `;
              cascadeStage.appendChild(rEl);
            });
            stage.appendChild(cascadeStage);

            // Layer 7: Fine-Grained Gravitational Droplets descending along the expanded fan
            for (let i = 0; i < 18; i++) {
              const fdrop = document.createElement('div');
              const left = 16 + (i * 3.8); // 16% to 80% wide span!
              const delay = 0.30 + (i * 0.032);
              const size = 1.6 + (i % 3) * 1.0;
              fdrop.style.cssText = `position:absolute; top:135px; left:${left}%; width:${size}px; height:${size * 1.5}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 65%, #0284c7 100%); z-index:22; opacity:0; animation:hcFineGrainVelocityCascade 0.72s cubic-bezier(0.45, 0.05, 0.9, 1) ${delay.toFixed(3)}s forwards; pointer-events:none; box-shadow:0 0 4px #7dd3fc;`;
              stage.appendChild(fdrop);
            }

            // Layer 8: Wide Bottom Border Recoil Micro-Splashes (Kartın tüm alt tabanına (156px) yayılan köpük sıçramaları)
            const bottomSplashes = document.createElement('div');
            bottomSplashes.style.cssText = 'position:absolute; bottom:6px; left:14px; width:156px; height:18px; z-index:22; pointer-events:none;';
            for (let i = 0; i < 12; i++) {
              const bSplash = document.createElement('div');
              const xPos = 2 + (i * 12.8);
              const delay = 0.40 + (i * 0.035);
              const size = 3.2 + (i % 3) * 1.6;
              bSplash.style.cssText = `
                position: absolute;
                bottom: 2px;
                left: ${xPos.toFixed(1)}px;
                width: ${size}px;
                height: ${size * 1.2}px;
                border-radius: 50% 50% 35% 35%;
                background: radial-gradient(circle, #ffffff 0%, #7dd3fc 55%, #0284c7 95%);
                box-shadow: 0 0 5px rgba(56,189,248,0.7);
                opacity: 0;
                animation: hcBottomRecoilSplash 0.55s ease-out ${delay.toFixed(3)}s forwards;
              `;
              bottomSplashes.appendChild(bSplash);
            }
            stage.appendChild(bottomSplashes);

            // Hard DOM Cleanup
            setTimeout(() => {
              if (foamStage && foamStage.parentNode) foamStage.parentNode.removeChild(foamStage);
              if (shockContainer && shockContainer.parentNode) shockContainer.parentNode.removeChild(shockContainer);
              if (cascadeStage && cascadeStage.parentNode) cascadeStage.parentNode.removeChild(cascadeStage);
              if (bottomSplashes && bottomSplashes.parentNode) bottomSplashes.parentNode.removeChild(bottomSplashes);
            }, 1480);
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcAtmosphericVaporFlash 0.7s ease-out forwards;"></div>';"""

code = code[:r_start] + new_render + code[r_end:]

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/generate_cinema_masterpieces.py successfully with Wide Fanning Cascade & Zero Gaps!")
