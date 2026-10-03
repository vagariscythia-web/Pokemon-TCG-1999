# Pokémon TCG 1999: Agent Rules & Animation Directive

## 1. Zorunlu Animasyon Kılavuzu (Strict Animation Directive)

Bu depoda herhangi bir saldırı animasyonu (Move Animation / Battle FX), görsel efekt veya parçacık sistemi üzerinde analiz, tasarım, düzenleme veya implementasyon yaparken; istisnasız olarak projenin ana anayasası olan **[ANIMATION_DESIGN_SYSTEM.md](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/ANIMATION_DESIGN_SYSTEM.md)** kılavuzuna başvurmak ve oradaki tüm kurallara harfiyen uymak ZORUNDASIN. Yeni bir sohbete başlandığında ya da bağlam tazelendiğinde, bu düsturu tekrar hatırlatmaya gerek kalmaksızın doğrudan referans al.

### Asla İhlal Edilemeyecek Temel İlkeler:

1. **5 Katmanlı Mimari Hiyerarşisi (The 5-Layer Modular Architecture):**
   Efektler bu 5 katmanlı mimari hiyerarşisine sadık kalmalıdır (saldırının doğasına göre 2 ila 5 katman modüler seçilir; her saldırıya zorla lüzumsuz katman sokulup görsel çamur yaratılamaz):
   - `[Katman 1]` Ambient Card Floor / Atmosphere (Zemin aurası, termal kavrulma, iyonize zemin veya sürtünme tozu).
   - `[Katman 2]` Primary Visual Actor (Otantik 1996 Ken Sugimori suluboya görseli veya çok parçalı organik Bézier SVG).
   - `[Katman 3]` Impact Flash & Shockwaves (Starburst pop, kesme parlaması, akkor flaş ve eşmerkezli şok halkaları).
   - `[Katman 4]` Secondary Scatter & Cavitation (Hız rüzgârı çizgileri, yöne bağlı şimşek arkları, balistik sıçramalar).
   - `[Katman 5]` Ambient Dissipating Particles (Havada süzülerek sönümlenen kıvılcımlar, dövüş/statik zerreleri).

2. **Anti-Idle & Kesintisiz Momentum (Continuous Momentum - %15 Kuralı):**
   - Hiçbir görsel öge toplam animasyon süresinin **%15'inden uzun süre havada donup (`freeze`) hareketsiz kalamaz**.
   - Vuruş temas anında donma yerine **fiziksel elastik gerilim, squash & stretch ve mikro-titreme (shudder tremor)** kullanılmalıdır.

3. **İki Kademeli Boyutlandırma Hiyerarşisi (Two-Tier Scaling Hierarchy):**
   - **Tier 1 (Büyük Silahlar, Tüm Vücutlar & Apex Canavarlar):** Standart `~108px – 114px` (~68.1% card width, 4.500–5.500 px² kütle). Whiff: `~82px`.
   - **Tier 2 (Temel Pokémon Kafaları, Burun/Gaga & Küçük Organlar):** Standart `~76px – 84px` (~45%–50% card width, 2.000–2.800 px² kütle). Whiff: `~58px`.
   - Asla naif CSS genişliğine aldanma; görselin içindeki gerçek opak piksel kütlesini ve en-boy oranını (`object-contain`) hesaba kat.

4. **Kromatik Sıcaklık Hiyerarşisi (Layered Incandescence):**
   - Düz ana renkler (`#ffff00`, `#ff0000`, `#0000ff`) kesinlikle yasaktır.
   - Her efekt akkor beyaz çekirdekten (`#ffffff`) dış haleye doğru sıcaklık gradyanı içermelidir (Örn. Elektrik: Akkor Beyaz $\rightarrow$ Neon Sarı `#facc15` $\rightarrow$ Kehribar `#fbbf24`; Ateş/Dövüş: Beyaz $\rightarrow$ Limon Sarısı `#fef08a` $\rightarrow$ Sıcak Kehribar `#f97316` $\rightarrow$ Volkanik Kırmızı `#dc2626`).

5. **Kesin Whiff (Iskalama / Engellenme) Standartları:**
   - Saldırı ıska geçtiğinde veya engellendiğinde (`fx.whiffed === true`):
     - Aktör boyutu Tier-whiff ölçeğine küçülür.
     - İkincil darbe patlamaları, zemin şok halkaları ve şiddetli kart sarsıntısı KOŞULSUZ olarak bastırılır (`!fx.whiffed`).
     - Efekt hedefe ulaşamadan cılız bir duman veya sönümle havada dağılır.

