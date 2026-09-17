# Pokémon TCG 1999: Animation & Visual FX Design System (Master Blueprint)

This document is the permanent, canonical design standard for all move animations, combat visual effects, and particle systems in the Pokémon TCG 1999 demo application.

---

## 1. Visual Aesthetics & Art Direction

### A. Fusion of GBA Nostalgia & 60fps Fluidity
- **Inspiration:** *Pokémon Trading Card Game 2 (GBC)* and the mainline *GBA Era (Ruby/Sapphire/FireRed)*.
- **Modern Execution:** The geometry, retro color vibrancy, and rhythmic snap of the retro era rendered with silky 60fps hardware-accelerated CSS keyframes, cubic-bezier timing curves, and layered SVGs.

### B. Absolute Purge of Mobile Emojis
- **Zero Emojis Allowed:** Modern emojis (`⚡`, `🍃`, `💨`, `📍`, `🦅`, `⚔️`, `🕸️`, `🔥`, `❄️`, `🌿`, `💥`, `♪`) are strictly banned from combat overlays.
- All iconography must be custom, retro-styled, resolution-independent SVGs with drop-shadows, gradients, and proper stroke styling.

### C. Rejection of Flat Primaries (Layered Incandescence)
- Never use flat primary colors (`#ff0000`, `#ffff00`, `#0000ff`).
- Every element must feature a chromatic temperature hierarchy from white-hot core to outer dissipating halo:
  - **Fire / Explosions:** Incandescent Core (`#ffffff`) $\rightarrow$ Lemon Glow (`#fef08a`) $\rightarrow$ Warm Amber (`#f97316`) $\rightarrow$ Volcanic Crimson/Charcoal (`#dc2626` / `#7f1d1d`).
  - **Water / Ice:** Glacial White (`#ffffff`) $\rightarrow$ Crisp Frost (`#cffafe`) $\rightarrow$ Electric Cyan (`#38bdf8`) $\rightarrow$ Deep Oceanic Sapphire (`#0284c7`).
  - **Psychic:** Tachyon Center (`#ffffff`) $\rightarrow$ Mauve Mist (`#f3e8ff`) $\rightarrow$ Vibrant Violet (`#a855f7`) $\rightarrow$ Abyssal Dusk (`#581c87`).
  - **Electric:** Superconductive White $\rightarrow$ High-Voltage Neon Yellow (`#facc15`) $\rightarrow$ Amber Spark (`#fbbf24`).

### D. Fluid Atmospheric FX vs. Rigid Blocks (Akışkan Duman İlkesi)
- Gas, mist, smoke, and ink clouds must NEVER be animated using rigid whole-body `rotate(...)` transforms (which visually turns them into spinning square cardboard cutouts).
- Clouds must expand organically via multi-lobed SVG Bézier paths (`d="M..."`), internal hydrodynamic flow swirls, chromatic density layering (e.g. zifiri abyssal ink core `#020617` $\rightarrow$ translucent charcoal rim `#334155`), and independent floating dissipation motes.

### E. Thematic Form & Chromatic Integrity (Organik Doku vs. Kristal/Metal İllüzyonu)
- **Kavramsal Uyumsuzluk Yasağı:** Ateş, ruh, hayalet veya psişik kökenli saldırılarda (Kitsunebi / Confuse Ray, Will-O-Wisp, Night Shade vb.) sivri, köşeli geometrik çokgenler (elmas, prizmatik baklava, keskin kristal parçaları) ve soluk gri/beyaz/açık mavi gradyanlar kullanılması KESİNLİKLE YASAKTIR. Bu hatalı yaklaşım, alev/ruh yerine "fırıldak gibi dönen metalik/gümüş kristal parçaları" veya "buz kütleleri" illüzyonu yaratarak saldırının tematik kimliğini zedeler.
- **Organik Bézier Geometrisi:** Yaşayan veya mistik alev dilleri, iç içe geçen çok kavisli akışkan damla ve alev yollarıyla (`<path d="M... C... Z">`) çizilmelidir.
- **Kromatik Sıcaklık & Mistisizm:** Mistik alevler (Kitsune fox-fire gibi) akkor limon çekirdekten (`#fef08a`), sıcak kehribar orta gövdeye (`#f97316`) ve dış çeperde mistik fujya/mor ebruli haleye (`#ec4899` $\rightarrow$ `#9333ea`) uzanan çok katmanlı spektral bir ışıma taşımalıdır. Metalik/gümüş ve soğuk buz mavisi renk paletleri yalnızca Steel, Ice veya Rock tipi saldırılara (Metal Claw, Ice Shard, Reflect vb.) mahsustur.

