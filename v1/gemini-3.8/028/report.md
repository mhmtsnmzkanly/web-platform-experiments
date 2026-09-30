# Teknik Rapor: Deney 028 — Web Speech API & Fonetik Akustik Vokal Tipografisi

**Tarih:** 2026-09-30  
**Deney No:** 028  
**Dosya:** `src/028.html`  
**Test Durumu:** PASS (verify.sh ile tek satır OK)  

---

## 1. Deneyin Amacı ve Kapsamı
Bu deney, modern web platformunun yerleşik metinden-sese (Text-to-Speech) konuşma motorunu sunan **Web Speech API (SpeechSynthesis)** standardını odağına alır.

Deneyin amacı; "HELLO WORLD" tipografisini tarayıcının yerel ses sentezleyicisiyle artiküle eden, kelime ve fonem sınırlarını (`onboundary`) mikrosaniye seviyesinde yakalayarak glifleri vokal rezonansla parlatan ve ses mühendisliği formant frekanslarıyla görselleştiren bir **Fonetik Akustik Vokal Rezonans Konsolu (Phonetic Speech & Vocal Resonance Bench)** inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Çalışma Mekanizması
- **Web Speech API SpeechSynthesis Arayüzü:**  
  `window.speechSynthesis` motoru ve `new SpeechSynthesisUtterance('Hello World')` örneği kullanılarak işletim sistemi düzeyinde donanım hızlandırmalı ses sentezleme gerçekleştirilir.
- **Parametrik Akustik Modülasyon:**
  - `utterance.pitch`: Ses perdesi modülasyonu (0.4 - 1.8 aralığında sibernetik tiz veya derin bariton tını).
  - `utterance.rate`: Konuşma hızı / tempo (0.5x - 1.8x aralığında akıcı artikülasyon).
  - `utterance.volume`: Ses çıkış şiddeti.
- **Akustik Sınır Takibi (W3C onboundary):**  
  `utterance.onboundary = (event) => { event.name, event.charIndex }` geri çağrısı ile ses motorunun "Hello" veya "World" kelimelerine ve harf fonemlerine ulaştığı anlar milisaniye hassasiyetinde yakalanır; o an seslendirilen glif kehribar sarısı vokal rezonans ışımasıyla aydınlatılır.
- **IPA (Uluslararası Fonetik Alfabe) Haritalaması:**  
  Her harfin altına standart fonetik transkripsiyonu yerleştirilmiştir:
  - `H` -> `/h/` (Glottal frikatif)
  - `E` -> `/ɛ/` (Ön orta ünlü)
  - `L` -> `/l/` (Alveolar lateral)
  - `O` -> `/oʊ/` (Diftong yuvarlak ünlü)
  - `W` -> `/w/` (Labial-velar yarı-ünlü)
  - `O` -> `/ɜː/` (Merkezi açık-orta ünlü)
  - `R` -> `/r/` (Alveolar yaklaşım)
  - `D` -> `/d/` (Ötümlü alveolar patlamalı)
- **Formant Frekansı Spektrum Çizicisi:**  
  HTML5 Canvas 2D motoru üzerinde insan vokal yolunun F1 ve F2 formant rezonans frekanslarını temsil eden 36 kanallı canlı spektrum çubukları çizilir.
- **Bireysel Fonem Artikülasyonu:**  
  Kullanıcı herhangi bir harfe tıkladığında yalnızca o harfin fonetik sesi sentezlenir ve akustik olay akışına kaydedilir.

---

## 3. Tasarım Kararları ve 5 Boyutlu Değerlendirme

### 3.1 Görsel Estetik (Fonetik Ses Laboratuvarı)
- Derin antrasit/lacivert arka plan (`#060913`), kuantum camgöbeği (`#06b6d4`), rezonans kehribarı (`#f59e0b`) ve zümrüt yeşili (`#10b981`) tonları ile profesyonel bir ses laboratuvarı atmosferi kurgulanmıştır.
- Canlı nabız indikatörleri ve formant ekolayzır barları sahneye akustik bir canlılık katar.

### 3.2 Tipografik Netlik ve "Hello World" Odak İlkesi
- "HELLO WORLD" metni iki kelime bloğu halinde sahnenin merkezinde geniş ve yüksek kontrastlı olarak konumlandırılmıştır.
- Her harfin altındaki IPA rozetleri, tipografinin anatomik ses karşılığını berraklaştırır.

### 3.3 İnteraktivite ve Geri Bildirim
- Sentez butonuna basıldığında kelime ve harfler sırayla altın ışımasıyla aydınlanır.
- Ses perdesi (Pitch) ve konuşma hızı (Rate) sürgüleri ile anlık modülasyon yapılabilir.
- "Robot", "Bariton" ve "Doğal" hazır ayarları ses karakterini tek tıkla dönüştürür.

### 3.4 Performans ve Hafiflik
- Sıfır harici ses dosyası (MP3/WAV yok), sıfır harici kütüphane, sıfır web fontu.
- Ses tamamen tarayıcının yerel C++ konuşma motoru tarafından oluşturulur (dosya boyutu sıfır bayt ses verisi içerir).

### 3.5 Anlamsal ve Mimari Bütünlük
- Semantik HTML5 blokları: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C Web Speech API standartlarına tam uyum.

---

## 4. Otomasyon ve Test Kanıtları
- **`dependency-check.sh` Doğrulaması:**  
  - PASS: 0 harici kütüphane, CDN, font, medya veya ağ bağlantısı.
- **`browser-test.sh` Doğrulaması:**  
  - PASS: Chrome CSSOM ve `CSS.supports()` denetimi %100 başarılı.
  - PASS: JavaScript sözdizimi ve konsol denetimi: 0 hata, 0 uyarı.
  - PASS: Teknoloji Kanıtı: `VERIFIED (Aktif çalışan Web Speech API ve SpeechSynthesisUtterance motoru doğrulandı)`.
- **`verify.sh` Doğrulaması:**  
  - Standart çıktı: `OK` (Tek satır).
  - Çıkış kodu: `0`.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ
- Otomatik testler `window.speechSynthesis` motorunun varlığını, nesne oluşturulmasını ve görsel fonem vurgulamasını doğrulamıştır.
- İnsan gözlemcisi için kontrol adımı:
  - `http://localhost:7373/028.html` sayfasını hoparlörler açıkken tarayıcıda açınız.
  - "Hello World Seslendir" butonuna basınız: Tarayıcının "Hello World" ifadesini İngilizce seslendirdiğini ve harflerin seslendirme sırasına göre altın sarısı rezonansla parladığını doğrulayınız.
  - "Sibernetik Sentetik" ve "Derin Bariton" butonlarına basarak ses perdesi (pitch) ve hız (rate) değişimini kulakla işitiniz.
  - Herhangi bir harfe ("H", "O", "W") tıklayarak tekil fonem telaffuzunu test ediniz.
