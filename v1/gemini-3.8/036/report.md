# Hello World Lab — Teknik Rapor: Deney 036

**Deney Başlığı:** OffscreenCanvas & createImageBitmap API (Asenkron Piksel Render Motoru ve Çok Katmanlı Çift Tamponlu Tipografik Sentezleyici)  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/036.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 036, modern web grafiklerinin en yüksek performanslı yerleşik mimarilerinden biri olan **OffscreenCanvas** ve **createImageBitmap** standartlarını inceler. Geleneksel DOM tabanlı `<canvas>` elemanları ana iş parçacığı (main thread) üzerinde reflow, stil hesaplaması ve repaint baskısı yaratırken, `OffscreenCanvas` çizim yüzeyini tamamen DOM dışına çıkarır ve bellek içinde bağımsız piksel rasterizasyonu sağlar. Bu deneyde 3 bağımsız `OffscreenCanvas` mikro tamponu (Tampon A: Lazer Tipografi, Tampon B: Kuantum Izgara & Parçacıklar, Tampon C: CRT Fosfor ve Scanline) kurulmuş; her biri bağımsız olarak çizildikten sonra W3C `createImageBitmap()` API ile donanım hızlandırmalı GPU dokularına dönüştürülüp tek bir jank-free kompozitör çağrısıyla (`drawImage`) ana ekrana 60 FPS hızında yansıtılmıştır. "HELLO WORLD" metni hem ana kompozitör ekranında hem de tampon katmanlarında başroldedir.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C OffscreenCanvas Level 1 & HTML ImageBitmap Mimarisi:**
  - `new OffscreenCanvas(width, height)`: DOM ağacından tamamen izole edilmiş, bellek içi 2D render bağlamı (`ctx = offscreen.getContext("2d")`). DOM değişikliklerinden etkilenmez ve CPU/GPU kaynaklarını serbestçe kullanır.
  - Çok Katmanlı Çift Tamponlama (Triple Offscreen Double-Buffering):
    - **Tampon A (Tipografik Lazer):** "HELLO WORLD" glifleri, radyal enerji küresi, dinamik kromatik RGB kanal sapması (Aberration split: Kırmızı +X/-Y, Siyan -X/+Y), metalik gradyan gövde ve neon konturları içerir.
    - **Tampon B (Kuantum Izgara & Parçacıklar):** Tek kaçış noktalı (vanishing point) 3D perspektif zemin ızgarası, lazer ufuk çizgisi ve kinetik Euler parçacık sürüsü içerir.
    - **Tampon C (CRT Fosfor ve Scanline):** Yatay raster tarama çizgileri, CRT vignette kenar karartması ve dinamik yukarı-aşağı hareket eden laser tarama çubuğu içerir.
  - `createImageBitmap(imageSource)`:
    - Her bir `OffscreenCanvas` tamponu `createImageBitmap()` aracılığıyla asenkron olarak GPU dokusuna (texture) dönüştürülür (`Promise.all([createImageBitmap(offGrid), createImageBitmap(offTypo), createImageBitmap(offScanline)])`).
    - Doku doğrudan ekran kartı belleğinde sıfır kopyalama (zero-copy) ile hazırlanır.
  - `masterCtx.drawImage(bitmap, 0, 0)`:
    - 3 tampon sırayla master canvas üzerine tek bir render adımında kompozitlenir.
    - Aktarım sonrasında `bitmap.close()` çağrılarak GPU doku belleği anında serbest bırakılır (memory leak önleme).
  - `offscreen.convertToBlob({ type: "image/png" })`:
    - Tarayıcının ana iş parçacığını dondurmadan, arka planda doğrudan OffscreenCanvas belleğinden sıkıştırılmış PNG Blob görseli üretir (`URL.createObjectURL(blob)` ile önizlenir).

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezdeki "HELLO WORLD" ifadesi yüksek çözünürlüklü, metalik gradyan dolgulu, neon konturlu ve ayarlanabilir RGB kromatik sapma katmanlarıyla donatılmıştır.
   - Tuvalin hemen altında DOM tabanlı zengin tipografik başlık bandı (`.banner-heading`) yer alır.
2. **Renk Paleti ve Kontrast:**
   - Koyu uzay mavisi/siyah endüstriyel arayüz (`#030712`, `#090d1a`).
   - Elektrik siyanı (`#06b6d4`), neon moru (`#8b5cf6`), kehribar sarısı (`#f59e0b`) ve yakut kırmızısı (`#f43f5e`).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (metinler ile zemin arasında 9:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol alanda 16:9 Master Kompozitör Ekranı, hemen altında DOM Odak Bandı ve 3 bağımsız mikro-tampon önizleme penceresi yer alır.
   - Sağ alanda Katman Kompozitör Anahtarları, Çözünürlük Çarpanı Butonları (`1.0x`, `1.5x`, `2.0x`), Görsel Modülasyon Sürgüleri, Asenkron `convertToBlob()` dışa aktarma alanı ve canlı telemetri akışı bulunur.
4. **Mikro Etkileşim ve Hareket:**
   - Katman anahtarları kapatıldığında ilgili katman kompozisyondan anında düşer.
   - Kromatik sapma sürgüsüyle harflerin kırmızı ve siyan kanalları piksel piksel ayrışır.
   - 60 FPS hızında sürekli perspektif ızgara ve parçacık akışı sağlanır.
5. **Kavramsal Odak (Hello World Merkeziliği):**
   - "HELLO WORLD" hem master kompozitör ekranının hem de Tampon A'nın mutlak merkezidir; tüm asenkron rasterizasyon ve çift tamponlama mimarisi bu tipografiyi en yüksek kalitede sunmak üzere kurgulanmıştır.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici kütüphane, saf W3C OffscreenCanvas ve HTML ImageBitmap).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM ve Canvas üzerinde "HELLO WORLD" görünürlüğü kanıtlandı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Çoklu Durum Ekran Görüntüleri:**
  - `screenshot.png`: Varsayılan 3 tamponlu kompozisyon (Tipografi + Izgara + CRT Scanline, 60+ FPS, 4px sapma).
  - `screenshot-solo-typo.png`: Tampon B ve C kapatılarak yalnızca Tampon A'nın (Tipografi) izole çizildiği durum.
  - `screenshot-blob-exported.png`: 12px kromatik sapma modülasyonu ve `convertToBlob()` ile PNG fotoğrafının alındığı durum.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Görsel Jank / Yırtılma (Tearing) Olmadığı:**
  - Çözünürlük `1.0x`'ten `2.0x HiDPI` moduna alındığında veya sürgüler hızla kaydırıldığında ekranda hiçbir kare atlaması (jank) veya ekran yırtılması yaşanmadığı, çift tamponlamanın pürüzsüz aktarım sağladığı gözle doğrulanmalıdır.
- **convertToBlob() İndirme / Önizleme:**
  - "convertToBlob() GÖRÜNTÜ AL" butonuna tıklandığında sol alttaki küçük resim kutusunda anında Tipografi katmanının PNG görselinin oluştuğu ve boyut bilgisinin (örn. `45.2 KB`) listelendiği test edilmelidir.
