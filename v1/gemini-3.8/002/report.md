# Deney 002 Raporu: CSS Flexbox ve Akışkan Tipografi ile Esnek Odak

## 1. Amaç
Bu deneyin amacı, CSS Flexible Box Layout (Flexbox) biçimlendirme bağlamını ve modern akışkan tipografi fonksiyonlarını (`clamp()`, `100dvh`) kullanarak, `Hello World` ifadesini ekran boyutlarına duyarlı, esnek ve yüksek kontrastlı bir görsel/kavramsal odak noktası olarak sunmaktır.

## 2. Yeni Teknoloji ve Özgünlük Gerekçesi
- **Yeni Teknoloji:** CSS Flexible Box Layout Modülü (`display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`) ve Akışkan Tipografi Matematiksel Fonksiyonu (`font-size: clamp(...)`, `min-height: 100dvh`).
- **Özgünlük Gerekçesi:** Deney 001'de hiçbir stil kullanılmamış ve öğe tarayıcının varsayılan normal akışında sol üstte kalmıştır. Deney 002, tarayıcının esnek kutu hesaplama motorunu ve viewport'a göre pürüzsüz ölçeklenen matematiksel tipografi motorunu ilk kez devreye sokar.

## 3. Üç Alternatif ve Seçilen Tasarım
- **Alternatif A (Minimal Hizalama):** Yalnızca beyaz zemin üzerinde yatay ve dikey flex merkezlemesi.
- **Alternatif B (Akışkan Tipografi ve Koyu Tema Kontrastı):** Derin koyu zemin (`#0a0a0c`), `100dvh` dinamik viewport yüksekliği, `clamp(2.5rem, 8vw, 7rem)` ile viewporta göre akışkan ölçeklenen `Hello World` başlığı, esnek alt etiket hiyerarşisi ve modern tipografik harf aralığı. *(Seçilen Yaklaşım)*.
- **Alternatif C (Flex-Wrap ile Harf Kutuları):** Her bir harfin ayrı flex-item olarak sarılması.
- **Seçim Gerekçesi:** Alternatif B, Flexbox'ın eksen kontrolünü (`flex-direction: column`, `gap`) modern akışkan font formülüyle birleştirerek tipografik odağı en güçlü kılan ve görsel açıdan 001'den radikal biçimde ayrışan çözümdür.

## 4. Kullanılan Önceki Teknolojiler
- **001 (Yalın Semantik HTML):** Standart `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<main>` ve `<h1>` anlamsal iskeleti korunarak üzerine CSS Flexbox uygulanmıştır.

## 5. Teknolojik Soy Ağacı Bağlantıları
- `001 (Semantik HTML)` ──> `002 (CSS Flexbox & Akışkan Tipografi)`.
- 001'in anlamsal iskeleti, 002'de CSS düzen motoruyla zenginleştirilmiştir.

## 6. Mimari ve Uygulama Özeti
- Dosya: `src/002.html`
- Kod Yapısı:
  - `<style>` bloğu içerisinde CSS reset ve modern font ailesi tanımları (`system-ui`, sans-serif).
  - `<main class="stage">` elemanı flex kapsayıcısı olarak tanımlanmış, `100dvh` ile ekranı kaplayacak biçimde yapılandırılmıştır.
  - `<h1>Hello World</h1>` başlığı `clamp()` ile minimum 2.5rem, ideal 8vw ve maksimum 7rem aralığında ölçeklenir.
  - Sıfır harici font, sıfır dış bağımlılık; yalnızca yerleşik tarayıcı font ve düzen motorları.

## 7. Doğrulama ve Test Sonuçları
- `validate.sh`: PASS
- `dependency-check.sh`: PASS
- `browser-test.sh`: PASS (Çok kanallı doğrulama)
  - `DOM_VISIBILITY`: PASS
  - `GRAPHICS_RENDER`: NOT_APPLICABLE
  - `RUNTIME`: PASS (0 hata)
  - `NETWORK`: PASS (0 harici istek)
  - `PERMISSIONS`: PASS (0 izin talebi)
- Yerel Sunucu URL: `http://localhost:7373/002.html`

## 8. Ekran Görüntüsü ve Önceki Deneylerle Karşılaştırma
- Ekran Görüntüsü: `reports/002/screenshot.png` (1280x800)
- Karşılaştırma (001 vs 002):
  - 001: Beyaz zemin, varsayılan serif font, sol üst blok akışı, sabit küçük font.
  - 002: Derin siyah zemin (`#0a0a0c`), yüksek kontrastlı beyaz sans-serif tipografi, ekranın merkezinde iki eksenli flex hizalaması ve devasa akışkan `Hello World` vurgusu.

## 9. Bilinen Sınırlamalar
- Deney statiktir; henüz CSS animasyonu, JavaScript dinamizmi veya vektörel çizim içermemektedir (bu teknolojiler sonraki deneylerde sırayla ele alınacaktır).

## 10. Sonuç ve Kaynaklar
- **Sonuç:** CSS Flexbox ve akışkan tipografi yeteneği başarıyla uygulanmış ve doğrulanmıştır.
- **Kaynaklar:**
  - [MDN CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
  - [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
  - [W3C CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/)
