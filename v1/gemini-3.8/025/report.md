# Teknik Rapor: Deney 025 — PerformanceObserver API & Yüksek Çözünürlüklü Tipografik Profilleme Kokpiti

**Tarih:** 2026-09-30  
**Deney No:** 025 (25. Deney Kilometre Taşı)  
**Dosya:** `src/025.html`  
**Test Durumu:** PASS (verify.sh ile tek satır OK)  

---

## 1. Deneyin Amacı ve Kapsamı
Bu deney, modern web platformunun W3C Performance Timeline Level 2 ve User Timing Level 3 standartlarını temsil eden **PerformanceObserver API**'sini odağına alır.

Deneyin amacı; "HELLO WORLD" tipografisinin tarayıcı içerisindeki ilk boyama (First Paint), ilk içerikli boyama (FCP), DOM reflow ve yeniden düzenleme maliyetleri, glif morfolojisi ve mikrosaniye seviyesindeki animasyon render bütçelerini gerçek zamanlı olarak dinleyen, ayrıştıran ve canlı bir şelale (waterfall) çizelgesinde görselleştiren siber-fütüristik bir **Kuantum Profilleme Kokpiti** inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Çalışma Mekanizması
- **PerformanceObserver Arayüzü:**  
  `new PerformanceObserver((entryList, observer) => { ... })` kurucusu ile asenkron olay dinleme döngüsü oluşturulmuştur.
- **5 Eşzamanlı Giriş Türü (Entry Types):**
  1. `paint`: `first-paint` ve `first-contentful-paint` sürelerini tarayıcı motorundan otomatik yakalama (`buffered: true`).
  2. `mark`: `performance.mark()` ile kullanıcı ve sistem tipografik olaylarının başlangıç/bitiş anlarını mikrosaniye (`performance.now()`) hassasiyetiyle işaretleme.
  3. `measure`: `performance.measure(name, startMark, endMark)` ile iki işaret arasındaki kesin mikro-gecikmeyi hesaplayıp User Timing veri akışına enjekte etme.
  4. `layout-shift`: Layout Instability API üzerinden tipografik harf boyutu ve aralık değişimlerinin kümülatif düzen kayması (CLS) skorunu ve `hadRecentInput` durumunu kaydetme.
  5. `longtask`: Ana iş parçacığında 50 milisaniyeyi aşan yoğun hesaplamaları tespit edip kırmızı alarm şeridi olarak işaretleme.
- **Canlı Şelale Çizelgesi (Waterfall Canvas):**  
  HTML5 Canvas 2D motoru üzerinde her bir gözlemlenen olayın süresi ve başlangıç anı dinamik olarak yatay çubuklar halinde çizilir. 16.67ms (60 FPS) kritik kare bütçesi eşik çizgisi ile render maliyetleri gerçek zamanlı kıyaslanır.
- **İnteraktif Profilleme Tetikleyicileri:**  
  Kullanıcı veya otomatik test motoru `Tipografik Morfoloji`, `Dinamik Reflow Testi`, `Yoğun Döngü Stres Testi` ve `Spektral Parçacık Nabzı` butonlarıyla tipografi üzerinde gerçek zamanlı CSS/DOM mutasyonları tetikleyebilir.

---

## 3. Tasarım Kararları ve 5 Boyutlu Değerlendirme

### 3.1 Görsel Estetik (Siber Kuantum Kokpiti)
- Derin uzay mavisi (`#060911`) ve koyu cam panel arka planı üzerinde neon camgöbeği (`#00f0ff`), mor (`#8a2be2`) ve nane yeşili (`#00ff88`) aksan renkler kullanılmıştır.
- 32px'lik telemetri ızgarası ve radyal ışık alanı ile yüksek teknolojiye sahip bir havacılık/kuantum profilleme konsolu atmosferi oluşturulmuştur.

### 3.2 Tipografik Netlik ve "Hello World" Odak İlkesi
- "HELLO WORLD" metni sahnenin tartışılamaz görsel merkezidir.
- Her harf bağımsız bir `.glyph` span etiketine sarılmış, CSS lineer gradyan ve dinamik `drop-shadow` ışıması ile vurgulanmıştır.
- Harflere fareyle gelindiğinde (`:hover`) veya tıklandığında bireysel `performance.mark` üretilir ve glif mikrometre seviyesinde zıplar.

### 3.3 İnteraktivite ve Anlık Geri Bildirim
- Üst gösterge paneli (FP, FCP, CLS, Measure Adedi, Frame Render Bütçesi) her `PerformanceObserver` geri çağrısında anında güncellenir.
- Canlı Olay Akışı (Entry Stream) terminali son 25 gözlemi renklendirilmiş rozetlerle (`paint`, `measure`, `mark`, `layout-shift`) listeler.

### 3.4 Performans ve Hafiflik
- Sıfır harici kütüphane, sıfır web fontu, sıfır CDN.
- `PerformanceObserver` tamamen tarayıcının yerel C++ çekirdeğinde asenkron olarak çalıştığı için ana iş parçacığına ekstra yük getirmez.

### 3.5 Anlamsal ve Mimari Bütünlük
- Semantik HTML5 mimarisi: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- ARIA etiketleri ile erişilebilir yapı (`aria-label`, role ve live telemetri anonsları).

---

## 4. Otomasyon ve Test Kanıtları
- **`dependency-check.sh` Doğrulaması:**  
  - PASS: 0 harici kütüphane, 0 CDN, 0 uzaktan font, 0 harici ağ çağrısı.
- **`browser-test.sh` Doğrulaması:**  
  - PASS: Chrome CSSOM ve `CSS.supports()` geçerlilik denetimi %100 başarılı.
  - PASS: JavaScript konsol denetimi: 0 hata, 0 uyarı.
  - PASS: Teknoloji Kanıtı: `VERIFIED (PerformanceObserver desteklenen 5 giriş tipi aktif dinlendi, buffered paint ve user timing measure olayları başarıyla üretildi)`.
- **`verify.sh` Doğrulaması:**  
  - Standart çıktı: `OK` (Tek satır).
  - Çıkış kodu: `0`.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ
- Otomatik testler API'nin varlığını, sentaksını, konsol temizliğini ve görsel üretimini kanıtlamıştır.
- İnsan gözlemcisi için kontrol adımı:
  - Tarayıcıda `http://localhost:7373/025.html` sayfasını açınız.
  - "Tipografik Morfoloji" butonuna basınız: "HELLO WORLD" harflerinin genişleyip daraldığını ve şelale paneline yeşil renkte `hw-measure:glyph-morph` çubuğunun eklendiğini doğrulayınız.
  - "Yoğun Döngü Stres Testi" butonuna basınız: Kırmızı renkli `LONG_TASK_STALL` şeridinin belirdiğini ve üst paneldeki kümülatif ölçüm sayacının arttığını teyit ediniz.
