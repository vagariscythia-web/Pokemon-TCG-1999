const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const imgPath = path.join(__dirname, '../public/assets/raw/Articuno_raw_edited.png');
  const buf = await sharp(imgPath)
    .resize(600, 600, { fit: 'inside' })
    .png({ compressionLevel: 8 })
    .toBuffer();
  
  const b64 = buf.toString('base64');
  console.log('Optimized Articuno PNG base64 ready. Size:', (b64.length / 1024).toFixed(1), 'KB');

  const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Articuno "Blizzard" — Animation Preview Board</title>
  <style>
    :root {
      --speed-mult: 1;
    }
    * { box-sizing: border-box; }
    body {
      background: radial-gradient(circle at 50% 20%, #0f1d36 0%, #080c16 80%, #03060a 100%);
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      max-width: 900px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid #38bdf8;
      color: #7dd3fc;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 10px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #e0f2fe;
      margin: 0 0 8px 0;
      text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
    }
    p.desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }
    .metrics {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      font-size: 12px;
    }
    .metric-pill {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.25);
      padding: 6px 14px;
      border-radius: 8px;
      color: #cbd5e1;
    }
    .metric-pill strong {
      color: #38bdf8;
    }

    /* Controls Bar */
    .controls-panel {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 14px;
      padding: 14px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      max-width: 980px;
      width: 100%;
      margin-bottom: 28px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .ctrl-group {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .btn {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      border: 1px solid #38bdf8;
      color: #ffffff;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
    }
    .btn:hover {
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      transform: translateY(-1px);
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.6);
    }
    .btn-secondary {
      background: rgba(30, 41, 59, 0.8);
      border-color: #475569;
      color: #94a3b8;
      box-shadow: none;
    }
    .btn-secondary:hover {
      background: #334155;
      color: #f1f5f9;
      box-shadow: none;
    }
    .speed-btn {
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 6px;
      cursor: pointer;
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      font-weight: 600;
    }
    .speed-btn.active {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
    }

    /* Layer Toggles */
    .toggles-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12px;
      color: #cbd5e1;
      padding-top: 4px;
      border-top: 1px solid rgba(255,255,255,0.08);
      width: 100%;
      justify-content: center;
    }
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      user-select: none;
    }
    .toggle-label input {
      accent-color: #0284c7;
      cursor: pointer;
    }

    /* Grid of Cards */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1100px;
      width: 100%;
    }
    .card-panel {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .card-panel h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #7dd3fc;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-panel .card-subtitle {
      font-size: 11px;
      color: #64748b;
      margin-top: -6px;
      text-align: center;
    }

    /* TCG Card Container Stage */
    .tcg-card {
      width: 180px;
      height: 252px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 3px solid #38bdf8;
      box-shadow: 0 12px 30px rgba(0,0,0,0.7), inset 0 0 20px rgba(56, 189, 248, 0.15);
      position: relative;
      overflow: visible;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tcg-card.bench {
      width: 140px;
      height: 196px;
      border-color: #0284c7;
    }
    /* Simulated Pokemon Card Visual Inside Stage */
    .card-inner-frame {
      width: 100%;
      height: 100%;
      border-radius: 9px;
      overflow: hidden;
      position: relative;
      background: #111827;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .card-header-bar {
      height: 24px;
      background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
      padding: 3px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
    }
    .card-art-box {
      flex: 1;
      background: radial-gradient(circle at 50% 50%, #ea580c 0%, #7c2d12 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fed7aa;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      position: relative;
    }
    .card-footer-box {
      height: 58px;
      background: #1e293b;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    /* Battlefield Section (Active + 2 Bench cards side-by-side) */
    .arena-section {
      max-width: 1100px;
      width: 100%;
      margin-top: 30px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .arena-title {
      font-size: 16px;
      font-weight: 800;
      color: #38bdf8;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .arena-stage {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 36px;
      padding: 20px 0;
      width: 100%;
    }
    .slot-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .slot-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .slot-label.active {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      border: 1px solid #38bdf8;
    }
    .slot-label.bench {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
      border: 1px solid #475569;
    }

    /* KEYFRAMES FOR BLIZZARD (Synchronized with index.css) */
    @keyframes gbaBlizzardStockWingSpread {
      0%   { transform: translate(-50%, -50%) scale(0.55) translateY(14px); opacity: 0; }
      14%  { transform: translate(-50%, -50%) scale(0.62) translateY(18px); opacity: 0; }
      32%  { transform: translate(-50%, -50%) scale(1.06) translateY(-4px); opacity: 1; }
      46%  { transform: translate(-50%, -50%) scale(1.14) translateY(-8px); opacity: 1; }
      60%  { transform: translate(-50%, -50%) scale(1.10) translateY(-6px); opacity: 1; }
      80%  { transform: translate(-50%, -50%) scale(0.98) translateY(2px); opacity: 0.9; }
      100% { transform: translate(-50%, -50%) scale(0.88) translateY(6px); opacity: 0; }
    }
    @keyframes gbaBlizzardStockWhiff {
      0%   { transform: translate(-50%, -50%) scale(0.5) translateY(16px); opacity: 0; }
      14%  { transform: translate(-50%, -50%) scale(0.55) translateY(20px); opacity: 0; }
      34%  { transform: translate(-50%, -50%) scale(0.82) translateY(-2px); opacity: 0.45; }
      52%  { transform: translate(-50%, -50%) scale(0.86) translateY(-4px); opacity: 0.4; }
      74%  { transform: translate(-50%, -50%) scale(0.78) translateY(4px); opacity: 0.25; }
      100% { transform: translate(-50%, -50%) scale(0.68) translateY(10px); opacity: 0; }
    }
    @keyframes gbaBlizzardFrostVeil {
      0%   { opacity: 0; }
      22%  { opacity: 0.3; }
      45%  { opacity: 0.42; backdrop-filter: blur(0.6px); }
      70%  { opacity: 0.26; }
      100% { opacity: 0; }
    }
    @keyframes gbaBlizzardStormHaze {
      0%   { opacity: 0; transform: translate(30px, -20px) scale(0.7); }
      25%  { opacity: 0.75; transform: translate(10px, -6px) scale(1.0); }
      55%  { opacity: 0.6; transform: translate(-12px, 8px) scale(1.08); }
      80%  { opacity: 0.25; transform: translate(-30px, 20px) scale(1.16); filter: blur(2px); }
      100% { opacity: 0; transform: translate(-40px, 26px) scale(1.2); filter: blur(3px); }
    }
    @keyframes gbaArticunoBlizzardVortex {
      0% {
        opacity: 0;
        transform: translate(60px, -40px) rotate(12deg) scale(0.85);
      }
      25% {
        opacity: 0.95;
        transform: translate(15px, -10px) rotate(4deg) scale(1.05);
      }
      50% {
        opacity: 1;
        transform: translate(-10px, 10px) rotate(-3deg) scale(1.1);
      }
      75% {
        opacity: 0.85;
        transform: translate(-35px, 25px) rotate(-8deg) scale(1.0);
      }
      100% {
        opacity: 0;
        transform: translate(-65px, 45px) rotate(-15deg) scale(0.9);
      }
    }

    /* Physically Realistic Ballistic Scatter Shards (No unnatural spin; tip aligned with trajectory) */
    @keyframes gbaBlizzardIceShard {
      0% {
        opacity: 0;
        transform: translate(var(--shard-ox, 50px), var(--shard-oy, -40px)) rotate(var(--shard-angle, 228deg)) scale(0.4);
      }
      15% {
        opacity: 0.95;
        transform: translate(calc(var(--shard-ox, 50px) * 0.55), calc(var(--shard-oy, -40px) * 0.55)) rotate(calc(var(--shard-angle, 228deg) - 2deg)) scale(0.9);
      }
      45% {
        opacity: 1;
        transform: translate(calc(var(--shard-ox, 50px) * -0.15), calc(var(--shard-oy, -40px) * -0.15)) rotate(calc(var(--shard-angle, 228deg) + 2deg)) scale(1.02);
      }
      75% {
        opacity: 0.75;
        transform: translate(calc(var(--shard-ox, 50px) * -0.85 - 8px), calc(var(--shard-oy, -40px) * -0.85 + 10px)) rotate(calc(var(--shard-angle, 228deg) - 1deg)) scale(0.92);
      }
      100% {
        opacity: 0;
        transform: translate(calc(var(--shard-ox, 50px) * -1.5 - 18px), calc(var(--shard-oy, -40px) * -1.5 + 24px)) rotate(var(--shard-angle, 228deg)) scale(0.6);
        filter: blur(1px);
      }
    }

    /* Physically Realistic Ballistic Embed Shards (Tip-first penetration + kinetic impact shudder + sublimation) */
    @keyframes gbaBlizzardIceShardEmbed {
      0% {
        opacity: 0;
        transform: translate(var(--shard-ox, 55px), var(--shard-oy, -45px)) rotate(var(--shard-angle, 228deg)) scale(0.35);
      }
      22% {
        opacity: 0.95;
        transform: translate(calc(var(--shard-ox, 55px) * 0.45 + var(--shard-tx, 0px) * 0.55), calc(var(--shard-oy, -45px) * 0.45 + var(--shard-ty, 0px) * 0.55)) rotate(calc(var(--shard-angle, 228deg) - 1.5deg)) scale(1.05);
      }
      42% {
        opacity: 1;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(var(--shard-angle, 228deg)) scale(1.15, 0.92);
        filter: drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 14px #38bdf8);
      }
      50% {
        opacity: 1;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(calc(var(--shard-angle, 228deg) + 3.5deg)) scale(0.96, 1.04);
      }
      58% {
        opacity: 0.95;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(calc(var(--shard-angle, 228deg) - 2.5deg)) scale(1.02, 0.98);
      }
      68% {
        opacity: 0.9;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(calc(var(--shard-angle, 228deg) + 1deg)) scale(1.0);
        filter: drop-shadow(0 0 6px #7dd3fc);
      }
      80% {
        opacity: 0.85;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(var(--shard-angle, 228deg)) scale(0.98);
      }
      100% {
        opacity: 0;
        transform: translate(var(--shard-tx, 0px), var(--shard-ty, 0px)) rotate(var(--shard-angle, 228deg)) scale(0.85);
        filter: blur(1.5px);
      }
    }

    @keyframes gbaArticunoSnowflakeSpin {
      0%   { opacity: 0; transform: translate(var(--s-ox, 40px), var(--s-oy, -30px)) rotate(0deg) scale(0.4); }
      12%  { opacity: 0.7; transform: translate(calc(var(--s-ox, 40px) * 0.7), calc(var(--s-oy, -30px) * 0.7)) rotate(45deg) scale(0.8); }
      30%  { opacity: 1; transform: translate(calc(var(--s-ox, 40px) * 0.25 + 4px), calc(var(--s-oy, -30px) * 0.25 + 2px)) rotate(130deg) scale(1.05); }
      55%  { opacity: 0.85; transform: translate(calc(var(--s-ox, 40px) * -0.3 - 6px), calc(var(--s-oy, -30px) * -0.3 + 4px)) rotate(220deg) scale(0.95); }
      80%  { opacity: 0.5; transform: translate(calc(var(--s-ox, 40px) * -0.7 - 8px), calc(var(--s-oy, -30px) * -0.7 + 6px)) rotate(310deg) scale(0.8); }
      100% { opacity: 0; transform: translate(calc(var(--s-ox, 40px) * -1.1 - 10px), calc(var(--s-oy, -30px) * -1.1 + 8px)) rotate(380deg) scale(0.6); }
    }
    @keyframes gbaBlizzardBenchFrostBurst {
      0%   { opacity: 0; transform: scale(0.3); }
      25%  { opacity: 0.9; transform: scale(1.1); }
      55%  { opacity: 0.7; transform: scale(1.3); }
      100% { opacity: 0; transform: scale(1.6); filter: blur(2px); }
    }
    @keyframes gbaMagneticHumCardShake {
      0%, 100% { transform: translateX(0); }
      10% { transform: translateX(-1.5px); }
      20% { transform: translateX(1.5px); }
      30% { transform: translateX(-1px); }
      40% { transform: translateX(1px); }
      50% { transform: translateX(-0.5px); }
      60% { transform: translateX(0.5px); }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="badge">Pokémon TCG 1999 — Move Animation Engine</div>
    <h1>Articuno "Blizzard" — Animation Preview Board</h1>
    <p class="desc">
      Stok raster aktör <strong>168px</strong> (Apex Tier 1 ölçeği) seviyesine kalibre edilmiş, fırtına kütlesi (Haze <code>z-32</code>), rüzgâr akımı (Vortex <code>z-34</code>), buz kristalleri (Shards <code>z-36</code>) ve kar kristalleri (Snowflakes <code>z-38</code>) Articuno'nun (<code>z-26</code>) <strong>ÖNÜNDE</strong> süpürülerek aktif kart üzerinde tam görünürlük ve estetik derinlik sağlanmıştır.
    </p>
    <div class="metrics">
      <div class="metric-pill">Stok Konteyner: <strong>168px</strong> (Whiff: 90px)</div>
      <div class="metric-pill">Opak Kanat Açıklığı: <strong>~138.3px</strong> (Zapdos dengi)</div>
      <div class="metric-pill">Kristal Fiziği: <strong>Dönmesiz Balistik Ok Uçuşu + Kinetik Titreme</strong></div>
      <div class="metric-pill">Bench Slot: <strong>Tam Oyun İçi Orkestrasyonu (Fırtına + Burst)</strong></div>
    </div>
  </div>

  <!-- Interactive Controls Bar -->
  <div class="controls-panel">
    <div class="ctrl-group">
      <button class="btn" onclick="replayAll()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        Tümünü Yeniden Oynat
      </button>
    </div>

    <div class="ctrl-group">
      <span style="color:#94a3b8; font-size:12px; font-weight:600;">Animasyon Hızı:</span>
      <button class="speed-btn active" onclick="setSpeed(1, this)">1.0x (Normal)</button>
      <button class="speed-btn" onclick="setSpeed(0.5, this)">0.5x (Ağır Çekim)</button>
      <button class="speed-btn" onclick="setSpeed(0.25, this)">0.25x (İnceleme)</button>
    </div>

    <!-- Layer Checklist Toggles -->
    <div class="toggles-group">
      <label class="toggle-label"><input type="checkbox" id="chk-actor" checked onchange="updateVisibility()"> Articuno Aktör (z-26)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-veil" checked onchange="updateVisibility()"> Frost Veil (z-28)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-haze" checked onchange="updateVisibility()"> Storm Haze (z-32)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-wind" checked onchange="updateVisibility()"> Wind Vortex (z-34)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-shards" checked onchange="updateVisibility()"> Ice Shards (z-36)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-snow" checked onchange="updateVisibility()"> Snowflakes (z-38)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-burst" checked onchange="updateVisibility()"> Bench Frost Burst (z-15/20)</label>
      <label class="toggle-label"><input type="checkbox" id="chk-shake" checked onchange="updateVisibility()"> Kart Sarsıntısı</label>
    </div>
  </div>

  <!-- 3 Main Variant Stages -->
  <div class="grid">
    <!-- Panel 1: Active HIT -->
    <div class="card-panel">
      <h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#38bdf8"><circle cx="12" cy="12" r="10"/></svg>
        Aktif Slot: HIT (Başarılı Vuruş)
      </h2>
      <div class="card-subtitle">168px Articuno + Önde Fırtına + 8 Balistik Kristal + 6 Titreyen Saplanma</div>
      <div class="tcg-card" id="stage-hit"></div>
      <button class="btn btn-secondary" onclick="replayStage('stage-hit', false, 'active')">Tekrar Oynat</button>
    </div>

    <!-- Panel 2: Active WHIFF -->
    <div class="card-panel">
      <h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8"><circle cx="12" cy="12" r="10"/></svg>
        Aktif Slot: WHIFF (Iskalama)
      </h2>
      <div class="card-subtitle">90px Cılız Articuno (%53.5 whiff ölçeği) + Bastırılmış Fırtına + Uçuşan Kristaller</div>
      <div class="tcg-card" id="stage-whiff"></div>
      <button class="btn btn-secondary" onclick="replayStage('stage-whiff', true, 'active')">Tekrar Oynat</button>
    </div>

    <!-- Panel 3: Bench Slot Variant -->
    <div class="card-panel">
      <h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9"><circle cx="12" cy="12" r="10"/></svg>
        Bench Slot: Gerçek Oyun İçi Orkestrasyonu
      </h2>
      <div class="card-subtitle">BattleFXOverlay Uyumlu: Aktörsüz, 72px Frost Burst + Tipi + Rüzgâr + Kristaller + Kar</div>
      <div class="tcg-card bench" id="stage-bench"></div>
      <button class="btn btn-secondary" onclick="replayStage('stage-bench', false, 'bench')">Tekrar Oynat</button>
    </div>
  </div>

  <!-- Arena Battle Simulation (Active + 2 Bench Cards Hit Together) -->
  <div class="arena-section">
    <div class="arena-title">✦ Savaş Alanı Simülasyonu: Tam Takım Blizzard Taarruzu ✦</div>
    <div style="font-size:12px; color:#94a3b8; text-align:center; max-width:650px;">
      Oyunda Blizzard saldırısı yapıldığında aktif rakip ve tüm bench hedefleri eşzamanlı vurulur. Aktif kartta Articuno ve ön plandaki fırtına icra edilirken, yedeklerdeki Pokémon'lar fırtına akımları ve kompakt frost burst ile sarsılır.
    </div>

    <div class="arena-stage">
      <div class="slot-column">
        <div class="slot-label bench">Yedek #1 (Bench)</div>
        <div class="tcg-card bench" id="arena-bench-1"></div>
      </div>

      <div class="slot-column">
        <div class="slot-label active">★ Aktif Rakip (Active Target)</div>
        <div class="tcg-card" id="arena-active"></div>
      </div>

      <div class="slot-column">
        <div class="slot-label bench">Yedek #2 (Bench)</div>
        <div class="tcg-card bench" id="arena-bench-2"></div>
      </div>
    </div>

    <button class="btn" style="padding:10px 24px; font-size:14px;" onclick="replayArena()">
      ✦ Tüm Savaş Alanına Blizzard Püskürt ✦
    </button>
  </div>

  <script>
    // Embedded lossless high-resolution Articuno image as Base64 Data URI
    // This GUARANTEES 100% synchronous render with ZERO placeholder or broken image box under any browser or file:// protocol!
    const ARTICUNO_DATA_URI = "data:image/png;base64,${b64}";

    let currentSpeed = 1;

    function setSpeed(sp, btn) {
      currentSpeed = sp;
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      replayAll();
    }

    function dur(seconds) {
      return (seconds / currentSpeed).toFixed(2) + 's';
    }

    function renderCardBackground(container, name, hp, typeColor) {
      container.innerHTML = '';
      var inner = document.createElement('div');
      inner.className = 'card-inner-frame';
      inner.innerHTML = \`
        <div class="card-header-bar" style="background:linear-gradient(90deg, \${typeColor} 0%, rgba(0,0,0,0.85) 100%)">
          <span>\${name}</span>
          <span style="font-size:9px; color:#fef08a;">\${hp} HP</span>
        </div>
        <div class="card-art-box" style="background:radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.6) 100%)">
          <span style="opacity:0.35; font-size:10px; letter-spacing:0.1em;">POKÉMON CARD</span>
        </div>
        <div class="card-footer-box">
          <div style="font-weight:700; color:#e2e8f0; font-size:10px;">Blizzard Target</div>
          <div style="font-size:8px; color:#64748b;">Weakness: Metal / Retreat: 2</div>
        </div>
      \`;
      container.appendChild(inner);
    }

    // Common Blizzard storm elements function (shared identically between Active and Bench slots as in BattleFXOverlay.tsx)
    function renderBlizzardFX(container, options) {
      var isBench = options.slot === 'bench';
      var whiff = options.whiffed === true;
      var stage = document.createElement('div');
      stage.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:40;overflow:visible;';
      stage.className = 'blizzard-overlay';

      // 1. Layer 0: Articuno Stock Actor (ONLY on Active Slot)
      if (!isBench && document.getElementById('chk-actor').checked) {
        var actorBox = document.createElement('div');
        actorBox.style.cssText = 'position:absolute;left:50%;top:48%;transform:translate(-50%, -50%);pointer-events:none;z-index:26;' +
          'width:' + (whiff ? '90px' : '168px') + ';height:' + (whiff ? '90px' : '168px') + ';' +
          (whiff ? 'filter:saturate(0.4) brightness(0.85);' : '') +
          'animation:' + (whiff ? ('gbaBlizzardStockWhiff ' + dur(1.75) + ' ease-out forwards') : ('gbaBlizzardStockWingSpread ' + dur(1.75) + ' cubic-bezier(0.18, 0.92, 0.28, 1) forwards')) + ';';

        var img = document.createElement('img');
        img.src = ARTICUNO_DATA_URI;
        img.alt = 'Articuno Blizzard';
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;' +
          'filter:drop-shadow(0 0 18px rgba(56,189,248,0.75)) drop-shadow(0 0 9px rgba(207,250,254,0.5));' +
          'pointer-events:none;user-select:none;';
        img.draggable = false;
        actorBox.appendChild(img);
        stage.appendChild(actorBox);
      }

      // 2. Layer 1: Frost Veil Aura (ONLY on Active Slot when !whiff)
      if (!isBench && !whiff && document.getElementById('chk-veil').checked) {
        var veil = document.createElement('div');
        veil.style.cssText = 'position:absolute;left:50%;top:48%;width:176px;height:176px;transform:translate(-50%, -50%);border-radius:24px;pointer-events:none;z-index:28;opacity:0;' +
          'animation:gbaBlizzardFrostVeil ' + dur(1.75) + ' ease-out ' + dur(0.15) + ' forwards;' +
          'background:radial-gradient(ellipse, rgba(224,242,254,0.38) 0%, rgba(186,230,253,0.22) 45%, rgba(56,189,248,0.1) 70%, transparent 92%);';
        stage.appendChild(veil);
      }

      // 3. Bench Compact Frost Impact Burst (ONLY on Bench Slot)
      if (isBench && document.getElementById('chk-burst').checked) {
        var burst = document.createElement('div');
        burst.style.cssText = 'position:absolute;border-radius:50%;pointer-events:none;z-index:15;' +
          'width:72px;height:72px;' +
          'animation:gbaBlizzardBenchFrostBurst ' + dur(1.4) + ' ease-out forwards;' +
          'background:radial-gradient(circle, rgba(207,250,254,0.5) 0%, rgba(56,189,248,0.3) 40%, transparent 75%);';
        stage.appendChild(burst);

        var shimmer = document.createElement('div');
        shimmer.style.cssText = 'position:absolute;pointer-events:none;z-index:20;opacity:0;' +
          'animation:gbaBlizzardBenchFrostBurst ' + dur(1.2) + ' ease-out ' + dur(0.15) + ' forwards;';
        shimmer.innerHTML = \`
          <svg width="60" height="60" viewBox="0 0 60 60" style="overflow:visible">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#bae6fd" stroke-width="1.5" opacity="0.8" />
            <circle cx="30" cy="30" r="16" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6" />
          </svg>
        \`;
        stage.appendChild(shimmer);
      }

      // 4. Card Cold Shiver (Active & Bench both receive shiver when !whiff)
      if (!whiff && document.getElementById('chk-shake').checked) {
        var shiver = document.createElement('div');
        shiver.style.cssText = 'position:absolute;inset:0;pointer-events:none;' +
          'animation:gbaMagneticHumCardShake ' + dur(1.4) + ' ease-out ' + dur(0.2) + ' forwards;';
        stage.appendChild(shiver);
      }

      // 5. Layer 2: Dense Storm Haze Body (Both Active & Bench)
      if (document.getElementById('chk-haze').checked) {
        var haze = document.createElement('div');
        haze.style.cssText = 'position:absolute;border-radius:50%;pointer-events:none;z-index:32;' +
          'width:' + (isBench ? '140px' : '168px') + ';height:' + (isBench ? '110px' : '136px') + ';' +
          'animation:gbaBlizzardStormHaze ' + dur(1.7) + ' cubic-bezier(0.2, 0.9, 0.3, 1) forwards;' +
          'background:radial-gradient(ellipse, rgba(224,242,254,0.55) 0%, rgba(186,230,253,0.35) 45%, rgba(56,189,248,0.18) 70%, transparent 92%);';
        stage.appendChild(haze);
      }

      // 6. Layer 3: Howling Snowstorm Wind Stream (Active at z-34, Bench at z-25 as in BattleFXOverlay)
      if (document.getElementById('chk-wind').checked) {
        var wind = document.createElement('div');
        wind.style.cssText = 'position:absolute;pointer-events:none;z-index:' + (isBench ? '25' : '34') + ';' +
          'animation:gbaArticunoBlizzardVortex ' + dur(1.7) + ' cubic-bezier(0.2, 0.9, 0.3, 1) forwards;';
        var wScale = isBench ? 0.8 : 1.0;
        wind.innerHTML = \`
          <svg width="\${180 * wScale}" height="\${150 * wScale}" viewBox="0 0 180 150" style="overflow:visible; opacity:0.9;">
            <path d="M 170 15 C 130 35, 70 45, 10 95" fill="none" stroke="#e0f2fe" stroke-width="3.2" stroke-linecap="round" opacity="0.85" style="filter:drop-shadow(0 0 12px #38bdf8)" />
            <path d="M 180 40 C 130 65, 80 85, 20 135" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.8" style="filter:drop-shadow(0 0 8px #ffffff)" />
            <path d="M 160 65 C 110 95, 60 115, 5 150" fill="none" stroke="#7dd3fc" stroke-width="2.4" stroke-linecap="round" opacity="0.75" style="filter:drop-shadow(0 0 10px #7dd3fc)" />
            <path d="M 175 25 C 125 50, 75 65, 12 115" fill="none" stroke="#bae6fd" stroke-width="2.2" stroke-linecap="round" opacity="0.68" style="filter:drop-shadow(0 0 8px #bae6fd)" />
            <path d="M 150 78 C 100 102, 55 120, 10 145" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-linecap="round" opacity="0.6" />
          </svg>
        \`;
        stage.appendChild(wind);
      }

      // 7. Layer 4: Physically Realistic Ice Shards (8 Slicing Scatter Shards)
      if (document.getElementById('chk-shards').checked) {
        var scatterShards = [
          { ox: '58px', oy: '-46px', delay: 0.08, w: 8, h: 16, angle: '232deg' },
          { ox: '44px', oy: '-34px', delay: 0.18, w: 7, h: 15, angle: '228deg' },
          { ox: '-20px', oy: '-32px', delay: 0.26, w: 8, h: 17, angle: '225deg' },
          { ox: '50px', oy: '-18px', delay: 0.34, w: 7, h: 14, angle: '235deg' },
          { ox: '26px', oy: '-26px', delay: 0.42, w: 9, h: 18, angle: '230deg' },
          { ox: '-10px', oy: '-12px', delay: 0.50, w: 7, h: 15, angle: '226deg' },
          { ox: '38px', oy: '2px', delay: 0.58, w: 8, h: 16, angle: '233deg' },
          { ox: '8px', oy: '-8px', delay: 0.66, w: 7, h: 14, angle: '227deg' }
        ];

        scatterShards.forEach(function(sh, i) {
          var el = document.createElement('div');
          el.style.cssText = 'position:absolute;pointer-events:none;z-index:36;opacity:0;' +
            'animation:gbaBlizzardIceShard ' + dur(1.25) + ' cubic-bezier(0.18, 0.88, 0.32, 1) ' + dur(sh.delay) + ' forwards;' +
            '--shard-ox:' + sh.ox + ';--shard-oy:' + sh.oy + ';--shard-angle:' + sh.angle + ';';
          el.innerHTML = \`
            <svg width="\${sh.w}" height="\${sh.h}" viewBox="0 0 8 20" style="filter:drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 9px #0284c7)">
              <polygon points="4,0 7,6 5.5,20 2.5,20 1,6" fill="#f0f9ff" stroke="#0284c7" stroke-width="0.8" />
              <polygon points="4,1 6.5,6 5,17 4,19 4,1" fill="#ffffff" opacity="0.95" />
              <polygon points="4,1 4,19 3,17 1.5,6 4,1" fill="#7dd3fc" opacity="0.8" />
            </svg>
          \`;
          stage.appendChild(el);
        });

        // 8. Layer 4: Embed Shards (6 Penetrating Shards with Kinetic Impact Shudder)
        if (!whiff) {
          var embedShards = isBench ? [
            { ox: '44px', oy: '-36px', tx: '22px', ty: '-20px', delay: 0.14, w: 8, h: 17, angle: '232deg' },
            { ox: '-26px', oy: '-30px', tx: '-28px', ty: '-10px', delay: 0.24, w: 7, h: 15, angle: '226deg' },
            { ox: '36px', oy: '-12px', tx: '12px', ty: '10px', delay: 0.34, w: 8, h: 16, angle: '234deg' },
            { ox: '10px', oy: '-28px', tx: '-16px', ty: '24px', delay: 0.44, w: 7, h: 15, angle: '228deg' }
          ] : [
            { ox: '64px', oy: '-52px', tx: '32px', ty: '-28px', delay: 0.14, w: 9, h: 19, angle: '232deg' },
            { ox: '-36px', oy: '-42px', tx: '-38px', ty: '-16px', delay: 0.24, w: 8, h: 17, angle: '226deg' },
            { ox: '52px', oy: '-16px', tx: '18px', ty: '12px', delay: 0.34, w: 9, h: 18, angle: '234deg' },
            { ox: '12px', oy: '-38px', tx: '-22px', ty: '32px', delay: 0.44, w: 8, h: 17, angle: '228deg' },
            { ox: '40px', oy: '8px', tx: '26px', ty: '38px', delay: 0.54, w: 9, h: 19, angle: '230deg' },
            { ox: '-18px', oy: '-24px', tx: '-12px', ty: '-36px', delay: 0.62, w: 8, h: 16, angle: '225deg' }
          ];

          embedShards.forEach(function(es, i) {
            var el = document.createElement('div');
            el.style.cssText = 'position:absolute;pointer-events:none;z-index:36;opacity:0;' +
              'animation:gbaBlizzardIceShardEmbed ' + dur(1.2) + ' cubic-bezier(0.18, 0.88, 0.32, 1) ' + dur(es.delay) + ' forwards;' +
              '--shard-ox:' + es.ox + ';--shard-oy:' + es.oy + ';--shard-tx:' + es.tx + ';--shard-ty:' + es.ty + ';--shard-angle:' + es.angle + ';';
            el.innerHTML = \`
              <svg width="\${es.w}" height="\${es.h}" viewBox="0 0 8 20" style="filter:drop-shadow(0 0 7px #ffffff) drop-shadow(0 0 10px #0284c7)">
                <polygon points="4,0 7,6 5.5,20 2.5,20 1,6" fill="#f0f9ff" stroke="#0284c7" stroke-width="0.85" />
                <polygon points="4,1 6.5,6 5,17 4,19 4,1" fill="#ffffff" opacity="0.95" />
                <polygon points="4,1 4,19 3,17 1.5,6 4,1" fill="#7dd3fc" opacity="0.8" />
              </svg>
            \`;
            stage.appendChild(el);
          });
        }
      }

      // 9. Layer 5: Crystalline Snowflakes & Micro-snow (Active & Bench)
      if (document.getElementById('chk-snow').checked) {
        var flakes = whiff ? [
          { ox: '40px', oy: '-30px', delay: 0.15, size: 18 },
          { ox: '-30px', oy: '20px', delay: 0.35, size: 16 },
          { ox: '20px', oy: '-15px', delay: 0.55, size: 14 }
        ] : (isBench ? [
          { ox: '38px', oy: '-34px', delay: 0.10, size: 20 },
          { ox: '-30px', oy: '-22px', delay: 0.28, size: 18 },
          { ox: '12px', oy: '28px', delay: 0.42, size: 22 },
          { ox: '-38px', oy: '16px', delay: 0.55, size: 16 }
        ] : [
          { ox: '52px', oy: '-45px', delay: 0.10, size: 26 },
          { ox: '-40px', oy: '-28px', delay: 0.28, size: 22 },
          { ox: '15px', oy: '38px', delay: 0.42, size: 28 },
          { ox: '-50px', oy: '20px', delay: 0.55, size: 20 },
          { ox: '35px', oy: '-10px', delay: 0.70, size: 24 }
        ]);

        flakes.forEach(function(sn, i) {
          var el = document.createElement('div');
          el.style.cssText = 'position:absolute;pointer-events:none;z-index:38;opacity:0;' +
            'animation:gbaArticunoSnowflakeSpin ' + dur(1.4) + ' ease-out ' + dur(sn.delay) + ' forwards;' +
            '--s-ox:' + sn.ox + ';--s-oy:' + sn.oy + ';';
          el.innerHTML = \`
            <svg width="\${sn.size}" height="\${sn.size}" viewBox="0 0 24 24" style="filter:drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 6px #38bdf8)">
              <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
              <line x1="5" y1="5" x2="19" y2="19" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="12" r="2.8" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8" />
            </svg>
          \`;
          stage.appendChild(el);
        });
      }

      container.appendChild(stage);
    }

    function replayStage(stageId, whiff, slot) {
      var el = document.getElementById(stageId);
      if (!el) return;
      var overlays = el.querySelectorAll('.blizzard-overlay');
      overlays.forEach(function(o) { o.remove(); });
      void el.offsetWidth;
      renderBlizzardFX(el, { slot: slot, whiffed: whiff });
    }

    function replayAll() {
      replayStage('stage-hit', false, 'active');
      replayStage('stage-whiff', true, 'active');
      replayStage('stage-bench', false, 'bench');
      replayArena();
    }

    function replayArena() {
      replayStage('arena-active', false, 'active');
      replayStage('arena-bench-1', false, 'bench');
      replayStage('arena-bench-2', false, 'bench');
    }

    function updateVisibility() {
      replayAll();
    }

    // Initialize all boards
    window.addEventListener('DOMContentLoaded', function() {
      renderCardBackground(document.getElementById('stage-hit'), 'Charizard', '120', '#ea580c');
      renderCardBackground(document.getElementById('stage-whiff'), 'Charizard', '120', '#ea580c');
      renderCardBackground(document.getElementById('stage-bench'), 'Pikachu', '60', '#ca8a04');

      renderCardBackground(document.getElementById('arena-active'), 'Blastoise', '100', '#0284c7');
      renderCardBackground(document.getElementById('arena-bench-1'), 'Bulbasaur', '40', '#16a34a');
      renderCardBackground(document.getElementById('arena-bench-2'), 'Pidgey', '40', '#94a3b8');

      replayAll();
    });
  </script>
</body>
</html>
`;

  const outputPath = path.join(__dirname, '../public/preview_blizzard.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf-8');
  console.log('Successfully written to:', outputPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
