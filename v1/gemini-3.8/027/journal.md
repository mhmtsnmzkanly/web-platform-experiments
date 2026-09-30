# Çalışma Günlüğü: Deney 027

**Tarih:** 2026-09-30  
**Konu:** CSS Motion Path API & Yörüngesel Kinetik Tipografi  
**Durum:** GELİŞTİRME  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `026.html` (26 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- Sıradaki deney: 027.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** CSS Motion Path Module Level 1 (W3C Candidate Recommendation).
- **Temel API Özellikleri:**
  - `offset-path: path("M ... C ... Z")`: DOM öğelerinin hareket edeceği vektörel SVG Bézier eğrisini tanımlar.
  - `offset-distance: 0% -> 100%`: Öğenin yol üzerindeki anlık konumunu belirler; CSS `@keyframes` veya Web Animations API ile donanım hızlandırmalı olarak canlandırılır.
  - `offset-rotate: auto | auto 90deg | 0deg`: Öğenin yörünge eğrisine göre teğetsel dönüşünü veya sabit duruşunu ayarlar.
  - `offset-anchor: center center`: Yörüngeye kenetlenen referans merkez noktasını belirler.
- **Tasarım Yaklaşımı:**
  - Kozmik Astrodinamik Gözlemevi (Orbital Typographic Astrodynamics Observatory) teması.
  - "HELLO WORLD" kelimesindeki her bir harf (`H-E-L-L-O W-O-R-L-D`), uzay boşluğundaki yerçekimsel vektör yörüngelerinde süzülen parıltılı göksel kütleler gibi hareket eder.
  - 3 farklı yörünge modu:
    1. Lemniscate (Kuantum Sonsuzluk Düğümü - Çift Döngülü Figür-8)
    2. Kepler Çift Galaktik Yörünge (Eşmerkezli Eliptik Çemberler)
    3. Bernoulli Sarmal Nebulası (Dışa Açılan ve Kapanan Sarmal Girdap)
  - İnteraktif Kontroller: Yörünge geometrisi seçimi, açısal hız (orbital period), teğet açısı modu (`auto`, `reverse`, `fixed upright`), neon yörünge kılavuz çizgileri görünürlüğü.
  - Canlı Astrodinamik Telemetri Paneli: Her glifin anlık yay mesafesi (`offset-distance`), yay hızı ve teğet koordinatları hesaplanarak gösterilir.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Kozmik Astrodinamik Gözlemevi (Orbital Typographic Astrodynamics)**  
   - Karanlık derin uzay arka planı, yıldız tozu ızgarası, SVG ile çizilmiş parıldayan neon kılavuz yörüngeleri ve teğet rotasyonla eğriler boyunca süzülen 10 harfli "HELLO WORLD" glif sürüsü. Canlı telemetri kokpiti ve parametrik hız sürgüleri.
2. **Fikir 2: Saat Mekanizması ve Kaotik Sarkaç Tipografisi (Horological Kinetic escapement)**  
   - Mekanik saatçilik / altın pirinç estetiği; harflerin dişli çarklar ve yay eğrileri boyunca `offset-path` ile döngüsel hareket etmesi.
3. **Fikir 3: Manyetik Parçacık Hızlandırıcı (Subatomic Particle Collider)**  
   - Parçacık fiziği laboratuvarı; dairesel vakum tüpleri boyunca hızlanan harfler ve çarpışma noktalarında ışıma.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Kozmik Astrodinamik Gözlemevi** seçildi.
- **Gerekçe:** CSS Motion Path standardının en güçlü yanları olan vektörel Bézier yolları (`path()`), teğet otomatik yönlenme (`offset-rotate: auto`) ve yumuşak yol boyunca süzülme kabiliyetini hem görsel hem de matematiksel olarak en kusursuz ve büyüleyici şekilde ortaya koyan yaklaşım budur.

---

## Faz 5: Geliştirme (`src/027.dev.html`)
- HTML5 semantik mimarisi: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C CSS Motion Path Module Level 1 uygulaması:
  - `offset-path: var(--active-path)`
  - `offset-rotate: var(--active-rotate)`
  - `offset-anchor: center center`
  - `@keyframes orbitMotion { from { offset-distance: 0%; } to { offset-distance: 100%; } }`
  - 3 farklı Bézier eğrisi: Lemniscate (Figür-8 Sonsuzluk Düğümü), Kepler Eliptik, Bernoulli Sarmalı.
  - Teğet modları: `auto`, `0deg` (sabit dik), `auto 180deg` (ters yörünge).
  - SVG dinamik kılavuz çizgisi katmanı (trajectory path & glow).
  - Canlı astrodinamik telemetri ızgarası: 10 glifin her birinin anlık yay mesafesi yüzdesi (`offset-distance` %).
  - Etkileşimli glif kütleçekim dalgası ve oynat/durdur kontrolleri.

---

## Faz 6: Otomatik Doğrulama
- **Komut:** `./verify.sh src/027.dev.html reports/027`
- **Sonuç:** `OK` (Exit Code 0).
- **Ayrıntılar:**
  - `dependency-check.sh`: PASS (0 harici kütüphane, CDN, font veya harici ağ çağrısı).
  - Chrome CSSOM & `CSS.supports()`: PASS (`offset-path`, `offset-distance`, `offset-rotate` %100 geçerli).
  - Konsol / Çalışma Zamanı: PASS (0 hata, 0 uyarı).
  - Teknoloji Kanıtı: `VERIFIED (Aktif çalışan CSS Motion Path animasyonları tespit edildi)`.

---

## Faz 7: Görsel İnceleme ve Ekran Görüntüleri
- **Alınan Ekran Görüntüleri:**
  - `screenshot-ellipse.png`: Kepler Eliptik Yörünge görünümü.
  - `screenshot-spiral.png`: Bernoulli Sarmal Nebulası girdabı.
  - `screenshot-upright.png`: Sabit dikey oryantasyon (0 deg).
  - `screenshot.png`: Birincil sahne genel görünümü (Lemniscate sonsuzluk döngüsü).
- **İnceleme Sonucu:** Derin uzay estetiği, parıldayan neon kılavuz eğrileri, teğet açılarla süzülen "HELLO WORLD" harfleri ve canlı telemetri paneli kusursuz.

---

## Faz 8: Teknik Raporlama
- **Oluşturulan Belge:** `reports/027/report.md`
- **Bölümler:** 5 zorunlu bölüm eksiksiz dolduruldu.

---

## Faz 9: Mühürleme
- **İşlem:** `mv src/027.dev.html src/027.html`
- **Doğrulama:** `./verify.sh src/027.html reports/027` -> `OK` (Exit Code 0).
- **Mühürleme Durumu:** `src/027.html` mühürlendi; `src/` dizininde hiçbir `.dev.html` kalmadı.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 027 başarıyla tamamlandı.

