# Pokémon TCG 1999 — Konuşma Özeti, Alınan Teknik Kararlar ve Sıradaki İşler

**Tarih:** 13 Eylül 2026  
**Proje:** Pokémon TCG 1999 Demo (`pokemon-tcg-1999_demo`)  
**Doküman Konumu:** [`antigravity-chat.md`](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/antigravity-chat.md)  
**İlgili Ana Tasarım Belgesi:** [`ANIMATION_DESIGN_SYSTEM.md`](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/ANIMATION_DESIGN_SYSTEM.md)  

---

## 1. Konuşma Akışı ve Yapılan Başlıca İşler

Bu oturumda; daha önce üzerinde uzlaşılan görsel üretim/dekupaj kuralları, animasyon standartları ve ölçeklendirme prensipleri ekseninde hem somut hatalar giderilmiş hem de projenin genel tasarım felsefesi kalıcı bir mimari sisteme dönüştürülmüştür:

1. **Scyther "Swords Dance" (`scyther_blade_dance`) Ölçeklendirmesi ve Kırpma:**
   - **Sorun:** Orijinal stok görselde (`Scyther_Scythe_Blade.png`) 1080×1080 piksellik devasa saydam boşluk kalmıştı ve `BattleFXOverlay.tsx` içerisinde `w-16 h-16` (64px) kutuda çağrıldığı için gerçek tırpan sadece ~42px (minyatür) görünüyordu.
   - **Çözüm:** Görsel 739×519 piksellik tight bounding box'a kırpıldı; `w-[108px] h-[76px]` standart ve `w-[80px] h-[56px]` whiffed (ıskalama) dinamik boyutlandırmasına kavuşturuldu. Görsel ağırlığı %157 artırılarak projenin standart orak boyutuna getirildi.

2. **Horsea "Smokescreen" (`horsea_smokescreen`) Kapsamlı Yeniden Tasarımı:**
   - **Anatomik Yönelim ve Balistik Sorunu:** Orijinal görselde sola-aşağı bakan burun hedef kartın sol-üstüne konmuştu; burun boşluğa bakıyor ve arkasından çıkan duman geriye bükülüyordu. Horsea sağ-üst köşeye (`right: 2%`, `top: 6%`) taşındı; sola-aşağı doğru tam kartın merkezine hedef alması sağlandı.
   - **Fiziksel Geri Tepme (Recoil):** Üflemeden hemen önce hedefe doğru öne uzanıp şişme (`translate(0, 0)`), mürekkep patladığı anda sağ-yukarıya tok bir geri tepme ivmesi (`translate(12px, -3px)`) eklendi.
   - **Dönen Köşeli Blok Duman Sorunu:** 4 adet basit div çemberinin kare kutu içinde `rotate(25deg) -> rotate(160deg)` dönmesi (karton fırıldak görüntüsü) tamamen kaldırıldı. Yerine 10 boğumlu çok katmanlı organik SVG Bézier bulutu (`path`), abis merkezden buğulu kenara renk derinliği, iç hidrodinamik girdap hatları ve 6 bağımsız süzülen is parçacığı entegre edildi.
   - **Ölçeklendirme Düzeltmesi:** Horsea'nin kafası mekanik olarak Tier 1 (`114px x 91px` — Gyarados'tan büyük!) ayarlanmıştı. Minik temel Pokémon kafası standardına uygun olarak **`80px × 64px`** standart ve **`60px × 48px`** whiffed boyutuna indirgendi.

3. **Master Blueprint Oluşturulması & Anayasa Güncellemeleri:**
   - Proje ana dizininde kalıcı referans dokümanı olan [**`ANIMATION_DESIGN_SYSTEM.md`**](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/ANIMATION_DESIGN_SYSTEM.md) oluşturuldu ve konuşma boyunca çıkarılan derslerle zenginleştirildi.

---

## 2. Alınan Kritik Teknik Kararlar ve Mimari Standartlar

Projenin bütünlüğünü korumak adına aşağıdaki kurallar kesinleşmiş ve sisteme işlenmiştir:

