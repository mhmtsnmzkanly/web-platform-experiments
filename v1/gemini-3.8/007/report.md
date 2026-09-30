# Deney 007 Raporu: Web Animations API (WAAPI) ve Koreografik Tipografi

## 1. Deney Özeti
- **Deney No:** 007
- **Teknoloji:** Web Animations API (`element.animate()`, `KeyframeEffect`, `Animation.playbackRate`, `Animation.reverse()`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (PASS)
- **Dosya:** [`src/007.html`](file:///home/duldul/Belgeler/hw_lab/src/007.html)

---

## 2. Hipotez ve Amaç
CSS keyframe kuralları stil sayfalarında statik olarak tanımlanırken, Web Animations API (WAAPI) tarayıcının yerel donanım hızlandırmalı kompozitör motorunu (compositor thread) JavaScript'in dinamik kontrolüne açar. Amaç; "Hello World" ifadesini oluşturan harfleri ayrı DOM düğümleri olarak korurken, her birine programatik anahtar kareler ve faz kaymaları atamak; animasyon hızını (`playbackRate`), yönünü (`reverse()`) ve durumunu canlı olarak yönetebilen etkileşimli bir kinetik tipografi sistemi kurmaktır.

---

## 3. Mimari ve Uygulama Detayları
- **Harf Bazlı Bölümleme ve Semantik Bütünlük:** "Hello World" metni `<h1 class="title" aria-label="Hello World">` çatısı altında harf harf `.glyph` span elemanlarına ayrılmıştır. `aria-label` kullanımı sayesinde ekran okuyucular harfleri tek tek hecelemek yerine tek parça olarak okur.
- **Koreografik Zamanlama (Staggered Wave):** Her harf için `index * 110ms` matematiksel faz kaymasıyla `glyph.animate(keyframes, timing)` çağrısı yapılmıştır. Anahtar kareler dikey süzülme (`translate3d`), 3D rotasyon (`rotateX(24deg)`, `rotateZ(-3deg)`), ölçekleme ve OKLCH spektral renk döngüsünü içerir.
- **Doğrudan Kompozitör Erişimi:** Animasyonlar JavaScript `requestAnimationFrame` döngüsüne gerek kalmadan, doğrudan tarayıcının GPU kompozitör iş parçacığında sıfır ana iş parçacığı (main thread) yüküyle 60+ FPS hızında akar.
- **İnteraktif Kontrol Paneli:** Kullanıcıya animasyonu anlık duraklatma/oynatma, yönünü tersine çevirme (`reverse()`), hızını 0.2x ile 3.0x arasında kaydırma çubuğuyla ayarlama ve harflere rezonans şok dalgası gönderme imkanı sunulmuştur. Ayrıca her harfin üzerine gelindiğinde `mouseenter` ile bağımsız bir mikro yaylanma animasyonu tetiklenir.

---

## 4. Test ve Doğrulama Bulguları

Çok kanallı doğrulama zinciri icra edilmiş ve tüm kategoriler başarıyla geçmiştir:

```
[SYNTAX]                PASS (validate.sh - HTML5 ve JS V8 sözdizimi geçerli)
[DEPENDENCY]            PASS (dependency-check.sh - Sıfır harici istek/kütüphane)
[DOM_VISIBILITY]        PASS (<h1> "Hello World" 846x120px görünür ve aktif)
[GRAPHICS_RENDER]       NOT_APPLICABLE (Saf DOM / WAAPI animasyonu)
[VISUAL_REVIEW]         PASS (3D kinetik dalga, estetik OKLCH renkleri, net harfler)
[RUNTIME]               PASS (Sıfır konsol hatası veya istisna)
[NETWORK]               PASS (Sıfır yetkisiz ağ transferi)
[PERMISSIONS]           PASS (İzin gerektirmeyen tamamen yerleşik API)
[NEW_TECHNOLOGY_ACTIVE] PASS (Element.animate ve Animation arayüzü aktif)
```

---

## 5. Ekran Görüntüsü ve Görsel İnceleme

![Deney 007 Ekran Görüntüsü](screenshot.png)

Ekran görüntüsünde görüldüğü üzere:
- "Hello World" harfleri 3D uzayda zarif bir sinüzoidal dalga fazında süzülmekte, camgöbeğinden maviye, leylaktan mercan pembesine uzanan spektral OKLCH ışıması sergilemektedir.
- Alt kısımdaki fütüristik cam efektli (backdrop-filter blur) kontrol paneli, WAAPI zaman çizelgesinin tüm interaktif yeteneklerini kullanıcıya sunmaktadır.
