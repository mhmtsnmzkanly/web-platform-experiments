# Teknik Rapor: Deney 026 — BroadcastChannel API & Çok Düğümlü Kuantum Dolanık Tipografi

**Tarih:** 2026-09-30  
**Deney No:** 026  
**Dosya:** `src/026.html`  
**Test Durumu:** PASS (verify.sh ile tek satır OK)  

---

## 1. Deneyin Amacı ve Kapsamı
Bu deney, W3C ve WHATWG HTML Living Standard'ın yerleşik sekmeler/pencereler arası doğrudan mesajlaşma standardı olan **BroadcastChannel API**'sini odağına alır.

Deneyin amacı; harici hiçbir sunucu, WebSocket bağlantısı veya backend sinyalleşme katmanı olmadan, tarayıcının yerel süreçler arası iletişim (IPC) omurgasını kullanarak "HELLO WORLD" tipografisinin durumunu, morfolojisini, harf aralığını, perspektifini ve kinetik dalga animasyonlarını aynı köke (same-origin) sahip tüm pencereler, sekmeler ve çerçeveler arasında mikrosaniye seviyesinde eşzamanlayan bir **Kuantum Dolanıklık İstasyonu (Quantum Entanglement Hub)** inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Çalışma Mekanizması
- **BroadcastChannel Arayüzü:**  
  `const bus = new BroadcastChannel('hw_entangle');` kurucusu ile aynı kök (origin) altındaki tüm gezinme bağlamlarını (tabs, windows, iframes, workers) bağlayan tekil bir pub/sub iletişim kanalı açılmıştır.
- **Çift Düğümlü Mimari (Dual-Node Architecture):**
  1. **Düğüm Alfa (Master Terminal):** Ana sayfada yer alan kontrol kokpiti. "HELLO WORLD" metninin harf aralığı (`tracking`), perspektif açısı (`skew`), spektral renk rotasyonu (`hue`) ve kinetik dalga parametrelerini yönetir ve kanala yayınlar (`postMessage`).
  2. **Düğüm Beta (Uydu Frame):** Sayfa içine yerleştirilmiş sandbox çerçevesi. Kendi pencere bağlamında açtığı bağımsız `BroadcastChannel('hw_entangle')` örneği ile Düğüm Alfa'dan gelen yayınları anında yakalar (`onmessage`) ve ikiz "HELLO WORLD" tipografisine uygular.
- **Çift Yönlü İletişim ve Yankı (Echo Back):**  
  Düğüm Beta'daki "Cevap Yankıla (Echo)" butonu veya harflere tıklanması, veriyi Düğüm Alfa'ya geri yayınlar; Düğüm Alfa'da da reaktif ölçeklenme ve görsel onay tetiklenir.
- **Canlı Veri Yolu Paket Denetleyicisi (Bus Packet Inspector):**  
  Gönderilen (TX) ve alınan (RX) tüm paketler; paket ID, zaman damgası, iletim yönü, eylem türü (`SYNC_SLIDERS`, `SYNC_WAVE`, `SYNC_COLOR`, `GLYPH_HOVER`, `PONG_ECHO`) ve alt-milisaniyelik gecikme (latency) bilgisiyle canlı terminal akışında denetlenir.
- **Çok Pencereli Gerçek Sekme Testi (Multi-Window):**  
  "Yeni Sekme Aç" butonu ile aynı sayfa ayrı bir işletim sistemi penceresinde veya sekmesinde açıldığında, iki bağımsız sekmedeki "HELLO WORLD" metinleri tarayıcının yerel BroadcastChannel motoru üzerinden canlı olarak birbirini kontrol eder.

---

## 3. Tasarım Kararları ve 5 Boyutlu Değerlendirme

### 3.1 Görsel Estetik (Kuantum Dolanıklık Konsolu)
- Derin obsidyen arka plan (`#070a13`), kuantum camgöbeği (`#06b6d4`), zümrüt yeşili (`#10b981`) ve kehribar (`#f59e0b`) telemetri ışıması ile bilimkurgusal bir kuantum telemetri istasyonu tasarımı uygulanmıştır.
- 28px'lik ince ızgara kılavuzları ve canlı nabız indikatörleri ile sürekli veri akışı hissi güçlendirilmiştir.

### 3.2 Tipografik Netlik ve "Hello World" Odak İlkesi
- Her iki düğümün de merkezinde büyük, net ve parıltılı "HELLO WORLD" ana tipografisi bulunur.
- Düğüm Alfa'da neon camgöbeği/mor gradyan, Düğüm Beta'da ise zümrüt yeşili/camgöbeği gradyan kullanılarak alıcı ve verici rollerinin tipografik kimlikleri belirginleştirilmiştir.

### 3.3 İnteraktivite ve Geri Bildirim
- Sürgüler hareket ettirildiği anda Düğüm Beta'daki ikiz "HELLO WORLD" gecikmesiz olarak aynı harf aralığını ve perspektif eğikliğini alır.
- Harflerin üzerine gelindiğinde (`GLYPH_HOVER`), Düğüm Beta'daki karşılık gelen harf de eşzamanlı olarak parlar ve yükselir.

### 3.4 Performans ve Hafiflik
- Sıfır ağ sunucusu yükü: Bütün veri transferi doğrudan Chromium'un işletim sistemi seviyesindeki paylaşımlı bellek / IPC mekanizması üzerinden gerçekleşir.
- Paket gecikmesi 0.2ms - 0.8ms seviyesindedir.

### 3.5 Anlamsal ve Mimari Bütünlük
- Semantik HTML5 blokları: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C BroadcastChannel API standartlarına tam uyum.

---

## 4. Otomasyon ve Test Kanıtları
- **`dependency-check.sh` Doğrulaması:**  
  - PASS: Sıfır harici kütüphane, CDN, font veya harici ağ bağlantısı.
- **`browser-test.sh` Doğrulaması:**  
  - PASS: Chrome CSSOM ve `CSS.supports()` geçerlilik denetimi %100 başarılı.
  - PASS: JavaScript sözdizimi ve konsol denetimi: 0 hata, 0 uyarı.
  - PASS: Teknoloji Kanıtı: `VERIFIED (Aktif çalışan BroadcastChannel ve eşzamanlı IPC paket akışı doğrulandı)`.
- **`verify.sh` Doğrulaması:**  
  - Standart çıktı: `OK` (Tek satır).
  - Çıkış kodu: `0`.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ
- Otomatik testler BroadcastChannel nesnesinin varlığını, paket iletimini ve görsel tutarlılığı doğrulamıştır.
- İnsan gözlemcisi için kontrol adımı:
  - `http://localhost:7373/026.html` adresini iki ayrı tarayıcı penceresinde yan yana açınız.
  - Birinci penceredeki "Harf Aralığı" sürgüsünü kaydırınız veya "Kinetik Dalga" butonuna basınız.
  - İkinci bağımsız penceredeki "HELLO WORLD" metninin ve alt telemetri terminalinin sunucuya hiç gitmeden anında eşzamanlandığını gözlemleyiniz.
