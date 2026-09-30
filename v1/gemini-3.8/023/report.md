# Deney 023: CSS Typed Object Model (CSS Typed OM) API ve Tip Güvenli Houdini Tipografik Matris Motoru

## 1. Amaç ve Kapsam
Bu deneyin amacı, W3C CSS Houdini standartlar ailesinin temel yapı taşı olan **CSS Typed Object Model (CSS Typed OM) API** (`CSS.px()`, `CSS.deg()`, `CSS.number()`, `CSSTransformValue`, `attributeStyleMap`, `computedStyleMap()`) yeteneğini kullanarak geleneksel dizgi birleştirme (`element.style.transform = "..."`) yaklaşımını tamamen terk etmek ve "HELLO WORLD" gliflerinin 3D uzamsal kinetiğini doğrudan C++ seviyesinde tip güvenli sayısal nesnelerle 60 FPS hızında çalışan bir tipografi matris motoruna dönüştürmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. Tip Güvenli Birim Fabrikaları (`CSSUnitValue`)
- Sayısal değerler dizgi yerine kesin birim nesneleri olarak üretilir:
  - Uzunluk: `CSS.px(transY)`
  - Açı: `CSS.deg(rotZ)`
  - Boyutsuz ölçek / saydamlık: `CSS.number(scale)`, `CSS.number(opacity)`
- Bu yaklaşım, tarayıcının her animasyon karesinde dizgiyi ayrıştırıp sözdizimi denetimi yapma yükünü tamamen ortadan kaldırır.

### B. Birleşik Dönüşüm Matrisi Ağacı (`CSSTransformValue`)
- Her glif için dönüşüm bileşenleri yapısal bir dizi olarak paketlenir:
  ```javascript
  const transformVal = new CSSTransformValue([
    new CSSTranslate(CSS.px(0), CSS.px(transY)),
    new CSSRotate(CSS.deg(rotZ)),
    new CSSScale(CSS.number(scale), CSS.number(scale))
  ]);
  ```
- Glif öğesine `glyph.attributeStyleMap.set("transform", transformVal)` çağrısıyla doğrudan aktarılır.

### C. Doğrudan Eşleme ve Hesaplanan Değerler (`attributeStyleMap` / `computedStyleMap()`)
- `attributeStyleMap` stil özniteliklerini doğrudan yerleşik nesne haritası üzerinden manipüle eder.
- `computedStyleMap().get("font-size")` ile tarayıcının nihai hesapladığı tipografik değerler (`CSSUnitValue { value: 99, unit: "px" }`) doğrudan okunarak canlı telemetri paneline aktarılır.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** Fütüristik Houdini hesaplama laboratuvarı tipografisi. Teknik göstergelerde monospaced (`ui-monospace`, `Menlo`, `Consolas`), ana "HELLO WORLD" gliflerinde ise kalın ve net grotesk (`system-ui`, `-apple-system`, `Helvetica Neue`, 900 font-weight).
2. **Renk Paleti:**
   - Derin uzay moru zemin (`#07070d`, `#0e0e1a`)
   - Elektrik menekşesi (`#a855f7`)
   - Plazma pembesi (`#ec4899`)
   - Vektörel camgöbeği (`#06b6d4`)
   - Temiz beyaz ve titan grisi (`#f8fafc`, `#94a3b8`)
3. **Kompozisyon:** Genişletilmiş optik sahne: Merkezde reticle artı işaretleriyle hizalanmış 10 adet bağımsız kinetik glif kutusu; sağ tarafta canlı `CSSTransformValue` AST ağacı ve hesaplanan Houdini telemetrisi; alt kısımda etkileşimli matematiksel parametre çubuğu (genlik, açı, hız).
4. **Malzeme Hissi:** Yarı saydam cam levhalar (`backdrop-filter: blur(16px)`), plazma moru kontur ışımaları ve mikron ızgarası arka planı.
5. **Hareket:** 3 farklı Houdini hareket modu:
   - *01: Harmonik Dalga:* Sinüzoidal faz kaymalı dikey salınım ve açısal yaylanma.
   - *02: Girdap Dönüşü:* Açısal hız ve ölçek modülasyonlu kuantum vortex döngüsü.
   - *03: İzometrik Eğim:* 3D derinlik matrisi eğimi.
   - Tepe başlıkta dönen gyroskopik ikon (`@keyframes houdini-spin`).

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır dış kütüphane, CDN, font veya medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm CSS bildirimleri ve değişkenler geçerli).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel CSS Typed OM döngüsü doğrulandı)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Harmonik Dalga Modu (screenshot-wave.png)](screenshot-wave.png): Sinüzoidal faz dalgası, 26.8px dikey kayma, -4.0deg rotasyon ve canlı AST ağacı.
- [Girdap Dönüşü Modu (screenshot-vortex.png)](screenshot-vortex.png): Girdap yörüngesinde dönen glifler, -16.2deg açısal rotasyon.
- [İzometrik Eğim Modu (screenshot-skew.png)](screenshot-skew.png): İzometrik eksen eğim matrisi görünümü.
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa tam ekran genel Houdini kokpiti.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak CSS Typed OM'un sağladığı sıfır jank hissi ve kullanıcının kaydırıcılarla (slider) etkileşime girdiğinde elde ettiği anlık akıcılık otomasyonla tek başına tam olarak değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** Kullanıcı "Genlik", "Açı" ve "Hız" sürgülerini hareket ettirdiğinde veya mod butonlarına bastığında, 10 glifin eşzamanlı olarak dizgisiz C++ hızında sıfır gecikmeyle tepki vermesi ve sağdaki AST ağacının akıcı yenilenmesi.
- **Mevcut Teknik Kanıt:** Headless Chromium oturumunda `attributeStyleMap` ve `computedStyleMap()` çağrılarının hatasız çalıştığı, ekran görüntülerinde AST ağacının (`CSSTranslate`, `CSSRotate`, `CSSScale`) matematiksel değerleri başarıyla render ettiği kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/023.html` adresini açınız. Üst kısımdaki "01 HARMONİK DALGA", "02 GİRDAP DÖNÜŞÜ", "03 İZOMETRİK EĞİM" butonlarına sırayla tıklayınız. Alttaki sürgüleri sağa sola kaydırarak dalga boyunu ve dönüş açılarını değiştiriniz. Herhangi bir harfe tıklayarak sağ panelde o harfe ait `CSSTransformValue` AST ağacının canlı değişimini çıplak gözle doğrulayınız.
