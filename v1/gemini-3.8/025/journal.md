# Çalışma Günlüğü: Deney 025

**Tarih:** 2026-09-30  
**Konu:** PerformanceObserver API & Yüksek Çözünürlüklü Tipografik Profilleme Kokpiti  
**Durum:** GELİŞTİRME  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `024.html` (24 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 25. Deney, projenin çeyrek asırlık (quarter-century milestone) büyük kilometre taşıdır.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** PerformanceObserver API (W3C Performance Timeline Level 2 / Paint Timing / Layout Instability / User Timing API).
- **Temel API Yetenekleri:**
  - `new PerformanceObserver((list, observer) => { ... })`
  - Desteklenen Giriş Tipleri (`entryTypes`): `mark`, `measure`, `paint`, `layout-shift`, `longtask`.
  - `performance.mark(markName, { detail, startTime })`
  - `performance.measure(measureName, startMark, endMark)`
  - `performance.now()` ile mikrosaniye (sub-millisecond float) hassasiyetli zaman damgalama.
  - `PerformancePaintTiming` (`first-paint`, `first-contentful-paint`).
  - `LayoutShift` telemetrisi (`hadRecentInput`, `value`, kümülatif kayma skoru).
  - Canlı telemetri şelalesi (waterfall graph), 16.67ms (60 FPS) ve 8.33ms (120 FPS) frame budget barları.
- **Tasarım Yaklaşımı:**
  - Bilimkurgu / havacılık telemetri paneli (Kuantum Profilleme Kokpiti) estetiği.
  - Merkezde yüksek kontrastlı, neon ışıltılı ve morfolojik olarak değişebilen "HELLO WORLD" ana tipografisi.
  - Her tipografik animasyon ve morfolojik etkileşim mikro seviyede `performance.mark` ve `performance.measure` ile ölçülerek canlı şelale paneline işlenir.
  - Sıfır harici kütüphane, saf W3C tarayıcı API'si.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Kuantum Profilleme Kokpiti (Quantum Performance Cockpit)**  
   - Karanlık siber uzay arka planı, merkezde "HELLO WORLD" tipografik odağı.
   - PerformanceObserver ile anlık `mark`, `measure`, `paint`, `layout-shift` girişlerini yakalayan dinamik bir şelale zaman çizelgesi, 16.67ms frame bütçesi ibresi, CLS ve FCP telemetri göstergeleri.
   - Kullanıcı butonlarıyla tetiklenebilen "Tipografik Morfoloji", "Reflow Stres Testi" ve "Glif Yeniden Dizilimi" simülasyonları.
2. **Fikir 2: Laboratuvar Tipografik Telemetri Masası (Laboratory Telemetry Bench)**  
   - Açık gri / monokrom teknik editoryal mizanpaj.
   - "HELLO WORLD" harflerinin her birinin render ve reflow gecikmesini ayrı ayrı tabloya döken statik/dinamik test masası.
3. **Fikir 3: Retro-Fütüristik Katot Işınlı Profiler Konsolu (Cathode Ray Typographic Profiler)**  
   - Yeşil fosforlu CRT osiloskop simülasyonu.
   - Her frame için ölçülen süreyi dikey sütun grafiği olarak çizen konsol.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Kuantum Profilleme Kokpiti** seçildi.
- **Gerekçe:** Hem 25. deney kilometre taşına yaraşır görsel derinlik ve siber-fütüristik şıklık sunuyor, hem de PerformanceObserver'ın çoklu giriş türlerini (`mark`, `measure`, `paint`, `layout-shift`, `longtask`) eşzamanlı olarak gerçek zamanlı bir şelale çizelgesinde canlı görselleştirmeyi mükemmel biçimde mümkün kılıyor.

---

## Faz 5: Geliştirme (`src/025.dev.html`)
- HTML5 semantik mimarisi: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C Performance Timeline Level 2 & User Timing Level 3:
  - `new PerformanceObserver((entryList, observer) => { ... })`
  - Çoklu giriş gözlemi: `paint`, `mark`, `measure`, `layout-shift`, `longtask`.
  - `performance.mark()`, `performance.measure()`, `performance.now()`.
  - HTML5 Canvas 2D canlı şelale zaman çizelgesi (16.67ms 60 FPS bütçe çizgisi ile).
  - Canlı telemetri ibreleri: First Paint (FP), First Contentful Paint (FCP), Cumulative Layout Shift (CLS), Measure Adedi, Frame Render Bütçesi.
  - İnteraktif profilleme tetikleyicileri: Tipografik Morfoloji, Dinamik Reflow, Yoğun Döngü Stresi, Spektral Parçacık Nabzı, Kuyruk Temizleme.
  - Bireysel glif etkileşimi: Her bir harfe tıklandığında bireysel işaretleme ve ölçüm üretimi.

---

## Faz 6: Otomatik Doğrulama
- **Komut:** `./verify.sh src/025.dev.html reports/025`
- **Sonuç:** `OK` (Exit Code 0).
- **Ayrıntılar:**
  - `dependency-check.sh`: PASS (0 harici kütüphane, CDN, font veya harici ağ isteği).
  - Chrome CSSOM & `CSS.supports()`: PASS (Tüm CSS bildirimleri geçerli).
  - Konsol / Çalışma Zamanı: PASS (0 hata, 0 uyarı).
  - Teknoloji Kanıtı: `VERIFIED (PerformanceObserver desteklenen 5 giriş tipi aktif dinlendi, buffered paint ve user timing measure olayları başarıyla üretildi)`.

---

## Faz 7: Görsel İnceleme ve Ekran Görüntüleri
- **Alınan Ekran Görüntüleri:**
  - `screenshot-morph.png`: Genişletilmiş morfoloji ve canlı measure şelalesi.
  - `screenshot-reflow.png`: Dinamik reflow ve glif harf aralığı kayması.
  - `screenshot-stress.png`: Yoğun işlem döngüsü ve LONG_TASK_STALL uyarısı.
  - `screenshot.png`: Birincil sahne genel görünümü.
- **İnceleme Sonucu:** Siber uzay ve telemetri estetiği, yüksek kontrastlı parlayan "HELLO WORLD" ana başlığı ve mikrosaniye şelale grafiği kusursuz çalışıyor.

---

## Faz 8: Teknik Raporlama
- **Oluşturulan Belge:** `reports/025/report.md`
- **Bölümler:** 5 zorunlu bölüm eksiksiz dolduruldu.

---

## Faz 9: Mühürleme
- **İşlem:** `mv src/025.dev.html src/025.html`
- **Doğrulama:** `./verify.sh src/025.html reports/025` -> `OK` (Exit Code 0).
- **Mühürleme Durumu:** `src/025.html` mühürlendi; `src/` dizininde hiçbir `.dev.html` kalmadı.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 025 başarıyla tamamlandı.

