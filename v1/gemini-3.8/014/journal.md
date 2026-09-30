# Deney 014 Günlüğü: Web Audio API ve Akustik Dalga Tipografisi

Bu günlük, Deney 014 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:51] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Önceki 13 deney boyunca (001'den 013'e) laboratuvar DOM semantiği, CSS yerleşim/renk/animasyon, SVG vektör/filtre, Canvas 2D raster piksel, WebGL GPU shader ve CSS 3D uzamsal derinlik alanlarını araştırdı.
- Deney 014'te hedef: Tarayıcının sayısal ses ve akustik sinyal işleme motoru olan **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`, `AnalyserNode`) standardını devreye almak.
- Temel amaç: Sıfır harici ses dosyası (.mp3, .wav), sıfır harici kütüphane (Tone.js, Howler.js vb.) olmaksızın, tamamen saf matematiksel dalga formları (sinüs, üçgen, testere dişi, kare) ve ADSR zarf jeneratörleri ile "Hello World" ifadesini polifonik bir enstrümana dönüştürmek; her harfin akustik tınısını gerçek zamanlı osiloskop ve spektrum analizörü üzerinde görselleştirmek.

### Tasarım Alternatifleri
1. **Alternatif A — Sayfa Açılışında Tek Bir Zil Sesi:** Sayfa açılır açılmaz bir zil sesi çalmak. (Modern tarayıcıların otomatik oynatma / autoplay kısıtlamalarına takılır ve etkileşim derinliği zayıftır).
2. **Alternatif B — Etkileşimli Harmonik Synthesizer ve Canlı Neon Osiloskop (Seçildi):**
   - "HELLO WORLD" harflerinin her biri bağımsız birer müzikal tuş/ped olarak tasarlanır.
   - Her harfe pentatonik/diyatonik uyumlu bir perde atanır:
     - H: C4 (261.63 Hz)
     - E: D4 (293.66 Hz)
     - L: E4 (329.63 Hz)
     - L: G4 (392.00 Hz)
     - O: A4 (440.00 Hz)
     - [Boşluk]: Dinamik Akor / Sus
     - W: C5 (523.25 Hz)
     - O: D5 (587.33 Hz)
     - R: E5 (659.25 Hz)
     - L: G5 (783.99 Hz)
     - D: A5 (880.00 Hz)
   - Tıklama, dokunma veya klavye tuşlaması ile polifonik osilatörler, ADSR amplifikatör zarfı ve rezonant alçak geçiren filtre devreye girer.
   - `AnalyserNode` zaman alanı verisi (`Uint8Array`) alınarak merkezdeki "Hello World" arkasında canlı, analog katot tüplü yeşil/camgöbeği neon osiloskop dalga formu çizilir.
   - Otomatik Arpejatör ("Dizi Çal") butonu: Kullanıcı tıkladığında "Hello World" melodisini ritmik olarak çalar ve çalan harfi senkronize olarak ışıklandırır.
3. **Alternatif C — Rastgele Gürültü Sentezleyici:** Beyaz/pembe gürültü filtreleme. (Müzikal uyum olmadığı için estetik değeri düşüktür).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Sıfır izin ilkesine tam uyumlu olarak (AudioContext kullanıcı jestiyle veya arayüz butonuyla başlatılır/devam ettirilir), "Hello World" ifadesini hem işitsel hem görsel olarak etkileyici bir polifonik ses heykeline dönüştürür.

## [2026-09-29 01:53] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 doküman iskeleti, meta etiketleri, inline CSS ve V8 motoru ile JavaScript sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici ağ bağımlılığı, sıfır harici ses dosyası (.mp3/.wav); meşru tek dosya yapısı doğrulandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<canvas>` ve `<button class="synth-key">` elemanları başarıyla doğrulandı.
  - Grafik Yüzeyi Çizimi: 1176x310px canvas yüzeyinde analog osiloskop yeşil/mavi dalga formu piksel çizimi doğrulandı.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi (Web Audio AudioContext kullanıcı jesti kuralına tam uyumlu).
  - Yeni Teknoloji Denetimi: `AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`, `AnalyserNode` API desteği doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/014/screenshot.png` oluşturuldu ve incelendi. Mat şasi üzerinde CRT analog osiloskop ekranı, yeşil neon fosfor izi, "H E L L O . W O R L D" akustik klavyesi ve modüler kontrol paneli kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/014.dev.html` tüm testleri başarıyla tamamladıktan sonra `src/014.html` olarak kalıcılaştırıldı.
- Deney 014 başarıyla tamamlandı.
