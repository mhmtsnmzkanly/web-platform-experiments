# Deney 012 Günlüğü: WebGL Shader ve 3D Hacimsel Tipografi

Bu günlük, Deney 012 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:39] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 006'da CPU tabanlı Canvas 2D raster çizim döngüsü kullanılmıştı.
- Deney 012'de, tarayıcının doğrudan GPU donanımına (ekran kartı) bağlanan nihai grafik standardı **WebGL** (`webgl2` / `webgl`) hedeflenmiştir.
- Temel amaç: Sıfır harici kütüphane (Three.js, Babylon vb. olmadan) saf WebGL API ve GLSL gölgelendirici dili (OpenGL Shading Language) ile bir tam ekran GPU render hattı kurmak; "Hello World" ifadesini GPU fragment shader seviyesinde kromatik sapma, hacimsel ışıma ve dinamik ışık alanıyla 60+ FPS hızında işlemek.

### Tasarım Alternatifleri
1. **Alternatif A — Basit 3D Dönen Küp Üzerinde Metin:** Temel WebGL küpü üzerine doku giydirme. (Küp döndüğünde Hello World arkada kalıp görünmez olabilir; odak ilkesine tam uymaz).
2. **Alternatif B — GLSL Fragment Shader ve Hacimsel Kromatik Işıma (Seçildi):** Tüm ekranı kaplayan iki üçgen (full-screen quad) üzerinde çalışan özel bir GLSL Fragment Shader geliştirilir. "Hello World" metni yüksek çözünürlüklü bir doku (`gl.texImage2D`) olarak GPU'ya yüklenir. Shader içinde her piksel için RGB kanalları farklı koordinat sapmalarıyla okunur (chromatic aberration), ışık kaynağı imleç konumuna (`u_mouse`) göre hareket eder ve zamanla (`u_time`) harflerin etrafında holografik enerji dalgası oluşur.
3. **Alternatif C — Ham 3D Poligon Vertex Harfleri:** Her harfin köşelerini binlerce 3D vertex olarak elle tanımlamak. (Gereksiz kod şişkinliği yaratır ve okunabilirliği düşürebilir).

### Karar ve Mimari Tercih
- Alternatif B seçildi. "Hello World" odağını ekranın merkezinde büyüleyici, donanım hızlandırmalı modern bir GPU shader görseline dönüştürür; WebGL'in doku filtreleme, uniform yönetimi ve fragment shader matematik yeteneklerini eksiksiz sergiler.

## [2026-09-29 01:42] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 doküman yapısı, meta etiketleri, inline CSS ve inline JS sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici ağ isteği, sıfır harici CDN/font/script; meşru tek dosya yapısı doğrulandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<canvas role="img" aria-label="Hello World WebGL 3D GPU Shader">` elemanı (1280x713px) görünür.
  - Grafik Yüzeyi Çizim Doğrulaması: Canvas yüzeyinde anlamlı piksel çizimi doğrulandı.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi.
  - Yeni Teknoloji Denetimi: `WebGLRenderingContext` / `WebGL2RenderingContext` etkinliği ve GPU çizim döngüsü başarıyla doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/012/screenshot.png` oluşturuldu. Siyah arka plan üzerinde merkezlenmiş, RGB kromatik sapmalı ve hacimsel neon ışıltılı "Hello World" ifadesi ile interaktif kontrol arayüzü kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/012.dev.html` başarıyla test edilip doğrulandıktan sonra `src/012.html` olarak kesinleştirildi.
- Deney 012 başarıyla tamamlandı.
