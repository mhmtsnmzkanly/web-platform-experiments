# Deney 009 Raporu: SVG Filtreleri ve Sıvı Deformasyonu

## 1. Deney Özeti
- **Deney No:** 009
- **Teknoloji:** SVG Filtreleri (`<filter>`, `<feTurbulence>`, `<feDisplacementMap>`, `<feGaussianBlur>`, `<feMerge>`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (PASS)
- **Dosya:** [`src/009.html`](file:///home/duldul/Belgeler/hw_lab/src/009.html)

---

## 2. Hipotez ve Amaç
Standart CSS filtrelerinin çok ötesinde, tarayıcının yerleşik SVG filtre donanımını kullanarak DOM metinlerinin piksel koordinatlarını prosedürel matematiksel gürültü (Perlin / Fractal Noise) haritalarıyla saptırmak. "Hello World" ifadesini anlamsal bir `<h1>` başlığı olarak korurken, onu yaşayan, akışkan, erimiş cam veya sıvı metal gibi dalgalanan organik bir tipografiye dönüştürmek.

---

## 3. Mimari ve Uygulama Detayları
- **SVG Filtre Primitifleri Mimarisi:**
  - `<feTurbulence>`: Fraktal gürültü algoritmasıyla dinamik bir 2D vektörel gürültü haritası sentezler.
  - `<feDisplacementMap>`: Gürültü haritasının Kırmızı (R) ve Yeşil (G) piksel değerlerini alıp kaynak metnin X ve Y koordinatlarına matematiksel sapma (displacement) uygular.
  - `<feGaussianBlur>`: Sıvı yüzey gerilimini simüle eden yumuşak bir ışıma katmanı türetir.
  - `<feMerge>`: Keskin sıvı kenarları ile yumuşak ışıltıyı birleştirerek derinlik katar.
- **Canlı Sinüzoidal Modülasyon:** `requestAnimationFrame` döngüsü içinde `baseFrequency` parametresi X ve Y eksenlerinde farklı fazlarda salındırılarak sıvının durağan kalmayıp sürekli organik olarak akması sağlanmıştır.
- **Etkileşim:** Kullanıcı dalga şiddetini (`scale: 0-80`), frekansı (`0.005 - 0.035`) ve gürültü katmanını (`octaves: 1-3`) anlık olarak ayarlayabilir; imleci metin üzerine sürüklediğinde lokal enerji dalgası meydana gelir.

---

## 4. Test ve Doğrulama Bulguları

Çok kanallı doğrulama zinciri icra edilmiş ve tüm kategoriler başarıyla geçmiştir:

```
[SYNTAX]                PASS (validate.sh - HTML5 ve JS V8 sözdizimi geçerli)
[DEPENDENCY]            PASS (dependency-check.sh - Sıfır harici istek/kütüphane)
[DOM_VISIBILITY]        PASS (<h1> "Hello World" 798x150px görünür ve aktif)
[GRAPHICS_RENDER]       NOT_APPLICABLE (CSS filter: url(#...) ile donanım filtreleme)
[VISUAL_REVIEW]         PASS (Organik sıvı dalgalanması, akıcı gradyan, net harfler)
[RUNTIME]               PASS (Sıfır konsol hatası veya istisna)
[NETWORK]               PASS (Sıfır yetkisiz ağ transferi)
[PERMISSIONS]           PASS (İzin gerektirmeyen tamamen yerleşik API)
[NEW_TECHNOLOGY_ACTIVE] PASS (SVG filter primitives ve displacement aktif)
```

---

## 5. Ekran Görüntüsü ve Görsel İnceleme

![Deney 009 Ekran Görüntüsü](screenshot.png)

Ekran görüntüsünde görüldüğü üzere:
- "Hello World" tipografisi, erimiş sıvı metal gibi dalgalanmakta, turkuaz-mor-pembe spektral gradyanı ile büyüleyici bir akışkanlık sergilemektedir.
- Alt kontrol paneli aracılığıyla filtre genliği ve frekansı anlık olarak kullanıcı tarafından manipüle edilebilmektedir.
