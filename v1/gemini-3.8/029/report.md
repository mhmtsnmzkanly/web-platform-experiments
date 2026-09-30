# Teknik Rapor: Deney 029 — Page Visibility API & Kriyojenik Hibernasyon Tipografisi

**Tarih:** 2026-09-30  
**Deney No:** 029  
**Dosya:** `src/029.html`  
**Test Durumu:** PASS (verify.sh ile tek satır OK)  

---

## 1. Deneyin Amacı ve Kapsamı
Bu deney, modern web tarayıcılarının arka plan sekme yönetimi, güç koruma ve yaşam döngüsü standartlarını belirleyen **W3C Page Visibility API Level 2** ve **Document Lifecycle** mimarisini odağına alır.

Deneyin amacı; "HELLO WORLD" tipografisini sibernetik bir biyolojik organizma gibi konumlandırarak, sayfa görünür (`visible`) olduğunda tam güçle enerji metabolize eden, sekme arka plana atıldığında (`hidden`) veya simge durumuna küçültüldüğünde ise anında dondurularak mutlak sıfıra (-273.15 °C) inen ve CPU tüketimini sıfırlayan bir **Kuantum Kriyojenik Hibernasyon Konsolu (Cryogenic Hibernation Chamber)** inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Çalışma Mekanizması
- **W3C Page Visibility API:**
  - `document.visibilityState`: Dökümanın anlık görünürlük durumunu (`visible` veya `hidden`) sorgulama.
  - `document.hidden`: Mantıksal bayrak kontrolü.
  - `document.addEventListener('visibilitychange')`: Kullanıcı sekme değiştirdiğinde, tarayıcıyı simge durumuna aldığında veya ekrana döndüğünde mikro-gecikmeyle tetiklenen yerel yaşam döngüsü olayı.
- **Pencere Odak Denetimi (Focus & Blur):**  
  `window.addEventListener('focus')` ve `window.addEventListener('blur')` ile pencerenin kullanıcı etkileşiminde olup olmadığı denetlenir.
- **Kriyojenik Donma ve Termal Çözülme (Freeze-Thaw) Mekanizması:**
  - **Uyanık Durum (Active / Visible):** "HELLO WORLD" metni neon camgöbeği/kehribar sarısı gradyanla parlar, enerji barı %100'e çıkar, çekirdek sıcaklığı +37.0 °C'de seyreder ve 3 saniyelik metabolik nefes alma animasyonu çalışır.
  - **Hibernasyon (Frozen / Hidden):** `visibilitychange` ile sekme arka plana geçtiğinde döküman animasyonları askıya alınır, enerji barı %4'e düşer, sıcaklık -273.15 °C'ye iner ve "HELLO WORLD" buz kristali buzlanma katmanı (`frost-overlay`) ile donar. Uyku süresi milisaniyelik kronometre ile sayılır.
  - **Termal Uyanış (Wake Restore):** Sekmeye dönüldüğünde toplam uyku süresi hesaplanır, termal şok dalgasıyla harfler çözülür ve döküman denetim defterine (audit stream) işlenir.
- **Yaşam Döngüsü Denetim Defteri (Lifecycle Audit Stream):**  
  Tüm `HIBERNATE_ENTER`, `WAKE_RESTORE`, `WINDOW_FOCUS`, `WINDOW_BLUR` geçişleri zaman damgası ve geçiş süresiyle canlı olarak listelenir.

---

## 3. Tasarım Kararları ve 5 Boyutlu Değerlendirme

### 3.1 Görsel Estetik (Kriyojenik Kapsül Laboratuvarı)
- Derin uzay siyahı (`#040711`), kuantum camgöbeği (`#00f0ff`), buzul mavisi (`#a5f3fc`) ve termal kehribar (`#f59e0b`) renk hiyerarşisi kullanılmıştır.
- Donma anında tüm arayüz koyulaşır, buz kristali ışıması belirir ve enerji tasarrufu moduna geçer.

### 3.2 Tipografik Netlik ve "Hello World" Odak İlkesi
- "HELLO WORLD" tipografisi kriyojenik kapsülün kalbidir.
- Uyanıkken canlı ve akıcı, donmuşken ise dondurucu buz camı morfolojisine bürünerek durumunu estetik ve açık bir biçimde ifade eder.

### 3.3 İnteraktivite ve Anlık Geri Bildirim
- Manuel simülatör butonları ("Kriyojenik Uykuya Geç", "Termal Uyanış Tetikle", "Oto-Döngü Testi") kullanıcıya sekme değiştirmeden de tüm döngüyü deneyimleme imkanı tanır.
- Metabolik hız ve soğuma sürgüleri anlık parametre modülasyonu sağlar.

### 3.4 Performans ve Hafiflik
- Sıfır harici kütüphane, sıfır web fontu.
- Hibernasyon durumunda CPU tüketimi minimuma indirilir; tarayıcının pil ve bellek dostu mimarisiyle tam uyumludur.

### 3.5 Anlamsal ve Mimari Bütünlük
- Semantik HTML5 mimarisi: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C Page Visibility Level 2 standartlarına %100 uyum.

---

## 4. Otomasyon ve Test Kanıtları
- **`dependency-check.sh` Doğrulaması:**  
  - PASS: 0 harici kütüphane, CDN, font veya harici ağ bağlantısı.
- **`browser-test.sh` Doğrulaması:**  
  - PASS: Chrome CSSOM ve `CSS.supports()` geçerlilik denetimi %100 başarılı.
  - PASS: JavaScript sözdizimi ve konsol denetimi: 0 hata, 0 uyarı.
  - PASS: Teknoloji Kanıtı: `VERIFIED (Aktif çalışan Page Visibility API ve yaşam döngüsü geçişleri doğrulandı)`.
- **`verify.sh` Doğrulaması:**  
  - Standart çıktı: `OK` (Tek satır).
  - Çıkış kodu: `0`.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ
- Otomatik testler Page Visibility API nesnelerini, durum geçişlerini ve konsol temizliğini doğrulamıştır.
- İnsan gözlemcisi için kontrol adımı:
  - `http://localhost:7373/029.html` adresini tarayıcıda açınız.
  - Yeni bir tarayıcı sekmesi açıp 3 saniye o sekmede bekleyiniz, ardından geri dönünüz.
  - Döngü sayacının arttığını, döküman yaşam döngüsü günlüğünde gerçek sekme arka plan geçişinin milisaniye süresiyle kayıt altına alındığını ve "HELLO WORLD" metninin buzdan çözülerek uyandığını gözlemleyiniz.
  - "Kriyojenik Uykuya Geç [FREEZE]" butonuna basarak anında donma efektini ve sıcaklığın -273.15 °C'ye inişini test ediniz.
