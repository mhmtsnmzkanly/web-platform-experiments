# Deney 011 Raporu: ResizeObserver ve Container Queries

## 1. Deney Özeti
- **Deney No:** 011
- **Teknoloji:** ResizeObserver API (`contentBoxSize`, `borderBoxSize`) ve CSS Container Queries (`container-type: inline-size`, `@container`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (PASS)
- **Dosya:** [`src/011.html`](file:///home/duldul/Belgeler/hw_lab/src/011.html)

---

## 2. Hipotez ve Amaç
Geleneksel medya sorguları (`@media`) yalnızca tüm tarayıcı penceresinin (viewport) boyutunu denetleyebilirken, modern web mimarisinde bileşenler yerleştirildikleri üst kapsayıcının sınırlarına göre şekillenmelidir. CSS Container Queries (`@container`) ve `ResizeObserver` API bir araya getirilerek, "Hello World" ifadesini bağımsız bir konteyner içine yerleştirmek; konteyner daraldığında veya genişlediğinde harflerin morfolojik olarak dikey kuleden panoramik satıra geçmesini sağlamak ve piksel altı boyut telemetrisini sıfır gecikmeyle izlemektir.

---

## 3. Mimari ve Uygulama Detayları
- **CSS Container Queries Bağlamı:** Kapsayıcı `.resizable-container` üzerinde `container-type: inline-size` ve `container-name: hw-box` tanımlanmıştır. Üç ana mod kodlanmıştır:
  - `< 440px`: Dikey istiflenmiş iki katlı glif kulesi, kompakt boşluklar ve neon pembe ışıma.
  - `441px - 760px`: Yatay dengeli çift kelime, camgöbeği ışıma ve orta boy tipografi.
  - `> 761px`: Panoramik dev tipografi (5.6rem), eflatun/mor neon halo ve geniş glif aralıkları.
- **ResizeObserver API Entegrasyonu:** JavaScript tarafında `new ResizeObserver(entries => ...)` örneği oluşturulmuş, `entry.contentBoxSize` verileriyle anlık piksel genişliği okunarak HUD paneline aktarılmıştır.
- **Serbest Boyutlandırma ve Önayarlar:** Kullanıcı sağ kenardaki tutamaç (`#resizeHandle`) ile konteyneri serbestçe çekip uzatabilir veya alt paneldeki 360px, 580px, 840px ve 1060px butonlarıyla akıcı geçiş yapabilir.

---

## 4. Test ve Doğrulama Bulguları

Çok kanallı doğrulama zinciri icra edilmiş ve tüm kategoriler başarıyla geçmiştir:

```
[SYNTAX]                PASS (validate.sh - HTML5 ve JS V8 sözdizimi geçerli)
[DEPENDENCY]            PASS (dependency-check.sh - Sıfır harici istek/kütüphane)
[DOM_VISIBILITY]        PASS (<h1> "Hello World" 742x94px görünür ve aktif)
[GRAPHICS_RENDER]       NOT_APPLICABLE (Konteyner sorgulu saf DOM tipografisi)
[VISUAL_REVIEW]         PASS (Panoramik mor ışıma, akıcı geçişler, net telemetri)
[RUNTIME]               PASS (Sıfır konsol hatası veya istisna)
[NETWORK]               PASS (Sıfır yetkisiz ağ transferi)
[PERMISSIONS]           PASS (İzin gerektirmeyen tamamen yerleşik API)
[NEW_TECHNOLOGY_ACTIVE] PASS (ResizeObserver ve CSS Container Queries aktif)
```

---

## 5. Ekran Görüntüsü ve Görsel İnceleme

![Deney 011 Ekran Görüntüsü](screenshot.png)

Ekran görüntüsünde görüldüğü üzere:
- Konteyner 840px genişliğinde olup, `@container (min-width: 761px) [PANORAMİK SATIR]` modunda mor neon ışımasıyla "Hello World" ifadesini büyüleyici bir netlikte sunmaktadır.
- Sağ kenardaki sürükleme tutamacı ve alt kısımdaki önayar butonları ile gerçek zamanlı ResizeObserver telemetrisi eksiksiz çalışmaktadır.
