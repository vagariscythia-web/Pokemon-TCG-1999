# -*- coding: utf-8 -*-
import re

with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CSS: Add .btn-var styles and new keyframes
# Replace from @keyframes hcTurbulentFanningCascade up to @keyframes hcFineGrainVelocityCascade
css_start = code.find('/* Anisotropic Wide-Fanning Turbulent Cascade')
css_end = code.find('/* Fine-Grained High-Velocity Gravitational Droplet Cascade */')
assert css_start != -1 and css_end != -1, f"CSS positions: start={css_start}, end={css_end}"

new_css = """/* Variant Switcher Pill Styles */
    .variant-selector {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .btn-var {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #94a3b8;
      border-radius: 6px;
      padding: 4px 9px;
      cursor: pointer;
      font-size: 11px;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .btn-var:hover {
      border-color: #38bdf8;
      color: #f8fafc;
      background: rgba(2, 132, 199, 0.25);
    }
    .btn-var.active {
      background: rgba(2, 132, 199, 0.45);
      border-color: #38bdf8;
      color: #38bdf8;
      font-weight: 600;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
    }

    /* VARYANT 1: Revize Edilmiş Örgülü Kordonlu Şelale */
    @keyframes hcBraidedStreamFlow {
      0% {
        opacity: 0;
        transform: translateY(-8px) scaleY(0.12) scaleX(0.9);
      }
      18% {
        opacity: 0.95;
        transform: translateY(0) scaleY(1.02) scaleX(1.0);
        filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.8));
      }
      52% {
        opacity: 0.88;
        transform: translateY(8px) scaleY(1.0) scaleX(1.06);
      }
      78% {
        opacity: 0.58;
        transform: translateY(22px) scaleY(0.96) scaleX(1.15);
        filter: blur(1.5px);
      }
      100% {
        opacity: 0;
        transform: translateY(38px) scaleY(0.92) scaleX(1.22);
        filter: blur(4px);
      }
    }

    /* VARYANT 2: Gelişmiş Asimetrik Hidrodinamik Çağlayan */
    @keyframes hcAsymDelugeSurge {
      0% {
        opacity: 0;
        transform: rotate(var(--angle)) translateY(-10px) scaleY(0.12) scaleX(0.85);
      }
      20% {
        opacity: 0.95;
        transform: rotate(var(--angle)) translateY(0) scaleY(1.02) scaleX(1.0);
        filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.75));
      }
      52% {
        opacity: 0.88;
        transform: rotate(calc(var(--angle) * 1.05)) translateY(10px) scaleY(1.0) scaleX(1.14);
      }
      78% {
        opacity: 0.60;
        transform: rotate(calc(var(--angle) * 1.08)) translateY(22px) scaleY(0.96) scaleX(1.26);
        filter: blur(2px);
      }
      100% {
        opacity: 0;
        transform: rotate(calc(var(--angle) * 1.12)) translateY(38px) scaleY(0.92) scaleX(1.36);
        filter: blur(4px);
      }
    }

    /* Cohesive Water Bed Matrix (Boşlukları kapatan akışkan zemin perdesi) */
    @keyframes hcCohesiveWaterBed {
      0% {
        opacity: 0;
        transform: scaleY(0.1) translateY(-6px);
      }
      20% {
        opacity: 0.72;
        transform: scaleY(1.02) translateY(0);
        filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.5));
      }
      52% {
        opacity: 0.62;
        transform: scaleY(1.0) translateY(10px);
      }
      78% {
        opacity: 0.38;
        transform: scaleY(0.96) translateY(24px);
        filter: blur(2px);
      }
      100% {
        opacity: 0;
        transform: scaleY(0.92) translateY(40px);
        filter: blur(5px);
      }
    }

    """

code = code[:css_start] + new_css + code[css_end:]