### F. Visual Fidelity & Kinetic Polish (Çizgi Gürültüsü & Çalakalem Karalama Yasağı)
- **Görsel Gürültü Yasağı:** Kesme, pençe, kanat çırpış veya fiziksel darbe efektlerinde (Slash, Scratch, Wing Attack vb.); rastgele yönlere savrulan orantısız düz çizgiler, fırça pislikleri veya çalakalem karalamayı andıran görsel gürültüler KESİNLİKLE YASAKTIR.
- **Kinematik Keskinlik ve Ağırlık:** Her darbe ve kesik; temiz, keskin ve dinamik Bézier yayları (`strokeLinecap="round"`, incelen uçlar), merkezden dışa patlayan akkor enerji parlamaları ve fiziksel bir ağırlık/keskinlik hissi veren yönlü hız çizgileriyle (motion arcs) inşa edilmelidir. Referans alınan başarılı animasyonların (örneğin mevcut Slash efektinin) sunduğu dinamik ritim, estetik ve görsel tatmin seviyesinin altına asla düşülemez; kolaya kaçılmadan sinematik derinlik ön planda tutulmalıdır.

---

## 2. Motion Dynamics & Kinematics (The Anti-Idle Engine)

### A. The "Anti-Idle" Rule (Continuous Momentum)
- **Core Law:** No visible element may freeze or hang motionless mid-air for more than **15% of its total animation duration**.
- Every asset must maintain continuous physical momentum: deceleration, elastic squash & stretch, shudder tension, recoil bounce, or dissipation drifting.

### B. 3-Phase Impact Choreography
1. **0.0s – 0.25s (Anticipation / Approach):**
   - Velocity blur-in (`blur(4px)`), coil-up tension, parabolic arcing approach, or converging energy motes.
2. **0.25s – 0.45s (Impact Apex):**
   - Elastic deformation (`scale(1.15, 0.85)`), card tremor/shudder, crossing flash burst, 8-point geometric starburst pop, and primary shockwave expansion.
3. **0.45s – 1.0s+ (Recoil & Dissipation):**
   - Physical bounce/recoil, flying cavitation droplets, ice shards, drifting embers, and smooth cubic-bezier opacity fade-out.