6. **Teknik Süre Senkronizasyonu (`getFXDuration`):**
   - `BattleFXOverlay.tsx` içerisindeki `getFXDuration(fx.type)` dönüş değeri, `index.css` içindeki en uzun süren keyframe (gecikmeler dahil) ile milisaniyesi milisaniyesine senkronize olmalıdır. Animasyon bittiğinde bileşen ekranda gereksiz asılı kalmamalıdır.

7. **Emoji ve İlkel Şekil Yasağı (Primitive Geometric & Emoji Prohibition):**
   - Mobil/Unicode emojiler (`⚡`, `💥`, `🍃`, `💨` vb.) ve düz metin sembolleri (`✦`) overlay'lerde kesinlikle yasaktır.
   - Duman veya gaz bulutları tek parça kare gibi döndürülemez (`rotate` ile kutu döndürme yasağı); çok loblu Bézier SVG eğrileriyle organik kabarmalıdır.
   - **İlkel Vektör / CAD Çizimi Yasağı:** Kesik çizgili elipsler (`stroke-dasharray="6 4"` vb.), ham geometrik çember konturları, teknik çizim/tel kafes (wireframe) izlenimi veren ilkel SVG şekilleri KESİNLİKLE YASAKTIR. Şok dalgaları, felç/statik arkları ve auralar daima organik çok loblu Bézier eğrileri, çok dallı çatallanan iyonizasyon kırılmaları veya pürüzsüz kromatik sıcaklık gradyanları (`radial-gradient` akkor beyaz $\rightarrow$ neon $\rightarrow$ halelenme) ile inşa edilmelidir.

8. **Nozul/Ağız Ekseni Kilitlenmesi & Kart Sınırı İçi Kırpma (Nozzle Pinning & Anti-Bleed):**
   - Bir Pokémon'un ağzından, namlusundan veya organından çıkan jet, alev, su veya gaz püskürmelerinde (Arbok *Poison Vapor*, Horsea *Ink Jet* vb.); püskürme akıntısının başlangıç orijini aktörün anatomik ağız açıklığına pikseli pikseline kilitlenmelidir (`transform-origin: 50% 0%`, üst nozul ekseni, `top: 22%` kilitlenmesi).
   - Akıntı aktörün altından veya boşluktan fışkıramaz; akıntı konteyneri hedef kartın fiziksel sınırları içinde tutulmalı (`overflow-hidden rounded-xl`), kartın alt sınırının dışına taşma (boundary bleed) yaşanmamalıdır.

9. **Bench Hasarı Sinematik Kalite Standardı (Bench Cinematic Quality Standard):**
   - Bench süpürme hasarı içeren çoklu hedef saldırılarında (Poison Vapor, Blizzard vb.); yedek kartlar üzerindeki efektler aceleye getirilmiş tekdüze renk lekelerinden ibaret olamaz.
   - Küçük boyuttaki yedek kartlar (`110px × 151px`) üzerinde de minyatür 4-5 katmanlı bir kimyasal/fiziksel reaksiyon yaşanmalıdır (zemin aurası, dönen duman pufu, mikro köpük kabarcıkları, süzülen aerosol zerrecikleri ve darbe flaşı). Süreler ani kesilmeyip akıcı bir sönümlenme zarfı taşımalıdır.

10. **Varlık Üretim & Kırpma Protokolü (Strict Bounding-Box Cropping):**
    - Kullanıcının `public/assets/raw/` altında hazırladığı onaylı şeffaf PNG'ler, etrafında +8–16px güvenli pay bırakılarak sıkıca kırpılmalı (`tight crop`) ve öyle `/public/assets/` altına alınmalıdır.

