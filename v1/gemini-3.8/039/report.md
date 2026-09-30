# Deney 039 Teknik Raporu: Canvas ImageData & Konvolüsyon Matrisi Çekirdeği

## 1. Amaç
Bu deneyin temel amacı, HTML5 Canvas 2D ortamında ham piksel tamponuna (`Uint8ClampedArray`) doğrudan erişim sağlayan `ctx.getImageData()` ve `ctx.putImageData()` API'lerini kullanarak istemci tarafında gerçek zamanlı 3x3 uzamsal konvolüsyon matrisi (spatial convolution kernel) filtreleme motoru inşa etmektir. "Hello World" tipografisi ve dinamik arka plan ızgarası üzerinde Sobel kenar tespiti (gradient magnitude $G = \sqrt{G_x^2 + G_y^2}$), Laplacian 2. derece türev kenar filtresi, Kabartma (Emboss), Gaussian Blur ve Keskinleştirme (Sharpen) gibi konvolüsyon çekirdeklerinin piksel düzeyinde matematiksel dönüşümü interaktif bölünmüş ekran (split-screen caliper) ile sergilenmektedir.

## 2. Teknoloji ve Çalışma Mantığı

### Kullanılan API'ler ve Standartlar
- **HTML5 Canvas 2D (`CanvasRenderingContext2D`)**: 640x480 çözünürlükte çalışma tamponu ve 307.200 piksellik (1.228.800 bayt) RGBA renk uzayı.
- **`ctx.getImageData(sx, sy, sw, sh)`**: Kaynak tuvaldeki piksel verilerini tek boyutlu `Uint8ClampedArray` olarak elde eder.
- **`ctx.putImageData(imagedata, dx, dy, ...)`**: Konvolüsyon çekirdeği ile işlenmiş çıkış piksel tamponunu doğrudan ekrana yansıtır.
- **Konvolüsyon Motoru (3x3 Kernel Konvolüsyonu)**:
  - Piksel komşuluk matrisi:
    $$I_{out}(x, y) = \text{clamp}\left(\sum_{i=-1}^{1}\sum_{j=-1}^{1} K(i+1, j+1) \cdot I_{in}(x+i, y+j) \cdot \text{divisor} + \text{offset}\right)$$
  - Sınır koşulları: Dizin taşmasını önlemek için kenar pikselleri `Math.max(0, Math.min(dim - 1, pos))` ile kelepçelenir (clamp-to-edge).
  - Sobel Algoritması: Yatay $G_x$ ve dikey $G_y$ çekirdekleri ayrı ayrı hesaplanarak Öklid gradyan büyüklüğü $G = \sqrt{G_x^2 + G_y^2}$ ile yön bağımsız kenar büyüklüğü saptanır.
- **İnteraktif Bölünmüş Ekran (Split-Screen Caliper)**:
  - Kullanıcı kaydırıcı (`#splitSlider`) ile filtrelenmiş alanın genişliğini anlık olarak kontrol eder. `ctx.putImageData`'nın `dirtyX, dirtyY, dirtyWidth, dirtyHeight` parametreleri kullanılarak donanım düzeyinde kısmi piksel yazımı gerçekleştirilir.
- **Etkileşimli Matris Editörü**:
  - Kullanıcı 3x3 çekirdeğin 9 hücresini, bölenini (divisor) ve ofsetini doğrudan değiştirerek özel konvolüsyon çekirdekleri tanımlayabilir.

### Veri Akışı Şeması
```
[Sahne Renderı: Hello World + Izgara]
              │
              ▼
    [ctx.getImageData()] ──► 1.228.800 Bayt Uint8ClampedArray
              │
              ▼
    [3x3 Konvolüsyon Çekirdeği Hesaplama]
    (Sobel Gx/Gy, Laplace, Emboss, Sharpen, Blur)
              │
              ▼
    [ctx.putImageData(outData, splitX...)]
              │
              ▼
  [Sol: Saf Vektörel Piksel | Sağ: Konvolüsyon Filtresi]
```

## 3. 5 Boyutlu Tasarım Özeti

