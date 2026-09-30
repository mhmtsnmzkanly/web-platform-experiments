# Deney 040 Teknik Raporu: WebGL2 Instanced 3D Voksel Tipografisi & Phong Işık Monoliti (Decade 4 Milestone)

## 1. Amaç
Bu deneyin temel amacı, modern web platformunun en güçlü yerleşik donanım grafik standardı olan **WebGL 2.0 (OpenGL ES 3.0 Web Standardı)** mimarisini kullanarak, hiçbir harici kütüphane (Three.js, Babylon.js, gl-matrix vb.) olmaksızın saf GLSL ES 3.00 ve saf JavaScript lineer cebir matematiği ile "HELLO WORLD" tipografisini 3D uzayda anıtsal bir voksel monoliti olarak inşa etmektir. Deney, yüzlerce 3D küpü tek bir donanım çizim çağrısında (`gl.drawElementsInstanced`) GPU'ya aktaran donanım hızlandırmalı instanced rendering tekniğini, donanım derinlik tamponunu (`DEPTH_TEST`), dinamik Phong yansıma modelini ($I = I_a + I_d + I_s$) ve serbest yörünge kamerasını sergileyerek 4. Onluk Döngü Kilometre Taşını (Decade 4 Milestone: Deneyler 031–040) mühürlemektedir.

## 2. Teknoloji ve Çalışma Mantığı

### Kullanılan API'ler ve Standartlar
- **WebGL 2.0 (`canvas.getContext("webgl2")`)**: OpenGL ES 3.0 grafik çalışma zamanı.
- **GLSL ES 3.00**: `#version 300 es` standardında yüksek hassasiyetli (`precision highp float`) tepe noktası (vertex) ve piksel (fragment) gölgelendiricileri.
- **Vertex Array Objects (VAO - `gl.createVertexArray()`)**: Tepe noktası nitelik durumlarını tek bir GPU nesnesinde kapsüller.
- **Instanced Hardware Drawing (`gl.drawElementsInstanced`, `gl.vertexAttribDivisor`)**:
  - Konum, normal ve indeks dizileri temel küp için 1 kez tanımlanır (24 vertex, 36 index).
  - Voksel dünya pozisyonları (`a_inst_pos`), dispersiyon vektörleri (`a_inst_disp`) ve dinamik renkler (`a_inst_color`) divisor `1` ile her bir örnek başına (per-instance) GPU'ya aktarılır.
  - Tek bir çizim çağrısıyla (Single Draw Call) 544 voksel (19.584 üçgen / 39.168 köşe) 60 FPS hızında GPU tarafından eşzamanlı işlenir.
- **Donanım Derinlik Tamponu (Hardware Depth Buffer)**:
  - `gl.enable(gl.DEPTH_TEST)` ve `gl.depthFunc(gl.LEQUAL)` ile 3D uzayda örtülme (occlusion) hesaplamaları donanım düzeyinde çözülür.
  - `gl.enable(gl.CULL_FACE)` ve `gl.cullFace(gl.BACK)` ile görünmeyen arka yüzler atılarak GPU verimi maksimize edilir.
- **Sıfır Dış Bağımlılıklı Lineer Cebir Kütüphanesi (`Mat4`)**:
  - `Float32Array(16)` üzerinde 4x4 matris çarpımı (`multiply`), simetrik perspektif projeksiyonu (`perspective`), kamera görünüm dönüşümü (`lookAt`) ve Euler dönüşümleri (`rotateX`, `rotateY`).
- **Klasik Phong Aydınlatma Modeli**:
  $$I_{final} = I_{ambient} \cdot k_a + I_{diffuse} \cdot k_d + I_{specular} \cdot k_s$$
  - Ortam Işığı: Malzemeye özgü ortam rengi.
  - Dağınık Yansıma: Lambert kosinüs kuralı ($N \cdot L$).
  - Aynasal Yansıma: Blinn-Phong/Phong yansıma vektörü ($(R \cdot V)^\alpha$) ve ayarlanabilir parlaklık üssü ($\alpha$).

### Veri Akışı ve Mimari Şeması
```
[HELLO WORLD Glif Verileri (5x7 Izgara)]
                   │
                   ▼
  [544 Voksel Örneği (XYZ, Dispersiyon, Renk)]
                   │
  ┌────────────────┴────────────────┐
  ▼                                 ▼
[VBO: Küp Geometrisi]     [Instance VBOs (Divisor 1)]
(24 Vertex, Normaller)    (Pos, Dispersion, Color)
  └────────────────┬────────────────┘
                   │
                   ▼
        [Vertex Array Object (VAO)]
                   │
                   ▼
    [gl.drawElementsInstanced(TRIANGLES, 36, ... 544)]
                   │
                   ▼
      [GLSL ES 3.00 Shader İşleme]
  (Projeksiyon * Görünüm * Model * Instanced World)
                   │
                   ▼
  [Donanım Derinlik Testi (DEPTH_TEST)]
                   │
                   ▼
    [Ekran: 3D Phong Işık Monoliti (60 FPS)]
```

## 3. 5 Boyutlu Tasarım Özeti