11. **Kod Teyidi ve Varlık Denetim Protokolü (Strict Codebase Verification Protocol):**
    - Bir Pokémon'un, saldırı animasyonunun veya görsel varlığın mevcut durumunu analiz ederken veya kullanıcıya raporlarken; ASLA naif regex aramalarına veya geçici terminal script özetlerine körü körüne güvenilerek varsayımda bulunulamaz.
    - Herhangi bir varlığın (`.png`/`.svg`) veya saldırının kodda aktif olup olmadığı, istisnasız olarak doğrudan `BattleFXOverlay.tsx` içindeki gerçek JSX satır numaraları (`<img src="..." />` ve `fx.type === ...`) ve `cards.json` eşleşmeleri okunarak KESİNLEŞTİRİLMELİDİR.
    - Depoda zaten mevcut ve 5 katmanlı mimaride çalışan bir varlık (örneğin Pikachu, Nidoran ♂, Clefairy vb.) için kod teyidi yapılmadan "eksik", "yapılacak" veya "stok görsel adayı" şeklinde yanıltıcı iddialarda bulunulması KESİNLİKLE YASAKTIR. Her analiz doğrudan kod referansıyla (satır numarasıyla) belgelenmelidir.
    - `public/assets/` altındaki bir görselin (örneğin `ThunderPunch_Fist.png`), `raw/` klasöründeki bir varlığın (`Electabuzz_raw_edited.png`) önceden onaylanıp sıkı kırpılmış nihai versiyonu olabileceği hesaba katılmalı; dosya içeriği ve görsel kökeni teyit edilmeden varsayımda bulunulmamalıdır.

12. **Görev Kapsamı, Bağlam Tazeleme ve İstem Dışı Müdahale Yasağı (Strict Scope Locking & Anti-Drift Directive):**
    - Bir oturum kota dolumu, sunucu yeniden başlatılması veya uzun mesaj geçmişi (context compaction) sonrasında kesintiye uğrayıp devam ettirildiğinde; model ASLA aktif görevin/kullanıcı prompt'unun kapsamı dışındaki eski test loglarına, geçmiş terminal hatalarına (`FAIL` sonuçlarına) veya alakasız dosyalara otonom olarak müdahale edemez (*regression anchor / drift yasağı*).
    - Eski test koşucuların ürettiği hatalar veya regex uyumsuzlukları, kullanıcının o anki açık talebi olmadıkça düzeltilmeye çalışılamaz; test regex'ine yaranmak adına projenin çalışan diğer bileşenlerindeki parametreler, stiller veya fonksiyon imzaları (örneğin `BattleFXOverlay.tsx`, `index.css`, `GameBoard.tsx`) asla sessizce değiştirilemez.
    - Bir göreve devam edilirken çalışma belleğinde veya görev odağında şüphe oluşursa; kodlarda rastgele değişiklik yapmak yerine, öncelikle son durumda nerede kalındığı kullanıcıya maddeler halinde raporlanmalı (*Read-Only Audit First*) ve kullanıcının onayı alınmadan hiçbir dosyada `replace`/`edit` işlemi uygulanmamalıdır.

13. **Stok Görsel Üretim ve İş Akışı Protokolü (User-Driven External Asset Workflow):**
    - Aksi kullanıcı tarafından açıkça talep edilmedikçe, dahili görsel üretim araçları (`generate_image`) API kotası tüketimini önlemek adına KESİNLİKLE çağrılamaz.
    - Stok görsel ihtiyacı doğduğunda izlenecek zorunlu iş akışı:
      1. Model kullanıcıya en yüksek kalitede, 1996 Ken Sugimori suluboya ve teknik direktifleri içeren prompt metnini (pozitif, negatif ve parametreleriyle) sunar.
      2. Kullanıcı görseli kendi harici üreticisiyle oluşturur ve sohbette görsel olarak paylaşır.
      3. Model paylaşılan görseli 5 katmanlı mimariye, Sugimori anatomisine ve animasyon uygulanabilirliğine göre denetleyip detaylı uygunluk analizini raporlar.
      4. Uygunluk onayı sonrasında kullanıcı görseli transparanlaştırarak (`.png`) `public/assets/raw/` klasörüne yerleştirir.
      5. Dosya klasöre girdikten sonra model sıkı kırpma (+8–16px bounding box) ve animasyon implementasyonuna başlar.

