# Pokémon TCG 1999: Animation & Visual FX Design System (Master Blueprint)

This document is the permanent, canonical design standard for all move animations, combat visual effects, and particle systems in the Pokémon TCG 1999 demo application.

### Core Operational Philosophy: Two Pillars
1. **Non-Negotiable Invariants (Kırmızı Çizgiler):** Teknik stabilite, süre senkronizasyonu (`getFXDuration`), kart çerçevesi bütünlüğü (anti-bleed), whiff bastırması ve emoji yasağı gibi kurallar katıdır; ödün verilemez.
2. **Modular Creative Toolset (Tasarım Alet Çantası):** Çoklu katmanlar, uydu hareketleri, jet akıntıları ve stok aktörler her saldırıya körü körüne zorlanacak kalıplar değil; saldırının doğasına (fiziksel vuruş, doğa olayı, mistik psişik büyü vb.) göre raftan seçilecek modüler zenginleştirme araçlarıdır.

---

## 1. Visual Aesthetics & Art Direction

### A. Classic 1996–1999 Aesthetic Heritage & 60fps Fluidity
- **Artistic Lineage:** Orijinal 1996–1999 Base Set / Jungle / Fossil kartlarının efsanevi sanatçı ekolleri referans alınır:
  - **Ken Sugimori:** Otantik suluboya ebrulisi, temiz mürekkep hatları, organik gölgelendirmeler.
  - **Mitsuhiro Arita:** Viseral fiziksel darbe dinamizmi, dramatik ışık-gölge kontrastı ve sinematik parlama.
  - **Kagemaru Himeno:** Doğal zengin dokular, yumuşak atmosferik zerreler ve lirik mistisizm.
  - **Keiji Kinebuchi:** Erken dönem 3D/CGI enerji küreleri, retro geometrik prizmalar ve net optik ışımalar.
- **Craftsmanship & Kinetic Polish:** Bu klasik miras; modern 60fps donanım hızlandırmalı CSS keyframe'leri, pürüzsüz dinamikler ve çok katmanlı SVG'lerle harmanlanır. Kolaya kaçan, kabataslak, çalakalem veya bitmemiş hissettiren çocuksu çizimler kesinlikle reddedilir; her efekt oyuncuyu büyüleyen doğal, özenli ve görsel tatmin sunan bir derinlikle inşa edilmelidir.

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
  - **Physical Impact / Punch (Comet Punch, Mega Punch, Double Slap):** Incandescent Flash Core (`#ffffff`) $\rightarrow$ Citrine Burst (`#fde68a`) $\rightarrow$ Warm Impact Amber (`#f59e0b`) $\rightarrow$ Dissipating Dust Umber (`#a8a29e` / `#78716c`). Fiziksel vuruşlarda kromatik sıcaklık, çarpma anında akkor beyazdan başlayarak dışa doğru toz-toprak tonlarına sönümlenir; bu, ateş veya elektrik saldırılarındaki spektral ışımadan farklı olarak **kinetik enerjinin mekanik ısıya ve partikül saçılımına dönüşümünü** anlatır.

### D. Fluid Atmospheric FX vs. Rigid Blocks (Akışkan Duman İlkesi)
- Gas, mist, smoke, and ink clouds must NEVER be animated using rigid whole-body `rotate(...)` transforms (which visually turns them into spinning square cardboard cutouts).
- Clouds must expand organically via multi-lobed SVG Bézier paths (`d="M..."`), internal hydrodynamic flow swirls, chromatic density layering (e.g. zifiri abyssal ink core `#020617` $\rightarrow$ translucent charcoal rim `#334155`), and independent floating dissipation motes.
- **Impact FX Genelleştirmesi (Kangaskhan Comet Punch Dersi):** Bu ilke yalnızca gaz/duman bulutlarıyla sınırlı değildir. Fiziksel darbe efektlerinin **tüm Layer 3 alt bileşenleri** — şok halkaları (ring), yıldız patlamaları (starburst), toz bulutları (dust) — düz CSS primitiflerinden (`div border-radius`, `clip-path polygon`, basit `ellipse`) organik SVG geometrisine terfi ettirilmelidir:
  - **Ring:** Tek bir `border` çemberi yerine, farklı `stroke-width`, `opacity` ve hafif `scale` offset'lerine sahip 2–3 eşmerkezli SVG elipsi (`<ellipse>`) kullanılmalıdır. Bu, şok dalgasının "tek bir çizgi" değil, **kalınlığı ve derinliği olan bir enerji cephesi** olarak okunmasını sağlar.
  - **Starburst:** 5 noktalı düz `polygon` yerine, 10–12 noktalı ve kromatik hiyerarşiye sahip (beyaz merkez $\rightarrow$ limon orta $\rightarrow$ amber uç) incandescent starburst `<polygon>` veya `<path>` kullanılmalıdır. Her noktanın uzunluğu hafifçe farklılaştırılarak mekanik simetri kırılır ve organik bir parlama hissi elde edilir.
  - **Dust:** Düz `border-radius: 50%` elipsler yerine, çok loblu kuadratik Bézier `Q`-path'leriyle (`d="M... Q... Q... Z"`) çizilen organik bulut formları kullanılmalıdır. Her lob farklı yarıçap ve açıyla konumlandırılarak "kes-yapıştır elips" hissinden uzaklaşılır.

### E. Thematic Form & Chromatic Integrity (Organik Doku vs. Kristal/Metal İllüzyonu)
- **Kavramsal Uyumsuzluk Yasağı:** Ateş, ruh, hayalet veya psişik kökenli saldırılarda (Kitsunebi / Confuse Ray, Will-O-Wisp, Night Shade vb.) sivri, köşeli geometrik çokgenler (elmas, prizmatik baklava, keskin kristal parçaları) ve soluk gri/beyaz/açık mavi gradyanlar kullanılması KESİNLİKLE YASAKTIR. Bu hatalı yaklaşım, alev/ruh yerine "fırıldak gibi dönen metalik/gümüş kristal parçaları" veya "buz kütleleri" illüzyonu yaratarak saldırının tematik kimliğini zedeler.
- **Organik Bézier Geometrisi:** Yaşayan veya mistik alev dilleri, iç içe geçen çok kavisli akışkan damla ve alev yollarıyla (`<path d="M... C... Z">`) çizilmelidir.
- **Kromatik Sıcaklık & Mistisizm:** Mistik alevler (Kitsune fox-fire gibi) akkor limon çekirdekten (`#fef08a`), sıcak kehribar orta gövdeye (`#f97316`) ve dış çeperde mistik fujya/mor ebruli haleye (`#ec4899` $\rightarrow$ `#9333ea`) uzanan çok katmanlı spektral bir ışıma taşımalıdır. Metalik/gümüş ve soğuk buz mavisi renk paletleri yalnızca Steel, Ice veya Rock tipi saldırılara (Metal Claw, Ice Shard, Reflect vb.) mahsustur.
- **Kromatik Zemin Ayrışması & Kenar Işıması (Ground Separation & Rim Highlighting):** Dinamik parçacıklar veya uydular, arkalarındaki atmosferik zemin sisiyle (örn. mor psişik sis) aynı renk ailesine gömülemez; zeminle kontrast oluşturan akkor spektrumda (`#ffffff` $\rightarrow$ `#fef08a` $\rightarrow$ `#facc15` $\rightarrow$ `#f97316`) parlamalıdır. Arkadaki blur veya sisten sıyrılıp silikleşmeyi önlemek için parçacıklar mutlaka ince, keskin bir beyaz dış kenar konturu (`stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.85"`) taşımalıdır.

### F. Visual Fidelity & Kinetic Polish (Çizgi Gürültüsü & Çalakalem Karalama Yasağı)
- **Görsel Gürültü Yasağı:** Kesme, pençe, kanat çırpış veya fiziksel darbe efektlerinde (Slash, Scratch, Wing Attack vb.); rastgele yönlere savrulan orantısız düz çizgiler, fırça pislikleri veya çalakalem karalamayı andıran görsel gürültüler KESİNLİKLE YASAKTIR.
- **Kinematik Keskinlik ve Ağırlık:** Her darbe ve kesik; temiz, keskin ve dinamik Bézier yayları (`strokeLinecap="round"`, incelen uçlar), merkezden dışa patlayan akkor enerji parlamaları ve fiziksel bir ağırlık/keskinlik hissi veren yönlü hız çizgileriyle (motion arcs) inşa edilmelidir. Referans alınan başarılı animasyonların (örneğin mevcut Slash efektinin) sunduğu dinamik ritim, estetik ve görsel tatmin seviyesinin altına asla düşülemez; kolaya kaçılmadan sinematik derinlik ön planda tutulmalıdır.

### G. Feathered Equine Hair & Fur Texture vs. Monolithic Block Polygon (Tüylü/Yeleli Kuyruk İlkesi)
- **Monolitik Poligon Yasağı:** Kuyruk, yele, tüy veya kürk gibi lifli ve organik yapıları temsil eden aktörler; asla tek parça, sivri uçlu, küt ve kalın bir kapalı çokgen bloğu (`<path d="M... Z">`) olarak modellenemez. Bu ilkel yaklaşım, yaşayan bir at kuyruğu veya alev yelesi yerine "kesilmiş tahta parçası", "sert karton maket" veya "plastik blok" hissi verir.
- **Tüylü/Lifli Anatomik Mimari (Feathered Tresses Hierarchy):**
  1. **Kök Tabanı (Tail Dock Root):** Saç ve liflerin çıktığı anatomik omurga kökü (Ponyta için ince krem-şeftali deri boğumu `#fef3c7`).
  2. **Yelpaze Saç Tutamları (Fanning Lock Strands):** Kuyruk tek parça kalmaz; yukarı kıvrılan kabarık sırt yelesi (dorsal crest), alt dökümlü saç tutamı (ventral flowing lock) ve ana S-kavisli gövde lülesi olmak üzere en az 3–4 bağımsız tüy dalgasına ayrışır.
  3. **Çatallanan İnce Uç Telleri (Staggered Whispy Tips):** Kuyruğun bittiği uç kısım küt bir burun veya tek bir üçgen yerine; boyları birbirinden farklı, fırça gibi çatallanan ve kademeli sönümlenen ince ipliksi alev/saç telleriyle (`strokeWidth="0.6–0.7"`) sonlanır.
  4. **İç Doku Çizgileri (Hair Filament Strands):** Gövdenin üzerinden geçen ve liflerin akış yönünü vurgulayan ince kıl/tüy çizgileri (`strokeLinecap="round"` filamentler) ile akkor omurga hattı (`url(#pnySpineGrad)`).
  5. **Asal Fazlı Bağımsız Dalgalanma (Phase-Shifted Flame Lick Waving):** Tutamlar birbirinden bağımsız CSS skew ve ölçek mikro-dalgalanmalarına (`@keyframes gbaFlameLickWave1`, `gbaFlameLickWave2`) sahip olmalı, kuyruk tek parça bir tahta gibi değil saç liflerinin rüzgârda dalgalanması gibi canlı ve organik salınmalıdır.

### H. Card Illustration Color Fidelity & Palette Authenticity (Kart İllüstrasyonuna Sadık Renk Paleti)
- **Rastgele Jenerik Renk Yasağı:** Bir Pokémon'un anatomik uzvunu, derisini veya postunu betimleyen SVG aktörlerinde; jenerik hardal sarısı (`#ca8a04`), çamur kahverengisi (`#854d0e`) veya rastgele ara tonlar kullanılamaz.
- **Kart İllüstrasyonu Eşleşmesi (Canonical Card Match):** Renkler doğrudan Pokémon'un orijinal Base Set / Jungle / Fossil kartındaki Ken Sugimori illüstrasyonundan örneklenmelidir:
  - **Ponyta / Rapidash Derisi:** Yumuşak vanilya/fildişi taban (`#fffdf0` $\rightarrow$ `#fef3c7`), sıcak şeftali/amber gölgelendirme derinliği (`#fed7aa`), ve sıcak kehribar kontur (`#b45309`). Asla çiğ limon sarısı veya donuk hardal sarısı kullanılamaz.
  - **Tırnak, Nal ve Taban Dokuları (Hooves & Sole):** Derin obsidyen/grafit gri taban (`#0f172a` / `#1e293b`), dövme çelik/demir nal tonları (`#cbd5e1` $\rightarrow$ `#475569`).
  - **Ateş / Yele Gradyanı:** Akkor beyaz çekirdek $\rightarrow$ parlak limon sarısı (`#fef08a`) $\rightarrow$ sıcak turuncu (`#f97316`) $\rightarrow$ volkanik kırmızı (`#dc2626`).

### I. Gaseous & Ectoplasmic Plume Purity (Gaz, Duman ve Ruhsal Ektoplazma Saflığı)
- **Çocuksu Karikatür & Emoji Yüz Yasağı:** Sis, gaz, duman veya ektoplazmik döküntü efektlerinde (örneğin Gastly *Sleeping Gas*, Koffing *Poison Gas*, Weezing *Smog*); gaz bulutunun ortasına iliştirilmiş yapay karikatür gözler, çizgi film ağızları veya emoji benzeri yüz ögeleri KESİNLİKLE YASAKTIR.
  - *Neden:* Bu ögeler oyunun estetik çıtasını düşürür, dövüşün ciddiyetini bozar ve otantik atmosferi ucuz bir çizgi filme dönüştürür.
- **Akışkanlar Dinamiği ve Girdap Yapısı (Pure Fluid Dynamics):**
  - Gaz bulutları, çok loblu Bézier Kelvin-Helmholtz kararsızlık dalgaları, iç içe geçen ters dönüşlü girdaplar (`counter-rotating eddies`) ve hidrodinamik buhar iplikçikleriyle modellenmelidir.
  - Merkezdeki ruhsal veya hipnotik derinlik, yapay bir surat yerine somnifik/hipnotik ışıma gradyanları (`radial-gradient` void), derin çivit/mor çekirdek ve etrafında süzülen konsantrik rüya halkaları/küreleri ile sağlanır.
- **Kesik Çizgili CAD Çemberi Yasağı (No Dashed Mechanical Wavefronts):**
  - Hipnotik uyku, psiyonik dalga veya rüya titreşimlerinde; teknik çizim programlarını veya hedefleme retiküllerini andıran yapay kesik çizgili çemberler (`strokeDasharray="14 8"` vb.) KESİNLİKLE YASAKTIR.
  - Dalgalar, spektral sisin içinde yayılan pürüzsüz çift gradyanlı (`#c084fc` $\rightarrow$ `#a5f3fc`), yumuşak ışımalı ve Gaussian bulanıklık geçişine sahip otantik somnolence halkaları olarak genişlemelidir.
- **Doğal Uyku Partikülü & Zerre Mimarisi (Organic Somnific Spores & Dream Motes):**
  - **Sert Kenarlı Plastik Düğme Yasağı:** Partiküller asla `border border-white` veya hedef tahtası gibi iç içe geçmiş iki renkli plastik düğmeler şeklinde çizilemez.
  - **Işıma ve Doku Saflığı:** Her partikül akkor beyaz çekirdekten mora/camgöbeğine açılan kesintisiz bir radyal gradyana (`radial-gradient`) ve yumuşak bir ışık halesine (`box-shadow`) sahip olmalıdır.
  - **Üç Kademeli Boyut Hiyerarşisi:**
    1. *Mikro Zerreler (2.5px – 3.5px):* Havada süzülen ince uyku tozu/şeffaf zerreler (yüksek kaldırma kuvveti ve parıldama).
    2. *Orta Boy Rüya Küreleri (4.5px – 6.2px):* Gaz girdabıyla birlikte tembelce salınan yarı-saydam ışık damlaları.
    3. *Büyük Hipnotik İnciler (7.5px – 8.6px):* Alanı merkezleyen akkor çekirdekli somnolent inciler.
  - **Filotaksis Dağılımı & Doğal Salınım (Phyllotaxis & Buoyancy Drift):** Partiküller düz bir doğru veya basit altıgen dizilimi yerine; doğadaki tohum/spor dağılımını taklit eden 360° altın açı ($137.5^\circ$) sarmalıyla merkezden fışkırmalı, yukarı doğru asimetrik kaldırma kuvvetiyle (`calc(var(--gm-y) - 26px)`) sinüzoidal salınarak dağılmalıdır.

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
  4. **Kademeli İvmelenme & Geç Vertigo Hareketi (Progressive Kinematic Acceleration):** Dairesel, spiral veya girdap hareketleri animasyon başında asla dik bir eğriyle son hızda başlayamaz. %0–%45 fazı sakin, izlenebilir ve kristal berraklığında (`blur(0px)`) olmalıdır. Yön değişimi ve ivmelenmenin ardından, baş döndürücü tepe hızı ve aşamalı hareket bulanıklığı (`motion blur` 2px–4px) yalnızca son %68–%92 vertigo fazında devreye girmelidir.

### F. Stock Asset Kinematic Cohesion (Stok Görsel Merkezli Bütünsel Kinetik İlkesi)
- **Pasif Çıkartma Yasağı:** Ken Sugimori suluboya stok görseli içeren bir saldırıda (Growlithe, Vulpix, Horsea, Pikachu vb.), görsel asla eski/jenerik bir SVG efektinin üzerine sonradan iliştirilmiş "hareketsiz bir çıkartma/etiket" gibi konumlandırılamaz.
- **Kinetik ve Anatomik Merkez Üssü:** Stok görsel, saldırının hem anatomik hem de kinetik odak noktasıdır:
  1. **Anatomik Kilitlenme:** Ağızdan çıkan alev jeti, burundan püsküren mürekkep veya kuyruktan savrulan kırbaç; stok görselin kafa/ağız/uzuv koordinatlarına pikseli pikseline kenetlenmelidir.
  2. **Fiziksel Kinetik Katılım (Squash & Recoil):** Karakter görseli efekt boyunca donuk kalamaz; atılma (lunge), yaylanma (compression) ve atış anında geri tepme (recoil) fiziksel hareketlerini bizzat yaşamalıdır.
  3. **Bütünsel Efekt Revizyonu:** Yeni bir stok görsel entegre edildiğinde, etrafındaki yardımcı efekt katmanları (namlu parlaması, rüzgâr çizgileri, zemin kavrulması, darbe patlaması) stok görselin getirdiği yeni kütle, boyut ve açı hiyerarşisine göre tepeden tırnağa yeniden kalibre edilmelidir.
  4. **Püskürtücü & Kaskad Bütünlüğü (Emitter-Cascade Cohesion):** Parçacık (spor, asit, alev) saçan organlar (çiçek, ağız, namlu); parçacıklar dağılmadan önce aniden kaybolamaz veya parçacıklar bittikten sonra ekranda hareketsiz asılı kalamaz (%15 kuralı). Parçacıklar animasyon süresine yayılan 2–3 ritmik dalga halinde pompalanmalı; püskürtücü aktör ise son dalgayla birlikte elastik bir geri çekilme/solma ile sahneden ayrılmalıdır.
  5. **Tematik Rol & Perspektif Saflığı (Thematic Role & Perspective Purity):** Bir Pokémon'un zihinsel/hipnotik duruşu için tasarlanmış bir görseli (örn. Drowzee hipnoz trance), fiziksel bir tokat veya avuç darbesi (`pound`) gibi tamamen zıt mekanik ve perspektif gerektiren saldırılarda asla arka planda 'dolgu aktör' olarak zorla kullanılamaz. Fiziksel vuruşlar ve uzuv darbeleri, kendi kinetiğini taşıyan amaca uygun aktörlerle (organik Bézier SVG veya özel çizimlerle) icra edilmelidir.

