# Deney 008 Günlüğü: Web Components ve Shadow DOM

Bu günlük, Deney 008 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:20] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Önceki deneylerde HTML5 semantiği, CSS yerleşim ve renk değişkenleri, CSS animasyonları, SVG vektörleri, Canvas 2D pikselleri ve WAAPI kompozitör animasyonları incelendi.
- Deney 008'de modern tarayıcıların en temel mimari standartlarından biri olan **Web Components** (Custom Elements v1, Shadow DOM v1, `<template>`, `<slot>`) hedeflenmiştir.
- Temel amaç: Sıfır harici framework veya derleyici (React, Svelte, Vue vb.) kullanmadan, tarayıcının yerel bileşen sistemini kullanarak `<hello-world>` özel etiketini tanımlamak, Shadow DOM ile stil ve DOM ağacını dış dünyadan tamamen izole etmek ve reaktif öznitelik (`observedAttributes`) mekanizmasını göstermek.

### Tasarım Alternatifleri
1. **Alternatif A — Yalnızca Custom Elements (Shadow DOM'suz):** `class HelloWorld extends HTMLElement` ile sadece özel etiket kaydetmek. (Stil yalıtımı ve şablonlama yeteneklerini sergilemez).
2. **Alternatif B — Reaktif Çok Temalı Shadow DOM Bileşeni (Seçildi):** `attachShadow({ mode: 'open' })` ile tam yalıtımlı gölge ağaç kurulur. `:host` sözde sınıfı, `<template>` kopyalama ve `<slot>` projeksiyonu kullanılır. Bileşenin `variant` ("cyber", "zen", "retro", "prism") ve `glow` öznitelikleri `attributeChangedCallback` yaşam döngüsü metoduyla dinamik olarak dinlenir. Dış sayfadan bu öznitelikler değiştirildiğinde bileşen kendi iç dünyasını anında yeniden biçimlendirir.
3. **Alternatif C — Shadow DOM İçi Canvas/SVG Entegrasyonu:** Bileşenin içine bir canvas veya SVG yerleştirmek. (Önceki 005 ve 006 deneylerinin tekrarı yerine, Web Components'in asıl gücü olan stil yalıtımı ve şablon mimarisine odaklanmak daha değerlidir).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Standart web bileşenlerinin tüm yapı taşlarını (Custom Elements, Shadow Root, HTML Template, Slots, Lifecycle Hooks ve Scoped CSS) eksiksiz ortaya koyar.


## [2026-09-29 01:22] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/008.dev.html` geliştirildi:
   - `<template id="hello-world-template">` tanımlandı.
   - `HelloWorldElement extends HTMLElement` sınıfı yazıldı.
   - `attachShadow({ mode: 'open' })` ile yalıtılmış gölge kök oluşturuldu.
   - `static get observedAttributes() { return ['variant', 'glow']; }` ve `attributeChangedCallback` ile tam reaktif bileşen modeli kuruldu.
   - `<slot name="subtitle">` ile dış belgeden zengin içerik aktarımı ve `::slotted` ile stil yönetimi sağlandı.
   - 4 farklı tema varyantı ("Cyber", "Zen", "Retro", "Prism") ve ışıma anahtarı `:host([variant="..."])` sözde sınıflarıyla donatıldı.
2. Doğrulama Süreci ve Shadow DOM Çözümü:
   - `browser-test.sh` içinde `document.elementFromPoint(cx, cy)` çağrısının Shadow DOM sınırında host elemanı döndürmesi nedeniyle oluşan yanlış örtülme (occlusion) uyarısı çözüldü.
   - `topEl.shadowRoot.elementFromPoint(cx, cy)` derinleşme algoritması eklenerek Shadow DOM elemanlarının doğrudan ve doğru doğrulanması sağlandı.
3. Pipeline Çıktıları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, Shadow DOM içi `<h1>` 553x109px)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
4. Yayımlama:
   - `src/008.dev.html` -> `src/008.html` olarak terfi ettirildi ve kilitlendi.
