# Deney 009 Günlüğü: SVG Filtreleri ve Sıvı Deformasyonu

Bu günlük, Deney 009 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:24] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 005'te SVG'nin 2D vektör çizim kabiliyetleri kullanılmıştı.
- Deney 009'da, tarayıcının piksel seviyesindeki en güçlü dahili efekt motoru olan **SVG Filtre Primitifleri** (`<filter>`, `<feTurbulence>`, `<feDisplacementMap>`, `<feColorMatrix>`) hedeflenmiştir.
- Temel amaç: Sıradan CSS filtrelerinin (`filter: blur(5px)`) yapamadığı karmaşık koordinat kaydırma ve prosedürel doku sentezini (Perlin Noise / Fractal Noise) kullanarak semantik "Hello World" DOM başlığını canlı, dalgalanan, sıvı bir tipografiye dönüştürmek.

### Tasarım Alternatifleri
1. **Alternatif A — Basit SVG Bulanıklığı ve Renk Matrisi (Gooey Effect):** İki dairenin birleşmesi benzeri standart gooey filtresi. (Sıvı dalgalanmasını ve displacement map gücünü yeterince hissettirmez).
2. **Alternatif B — Prosedürel Perlin Gürültüsü ile Sıvı Deformasyonu (Seçildi):** `<feTurbulence type="fractalNoise">` ile fraktal gürültü alanı oluşturulur. `<feDisplacementMap>` bu gürültünün Kırmızı ve Yeşil kanallarını koordinat vektörleri olarak kullanarak metin piksellerini organik bir sıvı gibi büker. JavaScript döngüsü ile `baseFrequency` parametresi sinüzoidal olarak modüle edilerek metnin nefes alan bir cıva/akışkan gibi akması sağlanır. Etkileşimli kontrol paneli ile dalga şiddeti (scale), frekans ve RGB ayrışması (chromatic aberration) değiştirilebilir.
3. **Alternatif C — Statik Çatlak/Taş Dokusu:** Tek seferlik statik displacement filtresi. (Dinamik ve etkileşimli olmadığı için elendi).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Standart semantik DOM metnini korurken, tarayıcının donanım hızlandırmalı vektörel filtre mimarisini canlı ve interaktif bir görsel şölene dönüştürür.


## [2026-09-29 01:25] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/009.dev.html` geliştirildi:
   - `<svg>` içinde `<filter id="liquidFilter">` tanımlandı.
   - `<feTurbulence>` (fraktal Perlin gürültüsü) ve `<feDisplacementMap>` (X/Y renk kanalları ile piksel koordinat deformasyonu) bağlandı.
   - Yüzey gerilimi ve ışıma için `<feGaussianBlur>` ve `<feMerge>` entegre edildi.
   - `requestAnimationFrame` ile `baseFrequency` sinüzoidal olarak modüle edilerek metne canlı erimiş metal / sıvı akış simülasyonu kazandırıldı.
   - Kullanıcı etkileşimi: Dalga genliği (scale), frekans, gürültü katmanı (octaves), akış duraklatma ve imleç enerji dalgası (pointer ripple) kontrolleri eklendi.
2. Pipeline Çıktıları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, `<h1>` 798x150px)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
3. Yayımlama:
   - `src/009.dev.html` -> `src/009.html` olarak terfi ettirildi ve kilitlendi.
