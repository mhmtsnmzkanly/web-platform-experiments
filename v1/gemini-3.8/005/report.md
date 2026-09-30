# Deney 005 Raporu: SVG Vektörel Kontur Çizimi ve Geometrik Tipografi

## 1. Amaç
Bu deneyin amacı, HTML metin kutusu modelinin ötesine geçerek tarayıcının yerleşik SVG (Scalable Vector Graphics) 2D vektör motorunu devreye sokmak; `Hello World` ifadesini vektörel kontur çizimi (`stroke-dasharray`, `stroke-dashoffset`), lineer vektör gradyanları ve sonsuz çözünürlük ölçeklenebilirliği ile sunmaktır.

## 2. Yeni Teknoloji ve Özgünlük Gerekçesi
- **Yeni Teknoloji:** SVG 2 Vektörel Çizim Mimarisi (`<svg viewBox="...">`, `<defs>`, `<linearGradient>`, `<text>`, `stroke`, `stroke-dasharray`, `stroke-dashoffset`).
- **Özgünlük Gerekçesi:** 001–004 arasındaki deneyler saf HTML/CSS tipografisiydi. 005, tarayıcının doğrudan 2D vektör çizim motorunu devreye sokar. Harflerin konturları matematiksel vektör yolları olarak işlenir ve kontur çizim fiziği (`stroke-dashoffset`) ile harfler kendiliğinden çizilir.

## 3. Üç Alternatif ve Seçilen Tasarım
- **Alternatif A (Minimal SVG Outline):** Yalnızca tek renkli ince kontur çizgisi.
- **Alternatif B (Neon Kontur Vektör Tipografisi):** SVG `<defs>` içinde tanımlı canlı vektörel gradyan (`#svg-grad`), çift katmanlı neon kontur, `stroke-dashoffset` ile 4 saniyede kendiliğinden beliren kaligrafik çizim ve ardından gelen yarı saydam iç dolgu. *(Seçilen Yaklaşım)*.
- **Alternatif C (Doğrudan Path Yolları):** Her harfi elle çizilmiş `<path d="...">` olarak vektörize etme.
- **Seçim Gerekçesi:** Alternatif B, SVG `<text>` etiketinin erişilebilirliğini ve vektörel kontur animasyonunun zarafetini en yüksek kontrastla sunar.

## 4. Kullanılan Önceki Teknolojiler
- **001 (Yalın Semantik HTML):** Semantik `<main>` iskeleti.
- **002 (CSS Flexbox):** SVG öğesini ekran merkezinde konumlandıran `display: flex`, `100dvh` sahnesi.
- **003 (CSS Custom Properties):** Kök tema değişkenleri.
- **004 (CSS Keyframe Animasyonları):** SVG kontur kaydırmasını yöneten `@keyframes stroke-draw` animasyonu.

## 5. Teknolojik Soy Ağacı Bağlantıları
- `001` ──> `002` ──> `003` ──> `004` ──> `005 (SVG Vektör Çizimi)`.
- DOM metninden vektörel geometriye sıçrama yapılmış; Flexbox sahnesi ve CSS animasyonları bu yeni vektörel yüzeyle birleştirilmiştir.

## 6. Mimari ve Uygulama Özeti
- Dosya: `src/005.html`
- Kod Yapısı:
  - `<svg viewBox="0 0 1000 260" class="vector-stage">`
  - `<defs>` içinde `<linearGradient id="neon-grad">` ile açılı renk geçişi.
  - `<text class="vector-text">Hello World</text>`:
    - `stroke: url(#neon-grad)`
    - `stroke-width: 2.5`
    - `stroke-dasharray: 600`
    - `stroke-dashoffset` animasyonu ile pürüzsüz vektörel beliriş.

## 7. Doğrulama ve Test Sonuçları
- `validate.sh`: PASS
- `dependency-check.sh`: PASS
- `browser-test.sh`: PASS (Çok kanallı doğrulama)
  - `DOM_VISIBILITY`: PASS (SVG `<text>` elemanı doğrulanır)
  - `GRAPHICS_RENDER`: NOT_APPLICABLE
  - `RUNTIME`: PASS (0 hata)
  - `NETWORK`: PASS (0 harici istek)
  - `PERMISSIONS`: PASS (0 izin talebi)
- Yerel Sunucu URL: `http://localhost:7373/005.html`

## 8. Ekran Görüntüsü ve Önceki Deneylerle Karşılaştırma
- Ekran Görüntüsü: `reports/005/screenshot.png` (1280x800)
- Karşılaştırma:
  - 001: Sade siyah serif metin.
  - 002: Beyaz sans-serif blok metin.
  - 003: OKLCH gradyan dolgulu metin.
  - 004: Hareketli renk rotasyonu.
  - 005: Kusursuz vektörel keskinlikte, ışıklı neon konturlarla çizilmiş SVG tipografisi.

## 9. Bilinen Sınırlamalar
- Deney SVG vektörel ortamında çalışmaktadır; henüz piksel tabanlı Canvas manipülasyonu içermemektedir (Canvas bir sonraki deneyde ele alınacaktır).

## 10. Sonuç ve Kaynaklar
- **Sonuç:** SVG 2 vektörel çizim motoru başarıyla doğrulanmış ve tipografik etkisi kanıtlanmıştır.
- **Kaynaklar:**
  - [MDN SVG: Scalable Vector Graphics](https://developer.mozilla.org/en-US/docs/Web/SVG)
  - [MDN stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)
  - [W3C SVG 2 Specification](https://www.w3.org/TR/SVG2/)