14. **Önizleme Sayfaları & GameBoard Boyut Paritesi, CSS Hijyeni ve Dayanıklı Varlık Protokolü (Preview Stage & GameBoard Parity, Scale & CSS Hygiene Protocol):**
    - **Oyun İçi Boyut ve En-Boy Oranı Paritesi:**
      - Aktif kart yuvası: **`184px × 253px`** (`aspect-ratio: 600 / 825`, `border-radius: 12px`).
      - Bench (yedek) kart yuvaları: **`110px × 151px`** (`aspect-ratio: 600 / 825`, `border-radius: 8px`).
      - Asla naif/tahmini değerler (`180×252`, `184×256`, `110×152`) kullanılamaz; masaüstü `GameBoard.tsx` ve `CardView.tsx` CSS standartları pikseli pikseline uygulanmalıdır.
    - **CSS Sözdizimi Hijyeni & Bağımsız Keyframe Kuralı (Root-Level Keyframes Invariant):**
      - Önizleme HTML dosyalarındaki `@keyframes` kuralları ASLA bir CSS seçicisinin (örneğin `.fx-layer`) içine gömülü (nested) yazılamaz; istisnasız olarak doğrudan CSS root seviyesinde tanımlanmalıdır.
      - Açılan ve kapanan süslü parantez blokları (`{ ... }`) daima dengede tutulmalıdır (`open === close`). Kapanmayan tek bir parantez tarayıcının tüm keyframe'leri geçersiz saymasına ve başlangıçta `opacity: 0` olan tüm efektlerin ekranda hiçbir zaman görünmemesine (boş tahta / freeze hatası) yol açar.
    - **Otantik Durum Şeridi & Çift Modlu Doğrulama (Status Strip & Dual-Mode Verification):**
      - `CardView.tsx` durum şeridi (HP göstergesi ve segmentli yeşil can pips'leri) önizleme kartlarına da entegre edilmelidir.
      - Önizleme sayfaları, test edilen kart tipine uygun otantik Base Set / Jungle / Fossil kart altlıklarını (`cards/*.jpg`) barındırmalı ve "Real Card Mode" ile "Dark Board Canvas" arasında anlık geçiş sağlayan mod butonu (`#btnMode`) sunmalıdır.
    - **Dayanıklı Varlık Yolları (Resilient Path Protocol):**
      - `public/preview_*.html` veya herhangi bir bağımsız HTML showcase sayfasında görsel yüklerken asla tekil veya mutlak yol (`/assets/...`) kullanılmaz.
      - Sayfalar hem yerel dosya sisteminden doğrudan çift tıklanarak (`file:///...`) hem de dev sunucudan (`http://localhost:5173/...`) açılabildiğinden; istisnasız tüm `<img>` yüklemelerinde `candidatePaths` dizisi (`['assets/...', './assets/...', '/assets/...', '../public/assets/...']`) ve `onerror` döngüsü kullanılmak ZORUNDADIR.

15. **Proaktif Yüksek Sadakat ve İleri Düzey Görsel Alternatif Rehberliği İlkesi (Proactive High-Fidelity & Advanced Visual Guidance Directive):**
    - Kullanıcı/oyuncu bazı ileri düzey grafik, fizik veya simülasyon alternatiflerinin (akışkanlar mekaniği, Gooey metaball yüzey gerilimi, Perlin türbülansı, Eulerian akışkan ızgaraları, yay-kütle dalga fiziği, WebGL shader caustics vb.) teknik detaylarının farkında olmasa dahi; eğer istenen saldırı temasına ve animasyon tarzına uygunsa (su jeti, gaz/zehir bulutu, balçık kütlesi, kar/blizzard fırtınası, kıvılcım yağmuru, plazma vb.), model kullanıcıya yol gösterici mahiyette daha gerçekçi ve yüksek sinematik kalite sunabilecek zenginleştirilmiş yöntemleri proaktif olarak sunmaya hazır olmalıdır.
    - Model, kullanıcı talebini kolaya kaçan düz/ilkel SVG çizgileriyle geçiştirmek yerine; daima istenen implementasyon senaryosu dahilinde optimum kalite, fiziksel inandırıcılık ve zenginleştirilmiş sadakat (*Enriched Visual Fidelity — ANIMATION_DESIGN_SYSTEM.md §7.K*) arayışı ilkesiyle hareket etmeli, mimari seçenekleri ve "tatlı nokta" (sweet spot) alternatiflerini kullanıcıya bilinçli bir vizyonla önermelidir.
16. **Otonom Canlı Tarayıcı Testi Yasağı (Strict Prohibition of Autonomous Live Browser Testing):**
    - Aksi kullanıcı tarafından açıkça talep edilmedikçe veya onaylanmadıkça; sistem kaynaklarını (CPU/GPU/bellek) aşırı tüketebilecek ve donanım kilitlenmelerine yol açabilecek `browser_subagent` / canlı tarayıcı testi aracı KESİNLİKLE otonom olarak çağrılamaz.
    - Tüm görsel denetim ve incelemeler için doğrudan optimize edilmiş bağımsız önizleme HTML sayfaları (`public/preview_*.html`) hazırlanmalı; kullanıcının kendi yerel tarayıcısında rahatça incelemesi sağlanmalıdır.

17. **Anti-Checkbox & Sinematik VFX Sanat Yönetmenliği İlkesi (Strict Anti-Checkbox & Cinema-Grade VFX Art Direction Directive):**
    - Bir animasyon veya görsel efekt tasarlanırken veya önizleme hazırlanırken; asla "teknik kontrol listesi" mantığıyla yüzeysel/taslak düzeyde bırakılamaz ("Gooey filtresi var, Perlin var" deyip içine tek bir kaba SVG çizgisi veya daire koyma yanılgısı KESİNLİKLE YASAKTIR).
    - Her efekt, uzman bir VFX Artist ve Sanat Yönetmeni titizliğiyle; fiziksel inandırıcılık, akışkanlar mekaniği, optik kırılma/caustics, kromatik sıcaklık katmanlaşması, kavitasyon zerreleri ve kart dokusuyla etkileşim (immersion) derinliğine sahip olmak ZORUNDADIR.
    - **Nicelik Tuzağı Yasağı (Depth over Breadth Invariant):** Aynı anda çok sayıda saldırıyı alelacele ve çalakalem taslaklamak yasaktır. Öncelik daima tekil hedefe tam odaklanarak, ön hazırlıktan (Anticipation) sönümlenmeye (Dissolve) kadar her milisaniyenin Blastoise Hydro Pump veya Mewtwo Psychic seviyesinde mikro-kalibre edilmesidir.

18. **Bütüncül Titizlik, Sıfır-Wireframe/Kontur ve Kinematik Gerçekçilik İlkesi (Holistic Fidelity, Zero-Wireframe & Kinematic Realism Invariant):**
    - **Holistik Tamamlanmışlık (Bütüncül Özen Zorunluluğu):** Bir animasyonun sadece 1-2 merkezî fazını (örneğin sadece çekirdek patlamasını veya tepe vuruşunu) iyileştirip; enerji toplama kanatlarını, zemin darbe aurasını, akıntı kenarlarını veya sönümlenme parçacıklarını "kolaya kaçılmış kaba çizgilerle", "taslak formlarla" veya "ham şablonlarla" bırakmak KESİNLİKLE YASAKTIR. Animasyonun ilk milisaniyesinden sönümlenen son damlasına kadar tüm 5 katman ve tüm fazlar istisnasız aynı A-Grade VFX standartlarında bitirilmelidir.
    - **Sıfır-Wireframe / Sıfır-Kontur Yasağı:** Su, plazma, enerji ışını, gaz/duman gibi akışkan veya amorf elementlerde asla yapay kenar konturları (`stroke`), tel kafes çizgileri, karmaşık dolambaçlı iplikler ("tangled lines") veya cetvelle çekilmiş kenar çizgileri KULLANILAMAZ. Akışkanlar ve enerjiler kenarlarını `stroke` ile değil; yumuşak difüzyon, optik kırılma/caustics, hacimsel gradyan ve parçacık atomizasyonu ile bulmalıdır.
    - **Kinematik Doğallık ve Parçacık Hiyerarşisi:** Su ve kavitasyon zerrecikleri asla "havada süzülen kar tanesi" (`floating snowflake`) gibi hafif, yavaş ve yapay salınamaz. Sıvı damlacıkları orijinal *Blastoise Hydro Pump* standardına uygun olarak; yüksek çıkış kinetik enerjisi, ince taneli (fine-grained: $r = 1.5 - 2.8\text{px}$) mikro-zerre dağılımı ve yerçekimi ivmesiyle aşağı doğru hızlanarak çakılan doğal balistik yaylar taşımak ZORUNDADIR.

19. **Akışkan Drenajı, Sıfır-Tül ve Zemin Buhar Dalgası İlkesi (Fluid Cascade Continuity, Anti-Veil & Ground Impact Vapor Dynamics):**
    - **Monolitik Statik Tül Yasağı (No Monolithic Static Veil):** Su veya akışkan saldırılarında (Hydrocannon, Hydro Pump, Deluge vb.); darbe merkezinin altından dökülen suyu kartın alt yarısını kaplayan statik tek parça SVG gövdeleri (`<path>` veya `<rect>`), opak beyaz perdeler veya donuk tül tabakalarıyla geçiştirmek KESİNLİKLE YASAKTIR. Akışkan daima türbülanslı ve optik kırılmalı su kordonları (`feTurbulence`), örgülü akış şeritleri ve alttaki birleştirici kaustik matris örtüsü (`matrixSheet`) ile hacim kazanmalıdır.
    - **Barkod Boşluğu Yasağı (No Barcode Gaps):** Aşağı dökülen akışkan kordonları veya dereleri; animasyonun sönümlenme fazında birbirinden ayrık, paralel ve aralarında yapay boşluklar bulunan dikey çizgiler ("barkod/demir parmaklık") şeklinde seyrelip yok olamaz. Kordonlar birbirine binmeli (`overlapping braided ribbons`) ve altlarındaki yarı saydam akışkan zemin örtüsüyle boşluksuz bağlanarak akmalıdır.
    - **Dikenimsi / Sabit Çubuk / Buz Oku Parçacık Yasağı (No Rigid Spikes / Ice Shards in Fluid Spray):** Sıvı serpintisi ve kavitasyon zerrecikleri asla sabit uzunlukta (15–30px) dikey lancelar/çubuklar (`lineTo`) olamaz; bu durum suya "saplanan buz okları", "kirpi dikenleri" veya "düşen iğneler" izlenimi verir. Damlacıklar daima ince taneli (fine-grained: $r = 0.8 - 2.0\text{px}$), kuyruk uzunluğu anlık hız vektörüne dinamik orantılı ($L \le 5.0\text{px}$), hareket açısına kilitli aerodinamik teardrop damlaları ve difüz aerosol sis bulutları (`FluidMistCloud`) olarak saçılmalıdır.
    - **Zemin Darbesi Buhar Kabarışı (Ground Impact Vapor Billow):** Yüksek debili su kütlesi kartın tabanına çarptığında zeminde daralarak sönüp gidemez; kinetik darbe etkisiyle tabandan yukarı doğru kabaran ve yatayda genişleyen hacimli bir buhar ve sis dalgası (`translateY` yükselmesi, `scale` genleşmesi ve zemin aerosol zerrecikleri) fışkırtmalıdır.

20. **Çoklu Varyant & Coin-Flip Mimari Standardı (Multi-Variant & Coin-Flip Architecture Protocol):**
    - Bir saldırı animasyonu için kullanıcı tarafından birden fazla estetik veya kinematik varyant talep edildiğinde (örneğin Hydrocannon: *Örgülü Kordonlu Şelale* vs. *Geniş Çağlayan Deluge*); her iki varyant da eşit teknik titizlikle inşa edilmeli, tek bir varyant tercih edilip diğeri çöpe atılamaz.
    - Kod yapısı her iki varyantı da bünyesinde barındıracak modüler bir mimariyle tasarlanmalı; saldırı her tetiklendiğinde rastgele (%50 deterministik coin-flip) seçim yapan bir varyant seçici motoru entegre edilmelidir.
    - Bağımsız önizleme ve showcase sayfalarında (`preview_*.html`), rastgele coin-flip testinin yanı sıra geliştirici ve kullanıcının her bir varyantı doğrudan ve kesintisiz inceleyebilmesini sağlayan interaktif varyant pill butonları (`🎲 Coin-Flip (Rastgele)`, `1️⃣ Varyant 1`, `2️⃣ Varyant 2`) ve anlık varyant durum rozeti (`#activeVariantBadge`) bulunmak ZORUNDADIR.

21. **Güneş Işını, Enerji Toplama & Tabana Kilitli (bottom: 0px) Zemin Füzyon Dalgaları (Solar Accretion, Coronal Acceleration & Ground-Sealed Beam Dynamics — Venusaur Dersi):**
    - **Optik Kararma & Gravitasyonel Lensleme (Optical Lensing Vignette):** Yüksek enerjili solar veya plazma birikimlerinde (Solarbeam, Hyper Beam vb.); vuruş öncesinde sahneyi dış çeperden karartan ve enerjiyi merkeze çeken optik lensleme karartması zorunludur.
    - **Hızlanan Korona Fotosferi & Tekillik İçe Çöküşü (Coronal Acceleration & Vacuum Snap):** Enerji çekirdeği düz bir daire olarak büyüyüp tekdüze patlayamaz. Fotosfer etrafında 4 kıvrımlı korona plazma kolu kademeli ivmelenerek ($0^\circ \rightarrow 720^\circ$ hiper-dönüş) hızlanmalı; deşarjdan hemen önceki milisaniyede şiddetli bir tekillik içine çökmeli (`scale: 0.03` vakum kapanması / inward snap) ve ardından lazer sütunu deşarj edilmelidir.
    - **Tabana Kilitli Zemin Füzyon Dalgaları (Bottom-Anchored Ground Surge Waves):** Dikey sütun vuruşlarında zemin şok dalgaları kartın ortasında havada yüzemez. Dalgalar doğrudan lazerin bittiği taban hizasına (`bottom: 0px`, `transform-origin: 50% 100%`) contalanmalı; 3 kademeli (termal füzyon, klorofil plazma, iyonizasyon) dışa açılan eşmerkezli yarım elipsler olarak yayılmalı ve tabanda parıldayan eriyik çekirdeği (`ground hearth core`) ile dikey yükselen foton kıvılcımları üretmelidir.

22. **Vorteks Hidrodinamiği, Logaritmik Okyanus Hunisi ve Merkeze Çekilen Kavitasyon Fiziği (Logarithmic Siphon Vortex & Inward Cavitation Suction — Poliwrath Dersi):**
    - **Tel Örgü & CAD Çemberi Yasağı (No Tangled Wireframe Coils):** Girdap veya su burgusu efektlerinde (Whirlpool, Fire Spin vortex vb.); kartın ortasında dönen yapay mavi tel çizgiler (`stroke` yayları), kesik çizgili CAD çemberleri veya plastik makara izlenimi veren geometrik halkalar KESİNLİKLE YASAKTIR.
    - **Logaritmik Çift Kollu Okyanus Hunisi (Dual-Arm Logarithmic Archimedean Spiral Siphon):** Burgu, akışkan okyanus mantosu üzerinde iç içe geçen iki dengeli ters logaritmik spiral kolla (`wpDeepSiphonVortex`) ve merkezdeki karanlık abisal huni gözüyle (`vortex eye`) inşa edilmelidir.
    - **Merkeze Çekilen Kavitasyon Yörüngesi (Inward-Drawn Cavitation Suction):** Parçacıklar dışarı saçılmak yerine; girdabın merkezkaç ve emiş fiziğine uygun olarak dış yarıçaptan ($r=58\text{px}$) hızlanarak spiral çizip merkeze doğru küçülerek ($r=2\text{px}$, `scale: 0.1`) karanlık huniye emilmelidir.

23. **Kostik Asit Aşınması, Rayleigh-Plateau Viskoz Akışı ve Kabaran Sülfür Buharı (Caustic Substrate Erosion, Rayleigh-Plateau Necking & Boiling Blister Dynamics — Victreebel Dersi):**
    - **Karikatür Yeşil Damla & Düz Disk Yasağı (No Flat Drops or Plain Disks):** Asit ve kimyasal erime saldırılarında (Acid, Acid Melt, Corrosive Gas vb.); havadan düşen klipart su damlaları veya zemin üzerinde düz yeşil geometrik daireler KESİNLİKLE YASAKTIR.
    - **Çok Loblu Kostik Erozyon Göleti & Yanık Alt Katman (Multi-Lobed Corrosive Substrate Puddle):** Kart yüzeyini eriten asit göleti, Ken Sugimori asit dokusuna uygun olarak; altta yanık klorofil/karbonlaşma astarı (`#14532d`), üstte kaynayan neon asit kütlesi (`#bef264` $\rightarrow$ `#84cc16`), akkor sülfür çekirdekleri ve çevreye sıçrayan kimyasal aşınma lekeleriyle çok loblu organik Bézier formu taşımalıdır.
    - **Rayleigh-Plateau Viskoz Sıvı Boyunlaşması & Damla Kopması:** Dökülen asit jeti, akışkan fiziğine uygun esneyen viskoz boyun ve yerçekimiyle hızlanan damla taneleri (`pinch-off beads`) ile zemine inmelidir.
    - **Kaynayan Kimyasal Kabarcıklar & Sülfür Buhar Pencereleri:** Asit göleti üzerinde zeminle tepkimeye girerek kabaran ve patlayan 14 mikro kabarcık (`amChemicalBlisterBoil`) ve organik dönerek yükselen acı sülfür duman pufcukları (`amSulfurVaporHeptagon`) ile kimyasal reaksiyon tamamlanmalıdır.