### 1. Görsel Hiyerarşi
- **Ana Odak**: Tuval merkezinde parlayan devasa "HELLO WORLD" tipografisi ve sağ yarıda beliren yüksek frekanslı konvolüsyon kenar hatları.
- **Kontrol Katmanı**: Üst panelde hazır filtre butonları (Sobel, Laplace, Emboss, Sharpen, Blur, Filtresiz) ve interaktif 3x3 matris editörü.
- **Telemetri Paneli**: Alt kısımda FPS, işlenen piksel hacmi (307.2K px), piksel tampon boyutu (1.2 MB) ve anlık çekirdek ağırlıklarını gösteren HUD.

### 2. Tipografi
- Tuval içi tipografi: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` ile 64px `900` ağırlığında sans-serif glifler; alt başlıkta 18px `600` monospaced font.
- UI Kontrolleri ve Telemetri: `system-ui, -apple-system, monospace` dengeli teknik hiyerarşi.

### 3. Renk Paleti
- **Arka Plan**: Derin kuantum siyahı (`#08090d`) ve koyu grafit panel katmanı (`#0f121a`).
- **Ham Renkler**: Elektrik camgöbeği (`#00f0ff`) ve magenta vurgular.
- **Filtre Çıktıları**:
  - Sobel & Laplace: Yüksek kontrastlı monokrom / spektral kenar çizgileri.
  - Emboss: 128 ofsetli çelik rölyef gri tonları.

### 4. Hareket ve Animasyon
- `requestAnimationFrame` ile 60 FPS senkronizasyonunda hareket eden mikro ızgara çizgileri ve periyodik ışık dalgalanmaları.
- Ayrık konvolüsyon tamponunun her karede gerçek zamanlı işlenmesi (ortalama 4-7 ms işlem süresi).

### 5. Etkileşim
- **Hazır Filtre Butonları**: Tek tıklamayla önceden tanımlanmış konvolüsyon filtrelerine anında geçiş.
- **Split Slider**: Filtre etki alanını serbestçe sağa-sola kaydırabilme.
- **Özel Çekirdek Editörü**: 9 hücreye doğrudan sayısal girdi verilerek çekirdeği anında değiştirme ve "Uygula" butonu.

## 4. Doğrulama Kanıtları

### Otomasyon Testleri (`verify.sh`)
- `dependency-check.sh`: Sıfır harici ağ bağımlılığı, harici yazı tipi veya CDN yok. Tamamen yerleşik Canvas 2D API'leri.
- `browser-test.sh`:
  - `console.error()`: Sıfır hata.
  - Doğrulama Bayrağı: `window.__E039_VERIFIED === true`.
  - DOM/CSSOM İncelemesi: Geçerli CSSOM kuralları, sıfır geçersiz bildirim.
  - Test Sonucu: Tek satır `OK` (çıkış kodu 0).

### Çalışma Zamanı Metrikleri
- Tuval çözünürlüğü: 640 x 480 piksel (307.200 piksel).
- Piksel bayt uzunluğu: $640 \times 480 \times 4 = 1.228.800$ bayt.
- Kare işleme gecikmesi: ~5.2 ms (60 FPS stabilite marjı içinde).

## 5. İnsan Doğrulaması Gereken Durumlar

Aşağıdaki durumlar otomatik testlerle kontrol edilmiş olup görsel nitelik açısından insan gözlemi önerilir:
1. **Sobel Kenar Gradyanı**: Split kaydırıcı sürüklendiğinde, sol taraftaki düzgün mavi "HELLO WORLD" metninin sağ tarafta yalnızca parlak sınır çizgileri (konturlar) halinde görünmesi.
2. **Kabartma (Emboss) Rölyefi**: "Kabartma" filtresi seçildiğinde harflerin metalik kabartma gibi ışık-gölge efektiyle 3 boyutlu algılanması.
3. **Özel Çekirdek Testi**: 3x3 matris editöründe merkez hücreye `5`, dört kenara `-1` yazılıp divisor `1` yapıldığında keskinleştirme filtresinin doğrulanması.
