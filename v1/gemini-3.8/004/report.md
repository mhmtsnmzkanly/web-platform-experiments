# Deney 004 Raporu: CSS Keyframe Animasyonları ve Kinetik Tipografi

## 1. Amaç
Bu deneyin amacı, CSS `@keyframes` animasyon motorunu ve donanım hızlandırmalı transformasyonları (`transform: translate3d/scale`, `filter: hue-rotate`) kullanarak, `Hello World` ifadesini yaşayan, nefes alan ve sürekli spektral renk döngüsüne sahip kinetik bir odak noktasına dönüştürmektir.

## 2. Yeni Teknoloji ve Özgünlük Gerekçesi
- **Yeni Teknoloji:** CSS Keyframe Animasyon Motoru (`@keyframes`, `animation-timing-function: cubic-bezier`, `animation-iteration-count: infinite`, `will-change: transform, filter`).
- **Özgünlük Gerekçesi:** Deney 001, 002 ve 003 tamamen statik belgelerdi. Deney 004, tarayıcının zaman tabanlı enterpolasyon ve kompozitör (GPU compositor) motorunu ilk kez harekete geçirerek Hello World metnine ritmik bir kinetik varlık kazandırır.

## 3. Üç Alternatif ve Seçilen Tasarım
- **Alternatif A (Minimal Boyut Nabzı):** Yalnızca `scale(0.98)` ile `scale(1.02)` arasında yavaş nefes alma.
- **Alternatif B (Kinetik Spektrum ve Ritmik Nefes):** `translate3d` ve `scale` ile pürüzsüz dikey salınım ve nefes alma döngüsü (6s süreli yumuşak `cubic-bezier(0.4, 0, 0.2, 1)` eğrisi); eşzamanlı olarak `filter: hue-rotate(360deg)` (12s süreli lineer) ile 003'te tanımlanan OKLCH gradyanının tüm renk tayfında döngüsel akması. *(Seçilen Yaklaşım)*.
- **Alternatif C (Dijital Glitch Animasyonu):** `steps()` zamanlama fonksiyonuyla kesintili glitch sıçramaları.
- **Seçim Gerekçesi:** Alternatif B, metnin okunabilirliğini ve görsel zarafetini bozmadan iki farklı zamanlama eksenini (nefes alma + renk rotasyonu) kusursuzca harmanlar.

## 4. Kullanılan Önceki Teknolojiler
- **001 (Yalın Semantik HTML):** Semantik `main` ve `h1` iskeleti.
- **002 (CSS Flexbox & Akışkan Tipografi):** `display: flex`, `100dvh` ve `clamp()` ölçeklemesi.
- **003 (CSS Custom Properties & OKLCH):** `:root` değişkenleri ve `background-clip: text` gradyan dolgusu.

## 5. Teknolojik Soy Ağacı Bağlantıları
- `001 (Semantik HTML)` ──> `002 (Flexbox)` ──> `003 (CSS Değişkenleri & OKLCH)` ──> `004 (CSS Keyframe Animasyonları)`.
- Önceki üç deneyin tüm kazanımları korunarak kinetik hareket katmanı eklenmiştir.

## 6. Mimari ve Uygulama Özeti
- Dosya: `src/004.html`
- Kod Yapısı:
  - `@keyframes float-pulse`: 6 saniyelik çift yönlü (`alternate`) nefes ve süzülme animasyonu.
  - `@keyframes spectrum-cycle`: 12 saniyelik kesintisiz (`infinite linear`) renk çarkı rotasyonu.
  - `@keyframes badge-glow`: Rozet sınırında ritmik parıltı akışı.
  - `will-change: transform, filter`: Tarayıcının kompozitör katmanını optimize ederek CPU render yükünü sıfırlama.

## 7. Doğrulama ve Test Sonuçları
- `validate.sh`: PASS
- `dependency-check.sh`: PASS
- `browser-test.sh`: PASS (Çok kanallı doğrulama)
  - `DOM_VISIBILITY`: PASS
  - `GRAPHICS_RENDER`: NOT_APPLICABLE
  - `RUNTIME`: PASS (0 hata)
  - `NETWORK`: PASS (0 harici istek)
  - `PERMISSIONS`: PASS (0 izin talebi)
- Yerel Sunucu URL: `http://localhost:7373/004.html`

## 8. Ekran Görüntüsü ve Önceki Deneylerle Karşılaştırma
- Ekran Görüntüsü: `reports/004/screenshot.png` (1280x800)
- Karşılaştırma:
  - 001: Statik siyah-beyaz serif metin.
  - 002: Statik beyaz sans-serif metin.
  - 003: Statik mor-eflatun gradyanlı metin.
  - 004: Zaman boyutunda yaşayan, zenginleşen dinamik OKLCH spektrumu ve derinlikli süzülme hissi veren kinetik tipografi.

## 9. Bilinen Sınırlamalar
- Animasyon saf CSS ile oluşturulmuştur; kullanıcı fare hareketlerine veya tıklamalarına tepki vermez (etkileşim API'leri sonraki deneylerde eklenecektir).

## 10. Sonuç ve Kaynaklar
- **Sonuç:** CSS Keyframe Animasyonları başarıyla doğrulanmış ve tipografik etki kanıtlanmıştır.
- **Kaynaklar:**
  - [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)
  - [MDN @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)
  - [W3C CSS Animations Level 1](https://www.w3.org/TR/css-animations-1/)
