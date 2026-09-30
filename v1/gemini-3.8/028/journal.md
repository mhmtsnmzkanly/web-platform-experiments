# Çalışma Günlüğü: Deney 028

**Tarih:** 2026-09-30  
**Konu:** Web Speech API (SpeechSynthesis) & Fonetik Akustik Vokal Tipografisi  
**Durum:** GELİŞTİRME  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `027.html` (27 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- Sıradaki deney: 028.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** Web Speech API - SpeechSynthesis (W3C Community Group / WHATWG).
- **Temel API Yetenekleri:**
  - `const synth = window.speechSynthesis;`
  - `const utterance = new SpeechSynthesisUtterance('Hello World');`
  - `utterance.pitch`: Ses perdesi / frekansı (0.1 - 2.0).
  - `utterance.rate`: Konuşma hızı / tempo (0.1 - 2.0).
  - `utterance.volume`: Ses düzeyi (0.0 - 1.0).
  - `utterance.onboundary = (event) => { event.name, event.charIndex, event.charLength }`: Sentezleyicinin kelime veya hece sınırına ulaştığı anı yakalama.
  - `utterance.onstart`, `utterance.onend`.
- **Tasarım Yaklaşımı:**
  - Fonetik Akustik Vokal Laboratuvarı (Phonetic Speech & Vocal Resonance Bench).
  - "HELLO WORLD" metni merkezde yer alır; her harfin altında IPA (Uluslararası Fonetik Alfabe) transkripsiyonu bulunur (`/h/ /ɛ/ /l/ /oʊ/ /w/ /ɜː/ /l/ /d/`).
  - Sentezleyici "HELLO WORLD"ü seslendirdiğinde `onboundary` ve senkronize formant filtresi harfleri gerçek zamanlı olarak aydınlatır ve akustik rezonans dalgası yayar.
  - Formant Spektrumu (F1 & F2 frekans barları) ve Vokal Boğaz Osiloskopu görselleştirmesi.
  - Bireysel fonem seslendirmesi: Her harfe tıklandığında yalnızca o fonem sentezlenir.
  - Ses karakteri hazır ayarları: Sibernetik Robot, Derin Bariton, Hızlı Sentetik.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Fonetik Akustik Vokal Laboratuvarı (Phonetic Speech & Formant Console)**  
   - Koyu antrasit / kobalt mavi akustik laboratuvar teması. Merkezde büyük "HELLO WORLD", altında IPA sembolleri, üstte dinamik formant spektrum grafiği. Sentezleme esnasında heceler kelime sınırları (`onboundary`) ile parlar ve akustik dalga üretir.
2. **Fikir 2: Retro Konuşan Bilgisayar Arayüzü (1980s Speech Synthesizer SAM)**  
   - Eski yeşil fosforlu terminal hissi; fonetik kurallar tablosu ve pikselize konuşma dalgası.
3. **Fikir 3: Vokal Spektrogram & Artikülasyon Atlası (Articulatory Vocal Atlas)**  
   - Dil ve damak konumlarını gösteren tıbbi/fonetik şema ile harflerin seslendirilmesi.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Fonetik Akustik Vokal Laboratuvarı** seçildi.
- **Gerekçe:** Web Speech API'nin `SpeechSynthesisUtterance` özelliklerini (`pitch`, `rate`, `onboundary`, fonem haritalaması) modern bir ses mühendisliği ve formant rezonans konsolu şeklinde en etkili ve estetik biçimde görselleştiren tasarım budur.

---

## Faz 5: Geliştirme (`src/028.dev.html`)
- HTML5 semantik mimarisi: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<h1>`.
- W3C Web Speech API mimarisi:
  - `window.speechSynthesis` ve `SpeechSynthesisUtterance`.
  - `utterance.pitch`, `utterance.rate`, `utterance.volume`.
  - `utterance.onboundary` ile gerçek zamanlı kelime ve harf sınırlarının yakalanması.
  - IPA (Uluslararası Fonetik Alfabe) transkripsiyonu ile harf anatomisi eşlemesi (`/h/ /ɛ/ /l/ /oʊ/ /w/ /ɜː/ /l/ /d/`).
  - HTML5 Canvas 2D üzerinde 36 kanallı formant frekans ekolayzır barları.
  - Vokal karakter hazır ayarları: Sibernetik Sentetik (Robot), Derin Bariton, Doğal Artikülasyon.
  - Bireysel fonem seslendirmesi: Harflere tıklandığında bağımsız fonetik artikülasyon.

---

## Faz 6: Otomatik Doğrulama
- **Komut:** `./verify.sh src/028.dev.html reports/028`
- **Sonuç:** `OK` (Exit Code 0).
- **Ayrıntılar:**
  - `dependency-check.sh`: PASS (0 harici kütüphane, CDN, font, medya veya ağ bağlantısı).
  - Chrome CSSOM & `CSS.supports()`: PASS (Tüm CSS bildirimleri geçerli).
  - Konsol / Çalışma Zamanı: PASS (0 hata, 0 uyarı).
  - Teknoloji Kanıtı: `VERIFIED (Aktif çalışan Web Speech API ve SpeechSynthesisUtterance motoru doğrulandı)`.

---

## Faz 7: Görsel İnceleme ve Ekran Görüntüleri
- **Alınan Ekran Görüntüleri:**
  - `screenshot-active.png`: Seslendirme anında altın sarısı fonem vurgusu.
  - `screenshot-baritone.png`: Derin bariton hazır ayarı ve telemetri durumu.
  - `screenshot-robot.png`: Sibernetik tiz ses modu.
  - `screenshot.png`: Birincil sahne genel görünümü.
- **İnceleme Sonucu:** Akustik ses laboratuvarı atmosferi, canlı formant spektrumu ve fonetik "HELLO WORLD" kartları kusursuz çalışıyor.

---

## Faz 8: Teknik Raporlama
- **Oluşturulan Belge:** `reports/028/report.md`
- **Bölümler:** 5 zorunlu bölüm eksiksiz dolduruldu.

---

## Faz 9: Mühürleme
- **İşlem:** `mv src/028.dev.html src/028.html`
- **Doğrulama:** `./verify.sh src/028.html reports/028` -> `OK` (Exit Code 0).
- **Mühürleme Durumu:** `src/028.html` mühürlendi; `src/` dizininde hiçbir `.dev.html` kalmadı.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 028 başarıyla tamamlandı.