### C. Anatomical Orientation & Ballistic Trajectory (Doğal Hedefleme İlkesi)
- Visual assets must be positioned and oriented so that their natural anatomical gaze, muzzle, or projectile origin directly aims toward the center of the opponent's card.
- **Rule of Thumb:** If an asset naturally faces left-downward (e.g. Horsea's snout), place it in the upper-right corner so its breath sweeps down-left across the target card. Never place an asset where its anatomy points into empty void or shoots backwards.
- **Expulsion Recoil:** Projectile attacks (water jets, ink streams, blasts) must feature an anticipation lean toward the target followed by a snappy recoil in the opposite direction of the shot.

### D. Exemplary Fluid Dynamics & Jet Options (Akışkan Jet & Atmosferik Salınım Seçenekleri)
*Bu teknikler; Water Gun, Hydro Pump, Acid, Dragon Breath gibi yönlü sıvı veya enerji akıntılarında "katı blok kayması" yerine viskozite ve akışkanlık yaratmak istendiğinde başvurulabilecek zenginleştirici yöntem seçenekleridir:*

1. **İlerleyen Maske ile Akıntı Açılımı (Progressive Reveal via Clip-Path Option):**
   - **Prensip:** Akıntı nesnesini bir görsel blok gibi A'dan B'ye kaydırmak yerine; akıntının Bézier yolunu baştan çizip bir `<clipPath>` maskesi (`scaleX(0)` → `scaleX(1)`) ile kaynaktan hedefe doğru fışkırarak açmak.
   - **İç Akış Kayması (Internal Fluid Shear via Stroke-Dashoffset):** Maske açılırken, sütunun içindeki köpük kenarları ve beyaz çekirdek çizgilerinin `strokeDasharray` ve negatif `stroke-dashoffset` döngüleriyle akıntı yönünde bağımsız hızlarda kaydırılması. Bu, akıntının kendi içinde aktığı hissini verir.
2. **Yol Takip Eden Kavitasyon Ucu (Spline Tracking via `<animateMotion>` Option):**
   - **Prensip:** Jetin en ucundaki hava kabarcığı, enerji ucu veya mermi çekirdeği; düz bir çizgi yerine akıntının tam Bézier eğrisini (`path={...}`) takip eden bir SVG `<animateMotion calcMode="spline">` ile yürütülebilir.
3. **Parabolik Yerçekimli Sıçrama (Parabolic Ballistic Droplets Option):**
   - **Prensip:** Çarpma anında fırlayan damlalar veya moloz parçaları, sadece radyal düz çizgilerle saçılmak yerine; yerçekimi parabolü içeren keyframe'lerle (önce `-Y` ekseninde havaya fırlama, ardından tepe noktasından `+Y` ekseninde yere dökülme) balistik bir yay çizebilir.
4. **Asal Frekanslı Atmosferik Salınım (Incommensurate Frequency Aurora Veils Option):**
   - **Prensip:** Confuse Ray, Mist, Aurora gibi tül/perde formundaki atmosferik katmanlarda; perdelerin salınım süreleri birbirinin tam katı olmayan farklı frekanslara (örneğin `1.25s`, `1.05s`, `1.45s`, `0.9s`) ayarlanabilir. Bu, mekanik senkron tekrarı kırarak doğal, yaşayan bir kutup ışığı dalgalanması sağlar.

### E. Multi-Satellite Organic Dissociation (Bağımsız Yörünge vs. Katı Blok Tekerlek Yasağı)
- **Katı Blok Tekerlek / Carousel Yasağı:** Bir kartın veya hedefin etrafında dönen çoklu uydular (Alev topları/Wisps, Ruh Küreleri, Bariyer Parçaları, Sporlar, Dönen Koruyucular); ASLA tek bir ortak ebeveyn (`<div>`) içerisine konulup tüm kapsayıcıya `transform: rotate(360deg)` verilerek döndürülemez.
  - *Neden:* Bu teknik, ögelerin sanki bir tekerleğe veya bisiklet jantına kaynaklanmış metal çubuklar gibi mekanik, donuk ve yapay biçimde tek bir blok halinde dönmesine yol açar; oyunun sinematik derinliğini ve organik dinamizmini yok eder.
- **Bağımsız DOM Aktörleri ve Asimetrik Fazlar:** Her uydu ögesi DOM ağacında tamamen bağımsız bir katman olmalı ve kendine ait özel bir `@keyframes` yörüngesine sahip olmalıdır:
  1. **Ayrık / Asimetrik Başlangıç Gecikmeleri (Phase Offsetting):** Uydular aynı anda aynı açıda bulunamaz; aralarında periyodik olmayan faz gecikmeleri (`0s`, `0.12s`, `0.22s` vb.) bulunmalıdır.
  2. **Organik Lissajous / Eliptik Süzülme (Non-Circular Orbit):** Yörüngeler kusursuz bir pergel dairesi yerine eliptik (`rx !== ry`), eğik açılı veya Lissajous (sonsuzluk/sekiz işareti benzeri) eksen kaymalarıyla (`translate(X, Y) scale(...)`) hedefin etrafında derinlik ve perspektif kazanmalıdır.
  3. **Lokal Mikro-Salınım (Individual Micro-Flicker):** Yörüngede dönerken her alev/küre kendi içinde bağımsız hafif bir titreme, genleşme veya nefes alma animasyonuna (`scale(0.92)` $\leftrightarrow$ `scale(1.08)`) sahip olmalıdır.

### F. Stock Asset Kinematic Cohesion (Stok Görsel Merkezli Bütünsel Kinetik İlkesi)
- **Pasif Çıkartma Yasağı:** Ken Sugimori suluboya stok görseli içeren bir saldırıda (Growlithe, Vulpix, Horsea, Pikachu vb.), görsel asla eski/jenerik bir SVG efektinin üzerine sonradan iliştirilmiş "hareketsiz bir çıkartma/etiket" gibi konumlandırılamaz.
- **Kinetik ve Anatomik Merkez Üssü:** Stok görsel, saldırının hem anatomik hem de kinetik odak noktasıdır:
  1. **Anatomik Kilitlenme:** Ağızdan çıkan alev jeti, burundan püsküren mürekkep veya kuyruktan savrulan kırbaç; stok görselin kafa/ağız/uzuv koordinatlarına pikseli pikseline kenetlenmelidir.
  2. **Fiziksel Kinetik Katılım (Squash & Recoil):** Karakter görseli efekt boyunca donuk kalamaz; atılma (lunge), yaylanma (compression) ve atış anında geri tepme (recoil) fiziksel hareketlerini bizzat yaşamalıdır.
  3. **Bütünsel Efekt Revizyonu:** Yeni bir stok görsel entegre edildiğinde, etrafındaki yardımcı efekt katmanları (namlu parlaması, rüzgâr çizgileri, zemin kavrulması, darbe patlaması) stok görselin getirdiği yeni kütle, boyut ve açı hiyerarşisine göre tepeden tırnağa yeniden kalibre edilmelidir.

---

## 3. Scale, Proportion & Whiff Standards

### A. Two-Tier Scaling Hierarchy (Vücut/Silah vs. Organ/Kafa Boyutlandırması)
- **Tier 1 — Major Weapons, Full Bodies & Apex Monsters (~68.1% Rule):**
  - Standard Scale: **~68.1% of card width** (`~108px – 120px`).
  - Target Solid Mass: **~4,500 – 5,500 px²** of rendered non-transparent pixels.
  - Whiffed Scale: **~54.5% of card width** (`~78px – 84px`).
  - Examples: Gyarados dragon head (`108x108`, ~4,914 px²), Scyther scythe blade (`108x76`, ~2,092 px²), Eevee sprint, Rattata tackle, Machamp chop.
- **Tier 2 — Basic Pokémon Heads, Snouts & Small Bio-Organs (~45%–50% Effective Width):**
  - Standard Scale: **~45% – 50% of card width** (Effective rendered width: `~76px – 84px`).
  - Target Solid Mass: **~2,000 – 2,800 px²** of rendered non-transparent pixels.
  - Whiffed Scale: **~35% – 38% of card width** (`~58px – 64px`).
  - Examples: Horsea snout (`80x64`, ~2,613 px²), Weedle poison stinger (`110x110` box, but slender 45° diagonal with only 18.4% fill $\rightarrow$ ~2,227 px² solid mass), Bulbasaur seed pod (`98x98` box, vertical 1:1.74 aspect ratio $\rightarrow$ renders at `56x98`, ~2,476 px²), Charmander tail flame (`110x110` box $\rightarrow$ renders at `53x110`, ~2,819 px²).
  - **Comparative Rule:** A basic/small Pokémon's head or organ must NEVER overpower or exceed an apex monster in solid visual mass (e.g., Horsea's head at 5,302 px² was larger than Gyarados at 4,914 px², which caused visual imbalance; corrected to 2,613 px²).

