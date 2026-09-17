# Pokémon TCG 1999: Agent Rules & Animation Directive

## 1. Zorunlu Animasyon Kılavuzu (Strict Animation Directive)

Bu depoda herhangi bir saldırı animasyonu (Move Animation / Battle FX), görsel efekt veya parçacık sistemi üzerinde analiz, tasarım, düzenleme veya implementasyon yaparken; istisnasız olarak projenin ana anayasası olan **[ANIMATION_DESIGN_SYSTEM.md](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/ANIMATION_DESIGN_SYSTEM.md)** kılavuzuna başvurmak ve oradaki tüm kurallara harfiyen uymak ZORUNDASIN. Yeni bir sohbete başlandığında ya da bağlam tazelendiğinde, bu düsturu tekrar hatırlatmaya gerek kalmaksızın doğrudan referans al.

### Asla İhlal Edilemeyecek Temel İlkeler:

1. **5 Katmanlı Mimari Şablonu (The 5-Layer FX Architecture):**
   Her saldırı overlay'i istisnasız şu 5 katmandan oluşmalıdır:
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

7. **Emoji ve İlkel Şekil Yasağı:**
   - Mobil/Unicode emojiler (`⚡`, `💥`, `🍃`, `💨` vb.) ve düz metin sembolleri (`✦`) overlay'lerde kesinlikle yasaktır.
   - Duman veya gaz bulutları tek parça kare gibi döndürülemez (`rotate` ile kutu döndürme yasağı); çok loblu Bézier SVG eğrileriyle organik kabarmalıdır.

8. **Varlık Üretim & Kırpma Protokolü (Strict Bounding-Box Cropping):**
   - Kullanıcının `public/assets/raw/` altında hazırladığı onaylı şeffaf PNG'ler, etrafında +8–16px güvenli pay bırakılarak sıkıca kırpılmalı (`tight crop`) ve öyle `/public/assets/` altına alınmalıdır.

9. **Kod Teyidi ve Varlık Denetim Protokolü (Strict Codebase Verification Protocol):**
   - Bir Pokémon'un, saldırı animasyonunun veya görsel varlığın mevcut durumunu analiz ederken veya kullanıcıya raporlarken; ASLA naif regex aramalarına veya geçici terminal script özetlerine körü körüne güvenilerek varsayımda bulunulamaz.
   - Herhangi bir varlığın (`.png`/`.svg`) veya saldırının kodda aktif olup olmadığı, istisnasız olarak doğrudan `BattleFXOverlay.tsx` içindeki gerçek JSX satır numaraları (`<img src="..." />` ve `fx.type === ...`) ve `cards.json` eşleşmeleri okunarak KESİNLEŞTİRİLMELİDİR.
   - Depoda zaten mevcut ve 5 katmanlı mimaride çalışan bir varlık (örneğin Pikachu, Nidoran ♂, Clefairy vb.) için kod teyidi yapılmadan "eksik", "yapılacak" veya "stok görsel adayı" şeklinde yanıltıcı iddialarda bulunulması KESİNLİKLE YASAKTIR. Her analiz doğrudan kod referansıyla (satır numarasıyla) belgelenmelidir.