### G. Perspective Purity & Unambiguous Strike Plane Rule (Perspektif Saflığı ve Vuruş Düzlemi İlkesi)
- **Perspektif Belirsizliği Yasağı:** 3D derinlik illüzyonuna sahip vuruş animasyonlarında (özellikle tekme, toynak, yumruk, pençe, gaga darbeleri); uzvun oyuncuya hangi açıdan baktığı konusunda en ufak bir şüphe veya çelişki bulunamaz. "Önden mi geliyor yoksa arkadan mı vuruyor?", "Üst kısım bacak mı kurdele mi?" gibi görsel algı karmaşaları kesinlikle kabul edilemez.
- **İki Net Perspektif Standardı (Tekme ve Toynak Vuruşları İçin):**
  1. **Standart A: Arkadan Tekme / Taban Düzlemi (Plantar Sole View - Örn: Smash Kick):**
     - Oyuncuya ve ekrana doğrudan toynağın taban yüzeyi (Plantar surface) bakar.
     - **Anatomik Ayrışım:** Nallanmış 'U' şeklindeki dövme demir kenar (`#cbd5e1`), orta üçgen çatal (frog/çatal dokusu), iki adet belirgin ökçe yumrusu (heel bulbs), arkaya doğru küçülerek derinlikte kaybolan köstek kemiği (receding pastern).
     - **Roket İtici Aurası (Symmetrical Fetlock Thrust Flare):** Toynak bileğin gerisinden geldiği için, pranga tüyleri/ateş auraları toynağın etrafından simetrik biçimde bir roket motoru gibi dışarı doğru parlar; bacağın gerisini kapatarak kurdele veya kıvrık şerit algısını tamamen ortadan kaldırır.
  2. **Standart B: 3/4 Yanal Profil (Lateral Profile Slam):**
     - Bacak ekrana tam veya 3/4 yan profilden girer.
     - **Anatomik Ayrışım:** İnce kaval kemiği, belirgin bilek eklemi yumrusu, 45° açılı köstek, tırnak bandı (coronet), 50° eğimli ön tırnak duvarı ve tabana perçinlenmiş düz demir nal plakası.
     - **Yönlü Alev/Rüzgâr Sürüklenmesi:** Alev ve hız çizgileri sadece bacağın hareket yönünün tersine (arkaya ve yukarı) doğru savrulur.
- **Kural:** Her vuruş bu iki standarttan birini tavizsiz seçmeli; melez, belirsiz veya eğreti açılar kullanılmamalıdır.

### H. Whip & Sweep Kinematic Directionality (Kırbaç, Kuyruk ve Savurma Yön Dinamiği)
- **Akışkan Sürüklenme ve Eylemsizlik Kuralı (Fluid Drag & Aerodynamic Trailing):**
  - Bir kuyruk, kırbaç, sarmaşık veya kılıç yay çizerek bir yöne doğru savrulurken (örneğin soldan sağa doğru bir kırbaç hareketi); nesnenin ucu, kıvılcımlar, alev dilleri ve kavitasyon izleri kesinlikle hareketin tersi yönünde arkadan sürüklenmelidir (`drag inertia`).
  - Uç kısmın hareket yönünün önüne doğru ters çıkıntı yapması ("tersine bakan kuyruk") fiziksel olarak doğal hissettirmez. SVG geometrisi ve keyframe dönüşümü; kökün hareketi başlattığı, esnek ucun ise havada bir yay çizerek peşinden geldiği kırbaç fiziğine (`whip-crack kinematics`) sadık kalmalıdır.

### I. Sharp-Edge Phenomena: Filled Polygon Silhouette vs. Stroke Path (Keskin Kenar Fenomenleri: Dolu Poligon Silueti vs. Çizgi Yolu)

- **Stroke-Based Lightning Fallacy (Çizgi Tabanlı Şimşek Yanılgısı):** Yıldırım, şimşek, elektrik deşarjı veya benzeri keskin-kenarlı doğa fenomenleri; `stroke-dashoffset` draw-on animasyonları veya Q-bezier (`Q`) kavisli stroke path'leriyle modellenemez. Bu yaklaşım, şimşeğin doğasındaki **ani, keskin, köşeli** enerji boşalmasını yumuşak, kıvrımlı, yapay S-eğrilerine dönüştürür ve "elektrik" yerine "kurdele" veya "ip" hissi verir.
- **Filled Polygon Architecture (Dolu Poligon Mimarisi):** Keskin-kenarlı fenomenler, Thunderbolt referanslı **dolu (filled) jagged polygon** siluetleriyle modellenmelidir:
  1. **Altın Aura Poligonu (Golden Aura Polygon):** Dış katman; `fill="#fde047"`, `opacity: 0.92`, çift `drop-shadow` (18px + 30px) ile volumetrik ışıma. Köşe noktaları zigzag düzensizliği taşır (her segment farklı uzunluk ve açı).
  2. **Beyaz Çekirdek Poligonu (White-Hot Core):** İç katman; `fill="#fff"`, tek `drop-shadow(0 0 10px #fff)` ile akkor merkez. Aura poligonunun ~2–3px içeri çekilmiş versiyonu.
  3. **Çatal Sliver'ları (Fork Slivers):** 2 adet ince, keskin üçgenimsi poligon (`fill="#facc15"` / `fill="#fde047"`, opacity 0.80–0.85); ana omurgadan farklı açılarda fırlayan kısa dallar. Her biri tek `drop-shadow(0 0 8px #facc15)` taşır.
- **Geometrik Kurallar:**
  - Her zigzag segmenti farklı uzunlukta olmalıdır (ör. 42px, 44px, 42px değil; 42px, 44px, 50px gibi asimetrik).
  - Çatal noktaları ana omurganın %40–65'i arasında konumlanır; asla tepe veya taban yakınında değil.
  - Poligon köşe sayısı 10–12 arası tutulur; 8'den az "basit ok" hissi verir, 14'ten fazla görsel gürültü yaratır.
- **Zapdos Thunder FAZ7d doğrulaması:** Q-bezier stroke omurga (FAZ7c) kullanıcı tarafından "aşırı kıvrımlı/suni" bulunarak reddedildi. Filled polygon mimarisine geçiş (FAZ7d) ile 70×140 viewBox'ta 4 poligon (altın aura + beyaz çekirdek + 2 çatal) kullanılarak Thunderbolt'un kanıtlanmış estetik dili korundu; `npx tsc --noEmit` hatasız geçti.

### J. Convergent Particle Choreography & Parametric CSS Custom Property Driving (Yakınsak Parçacık Koreografisi & Parametrik Sürücü)

- **Yakınsak (Convergent) Parçacık Deseni:** "Oluşum" anlatan saldırılarda (buz kütlesi kristalleşmesi, enerji birikimi, madde oluşumu) parçacıkların **dışarıdan merkeze yakınsaması** fiziksel nedenselliği güçlendirir. İzleyici "parçalar birleşiyor, kütle oluşuyor" okuması yapar. Saçılma (scatter) deseninin tersidir; her ikisi de geçerlidir ancak farklı fiziksel anlatılara hizmet eder.
- **CSS Custom Property Parametrik Sürücü:** N parçacığın her biri için ayrı `@keyframes` bloğu yazmak yerine, tek bir keyframe bloğu CSS custom property'leri (`--fd-shard-x`, `--fd-shard-y`, `--fd-shard-rot`) üzerinden parametrize edilir. TSX tarafında her parçacık kendi başlangıç offset'ini inline style ile atar (`'--fd-shard-x': sr.x`); keyframe içinde `calc(var(--fd-shard-x) * 0.6)` gibi çarpımsal ara konumlarla her parçacık farklı bir yörünge izler.
  - **Avantaj:** 6 parçacık × 1 keyframe bloğu = 6 DOM elemanı + 1 CSS kuralı. 6 ayrı keyframe bloğu hem CSS boyutunu şişirir hem bakım maliyetini artırır.
  - **Kısıt:** `calc()` içinde `var()` çarpımı yalnızca sayısal çarpanlarla çalışır; birim dönüşümü (px → %) için ayrı wrapper gerekir.
- **Tumble Rotation Kuralı:** Yakınsak parçacıklar düz bir çizgide kaymaz; her keyframe stop'unda artan bir rotasyon (`+40°`, `+90°`, `+130°`, `+160°`) ile takla atarak ilerler. Bu, buz kırığı veya moloz parçasının aerodinamik olmayan savrulmasını taklit eder.
- **Terminal Convergence (Son Nokta Birleşmesi):** Tüm parçacıkların son keyframe'i aynı koordinata (`translate(0px, 5px)`) converge olur. Bu, parçacıkların "hedefe yapıştığını" ve ana kütlenin parçası olduğunu anlatır.
- **Freeze Dry FAZ5 doğrulaması:** `gbaFreezeDryShardRain` keyframe'i 6 shard'ı tek bir blokla sürer; her shard `--fd-shard-x/y/rot` ile parametrize edilir, 5 stop'ta (0%, 20%, 45%, 70%, 100%) yakınsak yörünge + tumble rotation + terminal convergence uygulanır. TSX L19063–19090, CSS L15565–15572. `npx tsc --noEmit` hatasız.

---

## 3. Scale, Proportion & Whiff Standards

### A. Two-Tier Scaling Hierarchy (Vücut/Silah vs. Organ/Kafa Boyutlandırması)
- **Tier 1 — Major Weapons, Full Bodies & Apex Monsters (~68.1% Rule):**
  - Standard Scale: **~68.1% of card width** (`~108px – 120px`).
  - Target Solid Mass: **~4,500 – 5,500 px²** of rendered non-transparent pixels.
  - Whiffed Scale: **~54.5% of card width** (`~78px – 84px`).
  - Examples: Gyarados dragon head (`108x108`, ~4,914 px²), Scyther scythe blade (`108x76`, ~2,092 px²), Eevee sprint, Rattata tackle, Machamp chop.
  - **Attacking Limb Precedent (Saldıran Uzuv Emsali):** Fiziksel olarak hedefe çarpan uzuvlar (el, pençe, yumruk, kuyruk darbesi) fırlatılan nesnelerden farklı olarak **Tier 1**'e tabidir. Machamp chop emsaliyle sabitlenmiştir. Double Slap el görseli (Jynx psychic hand, Poliwhirl boxing glove, Wartortle clawed paw) bu emsal gereği `108px` (normal) / `59px` (whiff) olarak boyutlandırılmıştır; orijinal görselin 2/3 oranında küçültülmesiyle elde edilmiştir. Küçük bio-organlar (kuyruk alevi, zehir iğnesi) ve fırlatılan mermiler (kemik, kaya) **Tier 2**'de kalır.
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

### E. Intensity & Whiff Modeling (Şiddet Katsayısı & Iskalama Standartları)
*Ekstra enerji, yazı-tura çarpanı veya ortak saldırı havuzlarında görsel etkiyi hasarla orantılı ölçeklendirmek için kullanılan standart modelleme ilkeleridir:*

1. **Üç Kademeli Intensity (Şiddet) Mimarisi:**
   - **Çarpanlı Saldırılar (Coin-Flip Multipliers):** Başarılı her yazı (`heads`) için saldırının görsel gücü kademeli artar (`fxIntensity = 1.0 + heads * 0.10`). Örn: *Big Eggsplosion*, *Continuous Fireball* (1 Yazı $\rightarrow$ 1.1x, 2 Yazı $\rightarrow$ 1.2x).
   - **Ekstra Enerji Güçlendiricileri (Energy Enhancers):** Karta eklenen her ekstra enerjiyle artan hasar görsel yoğunluğa yansıtılır (`fxIntensity = 1.0 + extraEnergy * 0.10` veya `1.0 + Math.max(0, baseDamage - 10) * 0.01`). Örn: *Hydro Pump* (40 dmg $\rightarrow$ 1.0x, +1 Enerji 50 dmg $\rightarrow$ 1.1x, +2 Enerji 60 dmg $\rightarrow$ 1.2x), *Hydrocannon*.
   - **Ortak Saldırı Havuzu Tabanı (Shared Move Pool Baseline):** Aynı animasyonu paylaşan saldırı havuzlarında, havuzdaki en düşük hasara sahip temel Pokémon `1.0x` (veya taban) kabul edilir; aynı saldırıyı kullanan daha gelişmiş Pokémon'lar ekstra enerji olmadan dahi tabandan daha güçlü/geniş başlar (Örn: *Water Gun* havuzunda Poliwag/Lapras 10 dmg $\rightarrow$ 1.0x iken, Vaporeon 30 dmg $\rightarrow$ 1.20x taban). Orantısız hasar uçurumu olan havuzlarda ise küçük Pokémon alt katsayıya çekilir (Örn: Graveler 40 dmg *Rock Throw* $\rightarrow$ 1.0x dev kaya iken, Onix 10 dmg *Rock Throw* $\rightarrow$ 0.40x kaya ölçeği).

2. **Kütlesel ve Geometrik Dağılım (Anti-Bleed Korumalı):**
   - Şiddet katsayısı (`wi = Math.max(1, fx.intensity ?? 1)`) tüm animasyon kutusunu kontrolsüzce büyüterek kart dışına taşırmaz (`anti-bleed` kuralı). Bunun yerine; iç akıntı kalınlığına (`strokeWidth={8 * wi}`), dinamik ışıma yarıçapına (`drop-shadow`), parçacık/damla sıklığına veya aktörün orantılı mikro-ölçeğine dengeli biçimde dağıtılır.

3. **Fiziksel Whiff (Menzil Yetmezliği & Hedefe Ulaşamama - Short-Fall Model):**
    - Saldırı ıska geçtiğinde veya engellendiğinde (`fx.whiffed === true`):
      - Mermi/jet maske açılımı yarı yolda kesilir (örneğin `%58` menzilde durur),
      - Kavitasyon ucu hedefe varamadan sönümlenir ve yerçekimiyle aşağı düşer,
      - Hedef karttaki ikincil çarpma patlamaları, zemin aurası ve şiddetli sarsıntı KOŞULSUZ olarak tamamen bastırılır (`!fx.whiffed`).

