# Deney 011 Günlüğü: ResizeObserver ve Container Queries

Bu günlük, Deney 011 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:29] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 002'de tüm ekran genişliğine (`vw`) bağlı akışkan tipografi kullanılmıştı.
- Deney 011'de, modern web yerleşiminin dönüm noktası olan **CSS Container Queries** (`@container`, `container-type: inline-size`) ve bu boyut değişimlerini piksel altı hassasiyetle dinleyen **ResizeObserver API** hedeflenmiştir.
- Temel amaç: "Hello World" ifadesini bağımsız, yeniden boyutlandırılabilir bir bileşen kutusu içine yerleştirip, yalnızca bu kutunun genişliğine göre tipografinin morfolojik olarak şekil değiştirmesini (kompakt dikey bloktan panoramik tek satıra) sağlamak ve ResizeObserver ile mikrosaniyelik telemetri akışı üretmektir.

### Tasarım Alternatifleri
1. **Alternatif A — Yalnızca CSS @container (ResizeObserver Olmadan):** Saf CSS konteyner sorguları. (ResizeObserver API'sinin JS entegrasyonunu ve dinamik gözlem kabiliyetini göstermez).
2. **Alternatif B — Konteyner Duyarlı Morfolojik Tipografi ve Telemetri (Seçildi):** Kullanıcının doğrudan tutamaç (resize handle) ile genişliğini sürükleyebileceği veya önayarlı butonlarla (320px, 540px, 860px, 1100px) boyutlandırabileceği interaktif bir sahne oluşturulur. `container-type: inline-size` ile CSS konteyner sorguları harflerin düzenini ve büyüklüğünü değiştirir; `ResizeObserver` ise `contentBoxSize` verilerini anlık okuyarak HUD'a yazar ve matematiksel mikro stil ayarlamaları yapar.
3. **Alternatif C — Grid Izgara İçinde Çoklu Küçük Kartlar:** Sayfada 10 farklı boyutta Hello World kutusu açmak. (Görsel odağı parçalayacağı için tek ana kutu ve canlı manipülasyon seçildi).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Ziyaretçinin kutu boyutunu anlık değiştirmesine imkan vererek hem CSS `@container` sorgularının hem de JS `ResizeObserver` arayüzünün eşzamanlı çalışmasını en berrak biçimde kanıtlar.


## [2026-09-29 01:37] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/011.dev.html` geliştirildi:
   - Yeniden boyutlandırılabilir konteyner `.resizable-container` üzerinde `container-type: inline-size` ve `container-name: hw-box` tanımlandı.
   - CSS Container Queries (`@container hw-box`) ile 3 farklı morfolojik tipografi modu oluşturuldu:
     - Kompakt (< 440px): Dikey istiflenmiş glif kulesi ve neon pembe tema.
     - Tablet (441px - 760px): Dengeli yatay çift satır ve camgöbeği tema.
     - Geniş / Panoramik (> 761px): Panoramik dev tipografi ve eflatun ışıma.
   - `ResizeObserver` API ile konteynerin `contentBoxSize` ölçümleri anlık dinlenerek HUD göstergesine ve durum rozetine aktarıldı.
   - Kullanıcı etkileşimi: Sürükleme tutamacı (`#resizeHandle`) ile piksel düzeyinde serbest boyutlandırma ve 4 adet önayarlı profil butonu eklendi.
2. Pipeline Çıktıları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, `<h1>` 742x94px)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
3. Yayımlama:
   - `src/011.dev.html` -> `src/011.html` olarak terfi ettirildi ve kilitlendi.
