
    let globalSpeed = 1;

    function setSpeed(spd, btn) {
      globalSpeed = spd;
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--speed-mult', 1 / spd);
      playAll();
    }

    function applySpeed(el, baseSec) {
      el.style.animationDuration = (baseSec / globalSpeed) + 's';
    }

    /* 1. MUK SLUDGE DELUGE */
    function renderMuk(stageId, whiffed) {
      const stage = document.getElementById(stageId);
      // Clean previous dynamic fx elements while keeping mockup labels
      Array.from(stage.children).forEach(c => {
        if (!c.classList.contains('card-mockup-label') && !c.classList.contains('card-mockup-hp') && !c.classList.contains('card-art-box')) {
          stage.removeChild(c);
        }
      });

      // Layer 1: Floor Mire
      const floor = document.createElement('div');
      floor.style.cssText = 'position:absolute;bottom:8px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:15;animation:gbaMukSludgeFloor forwards;';
      applySpeed(floor, 1.75);
      floor.innerHTML = '<div style="width:210px;height:56px;border-radius:9999px;background:radial-gradient(ellipse at 50% 50%, #3b0764 0%, #1e1b4b 75%, transparent 100%);filter:blur(2px);box-shadow:0 0 24px #581c87;"></div>';
      stage.appendChild(floor);

      // Layer 2: Muk Stock Actor (Tier 1 Apex Monolithic 144px)
      const actor = document.createElement('div');
      const w = whiffed ? '98px' : '144px';
      const h = whiffed ? '70px' : '103px';
      const opacityClass = whiffed ? 'opacity:0.4;filter:brightness(0.7);' : 'opacity:1;';
      actor.style.cssText = `position:absolute;left:50%;top:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:25;animation:gbaMukSludgeActorSurge cubic-bezier(0.18, 0.9, 0.28, 1) forwards;${opacityClass}`;
      applySpeed(actor, 1.75);
      
      const img = document.createElement('img');
      img.alt = 'Muk Sludge';
      img.style.cssText = `width:${w};height:${h};object-fit:contain;filter:drop-shadow(0 0 24px #a855f7) drop-shadow(0 0 40px #581c87);`;
      const candidatePaths = [
        'assets/Muk_Sludge_Actor.png',
        '/assets/Muk_Sludge_Actor.png',
        './assets/Muk_Sludge_Actor.png',
        '../public/assets/Muk_Sludge_Actor.png'
      ];
      let pathIdx = 0;
      img.onerror = function() {
        pathIdx++;
        if (pathIdx < candidatePaths.length) {
          this.src = candidatePaths[pathIdx];
        }
      };
      img.src = candidatePaths[0];
      actor.appendChild(img);
      stage.appendChild(actor);

      // Layer 3: High-Fidelity Multi-Tiered Tsunami Wave
      const wave = document.createElement('div');
      wave.style.cssText = 'position:absolute;bottom:0;width:100%;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:30;animation:gbaMukDelugeSurge cubic-bezier(0.12, 0.85, 0.25, 1) forwards;';
      applySpeed(wave, 1.75);
      wave.innerHTML = `
        <svg width="220" height="175" viewBox="0 0 220 175" style="overflow:visible">
          <defs>
            <linearGradient id="mukWaveDeepGrad_prev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7e22ce" />
              <stop offset="25%" stop-color="#581c87" />
              <stop offset="65%" stop-color="#3b0764" />
              <stop offset="100%" stop-color="#1e1b4b" />
            </linearGradient>
            <linearGradient id="mukWaveMidGrad_prev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#c084fc" />
              <stop offset="30%" stop-color="#9333ea" />
              <stop offset="70%" stop-color="#6b21a8" />
              <stop offset="100%" stop-color="#3b0764" />
            </linearGradient>
            <linearGradient id="mukWaveLipGrad_prev" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#c084fc" />
              <stop offset="25%" stop-color="#d8b4fe" />
              <stop offset="50%" stop-color="#a3e635" />
              <stop offset="75%" stop-color="#d8b4fe" />
              <stop offset="100%" stop-color="#c084fc" />
            </linearGradient>
          </defs>
          <path d="M 0 105 C 25 72, 50 88, 80 66 C 110 44, 140 76, 175 54 C 195 44, 210 62, 220 72 L 220 175 L 0 175 Z" fill="url(#mukWaveDeepGrad_prev)" opacity="0.95" />
          <path d="M 0 114 C 20 84, 45 96, 70 80 C 95 62, 120 88, 150 70 C 175 54, 195 74, 220 88 L 220 175 L 0 175 Z" fill="url(#mukWaveMidGrad_prev)" />
          <path d="M 28 92 Q 32 118, 38 122 Q 42 116, 39 94 Z M 72 82 Q 76 112, 82 116 Q 86 110, 83 84 Z M 116 80 Q 120 118, 126 122 Q 131 112, 127 82 Z M 158 76 Q 162 108, 167 112 Q 172 104, 168 78 Z M 190 84 Q 194 104, 198 108 Q 202 102, 199 87 Z" fill="#581c87" opacity="0.92" />
          <path d="M 4 112 C 24 86, 48 97, 72 82 C 98 64, 122 90, 152 72 C 178 56, 198 76, 216 88" fill="none" stroke="url(#mukWaveLipGrad_prev)" stroke-width="3.8" stroke-linecap="round" style="filter:drop-shadow(0 0 10px #c084fc)" />
          <path d="M 16 118 C 38 96, 60 104, 85 90 C 110 74, 132 96, 160 82 C 182 70, 196 84, 210 94" fill="none" stroke="#a3e635" stroke-width="1.8" stroke-linecap="round" opacity="0.9" style="filter:drop-shadow(0 0 6px #84cc16)" />
          <ellipse cx="65" cy="122" rx="24" ry="5.5" fill="#ffffff" opacity="0.5" transform="rotate(-6 65 122)" />
          <ellipse cx="145" cy="114" rx="28" ry="6.5" fill="#ffffff" opacity="0.45" transform="rotate(-4 145 114)" />
        </svg>
      `;
      stage.appendChild(wave);

      if (!whiffed) {
        // Layer 4: Ballistic Globs
        const globs = [
          { x: -35, y: -25, delay: 0.15, size: 14 },
          { x: 38, y: -28, delay: 0.22, size: 16 },
          { x: -18, y: -45, delay: 0.30, size: 12 },
          { x: 22, y: -42, delay: 0.35, size: 15 },
          { x: 50, y: -10, delay: 0.40, size: 11 }
        ];
        globs.forEach((g) => {
          const gb = document.createElement('div');
          gb.style.cssText = `position:absolute;left:50%;top:50%;width:${g.size}px;height:${Math.round(g.size * 0.8)}px;border-radius:50% 60% 40% 50%;background:radial-gradient(circle at 35% 35%, #e9d5ff 0%, #a855f7 45%, #4c1d95 100%);box-shadow:0 0 12px #c084fc;pointer-events:none;z-index:35;animation:gbaMukSludgeGlob forwards;--glob-x:${g.x}px;--glob-y:${g.y}px;opacity:0;`;
          applySpeed(gb, 1.25);
          gb.style.animationDelay = (g.delay / globalSpeed) + 's';
          stage.appendChild(gb);
        });

        // Layer 5: Translucent Bubbles
        const bubbles = [
          { x: -44, y: 18, size: 24, delay: 0.2, grad: 'linear-gradient(to top right, #581c87, #c026d3, #a3e635)' },
          { x: 42, y: 12, size: 28, delay: 0.35, grad: 'linear-gradient(to top right, #312e81, #9333ea, #f472b6)' },
          { x: -10, y: 32, size: 20, delay: 0.5, grad: 'linear-gradient(to top right, #3b0764, #9333ea, #fbbf24)' }
        ];
        bubbles.forEach((b) => {
          const bub = document.createElement('div');
          bub.style.cssText = `position:absolute;left:calc(50% + ${b.x}px);top:calc(50% + ${b.y}px);width:${b.size}px;height:${b.size}px;border-radius:9999px;background:${b.grad};border:1px solid rgba(216, 180, 254, 0.8);box-shadow:0 0 14px #c084fc;pointer-events:none;z-index:40;animation:gbaMukToxicBubble forwards;opacity:0;`;
          applySpeed(bub, 1.75);
          bub.style.animationDelay = (b.delay / globalSpeed) + 's';
          bub.innerHTML = '<div style="width:5px;height:5px;border-radius:9999px;background:rgba(255,255,255,0.85);margin-left:5px;margin-top:4px;"></div>';
          stage.appendChild(bub);
        });
      }

      // Layer 5 Ambient: Corrosive Acid Smoke
      const sizzle = document.createElement('div');
      sizzle.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:15;animation:gbaMukAcidSizzle forwards;';
      applySpeed(sizzle, 1.75);
      sizzle.innerHTML = '<div style="width:140px;height:140px;border-radius:9999px;background:rgba(132, 204, 22, 0.22);filter:blur(24px);box-shadow:0 0 35px #84cc16;"></div>';
      stage.appendChild(sizzle);
    }

    /* 2. GRIMER STICKY HANDS */
    function renderSticky(stageId, whiffed) {
      const stage = document.getElementById(stageId);
      Array.from(stage.children).forEach(c => {
        if (!c.classList.contains('card-mockup-label') && !c.classList.contains('card-mockup-hp') && !c.classList.contains('card-art-box')) {
          stage.removeChild(c);
        }
      });

      // Layer 1: Adhesion Aura
      const aura = document.createElement('div');
      aura.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:15;animation:gbaStickyClampTremor forwards;';
      applySpeed(aura, 1.65);
      aura.innerHTML = '<div style="width:160px;height:190px;border-radius:12px;background:rgba(59, 7, 100, 0.35);filter:blur(8px);border:1px solid rgba(168, 85, 247, 0.4);box-shadow:0 0 30px #7e22ce;"></div>';
      stage.appendChild(aura);

      // Layer 2: Primary Visual Actor (1996 Ken Sugimori Grimer Sticky Hands Actor — Two-Layer Wrapper)
      const actorWrapper = document.createElement('div');
      const w = whiffed ? '106px' : '150px';
      const h = whiffed ? '75px' : '106px';
      actorWrapper.style.cssText = `position:absolute;top:36%;left:50%;transform:translate(-50%,-50%);width:${w};height:${h};pointer-events:none;z-index:30;display:flex;align-items:center;justify-content:center;`;
      
      const actorInner = document.createElement('div');
      actorInner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;animation:gbaGrimerStickyActorLunge cubic-bezier(0.18, 0.9, 0.28, 1) forwards;';
      applySpeed(actorInner, 1.65);
      actorInner.innerHTML = `
        <img src="/assets/Grimer_StickyHands_Actor.png" alt="Grimer Sticky Hands" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 24px #a855f7) drop-shadow(0 0 12px #581c87);" />
      `;
      actorWrapper.appendChild(actorInner);
      stage.appendChild(actorWrapper);

      // Layer 3: Dynamic Hand Sludge Drips (Path Tracing - 4 Droplets Pinching Off from Hands)
      if (!whiffed) {
        const handDrips = [
          { x: -44, top: 'calc(36% + 8px)', kf: 'gbaGrimerHandDripL', delay: 0, w: 12, h: 18, r: 6 },
          { x: -22, top: 'calc(36% + 18px)', kf: 'gbaGrimerHandDripL', delay: 0.08, w: 14, h: 22, r: 7 },
          { x: 22, top: 'calc(36% + 18px)', kf: 'gbaGrimerHandDripR', delay: 0.08, w: 14, h: 22, r: 7 },
          { x: 44, top: 'calc(36% + 8px)', kf: 'gbaGrimerHandDripR', delay: 0, w: 12, h: 18, r: 6 }
        ];
        handDrips.forEach(d => {
          const drip = document.createElement('div');
          drip.style.cssText = `position:absolute;left:calc(50% + ${d.x}px);top:${d.top};transform:translateX(-50%);pointer-events:none;z-index:35;animation:${d.kf} cubic-bezier(0.4, 0, 0.9, 1) forwards;opacity:0;`;
          applySpeed(drip, 1.65);
          if (d.delay > 0) drip.style.animationDelay = (d.delay / globalSpeed) + 's';
          drip.innerHTML = `
            <svg width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}">
              <path d="M ${d.r} 0 C ${d.r} ${d.r * 0.75}, 0 ${d.h * 0.6}, 0 ${d.h * 0.75} C 0 ${d.h * 0.9}, ${d.r * 0.5} ${d.h}, ${d.r} ${d.h} C ${d.r * 1.5} ${d.h}, ${d.w} ${d.h * 0.9}, ${d.w} ${d.h * 0.75} C ${d.w} ${d.h * 0.6}, ${d.r} ${d.r * 0.75}, ${d.r} 0 Z" fill="#7e22ce" />
              <circle cx="${d.r * 0.7}" cy="${d.h * 0.7}" r="${d.r * 0.28}" fill="#f3e8ff" opacity="0.85" />
            </svg>
          `;
          stage.appendChild(drip);
        });

        // Floor Splatters Beneath Hand Drips
        const handSplat = document.createElement('div');
        handSplat.style.cssText = 'position:absolute;bottom:10px;pointer-events:none;z-index:20;animation:gbaGrimerHandDripSplat forwards;opacity:0;display:flex;justify-content:center;width:100%;';
        applySpeed(handSplat, 1.65);
        handSplat.innerHTML = `
          <div style="position:relative;width:208px;height:24px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;left:calc(50% - 33px);transform:translateX(-50%);">
              <svg width="34" height="14" viewBox="0 0 34 14" style="overflow:visible;filter:drop-shadow(0 0 8px #c084fc)">
                <ellipse cx="17" cy="8" rx="14" ry="4.5" fill="#581c87" opacity="0.92" />
                <ellipse cx="17" cy="7" rx="8" ry="2.5" fill="#a855f7" />
              </svg>
            </div>
            <div style="position:absolute;left:50%;transform:translateX(-50%);">
              <svg width="42" height="16" viewBox="0 0 42 16" style="overflow:visible;filter:drop-shadow(0 0 12px #c084fc)">
                <ellipse cx="21" cy="9" rx="18" ry="5.5" fill="#3b0764" opacity="0.95" />
                <ellipse cx="21" cy="8" rx="12" ry="3" fill="#c084fc" />
              </svg>
            </div>
            <div style="position:absolute;left:calc(50% + 33px);transform:translateX(-50%);">
              <svg width="34" height="14" viewBox="0 0 34 14" style="overflow:visible;filter:drop-shadow(0 0 8px #c084fc)">
                <ellipse cx="17" cy="8" rx="14" ry="4.5" fill="#581c87" opacity="0.92" />
                <ellipse cx="17" cy="7" rx="8" ry="2.5" fill="#a855f7" />
              </svg>
            </div>
          </div>
        `;
        stage.appendChild(handSplat);
      }

      // Layer 4: Viscous Elastic Slime Web Strands (Anchoring the Victim & Spanning Hand Webbing)
      const tendrils = document.createElement('div');
      tendrils.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:38;animation:gbaStickyWebPulse ease-out forwards;';
      applySpeed(tendrils, 1.65);
      tendrils.innerHTML = `
        <svg width="140" height="96" viewBox="0 0 140 96" style="overflow:visible">
          <path d="M 22 38 Q 70 20, 118 40" fill="none" stroke="#d8b4fe" stroke-width="3" stroke-linecap="round" opacity="0.92" style="filter:drop-shadow(0 0 8px #c084fc)" />
          <path d="M 26 50 Q 70 66, 114 48" fill="none" stroke="#d8b4fe" stroke-width="2.8" stroke-linecap="round" opacity="0.9" style="filter:drop-shadow(0 0 8px #c084fc)" />
          <path d="M 40 32 Q 70 50, 100 34" fill="none" stroke="#f5d0fe" stroke-width="1.8" stroke-linecap="round" opacity="0.95" />
          <path d="M 46 56 Q 70 34, 94 58" fill="none" stroke="#a855f7" stroke-width="2.4" stroke-linecap="round" opacity="0.85" />
          <path d="M 69 45 Q 70 76, 71 82 Q 72 76, 71 45 Z" fill="#9333ea" opacity="0.9" />
        </svg>
      `;
      stage.appendChild(tendrils);

      // Layer 5: Neurotoxic Bioluminescent Paralysis Pulse (NO YELLOW ZIGZAG SPARKS!)
      if (!whiffed) {
        const pulse = document.createElement('div');
        pulse.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:40;animation:gbaStickyParalysisRing 1.65s ease-out forwards;';
        applySpeed(pulse, 1.65);
        pulse.innerHTML = `
          <svg width="150" height="110" viewBox="0 0 150 110" style="overflow:visible">
            <defs>
              <radialGradient id="neuroParalysisPulse_p" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="35%" stop-color="#c084fc" stop-opacity="0.85" />
                <stop offset="70%" stop-color="#a3e635" stop-opacity="0.65" />
                <stop offset="100%" stop-color="#84cc16" stop-opacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="75" cy="55" rx="65" ry="42" fill="url(#neuroParalysisPulse_p)" />
            <ellipse cx="75" cy="55" rx="55" ry="34" fill="none" stroke="#fef08a" stroke-width="1.6" stroke-dasharray="6 4" opacity="0.75" />
          </svg>
        `;
        stage.appendChild(pulse);
      }
    }

    /* 3. GRIMER NASTY GOO */
    function renderGoo(stageId, whiffed) {
      const stage = document.getElementById(stageId);
      Array.from(stage.children).forEach(c => {
        if (!c.classList.contains('card-mockup-label') && !c.classList.contains('card-mockup-hp') && !c.classList.contains('card-art-box')) {
          stage.removeChild(c);
        }
      });

      // Layer 1: Mire Floor
      const floor = document.createElement('div');
      floor.style.cssText = 'position:absolute;bottom:8px;pointer-events:none;z-index:15;animation:gbaGrimerFloorMire forwards;display:flex;justify-content:center;';
      applySpeed(floor, 1.55);
      floor.innerHTML = '<div style="width:160px;height:40px;border-radius:9999px;background:radial-gradient(ellipse at 50% 50%, #3b0764 0%, #1e1b4b 70%, transparent 100%);filter:blur(2px);box-shadow:0 0 20px #581c87;"></div>';
      stage.appendChild(floor);

      // Layer 2: Main Blob (Centered on target Pokémon body at top 32%)
      const blobWrapper = document.createElement('div');
      const w = whiffed ? '112px' : '160px';
      const h = whiffed ? '77px' : '110px';
      blobWrapper.style.cssText = `position:absolute;left:50%;top:32%;transform:translate(-50%,-50%);width:${w};height:${h};pointer-events:none;z-index:30;display:flex;align-items:center;justify-content:center;`;
      
      const blobInner = document.createElement('div');
      blobInner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;animation:gbaGrimerGooSplat cubic-bezier(0.2, 0.9, 0.3, 1) forwards;';
      applySpeed(blobInner, 1.55);
      blobInner.innerHTML = `
        <svg viewBox="0 0 160 110" style="width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 24px #a855f7) drop-shadow(0 0 14px #7e22ce)">
          <defs>
            <radialGradient id="gooCore_p" cx="50%" cy="38%" r="58%">
              <stop offset="0%" stop-color="#f3e8ff" />
              <stop offset="25%" stop-color="#c084fc" />
              <stop offset="55%" stop-color="#9333ea" />
              <stop offset="82%" stop-color="#6b21a8" />
              <stop offset="100%" stop-color="#240d47" />
            </radialGradient>
            <linearGradient id="gooDripG_p" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#9333ea" />
              <stop offset="100%" stop-color="#581c87" />
            </linearGradient>
            <linearGradient id="gooGleamG_p" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="50%" stop-color="#ffffff" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M 80 14 C 110 12, 142 22, 148 46 C 154 68, 132 80, 118 76 C 110 74, 106 88, 102 94 C 98 86, 94 76, 80 78 C 66 76, 62 86, 58 94 C 54 88, 50 74, 42 76 C 28 80, 6 68, 12 46 C 18 22, 50 12, 80 14 Z" fill="url(#gooCore_p)" />
          <path d="M 40 48 C 30 38, 55 26, 75 32 C 60 44, 48 56, 40 48 Z" fill="#7e22ce" opacity="0.85" />
          <path d="M 120 48 C 130 38, 105 26, 85 32 C 100 44, 112 56, 120 48 Z" fill="#7e22ce" opacity="0.85" />
          <path d="M 40 74 Q 48 98, 56 74 Z" fill="url(#gooDripG_p)" />
          <path d="M 72 76 Q 80 104, 88 76 Z" fill="url(#gooDripG_p)" />
          <path d="M 104 74 Q 112 98, 120 74 Z" fill="url(#gooDripG_p)" />
          <path d="M 52 26 C 70 20, 95 20, 112 26" fill="none" stroke="url(#gooGleamG_p)" stroke-width="3.2" stroke-linecap="round" />
          <path d="M 38 42 C 48 34, 64 36, 72 44" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
          <path d="M 122 42 C 112 34, 96 36, 88 44" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
          <circle cx="62" cy="56" r="2.8" fill="#f5d0fe" opacity="0.85" />
          <circle cx="98" cy="56" r="2.8" fill="#f5d0fe" opacity="0.85" />
          <circle cx="80" cy="64" r="2.2" fill="#ffffff" opacity="0.9" />
        </svg>
      `;
      blobWrapper.appendChild(blobInner);
      stage.appendChild(blobWrapper);

      if (!whiffed) {
        // Layer 3: Organic Necking Filaments anchored directly to Nozzles at top: calc(32% + 43px) (Two-Layer Wrapper)
        const neckingWrapper = document.createElement('div');
        neckingWrapper.style.cssText = 'position:absolute;left:50%;top:calc(32% + 43px);transform:translateX(-50%);width:160px;pointer-events:none;z-index:25;display:flex;justify-content:center;';
        const neckingInner = document.createElement('div');
        neckingInner.style.cssText = 'width:100%;display:flex;justify-content:center;transform-origin:top center;animation:gbaGrimerNeckingThread forwards;';
        applySpeed(neckingInner, 1.55);
        neckingInner.innerHTML = `
          <svg width="160" height="55" viewBox="0 0 160 55" style="overflow:visible;filter:drop-shadow(0 0 10px #9333ea)">
            <path d="M 46 0 C 45 14, 44 26, 47 38 C 48 44, 51 44, 50 38 C 49 26, 51 14, 52 0 Z" fill="url(#gooDripG_p)" />
            <path d="M 77 6 C 76 20, 75 34, 79 46 C 80 52, 84 52, 83 46 C 82 34, 85 20, 86 6 Z" fill="url(#gooDripG_p)" />
            <path d="M 110 0 C 109 14, 108 26, 111 38 C 112 44, 115 44, 114 38 C 113 26, 115 14, 116 0 Z" fill="url(#gooDripG_p)" />
          </svg>
        `;
        neckingWrapper.appendChild(neckingInner);
        stage.appendChild(neckingWrapper);

        // Layer 4: Vertical Gravitational Droplets falling ~135px straight down (Aligned to -32px, 0px, +32px)
        const drops = [
          { x: -32, top: 'calc(32% + 43px)', kf: 'gbaGrimerPinchDrop1', w: 15, h: 22, r: 7.5 },
          { x: 0, top: 'calc(32% + 49px)', kf: 'gbaGrimerPinchDrop2', w: 19, h: 28, r: 9.5 },
          { x: 32, top: 'calc(32% + 43px)', kf: 'gbaGrimerPinchDrop3', w: 14, h: 20, r: 7 }
        ];
        drops.forEach(d => {
          const drop = document.createElement('div');
          drop.style.cssText = `position:absolute;left:calc(50% + ${d.x}px);top:${d.top};transform:translateX(-50%);pointer-events:none;z-index:30;animation:${d.kf} cubic-bezier(0.4, 0, 0.9, 1) forwards;opacity:0;`;
          applySpeed(drop, 1.55);
          drop.innerHTML = `
            <svg width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}">
              <path d="M ${d.r} 0 C ${d.r} ${d.r * 0.7}, 0 ${d.h * 0.6}, 0 ${d.h * 0.75} C 0 ${d.h * 0.9}, ${d.r * 0.5} ${d.h}, ${d.r} ${d.h} C ${d.r * 1.5} ${d.h}, ${d.w} ${d.h * 0.9}, ${d.w} ${d.h * 0.75} C ${d.w} ${d.h * 0.6}, ${d.r} ${d.r * 0.7}, ${d.r} 0 Z" fill="#7e22ce" />
              <circle cx="${d.r * 0.7}" cy="${d.h * 0.7}" r="${d.r * 0.25}" fill="#f3e8ff" opacity="0.85" />
            </svg>
          `;
          stage.appendChild(drop);
        });

        // Layer 4 Floor Splatters: 3 crowns positioned exactly below each droplet axis (-32px, 0px, +32px)
        const splat = document.createElement('div');
        splat.style.cssText = 'position:absolute;bottom:12px;pointer-events:none;z-index:20;animation:gbaGrimerFloorSplat forwards;opacity:0;display:flex;justify-content:center;width:100%;';
        applySpeed(splat, 1.55);
        splat.innerHTML = `
          <div style="position:relative;width:200px;height:24px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;left:calc(50% - 32px);transform:translateX(-50%);">
              <svg width="36" height="16" viewBox="0 0 36 16" style="overflow:visible;filter:drop-shadow(0 0 8px #c084fc)">
                <ellipse cx="18" cy="9" rx="16" ry="5" fill="#581c87" opacity="0.92" />
                <ellipse cx="18" cy="8" rx="10" ry="3" fill="#a855f7" />
              </svg>
            </div>
            <div style="position:absolute;left:50%;transform:translateX(-50%);">
              <svg width="46" height="18" viewBox="0 0 46 18" style="overflow:visible;filter:drop-shadow(0 0 12px #c084fc)">
                <ellipse cx="23" cy="10" rx="20" ry="6" fill="#3b0764" opacity="0.95" />
                <ellipse cx="23" cy="9" rx="14" ry="3.5" fill="#c084fc" />
              </svg>
            </div>
            <div style="position:absolute;left:calc(50% + 32px);transform:translateX(-50%);">
              <svg width="34" height="16" viewBox="0 0 34 16" style="overflow:visible;filter:drop-shadow(0 0 8px #c084fc)">
                <ellipse cx="17" cy="9" rx="15" ry="5" fill="#581c87" opacity="0.92" />
                <ellipse cx="17" cy="8" rx="9" ry="3" fill="#a855f7" />
              </svg>
            </div>
          </div>
        `;
        stage.appendChild(splat);
      }
    }

    /* 4. GRIMER MINIMIZE */
    function renderMinimize(stageId) {
      const stage = document.getElementById(stageId);
      Array.from(stage.children).forEach(c => {
        if (!c.classList.contains('card-mockup-label') && !c.classList.contains('card-mockup-hp') && !c.classList.contains('card-art-box')) {
          stage.removeChild(c);
        }
      });

      // Layer 1: Organic Bézier Liquid Surface Tension Ripples (Surrounding Floor Puddle at bottom: 8px) (Two-Layer Wrapper)
      const r1Wrapper = document.createElement('div');
      r1Wrapper.style.cssText = 'position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:170px;height:75px;pointer-events:none;z-index:20;display:flex;align-items:center;justify-content:center;';
      const r1Inner = document.createElement('div');
      r1Inner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center center;animation:gbaGrimerOrganicRipple1 forwards;';
      applySpeed(r1Inner, 1.5);
      r1Inner.innerHTML = `
        <svg width="170" height="75" viewBox="0 0 170 75" style="overflow:visible">
          <defs>
            <linearGradient id="minR1_p" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0" />
              <stop offset="30%" stop-color="#e879f9" stop-opacity="0.85" />
              <stop offset="70%" stop-color="#d8b4fe" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#c084fc" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M 12 38 C 10 52, 42 66, 85 66 C 128 66, 160 52, 158 38 C 156 24, 126 10, 85 10 C 44 10, 14 24, 12 38 Z" fill="none" stroke="url(#minR1_p)" stroke-width="2.2" stroke-linecap="round" style="filter:drop-shadow(0 0 8px #c084fc)" />
        </svg>
      `;
      r1Wrapper.appendChild(r1Inner);
      stage.appendChild(r1Wrapper);

      const r2Wrapper = document.createElement('div');
      r2Wrapper.style.cssText = 'position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:170px;height:75px;pointer-events:none;z-index:20;display:flex;align-items:center;justify-content:center;';
      const r2Inner = document.createElement('div');
      r2Inner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center center;animation:gbaGrimerOrganicRipple2 forwards;opacity:0;';
      applySpeed(r2Inner, 1.5);
      r2Inner.style.animationDelay = (0.22 / globalSpeed) + 's';
      r2Inner.innerHTML = `
        <svg width="170" height="75" viewBox="0 0 170 75" style="overflow:visible">
          <defs>
            <linearGradient id="minR2_p" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#9333ea" stop-opacity="0" />
              <stop offset="30%" stop-color="#c084fc" stop-opacity="0.75" />
              <stop offset="70%" stop-color="#f5d0fe" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#9333ea" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M 20 38 C 18 50, 46 62, 85 62 C 124 62, 152 50, 150 38 C 148 26, 122 14, 85 14 C 48 14, 22 26, 20 38 Z" fill="none" stroke="url(#minR2_p)" stroke-width="1.6" stroke-linecap="round" style="filter:drop-shadow(0 0 6px #a855f7)" />
        </svg>
      `;
      r2Wrapper.appendChild(r2Inner);
      stage.appendChild(r2Wrapper);

      // Layer 2: Genuine Liquefying Slime Mass Collapse (Floor-Centered at bottom: 12px) (Two-Layer Wrapper)
      const poolWrapper = document.createElement('div');
      poolWrapper.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:140px;height:64px;pointer-events:none;z-index:30;display:flex;align-items:center;justify-content:center;';
      const poolInner = document.createElement('div');
      poolInner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center bottom;animation:gbaGrimerPuddleMelt cubic-bezier(0.18, 0.9, 0.3, 1) forwards;';
      applySpeed(poolInner, 1.5);
      poolInner.innerHTML = `
        <svg viewBox="0 0 140 64" style="width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 28px #c084fc) drop-shadow(0 0 16px #7e22ce)">
          <defs>
            <radialGradient id="minCore_p" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#f3e8ff" />
              <stop offset="25%" stop-color="#c084fc" />
              <stop offset="65%" stop-color="#7e22ce" />
              <stop offset="100%" stop-color="#240d47" />
            </radialGradient>
          </defs>
          <path d="M 6 38 C 2 50, 24 62, 70 62 C 116 62, 138 50, 134 38 C 130 24, 104 14, 70 14 C 36 14, 10 24, 6 38 Z" fill="url(#minCore_p)" />
          <path d="M 24 38 C 38 28, 70 26, 102 30 C 118 32, 116 44, 96 48 C 74 52, 42 50, 24 38 Z" fill="#9333ea" opacity="0.85" />
          <ellipse cx="70" cy="36" rx="38" ry="11" fill="#a855f7" opacity="0.9" />
          <ellipse cx="50" cy="30" rx="24" ry="5.5" fill="#ffffff" opacity="0.65" transform="rotate(-6 50 30)" />
          <ellipse cx="94" cy="34" rx="18" ry="4.5" fill="#ffffff" opacity="0.55" transform="rotate(5 94 34)" />
          <circle cx="38" cy="40" r="2.8" fill="#f5d0fe" opacity="0.85" />
          <circle cx="104" cy="42" r="2.4" fill="#f5d0fe" opacity="0.85" />
        </svg>
      `;
      poolWrapper.appendChild(poolInner);
      stage.appendChild(poolWrapper);

      // Layer 3: Evasive Vapor Mist & Refractive Shimmer Aura
      const aura = document.createElement('div');
      aura.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:15;animation:gbaGrimerShieldAura forwards;';
      applySpeed(aura, 1.5);
      aura.innerHTML = '<div style="width:160px;height:200px;border-radius:14px;background:rgba(168, 85, 247, 0.2);filter:blur(18px);border:1px solid rgba(245, 208, 254, 0.4);box-shadow:0 0 35px #a855f7;"></div>';
      stage.appendChild(aura);
    }

    function playAll() {
      renderMuk('stage-muk-hit', false);
      renderSticky('stage-grimer-sticky', false);
      renderGoo('stage-grimer-goo', false);
      renderMinimize('stage-grimer-minimize');
    }

    function resetAll() {
      ['stage-muk-hit', 'stage-grimer-sticky', 'stage-grimer-goo', 'stage-grimer-minimize'].forEach(id => {
        const stage = document.getElementById(id);
        Array.from(stage.children).forEach(c => {
          if (!c.classList.contains('card-mockup-label') && !c.classList.contains('card-mockup-hp') && !c.classList.contains('card-art-box')) {
            stage.removeChild(c);
          }
        });
      });
    }

    // Auto-init on load
    playAll();
  