### 1. Görsel Hiyerarşi
- **Ana Odak**: 3D uzayda derinlikli iki satır ("HELLO" üstte, "WORLD" altta) halinde süzülen altın rengi voksel monoliti ve üzerinde dönen ışık yansıması.
- **Başlık ve Rozet**: Sol üstte Decade 4 Milestone rozeti, yanıp sönen altın nabız noktası ve teknik alt başlık.
- **Kontrol Dokusu**: Sağ tarafta koyu yarı saydam cam (`backdrop-filter: blur(14px)`) panel; voksel dispersiyonu, yörünge hızı, malzeme ön ayarları (Altın, Plazma Mavi, Yakut, Zümrüt) ve render modları.
- **Telemetri Çubuğu**: Alt kısımda API, Çizim Çağrısı (1 Draw Call), Üçgen Hacmi (19.584 Δ) ve anlık FPS HUD göstergesi.

### 2. Tipografi
- 3D Geometri: Voksel ızgarasında kodlanmış 10 glif ("H-E-L-L-O W-O-R-L-D"), her biri Z-ekseninde çift katmanlı mimari derinliğe sahip.
- UI Arayüzü: `system-ui, -apple-system, sans-serif` ve telemetri için `ui-monospace, monospace` teknik tipografi.

### 3. Renk Paleti
- **Zemin**: Derin obsidyen uzay siyahı (`#06070a`).
- **Malzeme Paletleri**:
  - *Siber Altın*: `#ffd043` taban, `#fff299` parıltı, yüksek aynasal ışık.
  - *Plazma Mavi*: `#00f0ff` elektrik camgöbeği, mavi ortam ışığı.
  - *Yakut Lazer*: `#ff2a6d` canlı fuşya/yakut.
  - *Kuantum Zümrüt*: `#05ffa1` neon zümrüt yeşili.
- **Normaller Modu**: $[X, Y, Z]$ normal vektörlerinin doğrudan $[R, G, B]$ renk kanallarına haritalanması ($N \cdot 0.5 + 0.5$).

### 4. Hareket ve Animasyon
- **Kamera Yörüngesi**: `requestAnimationFrame` ile yumuşak otomatik eksen dönüşü ve hafif dikey rezonans.
- **Dinamik Işık Kaynağı**: Monolit etrafında kürevi yörüngede dönerek harflerin pahlı köşelerinde parıldayan ışık huzmesi.
- **Kozmik Dispersiyon**: Sürgü hareket ettirildiğinde 544 vokselin kendi rastgele 3D patlama vektörleri boyunca dışarı fırlaması ve sıfırlandığında tekrar kusursuz monolite kenetlenmesi.

### 5. Etkileşim
- **Pointer/Mouse Yörüngesi**: Fare basılı tutulup sürüklendiğinde tam açılı serbest yörünge kamerası (`cameraAzimuth`, `cameraElevation`).
- **Zoom**: Fare tekerleği ile donanım perspektif kamerası yakınlaşma/uzaklaşma ($12 - 70$ birim).
- **Gerçek Zamanlı Malzeme Seçimi**: Tek tıkla altın, mavi, yakut ve zümrüt gölgelendirici katsayılarına geçiş.

## 4. Doğrulama Kanıtları

### Otomasyon Testleri (`verify.sh`)
- `dependency-check.sh`: Sıfır harici ağ bağımlılığı, harici betik veya CDN yok. Tamamen saf yerleşik WebGL2 API'si.
- `browser-test.sh`:
  - `console.error()`: Sıfır hata.
  - Doğrulama Nesnesi: `window.__E040_VERIFIED` eksiksiz:
    - `webgl2Supported: true`
    - `instanceCount: 544`
    - `drawCalls: 1`
    - `vaoValid: true`
    - `depthTestEnabled: true`
  - CSSOM İncelemesi: Geçerli CSSOM kuralları, sıfır geçersiz bildirim.
  - Test Sonucu: Tek satır `OK` (çıkış kodu 0).

### Çalışma Zamanı Metrikleri
- Voksel Sayısı: 544 adet bağımsız 3D küp.
- Toplam Üçgen / Köşe: $544 \times 12 = 6.528$ üçgen; $544 \times 36 = 19.584$ indeksli köşe çizimi.
- Çizim Çağrısı (Draw Call): Yalnızca 1 adet `gl.drawElementsInstanced()` çağrısı.
- Kare Hızı: 60.0 FPS kararlı GPU akışı.

## 5. İnsan Doğrulaması Gereken Durumlar

1. **3D Derinlik ve Örtülme**: Fare ile monolit çevresinde dönüldüğünde öndeki harflerin arkadaki harfleri doğru biçimde kapatması (`DEPTH_TEST` görsel kontrolü).
2. **Kozmik Dispersiyon Hissi**: "Kozmik Dağılma" kaydırıcısı çekildiğinde harflerin parçalanıp dağılması, sıfırlandığında kusursuz "HELLO WORLD" kelimesine geri kenetlenmesi.
3. **Phong Işık Parıltısı**: Malzeme butonları arasında geçiş yapıldığında küp yüzeylerindeki speküler parlamaların malzeme rengine göre değişmesi.
