# Deney 008 Raporu: Web Components ve Shadow DOM Mimarisi

## 1. Deney Özeti
- **Deney No:** 008
- **Teknoloji:** Web Components (Custom Elements v1, Shadow DOM v1, `<template>`, `<slot>`, `observedAttributes`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (PASS)
- **Dosya:** [`src/008.html`](file:///home/duldul/Belgeler/hw_lab/src/008.html)

---

## 2. Hipotez ve Amaç
Hiçbir harici JavaScript kütüphanesi veya derleyicisi (React, Vue, Webpack vb.) olmaksızın, W3C standartlarında yerel bir `<hello-world>` özel HTML etiketi üretilebilir. Shadow DOM mimarisiyle stil ve DOM düğümleri dış sayfanın stillerinden tamamen yalıtılabilir (sıfır CSS sızıntısı); `observedAttributes` ve `attributeChangedCallback` yaşam döngüsü metotlarıyla bileşen reaktif olarak tema ve görünüm değişimlerini yönetebilir.

---

## 3. Mimari ve Uygulama Detayları
- **Custom Elements v1 (`customElements.define`):** `HelloWorldElement` sınıfı doğrudan `HTMLElement` sınıfından türetilerek `'hello-world'` etiketiyle tescil edilmiştir.
- **Shadow DOM v1 (`attachShadow({ mode: 'open' })`):** Bileşenin iç yapısı ve CSS kuralları ana belgeden tamamen izole edilmiştir. Dış sayfadaki hiçbir kural bileşen içine nüfuz edemez; bileşenin iç stilleri de dış sayfayı etkileyemez.
- **HTML5 `<template>` ve `<slot>`:** Şablon doğrudan belgede saklanıp bileşen örneklendiğinde `cloneNode(true)` ile kopyalanır. `<slot name="subtitle">` projeksiyonu ile ana sayfa bileşen içine anlamsal içerik enjekte eder; `::slotted` sözde elemanı ile bu içerik biçimlendirilir.
- **Reaktif Yaşam Döngüsü (`lifecycle hooks`):**
  - `connectedCallback`: Bileşen DOM'a eklendiğinde başlangıç verilerini ve telemetriyi senkronize eder.
  - `observedAttributes`: `['variant', 'glow']` özniteliklerini gözlem listesine alır.
  - `attributeChangedCallback`: Dış sayfadan `element.setAttribute('variant', 'zen')` yapıldığında anında tetiklenerek iç bileşen durumunu günceller.
- **Çoklu Tema Desteği (`:host([variant="..."])`):** "Cyber", "Zen", "Retro" ve "Prism" olmak üzere 4 farklı görsel varyant sadece öznitelik değişimiyle dinamik olarak devreye girer.

---

## 4. Test ve Doğrulama Bulguları

Çok kanallı doğrulama zinciri icra edilmiş ve tüm kategoriler başarıyla geçmiştir:

```
[SYNTAX]                PASS (validate.sh - HTML5 ve JS V8 sözdizimi geçerli)
[DEPENDENCY]            PASS (dependency-check.sh - Sıfır harici istek/kütüphane)
[DOM_VISIBILITY]        PASS (Shadow DOM içi <h1> "Hello World" 553x109px görünür)
[GRAPHICS_RENDER]       NOT_APPLICABLE (Kapsüllenmiş Shadow DOM yapısı)
[VISUAL_REVIEW]         PASS (Cam efektli kart, reaktif rozet, parlak OKLCH ışıma)
[RUNTIME]               PASS (Sıfır konsol hatası veya istisna)
[NETWORK]               PASS (Sıfır yetkisiz ağ transferi)
[PERMISSIONS]           PASS (İzin gerektirmeyen tamamen yerleşik API)
[NEW_TECHNOLOGY_ACTIVE] PASS (customElements.define ve attachShadow aktif)
```

---

## 5. Ekran Görüntüsü ve Görsel İnceleme

![Deney 008 Ekran Görüntüsü](screenshot.png)

Ekran görüntüsünde görüldüğü üzere:
- `<hello-world>` özel bileşeni, etrafındaki camgöbeği ışıma ve koyu cam efektli kartı ile sayfanın merkezinde kusursuz bir biçimde konumlanmaktadır.
- `<slot name="subtitle">` aracılığıyla enjekte edilen altyazı ve gölge ağaç telemetri göstergesi (`Shadow Root: OPEN`) eksiksiz çalışmaktadır.
- Alt kısımdaki tema butonları, Custom Element özniteliklerini anlık olarak değiştirebilecek reaktiviteye sahiptir.