# 2. Update Dark Blastoise Render Function to accept chosenVariant
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
        desc: 'Çift Varyantlı (Coin-Flip) Hidrodinamik Çağlayan Sentezi: 24 kavitasyon köpüğü, ince taneli (fine-grained) hız vektörlü mikro serpinti ve aerosol sis ile desteklenen iki ayrı başyapıt mimarisi.',
        breakdown: '<strong>İki Alternatifli Hidrodinamik Sentez:</strong><br>• <strong>Varyant 1 (Örgülü Kordonlu Şelale):</strong> 6 adet birbirine binen örgülü su kordonu, alt akışkan örtü (sıfır boşluk) ve fine-grained mikro kavitasyon serpintisi.<br>• <strong>Varyant 2 (Asimetrik Hidrodinamik Çağlayan):</strong> Mekanik simetriden arındırılmış, non-lineer 7 asimetrik su akıntısı ve hacimsel akışkan perde.<br>• <strong>Ortak Standartlar:</strong> Nozul çıkışında süpersonik buhar $\\\\rightarrow$ anizotropik ikiz hidrolik sütunlar (21° eksenle tam V-çarpışması) $\\\\rightarrow$ darbe anında geniş alana (40-75px) 360° saçılan 24 kavitasyon köpüğü $\\\\rightarrow$ Micro-Canvas ile hız vektörüne kilitli (sıfır diken/ok!) fine-grained su damlacıkları $\\\\rightarrow$ tabanda mikro köpük sıçramaları $\\\\rightarrow$ tam DOM temizliği.',
        duration: 2100,
        render: function(stage, whiff, variant) {
          const chosenVariant = (variant === 1 || variant === 2) ? variant : 1;
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

            // Layer 5: High-Density Micro-Canvas Physical Water Particle Emitter + Fine-Grained Micro-Spray
            // 90 adet Newton balistik kavitasyon damlası + 50 adet ince taneli teardrop mikro serpinti + 20 adet aerosol sis zerreleri
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
                this.radius = 0.8 + Math.random() * 1.5;
                this.alpha = 1.0;
                this.decay = 0.016 + Math.random() * 0.015;
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

            // Fine-Grained Hydrodynamic Micro-Spray (SIFIR SABİT UZUN DİKEN/OK! Hız vektörüne kilitli minyatür damlalar)
            class FluidMicroSpray {
              constructor(ox, oy, angleOffset, speedMult) {
                this.x = ox + (Math.random() - 0.5) * 32;
                this.y = oy + (Math.random() - 0.5) * 8;
                const angle = Math.PI / 2 + (angleOffset || 0) + (Math.random() - 0.5) * 0.55;
                const speed = (3.5 + Math.random() * 4.5) * (speedMult || 1.0);
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.gravity = 0.18 + Math.random() * 0.06;
                this.drag = 0.98;
                this.radius = 0.8 + Math.random() * 1.2; // 0.8px - 2.0px minyatür damla
                this.alpha = 0.95;
                this.decay = 0.018 + Math.random() * 0.016;
                const r = Math.random();
                this.color = r > 0.6 ? '#ffffff' : (r > 0.3 ? '#bae6fd' : '#38bdf8');
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
                // Hız vektörüne kilitli dinamik kuyruk (Maksimum 5px! Asla 28px'lik mızrak/ok değil!)
                const vLen = Math.hypot(this.vx, this.vy);
                const tailLen = Math.min(5.0, vLen * 0.45);
                const tailX = this.x - (this.vx / (vLen || 1)) * tailLen;
                const tailY = this.y - (this.vy / (vLen || 1)) * tailLen;

                c.strokeStyle = this.color;
                c.lineWidth = this.radius * 1.4;
                c.lineCap = 'round';
                c.beginPath();
                c.moveTo(tailX, tailY);
                c.lineTo(this.x, this.y);
                c.stroke();

                // Damlacık başı
                c.fillStyle = '#ffffff';
                c.beginPath();
                c.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
                c.fill();
                c.restore();
              }
            }

            // Aerosol Mist Puff (Şelale etrafında süzülen difüz mikro su buharı)
            class FluidMistCloud {
              constructor(ox, oy) {
                this.x = ox + (Math.random() - 0.5) * 44;
                this.y = oy + Math.random() * 24;
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = 1.0 + Math.random() * 1.8;
                this.radius = 2.5 + Math.random() * 3.5;
                this.alpha = 0.32;
                this.decay = 0.012 + Math.random() * 0.010;
              }
              update() {
                this.x += this.vx;
                this.y += this.vy;
                this.radius += 0.06;
                this.alpha -= this.decay;
              }
              draw(c) {
                if (this.alpha <= 0) return;
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                c.fillStyle = 'rgba(186, 230, 253, 0.4)';
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                c.fill();
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

            // Wave 2: Fine-grained mikro kavitasyon serpintisi ve aerosol sis (0.28s) 50 damla + 20 sis
            setTimeout(() => {
              const spreadBias = (chosenVariant === 2) ? 0.35 : 0.18;
              for (let i = 0; i < 50; i++) {
                const off = (Math.random() - 0.5) * spreadBias;
                particles.push(new FluidMicroSpray(92, 135, off, 1.0));
              }
              for (let i = 0; i < 20; i++) {
                particles.push(new FluidMistCloud(92, 135));
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

            // Layer 6: Water Cascade (Seçili Varyanta Göre Render Edilir)
            const cascadeStage = document.createElement('div');
            cascadeStage.style.cssText = 'position:absolute; inset:0; z-index:21; pointer-events:none;';

            const bottomSplashes = document.createElement('div');
            bottomSplashes.style.cssText = 'position:absolute; bottom:6px; left:14px; width:156px; height:18px; z-index:22; pointer-events:none;';

            if (chosenVariant === 1) {
              // ==========================================
              // VARYANT 1: Revize Edilmiş Örgülü Kordonlu Şelale (Braided Stream Torrents)
              // Kordonlar arası boşlukları örten yumuşak su tabanı + 6 adet birbirine binen kordon
              // ==========================================
              const waterBed = document.createElement('div');
              waterBed.style.cssText = `
                position: absolute;
                top: 135px;
                left: 46px;
                width: 92px;
                height: 114px;
                transform-origin: 50% 0;
                opacity: 0;
                animation: hcCohesiveWaterBed 1.15s cubic-bezier(0.18, 0.88, 0.32, 1) 0.25s forwards;
              `;
              waterBed.innerHTML = `
                <div style="width:100%; height:100%; border-radius:10px 10px 4px 4px; background:linear-gradient(to bottom, rgba(224,242,254,0.75) 0%, rgba(56,189,248,0.45) 35%, rgba(2,132,199,0.25) 75%, transparent 100%); filter:url(#waterJetTurbulenceFilter); box-shadow:0 0 14px rgba(56,189,248,0.45);"></div>
              `;
              cascadeStage.appendChild(waterBed);

              // 6 Adet birbirine binen (overlapping) akışkan örgülü su kordonu
              // [left, width, height, delay, duration]
              const braidedStreams = [
                [72, 22, 114, 0.24, 0.98],
                [84, 24, 116, 0.24, 1.02],
                [94, 22, 114, 0.25, 0.98],
                [64, 18, 110, 0.26, 0.94],
                [102, 18, 110, 0.26, 0.94],
                [80, 20, 112, 0.27, 0.92] // Merkezî örgü bağı
              ];

              braidedStreams.forEach(([left, width, height, delay, duration]) => {
                const sEl = document.createElement('div');
                sEl.style.cssText = `
                  position: absolute;
                  top: 135px;
                  left: ${left}px;
                  width: ${width}px;
                  height: ${height}px;
                  transform-origin: 50% 0;
                  opacity: 0;
                  animation: hcBraidedStreamFlow ${duration}s cubic-bezier(0.18, 0.88, 0.32, 1) ${delay}s forwards;
                `;
                sEl.innerHTML = `
                  <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.85) 30%, rgba(2,132,199,0.75) 75%, transparent 100%); border-radius:8px 8px 4px 4px; box-shadow:0 0 10px rgba(56,189,248,0.5), inset 0 0 6px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                    <div style="position:absolute; top:2px; left:22%; width:56%; height:88%; border-radius:4px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 38%, rgba(125,211,252,0.4) 78%, transparent 100%); opacity:0.88; filter:blur(0.8px);"></div>
                  </div>
                `;
                cascadeStage.appendChild(sEl);
              });

              // Taban Sıçramaları (8 adet)
              for (let i = 0; i < 8; i++) {
                const bSplash = document.createElement('div');
                const xPos = 48 + (i * 11);
                const delay = 0.40 + (i * 0.04);
                const size = 3.2 + (i % 3) * 1.5;
                bSplash.style.cssText = `
                  position: absolute;
                  bottom: 2px;
                  left: ${xPos}px;
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

            } else {
              // ==========================================
              // VARYANT 2: Gelişmiş Asimetrik Hidrodinamik Çağlayan (Organic Fluid Deluge)
              // Mekanik simetri ve üçgen yelpaze formu tamamen terk edilmiş, 7 asimetrik akıntı
              // ==========================================
              const delugeCurtain = document.createElement('div');
              delugeCurtain.style.cssText = `
                position: absolute;
                top: 135px;
                left: 26px;
                width: 132px;
                height: 116px;
                transform-origin: 50% 0;
                opacity: 0;
                animation: hcCohesiveWaterBed 1.15s cubic-bezier(0.18, 0.88, 0.32, 1) 0.25s forwards;
              `;
              delugeCurtain.innerHTML = `
                <div style="width:100%; height:100%; border-radius:14px 28px 10px 22px; background:linear-gradient(175deg, rgba(224,242,254,0.78) 0%, rgba(56,189,248,0.50) 35%, rgba(2,132,199,0.30) 75%, transparent 100%); filter:url(#waterJetTurbulenceFilter); box-shadow:0 0 16px rgba(56,189,248,0.45);"></div>
              `;
              cascadeStage.appendChild(delugeCurtain);

              // 7 Adet asimetrik, non-lineer, organik su akıntısı
              // [left, width, height, angle, delay, duration]
              const asymSurges = [
                [78, 28, 116, 2, 0.24, 1.02],     // Ana Hacimsel Omurga (Hafif sağ meyil)
                [66, 24, 114, -9, 0.26, 0.98],    // Sol Yoğun Akıntı
                [96, 26, 114, 7, 0.25, 0.98],     // Sağ Akışkan Kabarma
                [52, 20, 110, -18, 0.29, 0.92],   // Sol Kanat Taşması
                [110, 22, 110, 15, 0.28, 0.94],   // Sağ Kanat Taşması
                [44, 15, 106, -24, 0.31, 0.88],   // Sol Dış Sıçrama Kordonu
                [88, 20, 112, 1, 0.27, 0.95]      // İç Bağlantı
              ];

              asymSurges.forEach(([left, width, height, angle, delay, duration]) => {
                const sEl = document.createElement('div');
                sEl.style.cssText = `
                  position: absolute;
                  top: 135px;
                  left: ${left}px;
                  width: ${width}px;
                  height: ${height}px;
                  transform-origin: 50% 0;
                  --angle: ${angle}deg;
                  opacity: 0;
                  animation: hcAsymDelugeSurge ${duration}s cubic-bezier(0.18, 0.88, 0.32, 1) ${delay}s forwards;
                `;
                sEl.innerHTML = `
                  <div style="width:100%; height:100%; background:linear-gradient(to bottom, #ffffff 0%, rgba(56,189,248,0.85) 28%, rgba(2,132,199,0.75) 72%, transparent 100%); border-radius:8px 8px 4px 4px; box-shadow:0 0 10px rgba(56,189,248,0.5), inset 0 0 6px #ffffff; filter:url(#waterJetTurbulenceFilter); position:relative;">
                    <div style="position:absolute; top:2px; left:22%; width:56%; height:88%; border-radius:4px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 38%, rgba(125,211,252,0.4) 78%, transparent 100%); opacity:0.88; filter:blur(0.8px);"></div>
                  </div>
                `;
                cascadeStage.appendChild(sEl);
              });

              // Taban Sıçramaları (12 adet, 150px taban yayılımı)
              for (let i = 0; i < 12; i++) {
                const bSplash = document.createElement('div');
                const xPos = 4 + (i * 12.2);
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
            }

            stage.appendChild(cascadeStage);
            stage.appendChild(bottomSplashes);

            // Layer 7: Fine-Grained Gravitational Droplets
            for (let i = 0; i < 16; i++) {
              const fdrop = document.createElement('div');
              const left = (chosenVariant === 2) ? (18 + i * 4.0) : (26 + i * 3.2);
              const delay = 0.30 + (i * 0.034);
              const size = 1.6 + (i % 3) * 1.0;
              fdrop.style.cssText = `position:absolute; top:135px; left:${left}%; width:${size}px; height:${size * 1.5}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 65%, #0284c7 100%); z-index:22; opacity:0; animation:hcFineGrainVelocityCascade 0.72s cubic-bezier(0.45, 0.05, 0.9, 1) ${delay.toFixed(3)}s forwards; pointer-events:none; box-shadow:0 0 4px #7dd3fc;`;
              stage.appendChild(fdrop);
            }

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

# 3. Update the Card Controls and playFX logic in JavaScript
# We need to add the variant pill selector to the Dark Blastoise card HTML and handle playFX
loop_target = """        <div class="card-controls">
          <button class="btn-play" onclick="playFX('${item.id}')">
            <span>▶</span>
            <span>Oynat (Replay)</span>
          </button>
          <div class="vfx-breakdown">${item.breakdown}</div>
        </div>"""

loop_pos = code.find(loop_target)
assert loop_pos != -1, f"loop_pos not found: {loop_pos}"

new_card_controls = """        <div class="card-controls">
          ${item.id === 'darkblastoise_hydrocannon_master' ? `
            <div class="variant-selector">
              <button class="btn-var active" id="btnVarCoin" onclick="setHydroVariant('coinflip')">🎲 Coin-Flip (Rastgele)</button>
              <button class="btn-var" id="btnVar1" onclick="setHydroVariant('v1')">1️⃣ Varyant 1: Örgülü Kordonlar</button>
              <button class="btn-var" id="btnVar2" onclick="setHydroVariant('v2')">2️⃣ Varyant 2: Asimetrik Çağlayan</button>
            </div>
            <div id="hydroVariantBadge" style="font-size:11.5px; color:#38bdf8; font-weight:600; margin-bottom:8px; min-height:16px;">🎲 Coin-Flip Modu Aktif (Oynatıldığında Rastgele Seçilecek)</div>
          ` : ''}
          <button class="btn-play" onclick="playFX('${item.id}')">
            <span>▶</span>
            <span>Oynat (Replay)</span>
          </button>
          <div class="vfx-breakdown">${item.breakdown}</div>
        </div>"""

code = code[:loop_pos] + new_card_controls + code[loop_pos + len(loop_target):]

# 4. Update playFX in the script
playfx_target = """      // Render FX layers
      item.render(stage, isWhiff);
    }"""

playfx_pos = code.find(playfx_target)
assert playfx_pos != -1, f"playfx_pos not found: {playfx_pos}"

new_playfx = """      // Variant Coin-Flip or Fixed Selection for Dark Blastoise
      let chosenVariant = 1;
      if (id === 'darkblastoise_hydrocannon_master') {
        if (hydroVariantMode === 'coinflip') {
          chosenVariant = Math.random() < 0.5 ? 1 : 2;
          const badge = document.getElementById('hydroVariantBadge');
          if (badge) {
            badge.innerHTML = `🎲 Coin-Flip Sonucu: <strong>Varyant ${chosenVariant}</strong> (${chosenVariant === 1 ? 'Örgülü Kordonlu Şelale' : 'Asimetrik Hidrodinamik Çağlayan'})`;
          }
        } else if (hydroVariantMode === 'v1') {
          chosenVariant = 1;
          const badge = document.getElementById('hydroVariantBadge');
          if (badge) badge.innerHTML = `1️⃣ Sabit Mod: <strong>Varyant 1</strong> (Örgülü Kordonlu Şelale)`;
        } else if (hydroVariantMode === 'v2') {
          chosenVariant = 2;
          const badge = document.getElementById('hydroVariantBadge');
          if (badge) badge.innerHTML = `2️⃣ Sabit Mod: <strong>Varyant 2</strong> (Gelişmiş Asimetrik Çağlayan)`;
        }
      }

      // Render FX layers
      item.render(stage, isWhiff, chosenVariant);
    }

    // Hydrocannon Variant Switcher Function
    let hydroVariantMode = 'coinflip';
    function setHydroVariant(mode) {
      hydroVariantMode = mode;
      ['btnVarCoin', 'btnVar1', 'btnVar2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      if (mode === 'coinflip') {
        const el = document.getElementById('btnVarCoin');
        if (el) el.classList.add('active');
        const badge = document.getElementById('hydroVariantBadge');
        if (badge) badge.innerHTML = '🎲 Coin-Flip Modu Aktif (Oynatıldığında Rastgele 1 veya 2 Seçilecek)';
      } else if (mode === 'v1') {
        const el = document.getElementById('btnVar1');
        if (el) el.classList.add('active');
        const badge = document.getElementById('hydroVariantBadge');
        if (badge) badge.innerHTML = '1️⃣ Sabit Mod: Varyant 1 (Örgülü Kordonlu Şelale)';
      } else if (mode === 'v2') {
        const el = document.getElementById('btnVar2');
        if (el) el.classList.add('active');
        const badge = document.getElementById('hydroVariantBadge');
        if (badge) badge.innerHTML = '2️⃣ Sabit Mod: Varyant 2 (Gelişmiş Asimetrik Çağlayan)';
      }
      playFX('darkblastoise_hydrocannon_master');
    }"""

code = code[:playfx_pos] + new_playfx + code[playfx_pos + len(playfx_target):]

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/generate_cinema_masterpieces.py successfully with Dual-Variant Hydrocannon & Coin-Flip Mechanism!")
