# Deney 003 Raporu: CSS Custom Properties ve OKLCH Algısal Renk Uzayı ile Işıltılı Tipografi

## 1. Amaç
Bu deneyin amacı, CSS Custom Properties (CSS Değişkenleri) mimarisini ve modern algısal renk uzayı `oklch()` fonksiyonlarını kullanarak, `Hello World` ifadesini parametrik, değişkenler üzerinden dinamik renk uyumu hesaplanan ve yüksek görsel derinliğe sahip ışıltılı bir tipografik odağa dönüştürmektir.

## 2. Yeni Teknoloji ve Özgünlük Gerekçesi
- **Yeni Teknoloji:** CSS Custom Properties (`--hue`, `--chroma`, `--primary`, `--glow`, `var()`) ve Algısal Renk Uzayı (`oklch()`) + `background-clip: text`.
- **Özgünlük Gerekçesi:** 001'de stil yoktu; 002'de statik renk değerleri (`#ffffff`, `#0a0a0c`) kullanıldı. 003'te tüm renk ve ışık paleti tek bir kök renk açısı (`--base-hue`) üzerinden algısal olarak eşit parlaklık sunan `oklch()` formülleriyle türetilir. Tarayıcının CSS değişken basamaklandırma (cascading) ve miras alma (inheritance) motoru ilk kez test edilir.

## 3. Üç Alternatif ve Seçilen Tasarım
- **Alternatif A (Minimal Değişkenli Tema):** Yalnızca `--bg` ve `--fg` değişkenleriyle açık/koyu mod.
- **Alternatif B (OKLCH Gradyan Işıltısı ve Değişken Parametreli Tipografi):** Kök düzeyde tanımlı `--base-hue: 260` (mor-mavi spektrum) etrafında harmonik tonlar türeten CSS değişken sistemi; `background-clip: text` ile harf gövdesine dökülen OKLCH gradyanı ve değişken parametreli ışıma efektleri. *(Seçilen Yaklaşım)*.
- **Alternatif C (Harf İndisli Spektrum):** Inline `--i` değişkenleriyle her harfe ayrı ton.
- **Seçim Gerekçesi:** Alternatif B, CSS değişkenlerinin matematiksel renk fonksiyonlarıyla (`oklch`) nasıl pürüzsüz ve algısal olarak tutarlı tipografik geçişler ürettiğini doğrudan Hello World harfleri üzerinde kanıtlar.

## 4. Kullanılan Önceki Teknolojiler
- **001 (Yalın Semantik HTML):** Semantik `main` ve `h1` etiket yapısı.
- **002 (CSS Flexbox & Akışkan Tipografi):** `display: flex`, `align-items`, `justify-content` ve `clamp()` akışkan boyutlandırması.

## 5. Teknolojik Soy Ağacı Bağlantıları
- `001 (Semantik HTML)` ──> `002 (CSS Flexbox)` ──> `003 (CSS Custom Properties & OKLCH)`.
- 001 iskeleti ve 002 yerleşimi, 003'te parametrik renk ve ışık motoruyla birleşir.

## 6. Mimari ve Uygulama Özeti
- Dosya: `src/003.html`
- Kod Yapısı:
  - `:root` bloğunda temel matematiksel değişkenler: `--base-hue`, `--chroma`, `--lightness`, `--primary`, `--secondary`, `--accent`.
  - Harf gövdesinde `background-image: linear-gradient(...)`, `-webkit-background-clip: text`, `color: transparent`.
  - Rozet ve sahne zemininde `color-mix()` ve değişken tabanlı transparan parlama katmanları.
  - Sıfır harici kütüphane, sıfır ağ yüklemesi.

## 7. Doğrulama ve Test Sonuçları
- `validate.sh`: PASS
- `dependency-check.sh`: PASS
- `browser-test.sh`: PASS (Çok kanallı doğrulama)
  - `DOM_VISIBILITY`: PASS
  - `GRAPHICS_RENDER`: NOT_APPLICABLE
  - `RUNTIME`: PASS (0 hata)
  - `NETWORK`: PASS (0 harici istek)
  - `PERMISSIONS`: PASS (0 izin talebi)
- Yerel Sunucu URL: `http://localhost:7373/003.html`

## 8. Ekran Görüntüsü ve Önceki Deneylerle Karşılaştırma
- Ekran Görüntüsü: `reports/003/screenshot.png` (1280x800)
- Karşılaştırma:
  - 001: Beyaz zemin, siyah serif metin.
  - 002: Düz beyaz sans-serif metin, siyah zemin.
  - 003: Canlı OKLCH mor-eflatun-cyan gradyanı ile ışıldayan, değişken parametreli yumuşak dış gölgeye sahip büyüleyici tipografi.

## 9. Bilinen Sınırlamalar
- Renkler statik CSS değişkenleriyle üretilmiştir; henüz JavaScript etkileşimiyle veya CSS animasyon döngüsüyle hareketlendirilmemiştir (bunlar sonraki deneylerin konusudur).

## 10. Sonuç ve Kaynaklar
- **Sonuç:** CSS Custom Properties ve modern OKLCH renk uzayı başarıyla doğrulanmıştır.
- **Kaynaklar:**
  - [MDN Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
  - [MDN oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
  - [W3C CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
