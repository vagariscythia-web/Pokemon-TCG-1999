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

### D. Fluid Atmospheric FX vs. Rigid Blocks (Akışkan Duman İlkesi)
- Gas, mist, smoke, and ink clouds must NEVER be animated using rigid whole-body `rotate(...)` transforms (which visually turns them into spinning square cardboard cutouts).
- Clouds must expand organically via multi-lobed SVG Bézier paths (`d="M..."`), internal hydrodynamic flow swirls, chromatic density layering (e.g. zifiri abyssal ink core `#020617` $\rightarrow$ translucent charcoal rim `#334155`), and independent floating dissipation motes.

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
3. **Multi-Target & Bench Slot Awareness:**
   - Special moves (e.g., Gengar *Dark Mind*, Ninetales *Lure*, Arbok *Stare*) can target either the Active card or a Bench slot (`slot === 'bench'`, `benchIndex`).
   - Coordinate logic must gracefully support bench transposition without visual clipping.

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

> **Terfi Notu:** §8'in ilkeleri, §7 gibi, kanıtlandıkça §§1–6'ya terfi ettirilebilir. Özellikle §8.G (zamanlama önceliği) ve §8.C (anticipation) evrensel animasyon ilkeleri olup, olgunlaştığında §1 veya §3'e taşınması beklenir.

> **Terfi Notu:** §8'in ilkeleri, §7 gibi, kanıtlandıkça §§1–6'ya terfi ettirilebilir. Özellikle §8.G (zamanlama önceliği) ve §8.C (anticipation) evrensel animasyon ilkeleri olup, olgunlaştığında §1 veya §3'e taşınması beklenir.