### B. Visual Mass & Silhouette Density Principle (Görsel Kütle Prensibi)
- **CSS Box Dimensions Can Be Deceptive:** Never judge an asset purely by naive CSS container classes (`w-[110px]`).
- **Aspect Ratio & `object-contain`:** A tall, slender vertical image (e.g., Bulbasaur seed, Charmander flame) inside a `110x110` box only renders at ~53px–56px wide, occupying only ~33% of card width, NOT 68%.
- **Diagonal & Slender Silhouettes:** A diagonal stinger or bone club (e.g., Weedle, Cubone) has 80%–85% transparent empty space in its square bounding box. Its actual solid visual surface area is sleek and light (~2,200 px²).
- **Human-in-the-Loop Sovereign Truth:** When the user confirms an asset looks visually balanced, natural, and satisfying on screen (as with Weedle), that visual presence is canonized as the permanent golden standard and must NEVER be altered based on automated scripts.

### C. Whiffed / Blocked Scale Dynamics
- When an attack misses, fails, or is blocked by protection (`fx.whiffed === true`):
  - Scale shrinks to Tier-appropriate whiffed dimensions.
  - Secondary impact bursts, ground shockwaves, and violent card shudders are suppressed.
  - The attack dissipates weakly into a sputtering wisp or dull puff of smoke.

