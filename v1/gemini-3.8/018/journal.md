# Deney 018 Günlüğü: Canvas Path2D ve Fourier Epicycles ile Harmonik Tipografi

Bu günlük, Deney 018 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 02:25] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Laboratuvar şimdiye kadar DOM semantiği, CSS yerleşim/renk/animasyon/3D/grid, SVG vektör/filtre, Canvas raster/parçacık, WebGL shader, Web Audio API, Web Cryptography ve Web Workers API alanlarını başarıyla tamamladı.
- Deney 018'de hedef: Saf matematiksel harmonik analiz (Ayrık Fourier Dönüşümü - DFT) ile tarayıcının yerleşik **Canvas 2D Path2D API** (`new Path2D()`, `ctx.stroke(path)`) standardını bir araya getirmek.
- Temel amaç: Sıfır harici matematik veya grafik kütüphanesi olmaksızın, "HELLO WORLD" kontur koordinatlarını karmaşık sayılar uzayında Fourier frekans bileşenlerine ayrıştırmak; uç uca eklenmiş dönen çemberler zinciri (Fourier Epicycles) ile harfleri gerçek zamanlı bir mekanik çizici kol makinesi gibi ekrana çizmek.

### Tasarım Alternatifleri
1. **Alternatif A — Basit Sinüs Dalgası Çizimi:** Ekranda tek bir sinüs dalgası çizmek. (Fazla basit ve tipografik Hello World odağı sağlamaz).
2. **Alternatif B — Harmonik Fourier Epicycles Zinciri ve Path2D Vektörel İz (Seçildi):**
   - "HELLO WORLD" kelimesinin vektörel kontur koordinatları bir dizi $N$ adet nokta $(x_n, y_n)$ olarak örneklenir.
   - Saf JavaScript ile Ayrık Fourier Dönüşümü (DFT) formülü çalıştırılır:
     $$X_k = \sum_{n=0}^{N-1} x_n \cdot e^{-i \cdot 2\pi \cdot k \cdot n / N}$$
   - Her harmonik frekans için genlik (çember yarıçapı $R_k$), faz açısı ($\phi_k$) ve açısal hız ($\omega_k = k$) hesaplanır.
   - Çemberler genliklerine göre büyükten küçüğe sıralanır ve her çemberin merkezi bir öncekinin uç noktasına bağlanır.
   - Zaman $t$ aktıkça son çemberin ucundaki lazer çizici iğne, bir `Path2D` nesnesi üzerine "HELLO WORLD" yolunu parıldayan fosforlu bir kontur olarak çizer.
   - Arayüz Kontrolleri:
     - Harmonik Sayısı Kaydırıcısı: $N=4$ (soyut eliptik dalga) ile $N=100$ (kusursuz keskinlikte "HELLO WORLD") arasında gerçek zamanlı değişim.
     - Epicycle Çemberlerini ve Vektör Kollarını Aç/Kapa.
     - Çizim Hızı ve İz Kalıcılığı (Trail Persistence) ayarı.
     - "Durdur / Oynat / Başa Sar" oynatıcı kontrolleri.
3. **Alternatif C — SVG SMIL `<animate>` Path Interpolation:** SVG SMIL tarayıcılar arasında bazı kısıtlamalara ve tutarsızlıklara sahiptir; Canvas Path2D ve saf DFT matematiği ise evrensel, deterministik ve son derece performanslıdır.

### Karar ve Mimari Tercih
- Alternatif B seçildi. "Hello World" ifadesini salt bir metin değil, matematiksel frekansların harmonik birleşimi olarak modelleyerek laboratuvara eşsiz bir analitik ve görsel derinlik kazandırır.


---

## [2026-09-29 02:33] — Uygulama, Doğrulama ve Yayımlama

### Geliştirilen Bileşenler
- `src/018.dev.html` dosyası sıfır harici kütüphane ve tam W3C HTML5 Canvas Path2D API uyumluluğu ile kodlandı:
  1. **SVG Path Parametrizasyonu:** "HELLO WORLD" konturu kesintisiz monoline geometri ile parametrize edildi ($N = 360$ nokta).
  2. **W3C `Path2D(SVG_PATH_DATA)`:** SVG yol dizesi doğrudan tarayıcının yerleşik `Path2D` motoruna aktarılarak kılavuz hedef kontur olarak derlendi.
  3. **Ayrık Fourier Dönüşümü (DFT):** Reel ve imajiner integrasyonla genlik ($R_k$), faz ($\phi_k$) ve açısal frekans ($\omega_k$) hesaplandı.
  4. **Epicycle Zinciri ve Lazer İzi:** `new Path2D()` nesneleri üzerinde çemberler, vektör kolları ve lazer kalemi parıltılı izi çizildi.
  5. **Canlı Frekans Spektrum Analizörü:** İkincil mini-kanvas üzerinde harmonik genlik çubukları ve kesim eşiği görselleştirildi.
  6. **Etkileşim:** 4 farklı tema (Fosfor, Siber, Plazma, Moröte), hız/harmonik kaydırıcıları ve klavye kısayolları (Boşluk/R) entegre edildi.

### Doğrulama ve Test Sonuçları
- `validate.sh src/018.dev.html`: **PASS** (HTML5 iskeleti, DOM yapısı, CSS ve V8 JS sözdizimi doğrulandı).
- `dependency-check.sh src/018.dev.html`: **PASS** (0 harici kaynak, sıfır ağ çağrısı, 100% bağımsız tek dosya).
- `browser-test.sh http://localhost:7373/018.dev.html`:
  - `[SYNTAX]`: PASS
  - `[DEPENDENCY]`: PASS
  - `[DOM_VISIBILITY]`: PASS (`<h1> "Hello World — Harmonik Fourier Epicycles"`, 1180x53px)
  - `[GRAPHICS_RENDER]`: PASS (2 adet aktif Canvas yüzeyi, 780x371px piksel çizimi)
  - `[RUNTIME]`: PASS (0 istisna)
  - `[NETWORK]`: PASS (0 harici istek)
  - `[PERMISSIONS]`: PASS (0 izin talebi)
  - `[NEW_TECHNOLOGY_ACTIVE]`: PASS
- `screenshot.sh http://localhost:7373/018.dev.html reports/018`: **PASS** (1280x800 piksel ekran görüntüsü başarıyla alındı).
- Görsel İnceleme: Epicycle çemberleri, vektör kolları, lazer kalemi parıltısı ve telemetri paneli kusursuz şekilde doğrulandı.

### Terfi ve Değişmezlik
- `src/018.dev.html` dosyası `src/018.html` olarak terfi ettirildi.
- `src/018.html` üzerinde tüm doğrulama adımları tekrar çalıştırılarak 8/8 PASS ile teyit edildi.
- Deney 018 kalıcı ve dokunulmaz (immutable) olarak kilitlendi.

- PROMPT.md Bölüm 7 gereği (çalışma dosyasının nihai dosyaya yeniden adlandırılması / temizliği), kopya olarak kalan `src/018.dev.html` dosyası kaldırılarak `src/` dizininde yalnızca nihai `src/018.html` bırakıldı.
- `src/018.html` üzerindeki tüm doğrulama adımları (validate, dependency-check, browser-test) tekrar çalıştırılarak doğrulandı.