### F. Dynamic Scaling Multiplication Trap & Anti-Bleed Containment (Keyframe Ölçek Çarpanı Tuzağı)
- **Ölçek Çarpanı Tuzağı (The Scale Multiplication Trap):**
  - Bir aktörün SVG taban genişliği (örneğin `120px` veya `160px`) ile CSS keyframe'indeki tepe ölçek çarpanı (örneğin `scale(1.32)`) birbirini çarparak kontrolsüz devasa boyutlara ulaşabilir.
  - Örneğin: `120px` base $\times 1.32 = 158.4px$ (kart genişliğinin %98'i!), `160px` base $\times 1.28 = 204.8px$ (kart genişliğini %128 aşarak dışarı taşar!).
  - Benzer şekilde Starmie gibi yoğun opak piksel kütlesine sahip katı varlıklar `108px` base $\times 1.32 = 142.6px$ ulaştığında rakip kartı boğarak nefes alacak alan bırakmaz.
- **Birleşik Tepe Tavanı Kuralı (Combined Peak Effective Ceiling):**
  - Gerçek piksel boyutu asla naif taban genişliğiyle değil; **$\text{Base Dimension} \times \text{Keyframe Peak Scale}$** formülüyle hesaplanmalıdır.
  - **Tier 1 Birleşik Tavanı (Büyük Silahlar & Apex Aktörler):**
    - Maksimum tepe boyutu: **~100px – 120px** (kart genişliğinin en fazla %60–%68'i).
    - Formül: Taban `112px` ise, keyframe tepe scale $\le 1.08$; taban `88px` ise, keyframe tepe scale $\le 1.15$.
  - **Tier 2 Birleşik Tavanı (Organlar, Toynaklar & Temel Kafalar):**
    - Maksimum tepe boyutu: **~84px – 90px** (kart genişliğinin en fazla %50–%55'i).
    - Formül: Taban `78px` ise, keyframe tepe scale $\le 1.15$.
- **Anti-Bleed & Kart İçi Nefes Payı (Card Margin Safety):**
  - Tek hedefli saldırılarda aktörün görsel kütlesi kart sınırlarının içinde en az 15–25px güvenlik payı bırakmalı; yanındaki kartlara, deste veya sayaç alanlarına asla taşmamalıdır.

### G. Satellite Distribution Symmetry, Z-Depth & Silhouette Variation (Uydu Dağılım Simetrisi, Z-Derinlik & Siluet Varyantı)

- **Görsel Sentroid Simetrisi:** Çoklu uydu (satellite) yerleşiminde sol ve sağ taraflardaki uydu sayıları eşit olmalı (3 sol / 3 sağ), ancak sol uyduların x offset'leri prizmanın sol kenarına göre açıkça dışarıda konumlanmalıdır (`x + w < -20`). Bunun nedeni: SVG/HTML elemanlarının varsayılan anchor noktası sol-üst köşedir; sol uydular `left: calc(50% + x)` ile konumlandığında, sağ uydulara kıyasla görsel merkezden daha içe kayar. Bu offset asimetrisi, **görsel sentroidin** geometrik merkezle çakışmasını sağlar.
- **Z-Derinlik Katmanlaşması:** Uyduların tümü aynı z-index'te olmamalıdır. En az 2 uydu ana prizmanın arkasına (`z-18`) yerleştirilerek hacim ve derinlik hissi yaratılır; kalan uydular önde (`z-26`) kalır. Bu, düz bir "halka" yerine üç boyutlu bir "küme" algısı üretir.
- **Siluet Varyantı (Anti-Kalıp Baskı):** Tüm uydular aynı polygon geometrisini kullanmamalıdır. En az 2 farklı polygon siluet varyantı (`v: 0` ve `v: 1`) dönüşümlü olarak atanır. Her varyant farklı köşe sayısı, farklı iç detay çizgisi ve farklı opacity katmanına sahiptir. Bu, "kalıp baskı" veya "copy-paste" hissini önler.
- **Stagger + Bağımsız Delay:** Her uydu kendi `animation-delay`'i ile stagger edilir (ör. 0.16s, 0.24s, 0.3s, 0.34s, 0.38s, 0.44s). Delay'ler eşit aralıklı değildir (§8.J parçacık aralığı kuralı); fiziksel nedenselliğe bağlıdır (merkezden dışa doğru kristalleşme sırası).
- **Freeze Dry FAZ7b doğrulaması:** 6 uydu (3 sol: −92/−72/−56px; 3 sağ: +52/+44/+34px), 2 adet z-18'de arkada, 2 polygon varyantı, `gbaArticunoIceEncase` keyframe'i paylaşılır. TSX L19000–19035. Sol uyduların x offset'leri sağa kıyasla mutlak değerce daha büyük tutularak görsel sentroid simetrisi sağlanmıştır. `npx tsc --noEmit` hatasız.

---

## 4. The 5-Layer FX Architectural Template (Modular Orchestral Ceiling)

Bu 5 katman zorla doldurulacak statik bir kalıp değil, **modüler bir orkestra tavanıdır**. Saldırının doğasına göre 2 ila 5 katman seçilerek orkestre edilir (örneğin zarif bir uyku/psişik saldırı 2–3 katmanla minimalist bir derinlik yakalarken, kataklizm bir patlama 5 katmanın tümünü devreye sokar). Amaç her saldırıyı aynılaştırmak değil, görsel çamuru önleyip sinematik katman hiyerarşisini korumaktır:

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
3. **Multi-Target & Bench Slot Awareness (Slot-Bilinçli FX Degradasyonu & Okunabilirlik Peçesi):**
   - Special moves (e.g., Gengar *Dark Mind*, Ninetales *Lure*, Arbok *Stare*) can target either the Active card or a Bench slot (`slot === 'bench'`, `benchIndex`).
   - Coordinate logic must gracefully support bench transposition without visual clipping.
   - **Slot-Bilinçli FX Degradasyonu & Paylaşımlı Fırtına Orkestrasyonu (Blizzard dersi):** Blizzard gibi çok hedefleri kapsayan alan (AOE) saldırılarında, fırtına atmosferi (vortex rüzgâr akımları, storm haze, balistik buz kristalleri, süzülen kar taneleri ve kart sarsıntısı) hem aktif hem de bench kartlarının üzerinden eşzamanlı olarak geçer. Ancak GPU bütçesini ve görsel hiyerarşiyi korumak adına stok raster aktör (Articuno, 168px) ve Frost Veil peçesi YALNIZCA aktif slotta render edilir (`fx.slot !== 'bench'`). Bench slotları ise devasa aktör yerine darbe merkezinde kompakt bir frost impact burst (`gbaBlizzardBenchFrostBurst`, 72px radyal burst + 60px shimmer halkası) alır.
   - **Z-Index Slot Farklılaştırması & Ön Katman Fırtına Hiyerarşisi:** Yoğun fırtına kütleleri ve buz parçacıkları (haze z-32, vortex streaks z-34, embed/scatter shards z-36, snowflakes z-38) aktif slotta stok aktörün (`z-26`, 168px / 90px whiff) ve Frost Veil'in (`z-28`, 176px) ÖNÜNDE süpürülmelidir. Bench slotunda ise vortex akımı `z-25` derinliğinde sarmalayarak bench burst ile kusursuz bir katmanlaşma oluşturur.
   - **Okunabilirlik Peçesi (Legibility Veil):** Yoğun raster sanat eseri üzerinde SVG parçacık efektlerinin okunabilirliğini korumak için, aktörün üzerine yarı saydam bir "peçe" katmanı eklenir. Frost Veil deseni: `radial-gradient` tabanlı, **opacity-only keyframe** (transform çakışması yok), peak opacity ~0.38, `backdrop-filter: blur(0.6px)` ile hafif buzlu cam etkisi. Peçe, efektin kendisi değil, efektin **okunabilirliğini sağlayan altyapı katmanıdır**.
   - **Blizzard Kalibrasyonu (Ölçek, Fırtına & Balistik Kristal Fiziği):** Active slot: stok Articuno (z-26, 168px normal / 90px whiff — gerçek kırpılmış opak kanat açıklığı ~138.3px ile Tier 1 Apex Zapdos dengi) + Frost Veil (z-28, 176px) + Storm Haze (z-32, 168x136px) + vortex streaks (z-34) + 8 adet balistik fırtına rotasında süzülen ok/iğne kristal (`gbaBlizzardIceShard`, 7–9px, dönmesiz aerodinamik akış) + 6 adet 4 kadrana saplanan ve çarpmada mikro-titreyen gömülü kristal (`gbaBlizzardIceShardEmbed`, 8–9px, kinetik shudder tremor) + kar taneleri (z-38). Bench slot: aktörsüz tam fırtına orkestrasyonu (rüzgâr z-25, haze, kristaller, kar, sarsıntı) + `gbaBlizzardBenchFrostBurst` (72px burst + 60px shimmer). Her iki varyant `npx tsc --noEmit` ve `scratch/test_batch_birds.py` hatasız.

---

## 7. Expansion Principles: From Static Art to Living Motion (Genişletici İlkeler & Ufuk Açıcı Yaklaşımlar)

Bu bölüm bir yasaklar listesi değil, §§1–6'yı tamamlayan **açık uçlu bir alet çantasıdır**: tek pozlu raster sanatın baş aktör olduğu saldırılar ve birden çok kart baskısının aynı adı paylaştığı durumlar gibi yeni senaryolarda modeli düşünmeye davet eder. Bir saldırının doğası bu ilkelerden biriyle çelişirse, §4'ün modüler felsefesi gereği **saldırının doğası önceliklidir**; ilkeler varsayılan rehber, yaratıcılık istisnadır.

### A. Kinetic Decomposition of Single-Pose Raster Actors (Statik Pozun Kinetik Ayrıştırması)
- Donmuş bir PNG tek bir "apex anı" içerir; hareket onun etrafında **inşa edilir**, görselin kendisi döndürülerek üretilmez (tüm gövdeyi çevirmek "sticker spin" hissi verir).
- Önerilen ayrıştırma rafı: (1) ölçülmüş pivot etrafında salınım/coil, (2) süpürme yayını anlatan vektör iz katmanı (`pathLength` + `stroke-dashoffset` crescent trace), (3) yayın ucunda impact flash, (4) ikincil ejecta (kor, kıvılcım, mote), (5) zemin tepkisi (scorch ring).
- Esneklik notu: Gerçekten balistik hareketlerde (dash, leap, tackle) aktörün tüm gövdesiyle ötelenmesi hâlâ doğru seçimdir; ilke "hareketi katmanlara ayır, çıkartmayı döndürme" biçiminde okunmalıdır.

### B. Measured Pivot & Anchor Discipline (Ölçülmüş Pivot İlkesi)
- `transform-origin` göz kararı değil, alpha bounding-box'tan türetilmelidir (crop script'i bbox, aspect ve önerilen pivot yüzdesini raporlar; değer implementasyon notuna/scratchpad'e yazılır).
- Bu, §3.D'nin kırpma disiplininin doğal devamıdır: kırpma yalnız görseli sıkılaştırmaz, kinematik çapaları da ölçülebilir kılar.

### C. Identity-Safe Dispatch (Kimlik-Güvenli Yönlendirme)
- Ad-tabanlı dispatch hızlıdır; ancak aynı Pokémon adını paylaşan baskılar (Base Set vs. Team Rocket vb.) için belirsizdir. Bir saldırı belirli bir baskıya aitse, kararlı kart kimliği (örn. `pokemonCard.id === 'tr-50'`) ek guard olarak kullanılır ve **özel guard, jenerik dispatch satırından önce** yerleştirilir.
- Katılık içermez: belirsizlik yoksa ad-tabanlı dispatch varsayılan olarak kalır; kimlik guard'ı yalnız varyant sadakati gerektiğinde raftan alınır.

### D. Raster Actor Registration (Çift-Ölçekleme Tuzaklarından Kaçınma)
- Baş aktörü raster görsel olan her yeni FX tipi, stok-görsel kümesine kaydedilir; böylece global SVG konteyner transformu aktörü ikinci kez ölçeklemez. Aktör SVG ise kayıt gerekmez. Bu bir tasarım kısıtı değil, tek satırlık bir entegrasyon kontrol listesidir.

### E. Sweep Reach via Trails, Not Actor Scale (Menzili İzle Anlatmak)
- Whip, spin, arc gibi geniş yaylı saldırılarda erişim, aktörü büyüterek değil **iz/şok katmanlarıyla** anlatılır; §3.F tavanları korunurken sinematik geniş yaylar kazanılır. İz katmanı kart içinde kalmak koşuluyla (§6.2) aktörden bağımsız ölçeklenebilir.
- Deney alanı: dashoffset hız eğrileri, sivrilen stroke uçları, faz kaymalı afterimage'ler — hepsi bu ilkenin doğal uzantılarıdır.

### F. Whiff Choreography for Sweep Moves (Iska Koreografisi)
- §3.C/E'nin süpürme hareketlerine genişletmesi: iz katmanı yay ortasında durur (örn. pathLength'in ~%58'i), aktör overshoot + stumble ile sendeler, impact katmanları koşulsuz bastırılır. Iska, "sönük vuruş" değil **fiziksel menzil yetmezliği** olarak okunmalıdır.

### G. Light-Based Amplification of Canonical Art (Sanatı Boyamadan Güçlendirmek)
- Onaylı suluboya sanat yeniden boyanmaz; akkorluk, §1.C sıcaklık hiyerarşisini izleyen katmanlı `drop-shadow` haleleri ile eklenir. `wi` (intensity) kutu boyutunu değil ışık yarıçapını, stroke kalınlığını ve parçacık sayısını modüle eder (§3.E ile uyumlu).

### H. Verification Bench as a First-Class Deliverable (Doğrulama Tezgâhı)
- Aktör odaklı her yeni FX; kart ölçekli mock, hit & whiff panelleri ve replay düğmesi içeren bağımsız bir preview ile hafif bir assertion scriptini standart çıktı olarak getirir. Nihai söz hakkı her zaman kullanıcı görsel onayındadır (§3.B human-in-the-loop).

### I. Sibling Move Differentiation (Kardeş Saldırı Farklılaştırması)

- Aynı Pokémon'un aynı element ailesindeki birden fazla saldırısı (Zapdos: Thunderbolt 100 dmg vs. Thunder 60 dmg; Charizard: Flamethrower vs. Fire Spin vb.) **aynı görsel dili konuşmalı ama farklı şiddet kademelerinde** icra edilmelidir.
- **Farklılaştırma Vektörleri (Öncelik Sırası):**
  1. **Geometrik Ölçek:** Kardeş saldırının aktör boyutu, ana saldırının ~%70–80'i oranında tutulur (Thunder bolt 70×140 vs. Thunderbolt pillar 90×180). Siluet oranları korunur; yalnızca mutlak boyut küçülür.
  2. **Katman Sayısı:** Ana saldırı 6–7 katman kullanıyorsa, kardeş 4–5 katmanla yetinir (Thunder: cloud + bolt + impact + 3 spark = 5 katman; Thunderbolt: pillar + wing-vein + wing-tip + plasma nodes + ground scorch + flash = 7 katman).
  3. **Duration & Pacing:** Kardeş saldırı daha kısa süreli ve daha sıkıştırılmış bir zamanlama zarfı kullanır (Thunder 1.45s vs. Thunderbolt ~2.1s). Anticipation fazı kısalır veya bulut gibi daha hafif bir ön hazırlığa dönüşür.
  4. **Stok Görsel Varlığı:** Yüksek hasarlı ana saldırı stok görsel aktör kullanırken, düşük hasarlı kardeş pure-SVG icra edilebilir (Thunderbolt: stok Zapdos PNG; Thunder: salt SVG bulut + şimşek + impact). Bu, görsel hiyerarşiyi hasar hiyerarşisiyle hizalar.
  5. **Animasyon Tekniği Farkı:** Kardeş saldırı, ana saldırının animasyon tekniğinden bilinçli olarak farklı bir teknik kullanır (Thunderbolt: pillar scaleY + jitter; Thunder: top-origin scaleY snap + voltage flicker). Bu, "aynı animasyonun küçültülmüş kopyası" hissini önler.
- **Kimlik Koruma:** Farklılaştırma ne kadar derin olursa olsun, element ailesinin kromatik imzası (§1.C Electric: akkor beyaz → `#facc15` → `#fbbf24`) ve temel geometrik dil (zigzag, keskin köşe) korunmalıdır. İzleyici iki saldırıyı da "Zapdos elektrik saldırısı" olarak tanıyabilmelidir.
- **Zapdos Thunder/Thunderbolt doğrulaması:** Thunder (60 dmg), Thunderbolt'un (100 dmg) pillar-scaleY + jitter yaklaşımından bilinçli olarak ayrıştırıldı: stroke-dashoffset draw-on yerine filled polygon + top-origin scaleY snap; stok görsel yerine pure-SVG; 7 katman yerine 5 katman; 2.1s yerine 1.45s. Her iki saldırı da aynı altın/beyaz kromatik aileyi ve zigzag geometrik dili paylaşır.
- **Shellder Hide in Shell / Supersonic doğrulaması:** Hide in Shell savunma hamlesinde stok kabuk aktörü (`Shellder_Shell.png`, snap & inci ışıltısı) kullanılırken; durum saldırısı olan Supersonic'te kapalı kabuk kaldırılmış, yerine rakip kart üzerinde tam karşı perspektiften (front-facing) genleşen 4 fazlı eşmerkezli suluboya akustik dalga treni (`gbaShellderSonicWaveTrain`, gül pembesi `#f472b6`, limon sarısı `#fde047`, aqua `#38bdf8`, lavanta `#c084fc`), hız çizgileri ve süzülen sersemlik zerreleri/droplet'ler konumlandırılmıştır. Böylece iki saldırının aynı stok görseli mükerrer kullanması önlenmiş ve tematik ayrışma sağlanmıştır.

### J. Anatomical Line Tracing & Stock+SVG Hybrid Layering (Anatomik Hat İzleme & Stok+SVG Hibrit Katmanlaşma)

- **Anatomik Hat İzleme (Wing Vein Trace):** Stok raster görselin mevcut anatomik hatları (kanat damarları, tüy çizgileri, kas lifleri) SVG `<path>` olarak izlenir ve `pathLength={1}` + `stroke-dasharray="1"` + `stroke-dashoffset: 1 → 0` draw-on animasyonu ile "ateşlenir". Bu teknik, aktörü yeniden boyamadan (§7.G) enerji akışını anatomik yapıya bağlar: izleyici "elektrik kanat damarlarında akıyor" okuması yapar.
  - **Uygulama deseni (Thunderbolt wing vein):** 6 path (3 sol kanat, 3 sağ kanat), her biri farklı `stroke-width` (1.1–1.6) ve renk (`#ffffff` / `#fde047` dönüşümlü). Draw-on delay'leri `(i % 3) * 0.06s` ile kademeli; ana damarlar önce, yan damarlar sonra ateşlenir.
  - **Kapsayıcı flash:** Draw-on'un üzerine bir `opacity` flash keyframe'i (`gbaZapdosWingVeinFlash`) bindirilir: 0%→18% görünmez, 26% tam parlama, 34% sönüm, 42% ikinci parlama, 55%→100% kademeli fade. Bu çift nabız, §8.S'deki voltage flicker deseninin anatomik versiyonudur.
- **Stok+SVG Hibrit Katmanlaşma:** Raster `<img>` aktör ve SVG overlay aynı DOM konteyneri içinde nested olarak konumlanır. Raster aktör z-30'da, SVG overlay (wing vein) aynı konteynerin içinde `absolute inset-0` ile, wing-tip sparks ise ayrı z-32 katmanında. Bu, aktörün whole-actor transform'unun (§8.H) tüm child katmanlara otomatik olarak uygulanmasını sağlar.
- **Raster Aktör Anticipation Yayı (Dense Stop Chain):** Stok aktör keyframe'lerinde anticipation fazı, tek bir geri çekilme noktası yerine **yoğun stop zinciri** ile modellenir: 0%→7%→14% (coil), 20%→26%→32% (rise), 40%→48% (peak hold), 56%→64%→72%→80% (decay), 88%→94%→100% (settle). 14+ stop'lu bu zincir, `cubic-bezier` interpolasyonunun üretemeyeceği "anticipation coil → explosive rise → sustained hold → graceful decay" dört fazlı yayı gerçekleştirir.
- **Thunderbolt FAZ6 doğrulaması:** `gbaThunderboltStockStrike` 14 keyframe stop'u ile 1.65s zarfında dört fazlı yay (CSS L15604); `gbaZapdosWingVeinDraw` 4 stop (0%, 18%, 40%, 100%) ile draw-on (CSS L12286); `gbaZapdosWingVeinFlash` 8 stop ile çift nabız flash (CSS L12273). TSX L19576–19609. Tüm katmanlar `npx tsc --noEmit` hatasız.

> **Terfi Notu:** Bu ilkeler zamanla kanıtlanıp kullanıcı onayıyla olgunlaştıkça §§1–6'nın kanonik maddelerine terfi ettirilebilir; tersine, yeni bir teknik ekranda daha iyisini kanıtlarsa bu bölüm onunla genişletilir. Amaç kuralları dondurmak değil, toolset'i birlikte büyütmektir.

---

## 8. Density, Timing & Phasing: Why More ≠ Better (Yoğunluk, Zamanlama ve Fazlama İlkeleri)

> Bu bölüm, §7'nin "ne eklemeli?" sorusuna karşılık **"ne kadar eklemeli, nereye eklemeli ve eklemek yerine ne yapmalı?"** sorusunu yanıtlar. Temel tez: animasyon kalitesini belirleyen şey keyframe veya katman sayısı değil, fiziksel fazların doğru zamanlamayla doğru easing üzerinden sunulmasıdır.

### A. Keyframe Count ≠ Quality (Fiziksel Faz Sayısı Kadar Keyframe)

- CSS `@keyframes` blokları **kontrol noktasıdır**; aralarındaki geçiş `animation-timing-function` (cubic-bezier) ile interpolate edilir. Asıl soru "daha fazla nokta mı lazım?" değil, **"mevcut iki nokta arasındaki tarayıcı interpolasyonu istediğim hareket eğrisini üretiyor mu?"** sorusudur.
- **Pratik kural:** 1.75 sn'lik bir zarfta 5 keyframe ≈ 350 ms arayla kontrol noktası demektir. İki nokta arasındaki hareket **monoton** (sürekli hızlanan veya yavaşlayan) ise ekstra keyframe gereksizdir; tarayıcının bezier interpolasyonu zaten pürüzsüz geçer. Hareket **monoton değilse** — önce hızlanıp sonra aniden yavaşlayıp tekrar ivmelenen bir kırbaç ucu gibi — araya kontrol noktası koymak gözle görülür iyileştirme sağlar.
- **Faz kontrol listesi:** Her keyframe bir fiziksel fazı temsil etmelidir: `anticipation → strike → follow-through → settle → fade`. Bu 5 faz varsa 5 keyframe yeterlidir. "Strike" kendi içinde overshoot + rebound yapıyorsa orayı ikiye bölmek (6–7 keyframe) anlamlıdır.
- **Tavan:** 8+ keyframe'lik bir CSS animasyonu, muhtemelen JS/SVG SMIL veya `requestAnimationFrame` tabanlı bir yaklaşımın sinyalidir; CSS'in interpolasyon gücünü zorlamak yerine teknolojiyi değiştirmek daha sağlıklıdır.

### B. Layer Count Ceiling (Katman Sayısı Tavanı)

- Katmanlar **görsel bilgi kanalıdır**. Her katman izleyiciye ayrı bir "şey oldu" sinyali verir. Soru: *"N. katman, izleyiciye (N−1). katmanın söylemediği ne söylüyor?"*
- **GBA estetiği kasıtlı olarak kısıtlıdır.** 4–6 katman ideal aralık, 7 tavan, 8+ ise farklı bir sanat yönetmenliği (modern anime, cinematic) gerektirir.
- **Zararlı katman çoğaltma örnekleri:**
  - İki farklı cinder sistemi (biri turuncu biri sarı, farklı yörüngelerle) → görsel gürültü, göz hangi parçacığı takip edeceğini bilemez.
  - İki ayrı glow katmanı (biri aktörün üstünde biri altında) → aynı bilgiyi iki kez vermek, sadece GPU yükü artar.
  - Efekt katmanlarının kartın kendisini bastırması → piksel sanatının okunabilirliği bozulur.
- **Faydalı 6. veya 7. katman adayları** (bkz. §8.F): ısı bozulması, ikincil motion trail, screen shake. Bunlar mevcut 5 katmanın söylemediği **yeni bir fiziksel bilgi** taşır.

### C. Anticipation Phase Priority (Ön Hazırlık Fazının Birincil Önceliği)

- Stok görsel animasyonlarında en sık eksik kalan faz **anticipation**'dır. Saldırı başlamadan önce aktörün 2–3 frame hafifçe geri çekilmesi (`translateX(-4px) scale(0.95)`, `rotate(-2°)`) → sonra patlaması, tek bir keyframe eklemekle 2 katman eklemekten **çok daha fazla** "ağırlık" ve "niyet" hissi verir.
- Anticipation fazı izleyiciye "bir şey geliyor" sinyali verir; bu sinyal olmadan vuruş "aniden olan" bir şey gibi okunur ve fiziksel ağırlık hissi kaybolur.
- **Uygulama:** Mevcut spin-actor keyframe'inin %0 noktasını hafif geri çekilme, %8–10 arasını maksimum geri çekilme (coil), %14'ten itibaren mevcut başlangıç olarak yeniden yapılandırmak genellikle yeterlidir. Bu, toplam keyframe sayısını artırmadan faz sayısını artırır.

### D. Stagger Offsets as Dynamism Multiplier (Kademeli Gecikmelerin Dinamizm Çarpanı)

- Aynı 5 katmanla bile, her katmanın `animation-delay`'ini fiziksel nedenselliğe bağlamak bambaşka bir dinamizm hissi verir: **çarpma → enkaz → toz → kalıntı**.
- **Nedensellik zinciri:** Impact flash (0 ms) → cinders fırlama (+80–120 ms) → scorch ring oturma (+150 ms) → ember motes yükselme (+250–350 ms). Bu zincir, "her şey aynı anda oluyor" hissini kırar ve izleyiciye olayın **sıralı bir fiziksel süreç** olduğunu anlatır.
- **Cinder stagger'ı genişletme:** Üç cinder'ın delay'lerini eşit aralıklı (0.10s) yerine hafif açılı (0.12s → 0.22s → 0.34s) yapmak, "tek seferde değil, ardışık kopan" parçacık hissi verir. Bu, yeni katman eklemekten çok daha ucuz ve etkilidir.
- **Whiff'te stagger:** Whiff senaryosunda stagger zinciri **bozulur** — impact ve cinder'lar bastırılır, sadece stumble + puff kalır. Bu bozulma, "bir şey eksik" hissini vererek whiff'i anlatır.

### E. Easing Selection Over Keyframe Addition (Easing Seçimi Keyframe Eklemekten Önce Gelir)

- `ease-out` yerine `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out) kullanmak, bir cinder'ın "fırlayıp yavaşlamasını" çok daha inandırıcı yapar. Bu, keyframe eklemekten **daha ucuz ve daha etkilidir**.
- **Easing karar tablosu:**
  - Fırlayan nesne (cinder, spark): `cubic-bezier(0.22, 1, 0.36, 1)` (hızlı çıkış, yavaş durulma)
  - Büyüyen halka (scorch ring): `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out, organik genişleme)
  - Fade-out (motes, trace): `ease-in` veya `cubic-bezier(0.55, 0, 1, 0.45)` (yavaş başla, hızla kaybol)
  - Overshoot gerektiren (whip ucu): `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out)
  - Toz/enkaz saçılması ve sönümlenmesi (dust, debris settling): `cubic-bezier(0.22, 1, 0.36, 1)` (fırlayan nesne ile aynı expo-out ailesi; Kangaskhan Comet Punch dust ve spark katmanlarında doğrulanmıştır)
  - Starburst parlama ve sönüm (incandescent pop): `cubic-bezier(0.15, 0.85, 0.35, 1)` (çok hızlı tepe, uzun kuyruklu sönüm; Kangaskhan Comet Punch star katmanında doğrulanmıştır)
  - Yıldırım snap / ani beliren fenomen (lightning strike, instant materialize): `cubic-bezier(0.2, 0.85, 0.3, 1)` (çok hızlı tepe, minimal overshoot, kontrollü yerleşme; Zapdos Thunder BoltStrike top-origin scaleY snap'te doğrulanmıştır)
- **Kural:** Yeni keyframe eklemeden önce, mevcut iki keyframe arasındaki easing'i değiştirmenin yeterli olup olmadığını test edin. Çoğu durumda yeterlidir.

### F. Expansion Layer Candidates (Genişletme Katmanı Adayları)

5 katmanlık bir yapıyı 6 veya 7'ye çıkarmak gerektiğinde, aşağıdaki adaylar **öncelik sırasıyla** değerlendirilmelidir:

| Öncelik | Katman | Fiziksel Bilgi | Uygulama |
|---|---|---|---|
| 1 | **Isı bozulması (heat shimmer)** | "Hava ısınıyor, ışık kırılıyor" | Aktörün arkasına `position:absolute; inset:-8px; border-radius:50%; backdrop-filter:blur(1.5px); opacity:0→0.3→0` animasyonu |
| 2 | **İkincil motion trail** | "Hareket ağır, iz bırakıyor" | Ana crescent trace'in 80–120 ms gerisinde, daha soluk ve daha geniş bir ikinci iz (`opacity: 0.3`, `stroke-width: +3`) |
| 3 | **Screen shake (kart sarsıntısı)** | "Darbe güçlü, zemin titriyor" | Kart konteynerine 2–3 px'lik `translate` jitter, sadece hit'te, sadece 120–200 ms, `animation-delay` = çarpma anı |
| 4 | **Afterimage (hareket hayaleti)** | "Hız o kadar yüksek ki iz bırakıyor" | Aktörün 2 kopyası, `opacity: 0.15/0.08`, `animation-delay: +40ms/+80ms`, aynı yörüngede |

- **Kaçınılacak:** Aynı bilgiyi veren paralel katmanlar (iki glow, iki cinder sistemi), 7+ parçacık sistemi, katman ekleyerek aktörü "daha parlak" yapmaya çalışmak (bunun yerine §7.G'deki `filter: brightness/saturate` animasyonu kullanın).

### G. Timing & Phasing Over Numbers (Sayı Değil, Zamanlama ve Fazlama)

- **Meta-ilke:** 5 katman + doğru stagger + anticipation, 7 katman + lineer zamanlama'dan **her zaman** daha iyi görünür.
- Bir animasyonu iyileştirmek istediğinizde öncelik sırası:
  1. Anticipation fazı ekle (§8.C)
  2. Stagger offset'lerini fiziksel nedenselliğe bağla (§8.D)
  3. Easing'i gözden geçir (§8.E)
  4. Ancak bunlardan sonra katman veya keyframe ekle (§8.A, §8.B, §8.F)
- Bu sıralama, "daha fazla şey ekleyeyim" refleksine karşı bir **karar ağacı** işlevi görür.

### H. Stock Image Actors: Special Notes (Stok Görsel Aktörler İçin Özel Notlar)

- Raster görselde iskelet animasyonu yoktur; aktör tek parçadır. Bu durumda aktöre 5 yerine 7 keyframe eklemek genellikle **sadece daha pürüzsüz bir rotasyon/çevirme** üretir — ki bunu `cubic-bezier` zaten yapar.
- Gerçek kazanç, aktörün **çevresindeki** ikincil hareketlerin (trace, cinders, motes) zamanlama ofsetlerinde ve easing seçimlerinde yatar.
- Aktörün kendisine `filter: brightness(1.4) saturate(1.3)` animasyonu bindirmek, çarpma anında "parlama" hissi verir. Bu, 6. katman eklemekten çok daha hafif ve GBA'ya daha uygundur.
- Stok görsel aktörlerde **en kritik iyileştirme** neredeyse her zaman anticipation fazıdır (§8.C); çünkü donmuş bir poz, "niyet" anlatamaz — onu animasyonun kendisi vermelidir.

### I. Pounce-Type Anticipation Morphology (Sıçrama Tipi Ön Hazırlık Morfolojisi)

- §8.C anticipation'ın **varlığını** şart koşar, ancak her saldırı tipi farklı bir anticipation **geometrisi** gerektirir. Yanlış geometri, "yanlış kas grubu" hissi vererek fiziksel inandırıcılığı bozar:
  - **Spin / Kırbaç saldırıları** (Charmander Fire Tail, Ponyta Flame Tail): Aktör geriye doğru döner veya çevrilir → *coil* (rotasyonel geri sarım) → savurma. Anticipation ekseni **rotasyoneldir**.
  - **Pounce / Sıçrama saldırıları** (Growlithe Flare, Rapidash Stomp): Aktör aşağıya çömelir (`scaleY` compress, `translateY` down) → yay gibi sıkışır → ileri/yukarı fırlar. Anticipation ekseni **dikey compress + yatay geri çekilme**dir.
  - **Jet / Püskürtme saldırıları** (Horsea Ink Jet, Squirtle Water Gun): Aktör hafifçe geriye yaslanır (*expulsion recoil*, §1.C) → püskürtme. Anticipation ekseni **gövde geri eğimi**dir.
- **Kural:** Anticipation fazının geometrisi, saldırının fiziksel mekaniğiyle eşleşmelidir. Bir pounce'a spin anticipation (veya tersi) koymak, izleyicinin "bu hareket nereden geldi?" sorusunu yanlış cevaplamasına yol açar.
- **Growlithe mevcut durumu:** `gbaGrowlitheActorPounce` keyframe'inde 0%→12% arası sadece fade-in + hafif translate vardır; gerçek bir çömelme/compress fazı yoktur. İyileştirme: 0% appear → 6% `scaleY(0.88) translateY(4px)` (çömelme) → 12% mevcut pozisyon → 28% fırlama.

### J. Particle Count vs. Spacing Trade-off (Parçacık Sayısı – Aralık Dengesi)

- §8.D stagger'ın nedenselliğe bağlanmasını söyler, ancak **parçacık sayısı ile aralık arasındaki dengeye** değinmez:
  - **6+ parçacık × eşit Δt** (ör. 6 cinder × 0.06s): Mekanik, makine tüfeği hissi verir. Göz bireysel parçacıkları takip edemez; tek bir "taneleme" olarak algılar.
  - **4–5 parçacık × nedensellik-bağlı Δt** (ör. 0.12s, 0.22s, 0.34s, 0.48s): Her parçacık ayrı bir "olay" olarak okunur; izleyici "birinci koptu, ikincisi biraz sonra, üçüncüsü en son" diye sıralı takip eder.
- **Pratik tavan:** GBA estetiğinde tek bir cinder/ember sistemi için **4–5 parçacık** yeterlidir. 6+ gerekiyorsa, bunları iki ayrı nedensellik grubuna bölün (ör. "pençe kalkışı cinder'ları" + "yele savrulması cinder'ları") ve **gruplar arası boşluğu grup içi boşluktan büyük** tutun.
- **Growlithe mevcut durumu:** 6 cinder, eşit 0.06s aralıkla (0.12→0.18→0.24→0.30→0.36→0.42). İyileştirme: 4–5 cinder'a düşürüp delay'leri nedensellik zincirine bağlamak (ör. 0.12, 0.22, 0.34, 0.48).

### K. Duration Envelope Coordination (Süre Zarflarının Koordinasyonu)

- Birden fazla bağımsız animasyonun aynı anda çalıştığı katmanlı yapılarda, her katmanın kendi süresi + delay'i **toplam zarfı aşmamalıdır**:
  - **Formül:** Her katman için `animation-delay + animation-duration ≤ total envelope`.
  - Envelope'ı aşan katmanlar, aktör kaybolduktan sonra "havada asılı" kalır ve sahnenin bittiği hissini geciktirir.
- **Growlithe mevcut durumu (denetim — son iterasyon sonrası):**
  - Aktör pounce: 1.75s ✓ (zarfın kendisi)
  - MouthTorrent: 0s + 1.75s = 1.75s ✓ (child-nested, §8.M)
  - CombustionBurst: 0.85s + 0.8s = 1.65s ✓
  - DiagonalBeam: 0.95s + 0.6s = 1.55s ✓
  - TrailingCinder (son parçacık): 0.46s + 1.3s = 1.76s ≈ 1.75s ✓ (düzeltildi; öncesi 0.42+1.5=1.92s ✗)
- **Not:** §8.N gereği accent delay'leri ileri kaydırıldığında (ör. Beam 0.18s → 0.95s), `delay + duration` toplamı envelope'a karşı **yeniden** kontrol edilmelidir. Delay'i artırmak peak'i geciktirir ama toplam süreyi de uzatır; envelope aşımı riski doğurur.
- **Kural:** Yeni bir katman veya parçacık eklerken, `delay + duration` toplamını mevcut envelope'a karşı kontrol etmek **zorunlu** bir denetim adımıdır.

### L. Internal Keyframe Hold Budget (Keyframe-İçi Bekleme Bütçesi)

- §8.K formülü (`external delay + duration ≤ envelope`) yalnızca CSS `animation-delay` ile katman süresini denetler. Ancak keyframe gövdesinin **içinde** bir `%0 → %N` aralığı "boş hold" (opacity 0, scale küçük, transform değişimsiz) olarak tanımlanmışsa, bu hold da toplam algılanabilir aksiyon bütçesinden yer.
- **Formül:** `hold% × duration` kadar süre "ölü" geçer. Efektif aksiyon süresi = `duration × (1 − hold%)`. Bu süre sahnenin algılanabilir temposunu doğrudan düşürür.
- **Eşik:** Tek bir katmanda hold bütçesi `%25`'i aşmamalıdır. `%25` üzeri hold'lar, izleyicinin "bir şey bekliyor" hissini kırar ve sahnenin ritmini bozar.
- **Charmander Ember tespit:** `gbaCharmanderOrganicBloom` `%28` hold (0.448s ölü süre), `gbaCharmanderHeatRipple` `%30` hold (0.48s ölü süre) → her ikisi de %25 eşiğini aşıyordu. Düzeltme: Bloom → `%18`, Ripple → `%22`.
- **Kural:** Yeni bir keyframe yazarken veya mevcut birini denetlerken, `0%` ile ilk anlamlı aksiyon keyframe'i arasındaki yüzdelik hold'u hesaplamak ve `%25` eşiğine karşı kontrol etmek **zorunlu** bir denetim adımıdır. Hold'u azaltmak, aynı `duration` değerinde daha erken ve daha dinamik bir giriş sağlar; envelope'ı uzatmaya gerek kalmaz.

### M. Actor–Emitter Trajectory Synchronization (Aktör–Emisyon Yörünge Senkronizasyonu)

- Bir aktör hareket ederken aynı anda bir efekt yayıyorsa (ağızdan alev, kuyruktan kıvılcım, pençeden şok dalgası), emisyon katmanının translate yörüngesi aktörün hareket vektörünü **her ortak keyframe yüzdesinde** takip etmelidir.
- **Yaygın hata:** Emisyon katmanı kendi bağımsız translate eğrisine sahiptir ve aktörden daha yavaş hareket eder. Sonuç: efekt, aktörün gövdesi üzerinde "geride kalır", boyun/kürk/gövde bölgesini kaplar ve aktörün okunabilirliğini bozar.
- **Kural:** Her ortak keyframe yüzdesinde (ör. %28, %46, %68) emisyon katmanının translate değeri, aktörün translate değerinden **en fazla ±4px** sapmalıdır. Aktör geri çekilirken emisyon da aynı yönde geri çekilmelidir.
- **Tercih edilen yaklaşım — DOM hiyerarşisi (child-nesting):** Emisyon katmanı bağımsız bir kardeş (sibling) katman olduğunda manuel translate senkronizasyonu (±4px kuralı) gerekir. Bunun yerine emisyon katmanı **aktör katmanının child'ı olarak yuvalanırsa**, emisyon aktörün transform'unu (translate/scale/rotate) otomatik devralır ve emisyon noktası kilidi (ör. ağız) manuel keyframe yazmadan korunur. Bu yaklaşım senkronizasyon hatası riskini ortadan kaldırır ve **öncelikli tercih**tir. Emisyon katmanının keyframe'i bu durumda **saf volumetrik büyüme** (yalnızca scale + rotate, translate yok) olmalıdır. Child-nesting yalnızca emisyonun aktörden tamamen ayrılıp bağımsız bir yörünge izlemesi gereken durumlarda (ör. projeksiyon/menzilli saldırı) kullanılmaz; o durumda ±4px translate kuralı devreye girer.
- **Transform-origin:** Emisyon katmanının `transform-origin` değeri, emisyon noktasına (ağız, pençe ucu, kuyruk sonu) sabitlenmelidir. Böylece `scale` büyümesi aktöre doğru değil, dışa doğru genişler. Varsayılan `center` origin kullanılmamalıdır.
- **Scale oranı sınırı:** Emisyon katmanının maksimum scale değeri, aktörün maksimum scale değerinin **3 katını** aşmamalıdır. Aksi halde volumetrik genişleme aktörü görsel olarak yutar.
- **Opacity decay:** Aktörün geri çekilme fazından itibaren emisyon katmanının opacity'si hızla düşürülmelidir (ör. %75'te 0.8, %88'de 0.4). Bu, kalan taşmayı görsel olarak önemsiz kılar.
- **Growlithe Flare tespit (öncesi/sonrası):**
  - Önceki: Torrent bağımsız sibling katman; 28%'de `translate(8,-8)`, aktör 28%'de `translate(18,-16)` → **Δ10px sapma**. Torrent max scale 1.24, aktör max 1.08 → oran 1.15 ✓ ama mutlak boyut 96px×1.24=119px aktörün 106px genişliğini aşıyordu. Transform-origin varsayılan `center`.
  - Sonrası: Torrent, aktör katmanının **child'ı** olarak yuvalandı → aktörün pounce transform'unu devralır, ağız kilidi otomatik korunur. Keyframe saf volumetrik büyüme (translate yok, yalnızca scale + rotate), transform-origin ağız noktası (%15, %85), 120px kutu, peak scale 1.22 (oran 1.22/1.08 = 1.13 < 3.0), rotate -24°→-32° (dik diyagonal çıkış), tam opaklık penceresi %32–%60, %75 sonrası hızlı opacity decay.

### N. Accent Layer Peak Sequencing (Vurgu Katmanlarının Peak Sıralaması)

- Katmanlı efekt kompozisyonlarında kısa süreli, yüksek z-index'li **vurgu (accent)** katmanları (lens flare beam, combustion burst, yıldız flaş, şok halkası) birincil efekti **vurgulamak** için vardır; birincil efektin yerini almak için değil. Bu nedenle accent peak'i, birincil efektin peak'inden **sonra** gelmelidir.
- **Formül:** Her katman için `peak_time = animation-delay + duration × peak%`. Accent katmanları için **kural:** `accent peak_time ≥ primary peak_time + 0.15s` (en az 150ms marj).
- **Yaygın hata:** Accent katmanları erken başlar (0.18–0.22s gibi kısa delay'ler) ve birincil efektin peak'inden önce veya aynı anda peak yapar. Z-index'leri de yüksek olduğundan, birincil efektin en görünür olması gereken anda üzerini tamamen örter. Sonuç: saldırı farklı bir hareket gibi okunur (ör. alev saldırısı yerine kafa vurma gibi) ve efektin kimliği kaybolur.
- **Okunabilirlik bütçesi:** Birincil saldırı efektinin, duration'ın **en az %25'i** kadar süren bir tam opaklık (opacity 1) penceresi olmalıdır. Bu pencere süresince hiçbir accent katmanı peak opacity fazında olmamalıdır.
- **Z-index sıralaması:** Birincil efektin peak penceresi boyunca, accent katmanları ya henüz başlamamış (opacity 0) ya da düşük opacity'de olmalıdır. Accent'lerin z-index'inin yüksek olması sorun değildir — sorun, peak zamanlarının çakışmasıdır.
- **Growlithe Flare tespit (öncesi/sonrası):**
  - Önceki: Torrent peak 0.81s (1.75s × %46). Beam peak 0.49s (0.18 + 1.2×%26), Burst peak 0.75s (0.22 + 1.4×%38) → her ikisi de torrent'in yükseliş/peak fazını örtüyordu; alev "tam parlayacakken" yıldız parlaması üzerini kapatıyordu.
  - Sonrası: Beam → 0.95s delay + 0.6s duration → peak ≈ 1.11s; Burst → 0.85s delay + 0.8s duration → peak ≈ 1.15s. Her iki accent de torrent'in 0.81s peak'inden ~0.3s sonra geliyor ve alevin sönümlenme fazında "impact accent" olarak çalışıyor. Torrent tam opaklık penceresi %32–%60'a (0.56–1.05s) uzatıldı.


### O. Actor Materialize & Exit Keyframe Density (Aktör Belirme/Çekilme Keyframe Yoğunluğu)

- Bir aktörün (stok görsel, sprite) sahneye girişi ve çıkışı, tek bir `opacity 0→1` veya `opacity 1→0` geçişiyle değil, **en az 3 ara keyframe** ile modellenmelidir.
- **Belirme (Materialize) kuralı:**
  - `%0` (invisible) ile ilk anlamlı aksiyon keyframe'i arasında en az **1 ara keyframe** olmalıdır (ör. `%6`'da `opacity: 0.45, blur: 1.5px`). Bu, "pop-in" hissini ortadan kaldırır.
  - Belirme anında hafif **overshoot + settle** (ör. `%12`'de `scale(1.03)`, `%16`'da `scale(0.98)`) canlı bir "snap" hissi verir. Mekanik doğrusal büyüme yerine elastik bir giriş sağlar.
  - Blur geçişi: `blur(3px)` → `blur(1.5px)` → `blur(0)` şeklinde kademeli olmalıdır. Doğrudan `blur` → `drop-shadow` geçişi ani bir filter kopukluğu yaratır.
- **Çekilme (Exit) kuralı:**
  - Çıkış tamamen doğrusal bir küçülme + solma olmamalıdır. En az bir **"nefes alma" duraksaması** (micro breath-pause) içermelidir: exit'in başlamasından hemen önce scale'de hafif bir bump (ör. `0.97 → 0.99`) ve translate'de kısa bir duraksama.
  - **Filter bridge:** `drop-shadow` ile `blur` arasında ani bir geçiş olmamalıdır. İkisinin bir arada olduğu bir ara keyframe (ör. `drop-shadow(..., 0.25) blur(0.5px)`) filter kopukluğunu önler.
  - **Per-segment timing-function:** Çıkış segmentlerinde `animation-timing-function: ease-in` kullanılmalıdır. Global easing (ör. `cubic-bezier(0.18, 0.95, 0.28, 1)`) her segmente uygulanır ve çıkış segmentlerinde "hızlı başla, yavaş bitir" hissi yaratarak stutter benzeri bir etki üretir. `ease-in` çıkışta "yavaş başla, hızlanarak kaybol" hissi verir.
- **Sustained power hold:** Aktörün "savaş duruşu" fazı ile çıkış fazı arasında en az bir **güç koruma keyframe'i** olmalıdır. Bu, aktörün erken "sarkmasını" önler ve izleyicinin karakteri güçlü algılamasını uzatır.
- **Charmander Ember ActorLunge tespit (öncesi/sonrası):**
  - Önceki: 9 keyframe; belirme `0%→12%` tek sıçrama (opacity 0→0.95, scale 0.72→0.96); çıkış `70%→86%→100%` doğrusal sönümleme; filter `drop-shadow` → `blur` ani geçiş; 50%→70% arası erken sarkma.
  - Sonrası: 14 keyframe; belirme `0%→6%→12%→16%` (smooth materialize + overshoot settle); çıkış `70%→75%→78%→86%→100%` (breath-pause + filter bridge + ease-in); 60% sustained power hold.
- **Kural:** Bir aktör animasyonu yazarken veya denetlerken, belirme ve çekilme fazlarındaki keyframe sayısını ve filter geçiş sürekliliğini kontrol etmek **zorunlu** bir denetim adımıdır.

### P. Card-Level Reaction Shudder (Kart Düzeyinde Tepki İrkilmesi)

- Bir kart üzerinde iyileştirme, hasar veya durum değişikliği gerçekleştiğinde, **efekt katmanı** (ikon, parçacık) ile **kart konteyneri** eş zamanlı tepki vermelidir. Yalnızca ikon sallanması, kartın "dış dünyadan kopuk" hissettirmesine neden olur.
- **Desen:** Kart konteynerine hafif bir `translateY` + `scale` + mikro `rotate` kombinasyonu uygulanır. İrkilme, "canlanma" hissi vermelidir — sert bir sarsıntı değil, hafif bir yukarı kalkma + bloom + sönümlenen titreşim.
- **Senkronizasyon kuralı:** Kart shudder'ının `animation-delay` değeri, mevcut ikon/efekt shudder'ının delay'i ile **birebir eşleştirilmelidir**. Böylece kart ve ikon aynı anda irkilir.
- **Keyframe yapısı (örnek — `fxHealCardShudder`):**
  - `0%`: nötr (transform: none)
  - `~15%`: hafif yukarı kalkma (`translateY(-2px)`) + scale bloom (`1.012`)
  - `~30%`: mikro geri dönüş (`translateY(0.5px)`) + scale settle (`0.998`)
  - `~50%`: ikinci mikro titreşim (`translateY(-0.5px) rotate(0.3deg)`)
  - `100%`: nötr
- **Uygulama noktası:** `GameBoard.tsx`'de her kart slotunun render'ında `shakeType` union tipine yeni bir değer eklenir (ör. `'heal'`). Trigger noktaları (CPU AI + Player elden oynama) `triggerSlotShake(slotIndex, 'heal', delay, duration)` çağrısı yapar.
- **Kural:** Yeni bir kart tepki efekti eklerken: (1) CSS keyframe + class tanımla, (2) `activeShakes`/`slotShakes` tipini genişlet, (3) tüm render noktalarına branch ekle, (4) tüm trigger noktalarına çağrı ekle, (5) delay'i mevcut ikon efektiyle senkronize et.

### Q. Progressive Filter Depth in Keyframes (Keyframe'lerde Progresif Filter Derinliği)

- Bir keyframe bloğu yalnızca `transform` ve `opacity` animasyonu taşımamalıdır; `filter` derinliği de keyframe boyunca **progresif olarak artmalı ve sönümlenmelidir**.
- **Desen (Kangaskhan Comet Punch — 5-stop keyframe'ler):**
  - `%0`: `filter: none` veya minimal `drop-shadow(0 0 2px rgba(..., 0.3))` — belirme anı, henüz enerji birikmemiş.
  - `%25`: `filter: drop-shadow(0 0 4px ...)` — ilk enerji birikimi.
  - `%50`: `filter: drop-shadow(0 0 8px ...) drop-shadow(0 0 14px ...)` — tepe parlama; **zincirleme çift drop-shadow** ile iç ve dış hale ayrışır.
  - `%75`: `filter: drop-shadow(0 0 5px ...)` — sönümleme başlangıcı; tek drop-shadow'a geri dönüş.
  - `%100`: `filter: none` veya `blur(1px)` — tamamen sönüm.
- **Kural:** 4-stop'tan 5-stop'a geçiş, yalnızca bir ara keyframe eklemek değil, **filter zincirinin tepe noktasında çift katmana çıkmasını** sağlar. Bu, "parlama → sönüm" geçişinin lineer değil, **asimetrik ve organik** hissettirmesini sağlar.
- **Uygulama maliyeti:** Sıfır yeni katman; yalnızca mevcut keyframe bloğuna bir `%50` stop'u ve `filter` değerleri eklenir. GPU maliyeti ihmal edilebilir düzeydedir (drop-shadow compositing).
- **Kangaskhan Comet Punch doğrulaması:** 4 keyframe bloğu (`Ring`, `Star`, `Spark`, `Dust`) 4 stop'tan 5 stop'a genişletildi ve her birine progresif `drop-shadow` zincirleri eklendi. Sonuç: starburst'ın tepe anında çift haleli akkor parlama, sönümde ise tek haleli yumuşak kaybolma elde edildi.

### R. Concentric Multi-Element Architecture (Eşmerkezli Çoklu Eleman Mimarisi)

- Tek bir elemanla temsil edilen şok dalgası, yıldız patlaması veya toz halkası **yetersiz derinlik** sunar. Aynı bilgiyi veren 2–3 eşmerkezli eleman, tek bir elemanın yerine geçtiğinde katman sayısı artmaz ama **algılanan derinlik** önemli ölçüde artar.
- **Ring deseni (Kangaskhan Comet Punch):**
  - İç elips: `stroke-width: 2.5`, `opacity: 0.95`, `scale` peak `1.18` — keskin birincil şok cephesi.
  - Orta elips: `stroke-width: 1.5`, `opacity: 0.6`, `scale` peak `1.32` — ikincil yankı dalgası; hafif `animation-delay: +30ms`.
  - Dış elips: `stroke-width: 1`, `opacity: 0.35`, `scale` peak `1.45` — atmosferik dağılma halkası; `animation-delay: +60ms`.
  - Üç elips aynı SVG `<svg>` konteyneri içinde olduğundan, tek bir `animation` uygulaması yeterlidir; gecikmeler `style` ile bireysel olarak atanır.
- **Starburst deseni (Kangaskhan Comet Punch):**
  - 12 noktalı polygon; noktalar dönüşümlü olarak uzun (`r_outer`) ve kısa (`r_inner`) yarıçaplara sahiptir.
  - Kromatik hiyerarşi: Merkez `#ffffff` (akkor) $\rightarrow$ orta halka `#fef08a` (limon) $\rightarrow$ dış uçlar `#f59e0b` (amber).
  - Her noktanın uzunluğu ±%8–12 rastgele varyasyonla farklılaştırılarak mekanik simetri kırılır.
- **Dust deseni (Kangaskhan Comet Punch):**
  - 3–4 çok loblu Bézier `Q`-path bulutu; her biri farklı `scale`, `opacity` ve `animation-delay` ile konumlandırılır.
  - Loblar arası açı farkı eşit değildir (ör. 70°, 95°, 80°, 115°); bu, "kalıp baskı" hissini önler.
- **Meta-ilke:** Eşmerkezli çoklu eleman, §8.F'deki "katman ekleme"den farklıdır: **yeni bir katman veya z-index eklenmez**; mevcut tek bir katmanın iç geometrisi zenginleştirilir. Bu, anti-bleed bütçesini ve DOM derinliğini etkilemez.
- **Kangaskhan Comet Punch doğrulaması:** Ring (3 eşmerkezli elips), Star (12 noktalı incandescent starburst), Dust (çok loblu Bézier bulutlar) — tümü tek bir SVG konteyneri içinde, katman sayısı değişmeden, görsel derinlik önemli ölçüde artırıldı.

### S. Strike-Snap Kinematics & Electrical Flicker Timing (Çarpma-Anı Kinematiği ve Elektriksel Titreşim Zamanlaması)

- **Strike-Snap Deseni (Top-Origin ScaleY Snap):** Yıldırım, şimşek veya benzeri "gökten inen" fenomenlerde; nesnenin yukarıdan aşağıya doğru kademeli olarak çizilmesi (`stroke-dashoffset` draw-on) yerine, **ani bir snap** ile tam boyutta belirmesi fiziksel gerçekliğe daha uygundur. Gerçek şimşek "çizilmez"; **aniden vardır**.
  - **Uygulama:** `transform-origin: top center`; `%0`'da `scaleY(0.15)` (neredeyse görünmez bir çizgi), `%8`'de `scaleY(1.04)` (hafif overshoot ile tam boyut). Bu 8%'lik pencere (~116ms, 1.45s duration'da), izleyicinin "bir anda belirdi" algısını üretir.
  - **Overshoot:** `scaleY(1.04)` → `%14`'te `scaleY(1.0)` settle. Bu 4%'lük overshoot, "çarpma anında zemin hafifçe esnedi" hissi verir; mekanik `scaleY(1.0)` duruşundan daha organiktir.
  - **Karşıt örnek (kaçınılacak):** `stroke-dashoffset: 1 → 0` draw-on animasyonu, şimşeği "yukarıdan aşağıya çizilen bir kalem" gibi gösterir; bu, elektrik deşarjının fiziksel doğasına aykırıdır ve "yapay, yavaş, dekoratif" hissi verir.
- **Voltage Flicker Deseni (Voltaj Titreşimi):** Strike-snap'in hemen ardından, elektriksel kararsızlığı anlatan bir **opacity osilasyonu** gelir:
  - `%8`: `opacity: 1` (tam parlama, peak `drop-shadow(0 0 22px rgba(253,224,71,0.8))`)
  - `%14`: `opacity: 0.55` (ilk sönüm — voltaj düşüşü)
  - `%22`: `opacity: 1` (ikinci parlama — voltaj toparlanması, `drop-shadow(0 0 18px #fde047)`)
  - Bu 14%'lük pencere (~200ms), gerçek elektrik deşarjındaki "flicker" karakterini taklit eder. Tek bir `opacity: 1 → 0` fade-out yerine, **asimetrik bir çift nabız** izleyiciye "enerji hâlâ akıyor" sinyali verir.
- **Dissipation Tail (Sönüm Kuyruğu):** Flicker'ın ardından gelen %42–%100 arası, kademeli opacity düşüşü + progresif `blur` artışı ile modellenir:
  - `%42`: `opacity: 0.85`
  - `%62`: `opacity: 0.7`
  - `%82`: `opacity: 0.35; filter: blur(1px)`
  - `%100`: `opacity: 0; transform: scaleY(1.02); filter: blur(2px)`
  - Blur'ün kademeli artışı (0 → 1px → 2px), "enerji dağılıyor, ışık kırılıyor" hissi verir. Ani `opacity: 0` kesimi yerine, blur + opacity birlikte sönümlenir.
- **Easing:** Strike-snap için `cubic-bezier(0.2, 0.85, 0.3, 1)` (hızlı çıkış, kontrollü durulma) kullanılır. Bu, §8.E tablosundaki "fırlayan nesne" easing'inden farklıdır; burada nesne fırlamıyor, **beliriyor ve yerinde kalıyor**.
- **Cloud as Anticipation (Bulut Ön Hazırlık Fazı):** Strike-snap'ten önce gelen fırtına bulutu (§2.I'deki filled polygon bolt'un kaynağı), §8.C anticipation ilkesinin **çevresel** bir uygulamasıdır. Aktörün kendisi geri çekilmek yerine, sahnenin atmosferi (bulut) "bir şey geliyor" sinyalini verir: `translateY(-16px) scale(0.7)` → `translateY(0) scale(1.04)` ile 26%'da tam belirme, ardından 80%'de `translateY(4px) scale(0.96)` ile hafif çökme. Whiff'te bulut aynı zamanlamada ama sönük (`opacity: 0.4` peak) ve daha küçük (`scale(0.75)` peak) kalır; bolt ve impact bastırılır.
- **Zapdos Thunder FAZ7d doğrulaması:** `gbaZapdosThunderBoltStrike` keyframe'i 8 stop içerir (0%, 8%, 14%, 22%, 42%, 62%, 82%, 100%). Strike-snap 0–8% arası (~116ms), flicker 8–22% arası (~200ms), dissipation 22–100% arası (~1.13s). Toplam 1.45s duration, `getFXDuration` ile senkronize. Impact katmanı 0.28s delay ile bolt'un çarpma anından ~200ms sonra başlar (nedensellik zinciri: bolt → impact → sparks).

### T. Scatter vs. Embed Dual Particle Behaviour (Saçılma vs. Gömme İkili Parçacık Davranışı)

- **İkili Parçacık Kaderi:** Aynı saldırı içinde iki farklı parçacık davranışı tanımlanabilir: **saçılma (scatter)** ve **gömme (embed)**. Her ikisi de aynı SVG geometrisini (buz shard polygon) kullanır, ancak farklı `@keyframes` bloklarıyla farklı fiziksel kaderler yaşar.
  - **Scatter (`gbaBlizzardIceShard`):** Parçacık dışarıdan gelir (`translate(var(--shard-ox), var(--shard-oy))`), merkezden geçer ve karşı tarafa savrulur (`* -1.2`). Son keyframe'de `filter: blur(1px)` ile bulanıklaşarak kaybolur. Bu, "rüzgârla savrulan moloz" davranışıdır.
  - **Embed (`gbaBlizzardIceShardEmbed`):** Parçacık dışarıdan gelir, hedef noktada **durur** (`translate → 0`), impact wobble ile "saplanır" (`scale(1.15)` overshoot → `scale(1.0)` settle), ardından `blur(1px)` ile fade-out. Bu, "karta saplanan buz kırığı" davranışıdır.
- **Kader Keyframe'de Tanımlanır:** Parçacığın geometrisi (polygon points, boyut, renk) her iki davranışta da aynıdır; yalnızca keyframe'in terminal davranışı değişir. Bu, "aynı nesne, farklı fiziksel sonuç" prensibini kod düzeyinde gerçekleştirir ve DOM/SVG maliyetini artırmaz.
- **CSS Custom Property Paylaşımı:** Her iki keyframe bloğu da aynı custom property şemasını kullanır (`--shard-ox`, `--shard-oy`). TSX tarafında parçacık yalnızca hangi keyframe'i kullanacağını seçer (`gbaBlizzardIceShard` vs `gbaBlizzardIceShardEmbed`); başlangıç offset'i aynı mekanizmayla iletilir. Bu, §2.J'deki parametrik sürücü prensibinin ikili davranış uzantısıdır.
- **Blizzard FAZ6 doğrulaması:** 6 scatter shard (1.3s, `cubic-bezier(0.25, 0.8, 0.35, 1)`, CSS L15505) + 4 embed shard (1.15s, `cubic-bezier(0.2, 0.85, 0.3, 1)`, CSS L15522). Embed shard'lar daha kısa süreli ve daha keskin easing ile "saplanma" hissini güçlendirir. TSX L19278–19326. Her iki grup `npx tsc --noEmit` hatasız.

### U. Concentric Psychic Ring Architecture & Layered Meditation (Eşmerkezli Psişik Halka Mimarisi ve Katmanlı Meditasyon)

- **İlke:** Psişik/mistik saldırılarda (Meditate, Confuse Ray, Psychic) eşmerkezli halka genişlemesi, tek bir halka yerine **kademeli stagger'lı 3–4 halka** olarak modellenmelidir. Her halka farklı `stroke-width`, `opacity` ve `animation-delay` ile konumlandırılır; bu, "tek bir enerji dalgası" yerine "katmanlı psişik rezonans" hissi verir.
- **Meditate Zen 6-Katman Mimarisi (doğrulanmış desen):**
  1. **Core Breathe:** İç psişik çekirdek — radyal gradyan SVG, `scale(0.3→1.15→1.0)` nefes döngüsü, §1.C psişik kromatik hiyerarşi (`#ffffff → #c7d2fe → #818cf8 → #4f46e5`).
  2. **4 Staggered Ring:** Eşmerkezli halkalar; `animation-delay: 0.12 + i × 0.18s` formülüyle kademeli; her halkanın çapı `60 + i × 26` px, stroke kalınlığı `3.5 − i × 0.6` px, opacity `0.85 − i × 0.12`. Bu formül, halkaların "aynı anda değil, ardışık rezonans dalgaları" olarak okunmasını sağlar.
  3. **5 Orbit Motes:** Eliptik yörüngede dönen psişik parçacıklar; §4 uydu hareketi prensibiyle bağımsız konumlandırma (her mote farklı `left/top` ile trigonometrik dağılım). Whiff'te **bastırılır**.
  4. **Zen Mandala Halo:** Yavaş dönen kesikli çember bariyeri (`strokeDasharray: "8 6"` ve `"5 8"`); iç ve dış halka farklı dash pattern'lerle "kutsal geometri" hissi verir. Whiff'te **bastırılır**.
  5. **4 Sparkles:** Yükselen psişik zerreler; `animation-delay: 0.3 + i × 0.12s`, duration `1.1s` (toplam bitiş `0.3 + 3×0.12 + 1.1 = 1.76s ≈ 1.75s` envelope). Sparkle bitiş süreleri envelope'a uydurulmalıdır (§8.K).
  6. **Aura Veil:** Tam kart radial gradyan nefes (`radial-gradient(ellipse at center, rgba(99,102,241,0.18) ...)`); yalnızca `opacity` animasyonu, `transform` yok (çakışma önleme).
- **Whiff Bastırma Kuralı:** Orbit Motes ve Mandala Halo katmanları whiff'te koşulsuz bastırılır (render edilmez); Core Breathe opacity `0.45`'e düşürülür. Bu, "meditasyon başarısız oldu, enerji dağıldı" anlatısını verir.
- **Kural:** Yeni bir psişik halka animasyonu yazarken: (1) halka sayısı 3–4 arası (Meditate Zen) veya 6–8 (Konveyör varyantı, §U.2), (2) stagger formülü `base + i × step` (step ≥ 0.15s) veya konveyör için `RING_DUR / RING_COUNT` (§U.2), (3) her halkanın stroke/opacity'si dışa doğru azalır, (4) toplam `delay + duration` envelope'ı aşmaz (§8.K).
- **Meditate Zen doğrulaması:** 6 katman, 1.75s envelope, 4 sparkle × 1.1s + max delay 0.66s = 1.76s ≈ 1.75s ✓. Orbit ve Mandala whiff'te bastırılmış. TSX L15590–15664, CSS L2925–2964. `npx tsc --noEmit` hatasız.

#### U.2 — Phase-Locked Conveyor Variant (Faz Kilitli Konveyör Varyantı — Abra Psyshock Lite/Dense)

- **Bağlam:** Abra'nın `psyshock_lite_waves` (TSX L1950–2112) ve Kadabra'ya transfer edilen `psyshock_waves` (TSX L1733–1810), yukarıdaki Meditate Zen `base + i × step` formülünden **temelden farklı** bir stagger mimarisi kullanır. Bu varyant, "katmanlı rezonans" yerine "tek organizma gibi akan konveyör" hissi hedefler.
- **Konveyör Stagger Formülü:** `STAGGER = RING_DUR / RING_COUNT`. Halkalar eşit faz aralıklıdır; her halka bir öncekinin tam `1/N` oranı kadar gecikir. Bu, Meditate Zen'in `base + i × step` (step ≥ 0.15s sabit) formülünden ayrılır:
  - **Meditate Zen:** Sabit step → dış halkalar giderek daha geç başlar → "yayılım" hissi.
  - **Konveyör:** Oransal step (`D/N`) → tüm halkalar aynı hızda akar → "tünel/konveyör" hissi.
- **Halka Sayısı:** Konveyör varyantı 6–8 halka gerektirir (Meditate Zen'in 3–4'ünden fazla). Neden: eşit faz aralığında yeterli "doluluk" için minimum 6 halka gerekir; 4 halka ile konveyör akışı kesikli görünür.
- **Container Query Units (cqw) Zorunluluğu:**
  - Konveyör blokları `containerType: 'inline-size'` ile sarılır; tüm boyutlar `cqw` biriminde tanımlanır (`1cqw = kart genişliğinin %1'i`).
  - `PX2CQW = 0.343406` dönüşüm faktörü, referans görseldeki px değerlerini cqw'ya çevirir.
  - **Kural:** 6+ halkalı konveyör animasyonlarında `px` yerine `cqw` kullanılmalıdır; bu, kart genişliği değiştiğinde oranların korunmasını sağlar (§2.D DOM bütçesi ile uyumlu — responsive maliyet sıfır).
  - Kart yüksekliği `137.5cqw` olduğundan, `80cqw` tepe yayılım dikeyde taşma yapmaz.
- **Yoğunluk Hiyerarşisi (Lite vs Dense):**
  - Aynı konveyör mimarisi, aşağıdaki parametrelerle "lite" (Abra) ve "dense" (Kadabra/Super Psy) olarak ayrıştırılır:

  | Parametre | Lite (Abra) | Dense (Kadabra) |
  |-----------|-------------|-----------------|
  | RING_COUNT | 8 | 6 |
  | RING_DUR | 1.08s | 1.25s |
  | Bant kalınlığı | 1.0–1.57 cqw (ince kontur) | 7–14 px (kalın bant) |
  | Renk doygunluğu | Pastel (#f472b6, #67e8f9, #fde68a) | Vivid (#d946ef, #a855f7, #ec4899) |
  | Toplam pencere | ~2.1s | ~2.2s |
  | Ek katman | 2 mottle + 12 speck + 3 core ring | Conic sheen + aura bloom + 8 spark |

  - **Kural:** Lite→Dense geçişinde halka sayısı **azalır** (8→6) ama bant kalınlığı **artar**; bu, "daha az ama daha güçlü" görsel okuması verir.
- **Suluboya Doku Katmanı (Referans Sadakati):**
  - Lite varyant, referans görseldeki suluboya pigment lekelerini taklit eder: 2 büyük mottle blot (`blur(2.6cqw)`, çoklu `radial-gradient`, opacity-only `gbaPsyshockLiteMottle` keyframe) + 12 küçük speck (nokta/çizgi, `gbaPsyshockLiteSpeck 0.8s ease-out`, stagger 0.15–1.0s).
  - **Kural:** Doku katmanları yalnızca `opacity` animasyonu kullanır; `transform` veya `scale` kullanılmaz (konveyör halkalarının `scale` animasyonuyla çakışmayı önler).
- **Merkez Yoğunluk Kompansasyonu:**
  - Konveyör halkaları dışa doğru aktığında merkezde "anulus boşluğu" oluşur. Bu boşluk, 3 sıkı çekirdek halkası (`gbaPsyshockLiteCoreRing`, çap `15 + k × 4.75` cqw) + parlak merkez çekirdeği (`gbaPsyshockCoreTick`) ile doldurulur.
  - Çekirdek katmanı `z-30`'da (halkaların `z-20`'si üzerinde) konumlanır; bu, halkalar keskin kalırken merkezde parlak sustain sağlar.
- **Abra Psyshock doğrulaması:** Lite: 8 halka, STAGGER = 1.08/8 ≈ 0.135s, toplam pencere 0.05 + 7×0.135 + 1.08 ≈ 2.08s ≈ 2.1s (getFXDuration 2100) ✓. Dense: 6 halka, STAGGER = 1.25/6 ≈ 0.208s, toplam ~2.2s ✓. Her iki varyant `containerType: 'inline-size'` + `cqw` kullanır. TSX L1950–2112 (lite), L1733–1810 (dense). `npx tsc --noEmit` hatasız.

### V. Elemental Branching in Shared Move Templates (Paylaşılan Hareket Şablonlarında Elementel Dallanma)

- **İlke:** Aynı hareket adı birden fazla Pokémon tarafından kullanıldığında (örn. Double Slap: Jynx, Poliwhirl, Wartortle), **tek bir animasyon şablonu** yazılır ve Pokémon tipine göre koşullu katmanlar eklenir. Bu, kod tekrarını önler ve tutarlılığı garanti eder.
- **Double Slap Elementel Dallanma Deseni (doğrulanmış):**
  1. **Ortak Taban:** Tüm Pokémon'lar için paylaşılan slap etkisi (impact flash, directional sparks, screen shake). Sparks `gbaDoubleSlapSparkPop 0.5s ease-out 0.71s forwards` ile 8 yöne dağılır.
  2. **Jynx Dalı (`isJynx`):** Psişik distorsiyon halkaları — `w-26 h-26` fuchsia border + `w-18 h-18` purple border, `gbaPsychicRing` keyframe'i ile genişler. Psikik tip kimliğini vurgular.
  3. **Wartortle Dalı (`isWartortle`):** Üçlü pençe kesik izleri — SVG `80x55` viewBox, 3 diagonal path (`strokeWidth: 3.5/3/3`), `scaleX(-1)` ile ayna, `gbaClawSlash 0.45s ease-out 0.71s forwards`. Su tipi pençe kimliğini vurgular.
  4. **Poliwhirl & Wartortle Dalı (`isPoliwhirl || isWartortle`):** Su damlası sıçrama yayları — 5 adet `w-3 h-3 rounded-full bg-cyan-100` parçacık, `gbaWaterSplashDrop 0.52s ease-out 0.71s forwards`. Su tipi elementel imza.
- **Dallanma Kuralları:**
  - Ortak taban her zaman render edilir; elementel katmanlar **yalnızca** ilgili Pokémon koşulu sağlandığında eklenir.
  - Elementel katmanlar ortak tabanın `animation-delay`'ini takip eder (burada `0.71s`); bağımsız zamanlama kullanılmaz.
  - Her dal en fazla 2 ek katman ekleyebilir (DOM bütçesi §2.D).
  - Whiff durumunda elementel katmanlar da bastırılır (ortak `fx.whiffed` kontrolü yeterli).
- **Double Slap doğrulaması:** Ortak 8 spark + Jynx 2 ring + Wartortle 3 slash + Poliwhirl/Wartortle 5 droplet = max 16 ek DOM node. TSX L2380–2460. `npx tsc --noEmit` hatasız.

### W. Dimensional Choreography & Teleport Layer Stacking (Boyutsal Koreografi ve Işınlanma Katman İstifleme)

- **İlke:** Boyutsal geçiş / ışınlanma animasyonları (Teleport, Vanish, Dimensional Warp) tek bir "kaybolma" efekti yerine **3 katmanlı bir koreografi** olarak modellenmelidir: (1) dış çevresel portal, (2) merkezi tekillik, (3) kaçan parçacıklar. Her katman farklı z-index, farklı easing ve farklı delay ile konumlandırılır.
- **Abra Vanish 3-Katman Deseni (doğrulanmış):**
  1. **Layer 1 — Dimensional Warp Tunnel (z-25):** Genişleyen portal diski; SVG `96x96`, radyal gradyan (`#ffffff → #e879f9 → #a855f7 → #581c87`), 3 eşmerkezli çember + 4 çapraz boyutsal yarıklar (`strokeDasharray`). Easing: `cubic-bezier(0.22, 1, 0.36, 1)` — hızlı başlangıç, yumuşak yerleşme. Duration: `1.35s`.
  2. **Layer 2 — Psychic Singularity (z-30):** Merkezi yoğun çekirdek; `w-14 h-14 rounded-full`, `bg-gradient-to-tr from-purple-900 via-fuchsia-500 to-white`, iç `w-6 h-6 bg-white` nokta. Easing: `cubic-bezier(0.25, 1, 0.5, 1)`. Duration: `1.3s`. Bu katman "her şey buradan kayboluyor" odak noktasını verir.
  3. **Layer 3 — Tachyon Sparks (z-35):** 6 adet yıldız parçacık; CSS custom properties (`--tx`, `--ty`) ile hedef offset, `cubic-bezier(0.2, 0.9, 0.3, 1)`, stagger delay `0.12–0.38s`. "Konverj → saçılma" davranışı: parçacıklar merkeze doğru çekilir, sonra dışarı savrulur.
- **Katman İstifleme Kuralları:**
  - z-index sıralaması **dıştan içe** artar: portal (en alt) → tekillik → parçacıklar (en üst).
  - Her katmanın easing'i farklıdır; aynı easing 3 katmanda kullanılmaz.
  - Toplam envelope: max(delay + duration) ≤ animasyon süresi. Abra Vanish: `0.38 + 1.25 = 1.63s ≤ 1.35s` envelope'ı aşmaz çünkü parçacıklar portal kapanmadan saçılır.
  - Whiff'te Layer 3 (parçacıklar) bastırılır; Layer 1–2 opacity düşürülerek "başarısız ışınlanma" hissi verilir.
- **Abra Vanish doğrulaması:** 3 katman, 6 parçacık × 1.25s + max delay 0.38s. TSX L13746–13810. `npx tsc --noEmit` hatasız.

### X. Attacking Limb Tier Precedent & Whiff Scaling (Saldıran Uzuv Tier Emsali ve Whiff Ölçeklendirme)

- **İlke:** Fiziksel olarak hedefe **çarpan** uzuvlar (el, pençe, yumruk, kuyruk darbesi) ile hedefe **fırlatılan** nesneler (kemik, kaya, mermi) farklı tier sınıflandırmasına tabidir. Çarpan uzuv **Tier 1**'dir; fırlatılan nesne **Tier 2**'dir.
- **Machamp Chop Emsali (kurucu vaka):** Machamp'ın 4 kollu chop animasyonu, saldıran uzvun kart genişliğinin ~%68'i oranında render edilmesi gerektiğini kanıtlamıştır. Bu emsal, tüm fiziksel çarpma animasyonları için bağlayıcıdır.
- **Double Slap Doğrulaması (Jynx / Poliwhirl / Wartortle):**
  - Orijinal el görseli: `~162px` genişlik (stok asset).
  - Tier 1 standardı: `108px` (normal) / `59px` (whiff) → orijinal görselin **2/3 oranında küçültülmesi**.
  - Whiff oranı: `59/108 ≈ 0.546` → §3.A'daki Tier 1 whiff bandı (`~54.5%`) ile tutarlı.
  - Görsel kütle: `108 × 138` box × ~%42 fill ≈ **6,266 px²** solid mass → Tier 1 üst bandında.
- **Sınıflandırma Karar Ağacı:**
  1. Uzuv hedefe fiziksel temas ediyor mu? → **Evet** → Tier 1.
  2. Nesne fırlatılıyor / atılıyor mu? → **Evet** → Tier 2.
  3. Küçük bio-organ (kuyruk alevi, zehir iğnesi) mı? → **Evet** → Tier 2.
  4. Belirsiz ise: "Bu nesne hedefin yüzeyine çarpıyor mu?" sorusuna göre karar ver.
- **Whiff Ölçeklendirme Kuralı:** Whiff durumunda saldıran uzuv, normal boyutun **~%54–55**'ine düşürülür. Bu, "ıskalayan darbe daha küçük görünür" algısını verir ve §3.A Tier 1 whiff bandıyla uyumludur.
- **Double Slap doğrulaması:** `108px` normal / `59px` whiff, 2/3 küçültme oranı, §3.A emsal notu eklendi. TSX L2300–2460. `npx tsc --noEmit` hatasız.

### Y. Keyframe Reuse, Evolution-Based Routing & Stock Asset Whiff Scaling (Keyframe Yeniden Kullanım, Evrim Bazlı Yönlendirme ve Stok Görsel Whiff Ölçeklendirme)

- **İlke:** Aynı görsel davranış (card blur, shockwave, aura) birden fazla hareket tarafından paylaşıldığında **aynı keyframe bloğu** yeniden kullanılmalı; yeni keyframe yazılmamalıdır. Evrim hattı boyunca yoğunluk artışı, routing katmanında (TSX `resolveFX`) çözülmeli; render katmanında değil.
- **Ders 1 — Keyframe Reuse (Super Psy Blast):**
  - Super Psy Blast'ın tam-kart `backdrop-filter: blur(3.5px)` overlay'i, Amnesia Mind Wipe'ın `gbaAmnesiaMindWipeCardBlur` keyframe'ini birebir yeniden kullanır (TSX L15440). Yalnızca `background` radyal gradyan renkleri psişik palette özelleştirilmiştir.
  - **Kural:** Aynı davranış (card blur + radial overlay) için ikinci bir keyframe yazmak gereksizdir. Renk/opacity farklılıkları `background` property'siyle çözümlenir; keyframe timing/easing profili paylaşılır.
  - Bu, CSS keyframe sayısını kontrol altında tutar ve §2.D DOM/CSS bütçesi ilkesine uyumludur.
- **Ders 2 — Evolution-Based Intensity Routing (Abra → Kadabra):**
  - Abra'nın `psyshock` hareketi `psyshock_lite_waves` (seyrek pastel halka rosetleri) olarak yönlendirilirken, Kadabra'nın aynı isimli hareketi **özel guard** ile `psyshock_waves` (yoğun faz kilitli v4 vortex konveyörü) olarak yönlendirilir (TSX L405–412).
  - **Kural:** Evrim hattı boyunca artan güç, routing fonksiyonunda **Pokémon adı koşulu** ile ayrıştırılır: `if (name.includes('psyshock')) return 'psyshock_lite_waves'` (Abra bloğu içinde) → `if (name.includes('super psy') && pkm.includes('kadabra')) return 'psyshock_waves'` (genel satırdan önce).
  - **Routing Öncelik Kuralı:** Spesifik (Pokémon-adı + hareket-adı) guard'lar, jenerik (yalnızca hareket-adı) satırlardan **önce** gelmelidir. Aksi halde jenerik satır spesifik guard'ı gölgeler (shadowing).
- **Ders 3 — Stock Image Whiff Scaling (Psybeam Kaleidoscope):**
  - Psybeam Kaleidoscope'ta stok görsel (`Alakazam_Psychic_Spoons.png`) whiff durumunda className koşulu ile küçültülür: `fx.whiffed ? 'w-[76px] h-[98px]' : 'w-[106px] h-[138px]'` (TSX L6073).
  - Whiff oranı: `76/106 ≈ 0.717` → görsel kütle oranı `(76×98)/(106×138) ≈ 0.512` → ~%51 küçülme. Bu, §3.A Tier 1 whiff bandıyla (`~54.5%`) uyumludur.
  - **Kural:** Stok görsel kullanan animasyonlarda whiff ölçeklendirmesi, `fx.whiffed` koşuluyla className'de yapılır; ayrı bir görsel dosyası oluşturulmaz.
- **Ders 4 — Whiff-Existence Anti-Pattern (Super Psy Blast):**
  - Super Psy Blast implementasyonunda (TSX L15431–15518) `fx.whiffed` kontrolü **bulunmamaktadır**. Hiçbir katman (card blur, core sphere, rings, warp wave, sparks) whiff durumunda bastırılmaz veya küçültülmez.
  - Bu bir **anti-pattern**'dir: her animasyon bloğu, whiff durumunda en az bir katmanı bastırmalı veya opacity/scale düşürmelidir. Aksi halde "ıskalayan" ve "isabet eden" saldırılar görsel olarak ayırt edilemez.
  - **Kural:** Yeni bir animasyon yazarken, her katman için `fx.whiffed` davranışı tanımlanmalıdır. Minimum: bir katman `opacity: 0.45` veya `scale(0.75)` ile bastırılmalıdır.
- **Kadabra doğrulaması:** Super Psy Blast keyframe reuse ✓, evolution routing guard önceliği ✓, Psybeam stock whiff `76x98/106x138` ✓. Super Psy Blast whiff-existence gap: bilinen anti-pattern, düzeltme adayı. TSX L15431–15518, L6063–6100, L405–412. `npx tsc --noEmit` hatasız.

### Z. Harmonic Acoustic Wave Train & Non-Scaling Front-Facing Radiations (Harmonik Akustik Dalga Treni ve Sabit-Piksel Vektörel Karşı-Perspektif Işımaları)

- **İlke:** Ağızdan veya kaynaktan doğrudan izleyiciye/hedefe (tam karşı perspektiften / head-on) patlayan akustik veya süpersonik ses dalgaları (Supersonic, Screech, Sonic Boom, Roar vb.), ekranı karmaşık çizgilerle boğan rastgele rotasyonlu bir "görsel çorba" yerine; **tek merkezden yayılan, sabit kontur kalınlığına sahip ve ekranda aynı anda en fazla 2–3 halkanın seyahat ettiği harmonik bir dalga treni** olarak inşa edilmelidir.
- **Anti-Pattern — The Visual Soup & Arbitrary Rotations (Görsel Çorba ve Rastgele Açı Tuzağı):**
  - Birden fazla dalga fazının her birine iç içe 3 çember + serbest açılı Bézier yayları koyup, bunları farklı açılarda (`rotate(28deg)`, `rotate(-22deg)`) döndürerek CSS `scale()` ile büyütmek; ekranda 12+ çember ve yay parçasının birbirini kesmesine ve rakip kartın yüzeyinin anlamsız bir çizgi karmaşasına / çorbaya dönüşmesine yol açar.
  - **Kural (Tek Merkez & Sıfır Açı Çarpıklığı):** Karşı perspektifli akustik yayılımlarda tüm dalgalar **tek bir ortak merkezden (single shared emission center)** çıkmalıdır. Dairesel akustik cepheler asla farklı açılarla döndürülmemeli (`rotate(0deg)` sabit kalmalı); eşmerkezlilik (concentricity) geometrik olarak bozulmamalıdır.
- **Anti-Pattern — The Stroke-Fattening Scale Trap (`vector-effect="non-scaling-stroke"` Koruması):**
  - CSS `transform: scale(0.18 → 1.78)` ile büyütülen SVG çemberlerinde; `vector-effect="non-scaling-stroke"` tanımlanmazsa, çemberin stroke kalınlığı da ölçekle birlikte katlanarak (ör. 2.4px $\rightarrow$ 4.3px $\rightarrow$ 6px) kaba, çamurlu ve pikselli şeritlere dönüşür.
  - **Kural:** Karşıdan izleyiciye doğru genleşen tüm vektörel halkalarda `vectorEffect="non-scaling-stroke"` zorunludur. Bu özellik, çember merkezden kart sınırına kadar ne kadar büyürse büyüsün, kontur kalınlığının ekran pikseli bazında kilitli (ör. 2.59px ana dalga + 1.3px iç rezonans) ve keskin kalmasını sağlar.
- **Anti-Pattern — Kesik Çizgili CAD Çemberi Yasağının İhlali:**
  - Hipnotik, sonik veya psiyonik dalgalarda `strokeDasharray` kullanımı (§1.I) kesinlikle yasaktır. Kesikli çizgiler ses dalgasını teknik çizim programı veya radar retikülü gibi hissettirir. Akustik cepheler, suluboyanın akışkan doğasına sadık, pürüzsüz, kesintisiz ve katı (`fill="none"`, `strokeLinecap="round"`) konturlarla çizilmelidir.
- **Harmonik Faz Zamanlaması ve Eşzamanlı Varlık Bütçesi (The 2–3 Simultaneous Ring Budget):**
  - 5 sıralı dalga cephesi (Gül Pembesi `#f472b6`, Limon Sarısı `#fde047`, Camgöbeği `#38bdf8`, Lavanta `#c084fc`, Mercan Pembesi `#fb7185`) düzenli `0.16s` aralıklarla (`0.06s`, `0.22s`, `0.38s`, `0.54s`, `0.70s`) doğar.
  - Her halkanın ömrü ~0.92s'dir ve terminal fazda (`%75` sonrasında) kademeli sönümleme (`opacity: 0.88 → 0.55 → 0.2 → 0`) yaşar.
  - Bu matematiksel zarf, ekranda aynı anda **kesinlikle en fazla 2 ila 3 halkanın** aktif görünmesini sağlar. Biri doğarken, biri zirvededir, biri ise kart sınırında kaybolur. Dalgalar kart sınırlarında asla birikmez ve kart illüstrasyonunu örtmez.
- **Suluboya Rezonans Çift Konturu (Dual-Contour Watercolor Bleed):**
  - Dış ana çember (`strokeWidth: 2.59px`, `%100` radius, `%95` opacity) + İç rezonans çemberi (`strokeWidth: 1.3px`, `~87%` radius, `%65` opacity, uyumlu açık renk). Bu çift kontur, suluboya kâğıdında suyun kururken kenarlara birikerek oluşturduğu doğal boya yoğunluğunu (watercolor edge bleed) taklit eder ve sıfır karmaşayla yüksek algılanan derinlik sunar.
- **Periferik Partikül Disiplini (Damlacık & Yıldız):**
  - Sersemlik yıldızları (`✦` 4-point Bézier) ve su damlacıkları merkezde dalgaların önüne geçmemeli; dalga konisinin dış periferisinde (`dx/dy: ~45–65px`) seyrek ve zarif (6 adet) süzülmelidir (`gbaShellderSonicDroplet`).
- **Shellder Supersonic Doğrulaması:** 5 sıralı pürüzsüz dalga, `strokeWidth="2.59"` (+%8 kalibrasyonlu) ana + `1.30` rezonans konturu, `vectorEffect="non-scaling-stroke"` koruması, sıfır `strokeDasharray`, tek merkez, 1.65s envelope (TSX L22011–22165, CSS L14089–14220). `npx tsc --noEmit` hatasız.

> **Terfi Notu:** §8'in ilkeleri, §7 gibi, kanıtlandıkça §§1–6'ya terfi ettirilebilir. Özellikle §8.G (zamanlama önceliği) ve §8.C (anticipation) evrensel animasyon ilkeleri olup, olgunlaştığında §1 veya §3'e taşınması beklenir. §8.U (psişik halka mimarisi), §8.V (elementel dallanma) ve §8.Z (harmonik akustik dalga treni) olgunlaştığında sırasıyla §2 ve §3'e terfi adaylarıdır. §8.X (saldıran uzuv tier emsali) §3.A'ya entegre edilmiştir. §8.Y Ders 2 (evrim bazlı routing) olgunlaştığında §4 routing mimarisine terfi adayıdır.

---

## 9. Stock Image Generation Prompt Standards (Stok Görsel Üretim Prompt'ları Standart Referans Kılavuzu)

> Bu bölüm, Articuno (Blizzard) ve Zapdos (Thunderbolt) stok görsel üretim turlarında kanıtlanan prompt mühendisliği kriterlerini, kanon doğrulama protokolünü ve teslim alma uygunluk kontrol listesini, gelecek tüm stok görsel istemleri için **genel geçer standart referans** olarak derler. §5'in işbirliği protokolünü tamamlar: asistan görsel üretmez; kullanıcı üretir, düzenler ve `public/assets/raw/` altına bırakır.

### A. Prompt Anatomy (Zorunlu 5 Blok)
Her stok görsel üretim prompt'u aşağıdaki 5 bloğu bu sırayla içerir:
1. **CHARACTER REFERENCE:** Türün resmi Ken Sugimori artwork'ü görsel girdi olarak bağlanır ve "anatomi, oran, renk yerleşimi ve işaret desenleri için tek doğruluk kaynağı" ilan edilir; modele yalnızca poz, kamera açısı ve efektleri değiştirme izni verilir. Doğrulanmış arşiv URL deseni: `https://archives.bulbagarden.net/media/upload/<hash>/<NNN><Species>.png` (ör. `0144Articuno.png`, `0145Zapdos.png`).
2. **STYLE:** 1996 Sugimori/Arita TCG suluboya ekolü (§1.A): şeffaf su boyası yıkamaları, kağıt dokusu, ince mürekkep hatları, vintage mat palet; saf beyaz veya şeffaf arka plan; çerçeve/metin/logo/filigran yasağı.
3. **CANONICAL ANATOMY CHECKLIST:** Bulbapedia Biology wikitext'inden doğrulanmış türe özgü madde listesi (§9.B): gövde rengi tonu, ibik/yele tüylerinin sayısı ve şekli, göz şekli+renk, gaga/bacak rengi, kanat ön yüzü ile arka yüzü renk ayrımı, kuyruk biçimi. Sayılabilir özellikler açık sayıyla yazılır ("exactly three feathers, count them"); renk yerleşimi yalnız renk adıyla değil **yüzey oranı ve ön/arka ayrımı** ile ifade edilir (ör. Zapdos: görünür yüzeyin ~%70'i sarı, siyah ≤%20 ve yalnız bordür/astar).
4. **POSE / COMPOSITION:** Animasyon katmanları için tasarlanır (§9.D): savaş ölçeğinde (~180px) okunur silüet (geniş V kanat açıklığı, net kafa/kuyruk), efekt yayın noktalarının (kanat kenarı, kuyruk ucu, pençe) keyframe'lerle hizalanması ve karakterin bedensel bütünlüğünün korunması (yalnız fırlatılan nesne değil, Pokémon'un kendisi görünür).
5. **STRICTLY FORBIDDEN:** Önceki üretim turlarında gözlenen her sapma kalıcı bir negatif kısıta dönüşür ("no glowing eyes", "no black-dominant wings", "no brown beak"). Negatif blok, pozitif checklist kadar bağlayıcıdır.

