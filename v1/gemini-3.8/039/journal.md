# Çalışma Günlüğü: Deney 039

**Tarih:** 2026-09-30  
**Konu:** Canvas ImageData & Konvolüsyon Matrisi Çekirdeği (Sobel Kenar Algılama, Laplace & Görüntü İşleme Odası)  
**Durum:** TAMAMLANDI  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `038.html` (38 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 4. Onluk Döngünün 9. deneyi (039) başlatılıyor. 40. deney kilometre taşı öncesi son aşama.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** Canvas 2D ImageData ve Konvolüsyon Matrisi Çekirdeği (W3C HTML Canvas 2D Context Level 2).
- **Temel API ve Tarayıcı Yetenekleri:**
  - `ctx.getImageData(sx, sy, sw, sh)`: Piksel tamponunu doğrudan `ImageData` (`Uint8ClampedArray` $[R, G, B, A, \dots]$) olarak RAM'e aktarır.
  - `ctx.createImageData(width, height)`: Bellek içi ham piksel dizisi tahsis eder.
  - `ctx.putImageData(imagedata, dx, dy)`: İşlenmiş piksel dizisini doğrudan framebuffer'a geri yazar.
  - 3x3 Konvolüsyon Matrisi Çekirdeği:
    - Sobel Kenar Algılama (Sobel Edge Detector: $G_x, G_y \to G = \sqrt{G_x^2 + G_y^2}$).
    - Laplacian Yüksek Frekanslı Kontur Filtresi ($4$ ve $8$ komşuluklu).
    - Emboss (Kabartma / Vektörel Işık Gölgelendirmesi).
    - Sharpen (Keskinleştirme).
    - Gaussian Blur (Yumuşatma / Düşük Geçiren Filtre).
  - Bölünmüş Ekran Kumpası (Split-Screen Comparator):
    - Orijinal yüksek kontrastlı "HELLO WORLD" ile konvolüsyon filtresi çıktısını aynı anda yan yana karşılaştıran dinamik bölücü.
  - İnteraktif 3x3 Kernel Matris Editörü:
    - 9 hücreli form girdisi ile serbest sayısal katsayı girişi, bölen (divisor) ve ofset (bias) yönetimi.
- **Tasarım Yaklaşımı:**
  - Siber-Optik Görüntü İşleme Laboratuvarı (Digital Image Processing & Convolution Lab).
  - Merkezde 840x380 çözünürlüğünde yüksek performanslı Canvas işlem alanı.
  - "HELLO WORLD" metni neon gradyanlar ve dinamik lazer çizgileriyle çizilir; konvolüsyon motoru harflerin konturlarını ve iç gradyanlarını Sobel / Laplace algoritmalarıyla tarar.
  - Canlı Piksel Telemetrisi: 336.000 piksel tarama süresi ($ms$), kare hızı ($FPS$), kenar yoğunluk yüzdesi ve aktif filtre katsayıları.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Konvolüsyon Matrisi ve Sobel Kenar Algılama Odası (Convolution Matrix & Sobel Edge Lab)**  
   - 336.000 piksellik doğrudan `ImageData` manipülasyonu, 5 ön tanımlı kernel (Sobel, Laplace, Sharpen, Emboss, Gaussian Blur), 3x3 interaktif kernel matrisi editörü, split-screen karşılaştırma kumpası ve piksel başı mikro-saniyelik telemetri.
2. **Fikir 2: Morfolojik Piksel Erozyon ve Genleşme Motoru (Mathematical Morphology Dilation & Erosion)**  
   - İkili morfoloji filtreleri.
3. **Fikir 3: Optik Karakter Ayrıştırma ve Histogram Eşitleme (Histogram Equalizer & OCR Filter)**  
   - Piksel histogramı grafiği ve kontrast germe.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Konvolüsyon Matrisi ve Sobel Kenar Algılama Odası** seçildi.
- **Gerekçe:** W3C Canvas `ImageData` API'sinin en temel bilgisayarla görme (computer vision) algoritması olan 3x3 konvolüsyon matrisini, hem hazır filtreler (Sobel, Laplace, Emboss) hem de kullanıcının düzenleyebileceği serbest 9-hücreli matris formatında interaktif olarak sunar. "HELLO WORLD" hem kaynak piksel görselinin hem de kenar algılama çıktısının ana odak nesnesidir.

---

## Faz 5: `src/039.dev.html` Geliştirme
- 640x480 çözünürlükte çalışma tamponu, 307.200 piksellik (1.228.800 bayt) RGBA renk uzayı oluşturuldu.
- `getImageData` ve `putImageData` API'leri ile optimize edilmiş 3x3 konvolüsyon döngüsü yazıldı.
- Sobel ($G = \sqrt{G_x^2 + G_y^2}$), Laplace, Emboss, Sharpen, Gaussian Blur hazır ön ayarları entegre edildi.
- İnteraktif split-screen kumpası ve dinamik 9-hücreli matris editörü eklendi.
- `window.__E039_VERIFIED` çalışma zamanı kanıt bayrağı oluşturuldu.

---

## Faz 6: Otomatik Doğrulama
- `./verify.sh src/039.dev.html reports/039` çalıştırıldı.
- Sıfır konsol hatası, sıfır harici bağımlılık, geçerli CSSOM ve DOM yapısı doğrulandı.
- Doğrulama sonucu: `OK` (çıkış kodu 0).

---

## Faz 7: Görsel İnceleme
- `screenshot.png` (bölünmüş kumpas görünümü), `screenshot-emboss.png` (kabartma efekti), `screenshot-laplace.png` (kenar tespiti) ve `screenshot-split-full.png` (%100 filtrelenmiş alan) CDP aracılığıyla yakalandı.
- Görsel hiyerarşi, neon tipografi, kenar keskinliği ve telemetri paneli doğrulandı.

---

## Faz 8: Teknik Raporlama
- `reports/039/report.md` oluşturuldu; amaç, çalışma mekaniği, 5 boyutlu tasarım özeti, kanıtlar ve insan doğrulama maddeleri belgelendi.

---

## Faz 9: Mühürleme
- `src/039.dev.html` dosyası `src/039.html` olarak mühürlendi.
- `./verify.sh src/039.html reports/039` ile nihai doğrulama yapıldı ve `OK` sonucu alındı.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 039 başarıyla tamamlandı.

