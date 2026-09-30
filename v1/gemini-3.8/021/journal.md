# Deney 021 İşlem Günlüğü (Journal)

Bu belge, Deney 021 (IntersectionObserver API ve Çok Eşikli Kinetik Tipografik Telemetri) sürecindeki anlamlı kararları, aşamaları, testleri ve sonuçları kronolojik ve append-only olarak kaydeder.

---

## [2026-09-30 00:40] Faz 1: Durum Kontrolü ve Başlangıç
- **İşlem:** Deney 021 çalışma alanı (`reports/021/`) oluşturuldu.
- **Hedef:** Modern W3C IntersectionObserver API (`new IntersectionObserver(callback, { root, rootMargin, threshold })`) kullanarak çok eşikli (101 kademeli) görünürlük algılama, her bir "HELLO WORLD" harfinin ve bileşeninin kesişim oranını (`intersectionRatio`, `intersectionRect`, `boundingClientRect`) milisaniyelik telemetriyle okuyup harf düzeyinde dinamik kinetik tipografi ve radar HUD arayüzü inşa etmek.
- **Teknoloji Tespiti:** W3C IntersectionObserver standardı tüm modern tarayıcılarda (%99+) yerel olarak desteklenmektedir; ana iş parçacığını kaydırma dinleyicileriyle yormadan doğrudan tarayıcının render döngüsüyle senkronize çalışır.

## [2026-09-30 00:40] Faz 2 & 3: Teknoloji Araştırması ve 3 Alternatif Fikir
- **İncelenen API:** IntersectionObserver API (W3C Working Draft & Standard).
- **Temel Yetenekler:**
  1. Granüler `threshold`: `Array.from({length: 101}, (_, i) => i / 100)` ile 0.0'dan 1.0'a kadar %1 hassasiyetle kesişim tetikleyicisi.
  2. `entry.intersectionRatio`, `entry.boundingClientRect`, `entry.intersectionRect`, `entry.isIntersecting`.
  3. `rootMargin` ile sanal gözlem tetikleme tamponları.
  4. Harf bazında CSS Custom Properties modülasyonu (`--ratio`, `--weight`, `--tracking`, `--glow`).
- **Alternatif 1 (Seçilen):** *Çok Eşikli Kinetik Harf Telemetrisi ve Optik Radar HUD.* "HELLO" ve "WORLD" kelimelerindeki 10 bağımsız harf glifi, özel bir optik tarama akış konteynerinde bağımsız gözlem hedefleri olarak izlenir. Her harfin görüş alanına giriş yüzdesine (`intersectionRatio`) göre font ağırlığı (100 -> 900), bulanıklığı, dikey ötelenmesi ve spektral OKLCH ışıması anlık modüle edilir. Ekranda gerçek zamanlı telemetri matrisi, radar vizörü ve interaktif kaydırma simülatörü bulunur.
- **Alternatif 2:** *Sonsuz Kart Yığını ve Ayrışan Harfler.* Sonsuz kaydırılan kartlar ekrana girdikçe harflerin yukarıdan aşağıya dökülmesi.
- **Alternatif 3:** *İkili Görünürlük Eşiği Karşılaştırıcısı.* Sayfadaki iki farklı gözlem kökünün (root) kesişim verilerinin kıyaslanması.

## [2026-09-30 00:40] Faz 4: Fikir Seçimi
- **Karar:** Alternatif 1 seçildi.
- **Gerekçe:** IntersectionObserver'ın mikroskobik matematiksel telemetri gücünü (`threshold: 101 kademe`) en estetik ve işlevsel şekilde doğrudan "HELLO WORLD" gliflerinin tipografik parametrelerine bağlaması, yüksek görsel çekiciliğe ve anında ölçülebilir çalışma zamanı kanıtına sahip olması.

## [2026-09-30 00:41] Faz 5: `src/021.dev.html` Geliştirme
- **Geliştirilen Dosya:** `src/021.dev.html`.
- **Uygulanan Standartlar:**
  - `new IntersectionObserver(callback, { threshold, rootMargin })`.
  - 101 kademeli (`0.00`'dan `1.00`'a) hassas eşik dizisi.
  - 10 bağımsız glif hedefi ("H-E-L-L-O W-O-R-L-D") ve CSS Custom Properties modülasyonu (`--ratio`, `--weight`, `--hue`).
  - Çift gözlemci kökü: Viewport gözlemcisi + iç konteyner gözlemcisi (`root: corridorScrollEl`).
  - Canlı radar reticle ve sağ panelde 10 hedefli telemetri matrisi.

## [2026-09-30 00:41] Faz 6: Otomatik Doğrulama
- **Komut:** `./verify.sh src/021.dev.html reports/021`
- **Sonuç:** `OK` (Exit Code 0).
- **Ayrıntılar:**
  - `dependency-check.sh`: PASS (Sıfır harici kütüphane, CDN, font veya medya).
  - Chrome CSSOM & `CSS.supports()`: PASS (Tüm CSS kuralları ve değişkenler geçerli).
  - Konsol / Çalışma Zamanı: PASS (0 hata, 0 istisna).
  - Teknoloji Kanıtı: `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel IntersectionObserver API döngüsü doğrulandı)`.

## [2026-09-30 00:41] Faz 7: Görsel İnceleme ve Ekran Görüntüleri
- **Alınan Ekran Görüntüleri:**
  - `screenshot-center.png`: Odak anı (%100 kesişim oranı, 900 font ağırlığı, tam aktif telemetri matrisi).
  - `screenshot-entry.png`: Koridor üst tamponu (%0.0 kesişim).
  - `screenshot-exit.png`: Koridor alt tamponu çıkış anı.
  - `screenshot.png`: Birincil kokpit genel görünümü.
- **İnceleme Sonucu:** Bilimsel uzay telemetri tasarımı, "HELLO WORLD" ana odak noktası, renk/ışık dengesi ve telemetri doğruluğu kusursuz.

## [2026-09-30 00:41] Faz 8: Teknik Raporlama
- **Oluşturulan Belge:** `reports/021/report.md`
- **Bölümler:** Amaç, Teknoloji ve Mekanizma, 5 Boyut Tasarım, Test Kanıtları, İNSAN DOĞRULAMASI GEREKLİ.

## [2026-09-30 00:41] Faz 9: Mühürleme
- **İşlem:** `mv src/021.dev.html src/021.html`
- **Doğrulama:** `./verify.sh src/021.html reports/021` -> `OK` (Exit Code 0).
- **Mühürleme Durumu:** `src/021.html` tamamlandı; `src/` dizininde hiçbir `.dev.html` kalmadı.

## [2026-09-30 00:41] Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` belgeleri güncelleniyor.
