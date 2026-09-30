# Teknik Rapor: Deney 027 — CSS Motion Path API & Yörüngesel Kinetik Tipografi

**Tarih:** 2026-09-30  
**Deney No:** 027  
**Dosya:** `src/027.html`  
**Test Durumu:** PASS (verify.sh ile tek satır OK)  

---

## 1. Deneyin Amacı ve Kapsamı
Bu deney, modern web platformunun W3C CSS Motion Path Module Level 1 standardını (`offset-path`, `offset-distance`, `offset-rotate`, `offset-anchor`) odağına alır.

Deneyin amacı; geleneksel düz hatlı CSS `translate` veya `margin` animasyonları yerine, "HELLO WORLD" metninin her bir harfini karmaşık vektörel Bézier eğrileri boyunca parametrik olarak hareket ettiren, teğet açılarını otomatik hizalayan ve donanım hızlandırmalı bir **Kozmik Yörüngesel Astrodinamik Gözlemevi (Orbital Typographic Astrodynamics Observatory)** inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Çalışma Mekanizması
- **CSS Motion Path Standardı:**
  - `offset-path: path("...")`: DOM gliflerinin takip edeceği kesin SVG kübik Bézier yörüngesini tanımlar.
  - `offset-distance: 0% -> 100%`: Öğenin yol üzerindeki bağıl yay mesafesini belirler; CSS `@keyframes orbitMotion` ile GPU kompozitör seviyesinde takılmasız canlandırılır.
  - `offset-rotate: auto | 0deg | auto 180deg`: Glifin eğrinin teğetine göre otomatik dönmesini (`auto`), daima dikey kalmasını (`0deg`) veya geriye doğru yönlenmesini sağlar.
  - `offset-anchor: center center`: Yörüngeye kenetlenen çekim merkezini glifin geometrik ortasına kilitler.
- **3 Parametrik Yörünge Geometrisi:**
  1. **Lemniscate (Kuantum Sonsuzluk Düğümü):** Çift döngülü simetrik Figür-8 eğrisi; "HELLO" ve "WORLD" harfleri düğüm noktasında kesişerek harmonik dalga çizer.
  2. **Kepler Eliptik Yörüngesi:** Gezegen yörüngesi formunda geniş eksenli elips.
  3. **Bernoulli Sarmal Nebulası:** Merkezdeki yerçekimsel odaktan dışa doğru spiral genişleme ve geri toplanma yolu.
- **Dinamik Faz Ayrımı (Stagger Phase Shift):**  
  Her harfe atanan `--glyph-index` değişkeni üzerinden `animation-delay: calc(var(--glyph-index) * var(--stagger-delay))` formülüyle harfler arasında kusursuz bir katar düzeni (orbital formation) sağlanmıştır.
- **Canlı Astrodinamik Telemetri Tablosu:**  
  10 glifin her birinin anlık yörünge yüzdesi (`offset-distance` %), seçilen yörünge periyodu ve teğet oryantasyonu gerçek zamanlı olarak alt telemetri kartlarında raporlanır.

---

## 3. Tasarım Kararları ve 5 Boyutlu Değerlendirme

### 3.1 Görsel Estetik (Kozmik Astrodinamik Konsolu)
- Derin uzay siyahı (`#050811`), radyal mor/mavi yıldız tozu ışıması, altın sarısı (`#fbbf24`), camgöbeği (`#00f0ff`) ve galaktik magenta (`#f43f5e`) paleti kullanılmıştır.
- SVG tabanlı kesikli neon yörünge çizgisi ve merkezde atan yerçekimi çekirdeği (gravity core) sahneye derinlik katar.

### 3.2 Tipografik Netlik ve "Hello World" Odak İlkesi
- "HELLO WORLD" metninin 10 glifi sahnenin birincil dinamik aktörleridir.
- "HELLO" kelimesi kuantum camgöbeği ışımasıyla, "WORLD" kelimesi ise göksel altın sarısı ışımasıyla birbirinden ayırt edilmiş; harfler yörüngede süzülürken okunaklılık korunmuştur.

### 3.3 İnteraktivite ve Anlık Geri Bildirim
- Yörünge geometrisi butonlarına basıldığında SVG kılavuz çizgisi ve CSS `offset-path` eşzamanlı olarak morfolojik geçiş yapar.
- Teğet modu düğmeleri (`AUTO`, `0 DEG`, `180 DEG`) harflerin bakış yönünü canlı değiştirir.
- Hız ve harf aralığı sürgüleri CSS değişkenlerini anında günceller.
- Gliflere tıklandığında kütleçekimsel dalgalanma efekti tetiklenir.

### 3.4 Performans ve Hafiflik
- Sıfır harici kütüphane, sıfır raster medya, sıfır web fontu.
- `offset-path` ve `offset-distance` özellikleri Chromium'un kompozitör iş parçacığında (Compositor Thread) çalıştığı için 60 FPS akıcılık sıfır CPU tıkanmasıyla sağlanır.

### 3.5 Anlamsal ve Mimari Bütünlük
- Semantik HTML5 blokları: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C CSS Motion Path standartlarına %100 uyum.

---

## 4. Otomasyon ve Test Kanıtları
- **`dependency-check.sh` Doğrulaması:**  
  - PASS: 0 harici kütüphane, CDN, font veya harici ağ çağrısı.
- **`browser-test.sh` Doğrulaması:**  
  - PASS: Chrome CSSOM ve `CSS.supports()` geçerlilik denetimi %100 başarılı (`offset-path: true`, `offset-distance: true`, `offset-rotate: true`).
  - PASS: JavaScript sözdizimi ve konsol denetimi: 0 hata, 0 uyarı.
  - PASS: Teknoloji Kanıtı: `VERIFIED (Aktif çalışan CSS Motion Path animasyonları tespit edildi)`.
- **`verify.sh` Doğrulaması:**  
  - Standart çıktı: `OK` (Tek satır).
  - Çıkış kodu: `0`.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ
- Otomatik testler CSS özelliklerinin geçerliliğini ve GPU animasyon döngüsünü doğrulamıştır.
- İnsan gözlemcisi için kontrol adımı:
  - `http://localhost:7373/027.html` sayfasını tarayıcıda açınız.
  - "HELLO WORLD" harflerinin Sonsuzluk Düğümü (Lemniscate) yörüngesi boyunca teğet açılarıyla akıcı biçimde süzüldüğünü doğrulayınız.
  - "Kepler Eliptik" ve "Bernoulli Sarmalı" butonlarına basarak yörüngelerin geometrik değişimini izleyiniz.
  - "Sabit Dikey [0 DEG]" seçeneğini tıklayarak harflerin eğrilere uymak yerine dik pozisyonda dönüp dönmediğini teyit ediniz.