### A. İki Kademeli Stok Görsel Ölçeklendirme Hiyerarşisi (Two-Tier Hierarchy)
- **Tier 1 — Büyük Silahlar, Tam Bedenler & Apex Yaratıklar (~%68.1 Kuralı):**
  - Standart: **~108px – 120px** (Kart genişliğinin %68'i).
  - Whiffed: **~78px – 84px** (%54.5).
  - *Örnekler:* Scyther tırpanı (`108x76`), Gyarados kafası (`108x108`), Eevee sprinti, Rattata deparı, Machamp chop.
- **Tier 2 — Temel Pokémon Başları, Burunları & Biyo-Organlar (~%45–%50 Kuralı):**
  - Standart: **~76px – 84px** (Kart genişliğinin %45–%50'si).
  - Whiffed: **~58px – 64px** (%35–%38).
  - *Örnekler:* Horsea burnu (`80x64`), Bulbasaur tohumu (`76x76`), Caterpie boynuzu (`72x72`), Weedle iğnesi (`64x64`), Pikachu yanakları (`84x84`).
  - *Kıyaslama İlkesi:* Küçük bir temel Pokémon'un kafası veya organı, ekranda asla Gyarados veya Scyther gibi apex yaratıklardan daha geniş olamaz!

### B. Akışkan Atmosferik FX vs. Köşeli Dönen Bloklar (Fluidity Rule)
- Gaz, sis, duman ve mürekkep bulutlarına **asla toptan `rotate(...)` verilmez** (bu durum onları dönen kare kartonlara dönüştürür).
- Dumanlar merkezden dışa çok boğumlu Bézier SVG eğrileriyle (`path`) genleşmeli, radyal yoğunluk gradyanı içermeli ve etrafa dağılan bağımsız süzülen zerrelerle çözülmelidir.

### C. Doğal Hedefleme & Balistik Yönelim (Anatomical Trajectory)
- Kullanılan stok görselin baktığı doğal açı ve namlu yönü, doğrudan rakip kartın merkezini hedeflemelidir.
- Püskürtme saldırılarında hedefe doğru hazırlık şişmesi ve atış anında merminin tersi yönünde geri tepme sarsıntısı (recoil) zorunludur.

### D. İşbirliği ve Dekupaj Protokolü
- Asistan kafasına göre otonom görsel üretimi veya otomatik arka plan silme işlemi yapmaz.
- Kullanıcı ham görselleri üretir ve arka plan şeffaflaştırmalarını `public/assets/raw/` klasöründe hazırlar.
- Asistanın görevi onaylanan PNG'leri tight bounding box'a göre kırpmak, CSS/SVG kodlamasını ve animasyon entegrasyonunu yapmaktır.

### E. "Bubblebeam" Dersi (Çalışan Zenginliğin Korunması)
- Yüzeysel regex/otomasyon taramaları körü körüne uygulanmaz; çalışan, zengin ve kullanıcının beğendiği animasyonlar (Gyarados *Bubblebeam*, Raticate *Super Fang*, Ninetales *Fire Blast* vb.) kesinlikle bozulmaz.

### F. Teknik ve UI Entegrasyon Sınırları
- `getFXDuration` süresi en uzun CSS keyframe süresine milimetrik eşit olmalıdır (efekt havada yarım kalıp pat diye kaybolamaz).
- Hasar sayıları ve HP barları her zaman en üstte (`z-50`) kalmalı, FX katmanları `z-10` ile `z-40` arasına hapsedilmelidir.
- Kart geneli auralarda kart container sınırları (`rounded-xl overflow-hidden`) korunmalıdır; oyun matına taşan gri/siyah dikdörtgen blur lekeleri engellenmelidir.

---

## 3. Model Geçişi Değerlendirmesi: Neden Gemini 3.1 Pro High?

3.8 Flash High kotasının dolması nedeniyle gündeme gelen alternatifler (3.8 Flash Medium vs. 3.1 Pro High) incelenmiş ve **3.1 Pro High** oybirliğiyle seçilmiştir:
- **Devasa Kod Tabanı Güvenliği:** `BattleFXOverlay.tsx` (16.700+ satır) ve `src/index.css` (11.400+ satır) gibi dev dosyalarda Flash Medium'un kod yutma, parantez kaçırma veya sözdizimi bozma riski yüksektir. 3.1 Pro High AST bütünlüğünü korur.
- **Kural Sadakati:** Dekupaj protokolü ve ölçek kurallarını "High" reasoning sayesinde unutmaz.
- **Multimodal Görüntü Analizi:** Piksel detaylarını, şeffaflık kenarlarını ve görsel oranları kavramada Pro mimarisi çok daha keskindir.
- **Hafıza Sürekliliği:** Aynı oturumda model değiştirildiğinde konuşma geçmişi sıfırlanmaz; [`ANIMATION_DESIGN_SYSTEM.md`](file:///c:/Users/KaanS/.gemini/antigravity/scratch/pokemon-tcg-1999_demo/ANIMATION_DESIGN_SYSTEM.md) belgesi de hazır olduğu için yeni model sıfır bağlam kaybıyla görevi devralabilir.

---

## 4. Kod Tabanı Genel Denetimi ve Tespit Edilen Sapmalar

Tüm kod tabanında yapılan otomatik analiz sonucunda, Horsea'nin önceki haline benzer problemler taşıyan iki ana liste çıkarılmıştır:

### Liste A: Stok Görsel Boyutlandırma İncelemesi (Görsel Kütle & Bounding Box)
> [!NOTE]
> **Bubblebeam Dersi & Görsel Kütle (Visual Mass) Ayrımı:** Sadece CSS'teki `110px` değerine bakarak mekanik karar verilmez. Örneğin **Weedle (`weedle_poison_sting`)**, 45 derece diyagonal ince bir silüete ve seri dalış ivmesine (`scale(0.4) -> scale(1.02)`) sahip olduğu için kullanıcı tarafından ekranda **tam olması gereken mükemmel boyutta** olduğu doğrulanmıştır ve **kesinlikle korunacaktır.**

Aşağıdaki adaylar ise ekrandaki görsel ağırlıklarına göre kullanıcının doğrudan gözlem ve onayıyla tek tek değerlendirilecektir:
1. **Caterpie (`caterpie_string_shot`):** `Caterpie_Head_Osmeterium.png` `110x110` — Kart merkezine konmuş, ipek telleri kafanın arkasından fırlıyor.
2. **Pikachu (`pikachu_thunder_jolt`):** `Pikachu_Spark_Cheeks.png` `120x120` — Sadece yanak/yüz parçası için görsel kütlesi yüksek olabilir.
3. **Bulbasaur (`bulbasaur_leech_seed`):** `Bulbasaur_Leech_Seed_Pod.png` `98x98`.
4. **Charmander (`charmander_ember_flame`):** `Charmander_Tail_Flame.png` `110x110`.
5. **Sandshrew (`sandshrew_sand_attack`):** `Sandshrew_Digging_Claws.png` `110x110`.
6. **Cubone (`cubone_bone_strike`):** `Cubone_Bone_Club.png` `120x120`.

---

### Liste B: Dönen Karton / Küt Geometri Kullanan Duman & Sis Hamleleri
1. **Paras Spore (`paras_spore`):** `gbaParasSporeCloud` animasyonunda duman bulutu **`rotate(0deg) -> rotate(200deg)`** şeklinde tam 200 derece dönüyor! Akışkan spor bulutu yerine havada fırıldak gibi dönen daireler kümesi görünüyor.
2. **Gastly Sleeping Gas (`gastly_sleeping_gas`):** `gbaGastlySleepGasCloud` animasyonunda tüm kutu 45 derece dönüyor; **Gastly'nin gözleri de dumanla beraber 45 derece yana devriliyor!** Organik buğu yerine 2 adet basit CSS div çemberi var.
3. **Weezing Toxic Smog (`weezing_toxic_smog`) & Koffing Foul Gas (`koffing_foul_gas`):** Weezing bacalarından çıkan sarı/mor gazlar `rotate(-20deg) -> rotate(40deg)` ile 60 derece dönen küt div çemberlerinden ibaret. Duman kabarmak yerine çubuk gibi dönüyor.
4. **Magmar Smog (`magmar_smog`):** `gbaMagmarSmogPlume1` ve `2` animasyonlarında dönen basit div daireleri.
5. **Genel Smokescreen (`smokescreen_cloud`) & Sleeping Gas (`sleeping_gas`):** Eski dönen daire kümeleri.

---

## 5. Sıradaki İşler ve Eylem Planı (Roadmap)

Kaldığımız yerden devam ederken izlenecek öncelikli iş sırası:

- [ ] **Görev 1: Duman ve Sis Efektlerinin Akışkanlaştırılması (Öncelikli Aşama - Fluidity Overhaul)**
  - **1.1. Paras (`paras_spore`):** 200 derecelik rotasyonu kaldır; organik çok boğumlu mantar sporu Bézier bulutu ve radyal ışıma parçacıkları ekle.
  - **1.2. Gastly (`gastly_sleeping_gas`):** Gözleri dönen kutudan ayırıp sabit/nabız atan ektoplazmik bir bakışa dönüştür; dönen daireler yerine hipnotik ve akışkan ektoplazma Bézier dumanı giydir.
  - **1.3. Weezing & Koffing (`weezing_toxic_smog`, `koffing_foul_gas`):** Bacalardan dönen bloklar yerine yukarı doğru kabaran sülfür ve asit duman dalgaları entegre et.
  - **1.4. Magmar & Genel Smokescreen:** Dönen div kümelerini organik akışkanlığa geçir.

- [ ] **Görev 2: Stok Görsel İncelemesi (Kullanıcı Onaylı & Seçici Değerlendirme)**
  - *Not: Weedle gibi kullanıcı tarafından onaylanan ve görsel kütlesi oturmuş animasyonlara dokunulmayacaktır.*
  - Caterpie, Pikachu, Bulbasaur vb. hareketler kullanıcı tarafından incelenip talep edilirse ölçek ve açı ince ayarına alınacaktır.

- [ ] **Görev 3: Doğrulama ve Derleme Kontrolü**
  - Her revizyonda `npm run build` ile TypeScript/Vite bütünlüğünü teyit et.
  - `http://localhost:3000/` üzerinde görsel akışkanlığı ve koordinat uyumunu doğrula.