### B. Canon Verification Protocol (Kanon Doğruluk Protokolü)
- Prompt yazılmadan önce tür anatomisi **Bulbapedia Biology wikitext** üzerinden doğrulanır (`action=parse&prop=wikitext&section=1`); model hafızasına asla güvenilmez.
- Üretim sonrası görsel, resmi artwork ile görsel dife tabi tutulur; sapmalar üç sütunlu tabloda kaydedilir: *gözlenen hata → kanon gerçek → prompt karşılığı*.
- Renk adları tek başına yeterli değildir: ton (pale sky blue ≠ indigo), yüzey (wing front ≠ wing backing) ve oran (~%70 yellow) birlikte belirtilir.
- Kullanıcının referans-görsel slotunu kullanmadığı turlarda bile checklist + negatif blok metin düzeyinde anatomi kilidi sağlar; prompt seti o turda kullanılmış olmasa dahi **toolset referansı** olarak saklanır ve gelecek istemlere şablonluk eder.

### C. Iteration & User Edit Loop (Yineleme ve Kullanıcı Düzenleme Döngüsü)
- v1 çıktının sapması beklenen durumdur; revizyon döngüsü: sapma tablosu → v2 prompt (negatif kısıtlar genişletilmiş).
- Oranlar/anatomi doğruysa yeniden üretim yerine **kullanıcının manuel düzeltmesi** tercih edilir (ör. Zapdos'ta sarı oranının kanon sınırlar içinde artırılması); düzenlenmiş dosya `_raw_edited.png` adıyla saklanır ve onaylı nihai girdi kabul edilir.
- Asistan bu düzenlemelere asla müdahale etmez (.clinerules §10); görsel olduğu gibi kullanılır, post-processing uygulanmaz.

### D. Asset Intake & Animation-Plan Suitability Checklist (Teslim Alma Uygunluk Kontrol Listesi)
Implementasyona geçmeden önce her stok görsel şu 6 kapıdan geçer:
1. **Arka plan:** Köşe pikselleri alfa=0 (şeffaf) veya tekdüze saf beyaz olmalıdır; şeffaf tercih edilir (blend-mode desteğine ihtiyaç bırakmaz, GBA zemininde beyaz kutu riski yaratmaz).
2. **Tuval & kırpma payı:** Kare tuval (tipik 2048×2048); içerik bounding box'ı, +8–16px güvenlik paylı tight-crop'a (§5) yetecek marj bırakır; efekt uzantıları (yıldırım, buz saçılımı) kırpma sonrası kompozisyonu bozmaz.
3. **Silüet okunabilirliği:** Poz, ~180px savaş ölçeğinde tek bakışta okunur (V kanat, net kafa/kuyruk); ince detaylar ölçekle kaybolsa bile silüet saldırının doğasını anlatır.
4. **Efekt-emitör hizası:** Boyalı efektler (yıldırım, kıymık, kar saçılımı) CSS keyframe'lerinin süreceği noktalara (kanat kenarı, kuyruk ucu, pençe) bağlıdır; ayrık parçalar whole-actor transform'larıyla tutarlı hareket eder.
5. **Whiff uygunluğu:** Aktör tek bir bitişik gövdedir; whiff'te scale/opacity/saturate bastırması (§3) ayrık parça bırakmaz.
6. **Kromatik bütçe:** Efekt renkleri §1.C hiyerarşisine oturur (buz: `#ffffff → #cffafe → #38bdf8 → #0284c7`; elektrik: akkor beyaz → `#facc15` → `#fbbf24`); düz primer kullanılmaz.

### E. Registration & Pipeline Notes (Kayıt ve Hat Notları)
- Onaylı görsel `STOCK_IMAGE_FX_TYPES` setine kaydedilir; raster aktörler evrensel SVG %68.1 konteyner transformundan muaftır (§7.D) — çift ölçekleme yasağı.
- Whiff durumunda stok aktör: küçültülmüş boyut sınıfı + opacity/saturate bastırması; stagger zinciri bozulur (§8.D). Anticipation fazı stok aktörlerde de zorunludur (§8.C): keyframe %0–14 geri çekilme coil'u.
- **Vaka notları (kanon sapma arşivi):** Articuno v1 — parlamalı camgöbeği göz, 4–5 bıçaklı ibik, çivit gövde, halat kuyruk → kanon: yuvarlak kırmızı göz, alında 3 baklava tüy, soluk gök mavisi, streamer kuyruk. Zapdos v1 — siyah ağırlıklı kanat, siyah yüz, kahve gaga/bacak, lamba göz → kanon: sarı ön kanat, siyah sivri yeleli sarı yüz, açık turuncu gaga/bacak, küçük üçgen göz. Zapdos nihai: kullanıcı sarı oranını kanon sınırlar içinde artırarak onaylamıştır.
- **Doğrulanmış referans URL'leri:** Articuno `https://archives.bulbagarden.net/media/upload/d/d0/0144Articuno.png` · Zapdos `https://archives.bulbagarden.net/media/upload/c/c6/0145Zapdos.png`.

> **Terfi Notu:** §9'un checklist'leri yeni türlerde kanıtlandıkça §5'in işbirliği protokolüne terfi ettirilir; §9 o tür için yalnızca vaka notunu saklar.

## 10. Case Study Lessons (Vaka Çalışması Dersleri)

> Bu bölüm, yakın zamanda tamamlanan üç animasyon implementasyonunun (Zubat Supersonic, Alakazam Confuse Ray, Zubat Leech Life) kaynak kodundan doğrulanmış derslerini içerir. Her ders, ilgili TSX/CSS satır referanslarıyla birlikte verilir; hiçbir ders model hafızasından değil, yalnızca diskteki koddan türetilmiştir.

### 10.1 — Zubat Supersonic: Faz Kaydırmalı Sonsuz Dalga Alanı ve Anti-Bleed Protokolü

**Kaynak:** `BattleFXOverlay.tsx` L12092–12248 · `index.css` L9732–9870 · 5 ana katman (Sonar Ping z-10, perspektif yıkama halkaları z-20, faz kaydırmalı derinlik halkaları z-30, sinüs dalga çizgileri z-25, konfüzyon yıldızları z-35).

- **A. Sonsuz döngü + negatif delay = ilk kareden kararlı durum:** Dalga alanı `RIPPLE_COUNT = 9` halkadan oluşur; her halka `gbaZubatSonicDepthRing ${RIPPLE_PERIOD}s linear ${(-(i * RIPPLE_PERIOD) / RIPPLE_COUNT).toFixed(3)}s infinite` ile sürülür. Negatif `animation-delay` animasyonu önceden başlamış gibi başlatır; böylece ilk render karesinden itibaren 4–5 farklı yarıçapta halka aynı anda ekrandadır. Pozitif delay kullanılsaydı alan "boş başlar, dolar" ve ilk saniye zayıf okunurdu.
- **B. Genişleyen halkada `width/height`, `transform: scale` DEĞİL:** `gbaZubatSonicDepthRing` keyframe'i 14px → 342px arası `width`/`height` animasyonu kullanır. Sebep: `scale` 2px border'ı da orantılı büyütür ve halka genişledikçe kontur kalınlaşır; `width/height` her yarıçapta sabit (jilet inceliğinde) kontur tutar. GBA estetiğinde halka konturları daima sabit kalınlıkta kalmalıdır.
- **C. Halkalarda glow/boxShadow yasağı (RC1):** Halkalar yalnızca 2px solid border taşır; `boxShadow` veya `drop-shadow` eklenmez. Glow komşu halkaların optik kaynaşmasına yol açar; ayrık dalga cepheleri istendiğinde parlaklık border rengiyle sağlanır.
- **D. Yön tek CSS custom property üzerinden:** Dalga çizgileri `['--wave-dy' as string]: \`${sonicDirY * (34 + (i % 4) * 14)}px\`` ile beslenir; keyframe `translate(0, var(--wave-dy, 30px))` okur. Hedef yönü (player/cpu) tek işaret değişkeniyle bütün ipliklere yayılır; parçacık başına ayrı keyframe yazılmaz.
- **E. Anti-Bleed Protokolü (Round 14):** Overlay hedef CardView'ın İÇİNE monte edilir (`absolute inset-0` = kart sınırları) ve konteyner `overflow-hidden rounded-xl` ile kırpılır. Böylece 342px'ye kadar genişleyen halkalar kart dışına (bench/zemin) taşmaz; halka sayısı, yoğunluk ve süre değişmez. Bu, "efekti küçült" değil "efekti çerçevele" çözümüdür.
- **F. Süre sıkıştırma turları (Round 15–17):** Toplam pencere kademeli daraltıldı: 1.75 → 1.575 → 1.4175s (hit), 1.2 → 1.08 → 0.972s (whiff) — kümülatif ~%19. Aynı turlarda `RIPPLE_PERIOD` 1.6 → 1.44s ve maksimum halka açıklığı 420 → 380 → 342px'e indirildi; halka aralığı ~36.4px, kart merkezinde yoğunluk hissi verir.
- **G. Emitör parlaklık tavanı (Round 12):** `gbaZubatSonarPing` bloom'u `scale(1.15)` ve 6px glow ile sınırlandı. Sebep: parlak çekirdek ~96px'lik bir disk boyayarak üstteki (z-30) derinlik halkalarını örtüyordu. z-index tek başına yetmez — görsel parlaklık da katman hiyerarşisine tabi olmalıdır.
- **H. Whiff bastırma listesi:** Whiff'te Layer 3 (dalga çizgileri), Layer 4 (distorsiyon alanı) ve Layer 5 (konfüzyon yıldızları) tamamen render edilmez; Layer 1–2 kısaltılmış süreyle (0.972s) kalır. Iska, "yayın yapıldı ama hedefe işlemedi" olarak okunur.

### 10.2 — Alakazam Confuse Ray: Stok Aktör Sistemi ve 4 Vuruşluk Ritmik Senkronizasyon

**Kaynak:** `BattleFXOverlay.tsx` L15433–15580 · `index.css` L6205–6380 · 4 ana katman (Alakazam stok aktör sahnesi, psişik enerji küresi, konfüzyon yıldızları, hedef şoku).

- **A. Stok aktör kavramı ve zorunluluğu:** Confuse Ray, saldıran tarafı *tam gövde* olarak gösteren ilk "attacker portrait" animasyonudur. Alakazam SVG'si (gövde, kafa, kaşık çiftleri) keyframe'den bağımsız statik bir katman olarak render edilir; animasyon yalnızca *hareket* katmanlarını (kaşık rotasyonu, enerji küresi, psişik dalga) içerir. Bu ayrım, kaşık geometrisinin keyframe içinde tekrar tekrar tanımlanmasını engeller.
- **B. 4 vuruşluk ritmik yapı (beat sync):** Enerji küresi 4 ayrı vuruşta (`gbaAlakazamConfusePulse 1.6s ease-in-out`) pulse yapar; her vuruş hedefin konfüzyon yıldızlarıyla senkronizedir. Vuruş zamanlaması: 0s → 0.4s → 0.8s → 1.2s. Bu "ritmik senkronizasyon" izleyiciye "her vuruş bir etki yaratıyor" hissini verir.
- **C. Kaşık çiftleri ve ayna simetrisi:** İki kaşık (sol/sağ) `gbaAlakazamSpoonSpin` ile zıt yönlerde döner (biri `rotate(0deg→360deg)`, diğeri `rotate(360deg→0deg)`). Bu ayna simetrisi "psişik odaklanma" jestini güçlendirir. Kaşık SVG path'leri `transform-origin: center` ile merkezlenmiştir; aksi halde dönüş yörüngesi kayardı.
- **D. Konfüzyon yıldızları — stok aktör üstünde değil, hedef üstünde:** Yıldızlar *hedefin* (savunan tarafın) etrafında döner; saldırgan Alakazam sahnesiyle aynı DOM ağacında değildir. Bu, "etki hedefte görünür" ilkesinin uygulamasıdır. Whiff durumunda yıldızlar render edilmez (yalnızca kaşık + küre kalır).
- **E. Psişik enerji küresi — gradient katmanlama:** Küre üç katmanlıdır: iç çekirdek (beyaz→mor), orta halo (mor→şeffaf), dış glow (mor 0.15 opasite). `radial-gradient` zinciri tek `background` özelliğinde virgülle ayrılmış üç katman olarak yazılmıştır; ayrı div'ler yerine bu tercih, katman sayısını azaltır.
- **F. Renk paleti — psişik tür kimliği:** Confuse Ray'in paleti (mor #a855f7, eflatun #c084fc, beyaz) Psişik türün kanon renkleriyle birebir örtüşür. Tür kimliği renkleri, animasyonun "hangi türe ait olduğu" bilgisini izleyiciye ilk karede iletir.
- **G. Z-index hiyerarşisi:** Alakazam sahnesi z-30, enerji küresi z-25 (Alakazam'ın *önünde* değil *arkasında* — kaşıklar küreyi yönlendirir), konfüzyon yıldızları z-35 (hedef üstünde en önde). Bu, "saldırgan sahnesi arka planda, etki ön planda" ilkesini uygular.
- **H. Whiff bastırma:** Whiff'te enerji küresi ve kaşık rotasyonu devam eder (saldırı "yapıldı") ama konfüzyon yıldızları ve hedef şoku tamamen kaldırılır. Bu, §10.1.H ile aynı prensibi izler: "hareket var, sonuç yok".

### 10.3 — Zubat Leech Life: İki Fazlı Anlatı (Isırık → Yaşam Emme) ve Yönlü Drain Akışı

**Kaynak:** `BattleFXOverlay.tsx` L21207–21305 (ana blok) + L21307+ (`zubat_leech_replenish` iyileştirme bloğu) · `index.css` L13255–13460 (`gbaZubatLeechFloor`, `gbaZubatFangTop`, `gbaZubatFangBottom`, `gbaZubatLeechOrbTravel`, `gbaZubatReplenish` keyframe'leri).

- **A. İki fazlı anlatı yapısı:** Leech Life, tek bir animasyonda iki ayrı "olay" anlatır: **Faz A (Isırık, 0–0.7s):** alt/üst vampir dişleri sahneye kenetlenir (`gbaZubatFangTop`/`gbaZubatFangBottom`, `cubic-bezier(0.16,1,0.3,1)` — hızlı giriş, yumuşak duruş) ve 0.25s'de `gbaShockwaveScale` ısırık şok dalgası patlar. **Faz B (Emme, 0.3s+):** 4 drain orb'ı (`gbaZubatLeechOrbTravel`) hedef bölgesinden saldırgana doğru 150px yol alır. Faz B'nin orb delay'leri (0.3s/0.45s/0.6s/0.75s) Faz A'nın ısırık anından *sonra* başlayacak şekilde kurgulanmıştır — bu gecikme zinciri, "önce diş geçer, sonra emme başlar" nedenselliğini kurar.
- **B. Yönlü drain — tek custom property (`--drain-dy`):** Orb'ların dikey emme yönü `drainDirY = fx.target === 'cpu' ? 1 : -1` ile hesaplanır ve her orb'a `['--drain-dy']: ${drainDirY * 150}px` olarak enjekte edilir. Keyframe içinde `translateY(var(--drain-dy))` kullanılır. Tek bir custom property ile hem "player'a saldırı" hem "cpu'ya saldırı" senaryoları tek keyframe'den yönetilir; yön değiştirmek için ayrı keyframe yazılmaz. Her orb ayrıca `--orb-x` / `--orb-start-y` ile kendi başlangıç ofsetini taşır.
- **C. Whiff'te Faz B tamamen atlanır:** `{!fx.whiffed && [...].map(orb => ...)}` — ısırık ıskalandıysa orb dizisi *hiç render edilmez*. Faz A (dişler + şok + zemin aurası) yine oynatılır; saldırının "yapıldığı ama emme gerçekleşmediği" anlatılır. Supersonic (§10.1.H) ve Confuse Ray (§10.2.H) ile aynı ilke: hareket kalır, sonuç kalkar.
- **D. Ayrı FX tipi olarak iyileştirme (`zubat_leech_replenish`):** Emilen yaşam enerjisinin saldırgan üstünde belirmesi ana bloğun bir gecikmeli devamı değil, *ayrı bir* `zubat_leech_replenish` FX olayıdır (L21307). Sebep: hasar hesaplama + HP kazanımı oyun motorunda ayrı zamanlamayla gelir; animasyon sistemi tek bir uzun timeline'a güvenmek yerine, motorun gönderdiği ikinci olaya tepki verir. Ders: "neden → sonuç" zincirini tek keyframe'e sığdırmaya zorlamayın; motor olaylarıyla senkronize ayrı bloklar daha sağlamdır.
- **E. Katman ve z-index planı:** Zemin aurası z-10 (crimson radial-gradient, 1.7s), şok dalgası z-20, dişler z-35, drain orb'ları z-40 (en önde — "yaşam enerjisi her şeyin üstünde akar"). Ana konteyner `overflow-visible` kullanır; orb'lar 150px'lik yolculuklarında sahne dışına taşabilmelidir (`overflow-hidden` olsaydı emme akışı kenarda kesilirdi).
- **F. SVG diş geometrisi — simetrik path çiftleri:** Üst dişler aşağı, alt dişler yukarı bakan kuadratik bezier path'leridir (`Q` komutları); her dişin içine ince kırmızı damar çizgisi (`stroke="#f87171"`, opacity 0.75) eklenmiştir. Üst ve alt SVG'ler ayrı `viewBox`'larda tanımlanır ve `drop-shadow` ile kırmızı glow alır — harici görsel varlık kullanılmaz, tüm geometri inline SVG'dir.
- **G. Renk anlatısı:** Faz A kırmızı/kızıl (ısırık, kan), Faz B'nin orb'ları yine kızıl ama beyaz çekirdekli (yaşam özü), replenish bloğu ise zümrüt yeşiline döner (`gbaZubatReplenish`). Renk geçişi "kızıl = alınan yaşam → yeşil = kazanılan HP" semantiğini izleyiciye kelimeler olmadan iletir.

## 11. Karşılaştırma Tablosu ve Anti-Paternler

### 11.A — Üç animasyonun yapısal karşılaştırması

| Boyut | Zubat Supersonic | Alakazam Confuse Ray | Zubat Leech Life |
|---|---|---|---|
| Anlatı modeli | Sürekli alan etkisi (sonsuz döngü) | Stok aktör + 4 vuruş ritmi | İki fazlı nedensellik (ısırık→emme) |
| Döngü tipi | `infinite` + negatif delay | Tek seferlik (1.6s, 4 pulse) | Tek seferlik + ayrı replenish FX'i |
| Yön bağımlılığı | Yok (merkezci dalga) | Yok | Var (`--drain-dy` hedefe göre ±150px) |
| Whiff davranışı | Katman 3–5 kaldırılır, 1–2 kısalır | Yıldızlar/şok kalkar, kaşık kalır | Faz B hiç render edilmez |
| Stok aktör | Yok | Var (Alakazam SVG) | Yok |
| Custom property sayısı | Faz offsetleri (per-halka delay) | Minimal | 4 (`--orb-x`, `--orb-start-y`, `--drain-dy`, orb delay) |
| Overflow | hidden | hidden | **visible** (orb taşması) |
| Ana renk kimliği | Mavi/camgöbeği (ses) | Mor/eflatun (psişik) | Kızıl→zümrüt (kan→iyileşme) |

### 11.B — Anti-patern listesi (bu üç implementasyondan çıkarılan yasaklar)

1. **Yanlış türün kodunu kaynak almak:** Golbat Leech Life kodunu Zubat Leech Life sanıp analiz etmek. Ders: bir ders/belge yazmadan önce TSX bloğunun `fx.type === '...'` satırını kelimesi kelimesine doğrula.
2. **Tek timeline'da neden+sonuç zorlaması:** Emme + HP kazanımını tek keyframe'e gömmek; motor olaylarıyla senkron kayar. Çözüm: ayrı FX tipi (Leech Life → `zubat_leech_replenish`).
3. **`overflow-hidden` ile yönlü akış:** Taşınan partikül/drain akışı varsa konteyner `overflow-visible` olmalı; aksi halde yolculuk kenarda kesilir.
4. **Yön için kopya keyframe:** Sağa/sola, yukarı/aşağı varyantlar için keyframe çoğaltmak yerine tek `--drain-dy` benzeri custom property kullan.
5. **Negatif delay'siz infinite döngü:** İlk karede boş alan, sonra "pop-in" oluşur; `RIPPLE_PERIOD` tabanlı negatif offset şart (§10.1.A).
6. **Sonuç katmanını whiff'te oynatmak:** Iska animasyonunda konfüzyon yıldızı/drain orb'u gibi "sonuç" katmanları render edilmemeli; hareket katmanları kısaltılmış süreyle kalabilir.
7. **İç içe gradient div enflasyonu:** Aynı merkeze çoklu radial-gradient'i ayrı div'lerle yazmak; tek `background` özelliğinde virgül ayrımlı katmanlama tercih edilir (§10.2.E).
8. **z-index'i parlaklıkla çeliştirmek:** Yüksek z-index'li soluk katman, düşük z-index'li parlak katmanı görsel olarak ezer; parlaklık da hiyerarşiye tabidir (§10.1.G).
9. **Stok aktör geometrisini keyframe'e gömmek:** Alakazam gövde/kaşık SVG'si statik katmandır; yalnızca hareket keyframe'e girer (§10.2.A).
10. **`transform-origin` belirsiz rotasyon:** Kaşık çiftleri gibi simetrik dönüşlerde `center` sabitlenmezse yörünge kayar (§10.2.C).

## 12. Ayar Turu Protokolü (Tuning Protocol)

Yeni bir animasyon teslim edilmeden önce bu sıra ile ayar turu yapılır:

1. **Timing bütünlüğü:** Toplam süre, oyun motorunun bekleme penceresiyle uyumlu mu? Fazlar arası gecikmeler (delay zinciri) nedensellik okutuyor mu? (Leech Life: diş 0.25s → orb 0.3s+.)
2. **Whiff senaryosu:** Her "sonuç" katmanı `fx.whiffed` koşuluyla kaldırılmış mı? Hareket katmanları kısaltılmış süreyle kalıyor mu?
3. **Yön parametreleri:** Hedefe göre değişen tüm ofsetler tek custom property'den türetiliyor mu (`--drain-dy` modeli)? Kopya keyframe var mı?
4. **Döngü kararlılığı:** `infinite` döngülerde negatif delay ile ilk karede steady state sağlanmış mı?
5. **Overflow kontrolü:** Taşan partikül var mı? Varsa konteyner `overflow-visible` mı?
6. **Katman/z-index + parlaklık tutarlılığı:** En "önemli" efekt en önde ve en parlak mı? (§10.1.G)
7. **Renk kimliği:** Palet, türün kanon renkleriyle örtüşüyor ve durum geçişini (kızıl→yeşil gibi) anlatıyor mu?
8. **Stok aktör ayrımı:** Statik geometri keyframe dışında mı? `transform-origin` sabit mi?
9. **FX olay sınırları:** Motor zamanlamasına bağlı sonuçlar ayrı FX tipi mi? (Leech Life / `zubat_leech_replenish` modeli.)
10. **Doğrulama:** `npx tsc --noEmit` EXIT=0 ve ilgili Python test grubu tam geçiş.

## 13. Revizyon Geçmişi

| Rev | Tarih | İçerik | Doğrulama |
|---|---|---|---|
| 1 | 2026-09-23 | §10 Vaka Çalışması Dersleri (10.1 Zubat Supersonic faz kaydırmalı sonsuz döngü + anti-bleed; 10.2 Alakazam Confuse Ray stok aktör + 4 vuruş ritmi; 10.3 Zubat Leech Life iki fazlı anlatı + yönlü drain), §11 karşılaştırma tablosu + 10 anti-patern, §12 Ayar Turu Protokolü, §13 Revizyon Geçmişi eklendi. Tüm dersler TSX (L12092, L15433, L21207) / CSS (L9732, L6205, L13255) satır referanslarıyla disk üzerinden doğrulandı. | `npx tsc --noEmit` EXIT=0 · `python scratch/test_group_b1.py` 39/39 PASS |