### D. Strict Bounding-Box Cropping
- Raw art canvases must never have transparent margins left in production.
- All assets must be cropped tightly to their visible content boundary (+ 8–16px safe margin) before deployment, ensuring that CSS container dimensions translate directly and predictably into intended on-screen pixel proportions.

### E. Exemplary Whiff & Intensity Modeling (İleri Düzey Whiff & Intensity Şablonu)
*Enerjiye bağlı güçlenen veya isabetsiz giden mermi/jet tipi saldırılarda referans alınabilecek örnek bir matematiksel modelleme varyasyonudur:*

1. **Kütlesel ve Geometrik Intensity Ölçeklemesi:**
   - Şiddet katsayısı (`wi = Math.max(1, fx.intensity ?? 1)`) sadece ana kapsayıcıyı büyütmekle kalmayıp; iç akıntı kalınlıklarına (`strokeWidth={8 * wi}`), dinamik ışıma yarıçapına (`drop-shadow(...)`) ve çarpma sıçramasının saçılma menziline orantılı olarak dağıtılabilir.
2. **Fiziksel Whiff (Menzil Yetmezliği & Hedefe Ulaşamama - Short-Fall Model):**
   - Iskalayan veya engellenen saldırılarda yalnızca opaklığı kısmak yerine bir seçenek olarak:
     - Maske açılımının yarıda kesilmesi (örneğin `%58`'de durması),
     - Kavitasyon ucunun yolun `%60`'ında enerjisini tüketip sönmesi,
     - Akıntının yerçekimiyle aşağıya meylederek düşmesi,
     - Hedef karttaki çarpma patlaması ve zemin halkalarının koşullu olarak tamamen bastırılması (`!fx.whiffed`).

---

## 4. The 5-Layer FX Architectural Template

Every attack overlay component in `BattleFXOverlay.tsx` follows this structured layer stack:

```
[LAYER 5] Ambient Dissipating Particles (Floating embers, Zzz runes, thought dots, sparks)
[LAYER 4] Secondary Scatter & Cavitation (Water droplets, ice shards, dust rocks, steam plumes)
[LAYER 3] Impact Flash & Shockwaves (Starburst pop, slash cross-flash, concentric rings)
[LAYER 2] Primary Visual Actor (Ken Sugimori stock asset OR multi-path Bézier SVG)
[LAYER 1] Ambient Card Floor / Atmosphere (Radial thermal aura, psychic fog, scorch rune, lens streak)
```

---

## 5. Collaboration & Decision Protocols

1. **Asset Creation & Decopage Protocol:**
   - The assistant does NOT autonomously generate new character art or attempt automated background removals.
   - The user creates raw artwork and executes background transparency/refinements in the `public/assets/raw/` directory.
   - The assistant's role is strictly cropping already-approved transparent PNGs, bounding-box optimization, and CSS/TypeScript animation integration.
2. **The "Bubblebeam Lesson" (Preservation of Working Excellence):**
   - Automated regex scripts (`r > 12`, `no blur keyword`) produce massive false positives and must NEVER be trusted blindly.
   - Any animation that is already functional, rich, and enjoyed by the user (e.g. Gyarados *Bubblebeam*, Raticate *Super Fang*, Ninetales *Fire Blast*, Ice Beam) is strictly protected from unwanted rewrites.
3. **Lore & Character Fidelity:**
   - Moves must fit the physical anatomy and canonical personality of the Pokémon. Dratini does not punch with gloves (it uses a serpentine tail whip); Ninetales does not sing Jigglypuff lullabies (it casts mystical kitsune fox-fire).
4. **Strict Codebase Verification Protocol (Kod Teyidi ve Varlık Denetim Protokolü):**
   - Bir Pokémon'un, saldırı animasyonunun veya görsel varlığın mevcut durumunu analiz ederken veya raporlarken; ASLA naif regex aramalarına veya geçici terminal script özetlerine körü körüne güvenilerek varsayımda bulunulamaz.
   - Herhangi bir varlığın (`.png`/`.svg`) veya saldırının kodda aktif olup olmadığı, istisnasız olarak doğrudan `BattleFXOverlay.tsx` içindeki gerçek JSX satır numaraları (`<img src="..." />` ve `fx.type === ...`) ve `cards.json` eşleşmeleri okunarak KESİNLEŞTİRİLMELİDİR.
   - Depoda zaten mevcut ve 5 katmanlı mimaride çalışan bir varlık için kod teyidi yapılmadan "eksik", "yapılacak" veya "stok görsel adayı" şeklinde yanıltıcı iddialarda bulunulması KESİNLİKLE YASAKTIR. Her analiz doğrudan kod referansıyla belgelenmelidir.

---

## 6. Technical Constraints & UI Integrity

1. **Duration Synchronization Rule (`getFXDuration`):**
   - The millisecond value returned by `getFXDuration(fxType)` in `BattleFXOverlay.tsx` must strictly match (or slightly exceed by +50–100ms) the longest active CSS keyframe animation duration (including start delays).
   - Never allow `SingleFX` to unmount while particle dissipations or cloud plumes are still resolving.
2. **Card Boundary Containment & Anti-Bleed Protocol (Kart Çerçevesi İçi Kırpma & Taşma Önleme):**
   - **Hedef Kart Çerçeve Bütünlüğü:** Belirli bir karta odaklanan tüm vuruş, alev püskürtme, patlama, şok dalgası ve zemin aurası efektleri; mutlaka hedef kart konteynerinin fiziksel sınırları içinde hapsedilmelidir (`.card-fx-block-overlay rounded-xl overflow-hidden pointer-events-none`).
   - **Görsel Taşma (Bleeding) Yasağı:**
     - Efektin radyal patlamaları, genişleyen şok halkaları veya alev jetleri kart çerçevesinin dışına taşarak yanındaki bench kartlarının, oyuncu deste/enerji alanlarının veya arena zemin panellerinin üzerine kontrolsüzce taşamaz.
     - Keyframe scale dönüşümleri (`scale(1.2)` vb.) ile SVG taban genişliğinin çarpımı, kartın fiziksel boyutlarını (`~140px – 165px`) aşmayacak şekilde oranlanmalıdır.
     - Ekranı kaplayan özel deprem/fırtına gibi global tahta saldırıları (Earthquake vb.) hariç, tek hedefli saldırılarda "kart dışı sızıntı" görsel bir kusur olarak kabul edilir.
   - **Z-Index & Okunabilirlik Hiyerarşisi:**
     - Hasar sayaçları, durum efekt rozetleri (Poison, Asleep, Paralyzed) ve HP göstergeleri her zaman en üstte (`z-50`) net ve okunabilir kalmalıdır.
     - FX overlay katmanları kesin olarak `z-10` (zemin aurası/yanık izi) ile `z-40` (çarpma patlaması/ön plandaki aktör) arasında katmanlanmalıdır.
3. **Multi-Target & Bench Slot Awareness:**
   - Special moves (e.g., Gengar *Dark Mind*, Ninetales *Lure*, Arbok *Stare*) can target either the Active card or a Bench slot (`slot === 'bench'`, `benchIndex`).
   - Coordinate logic must gracefully support bench transposition without visual clipping.
