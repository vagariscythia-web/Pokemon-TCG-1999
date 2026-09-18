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
