# Deney 001 Raporu: Yalın Semantik HTML ile Başlangıç Referansı

## 1. Amaç
Bu deney, Hello World Lab projesinin sıfır noktası ve temel referansıdır. Herhangi bir CSS stili, JavaScript mantığı, harici kütüphane veya gelişmiş grafik teknolojisi içermeyen en yalın, anlamsal (semantic) HTML5 belgesi ile tarayıcıda doğrudan görünür ve tasarımın görsel/kavramsal odak noktası olan bir `Hello World` çıktısı üretmektir (geometrik merkez zorunlu değildir).

## 2. Yeni Teknoloji ve Özgünlük Gerekçesi
- **Yeni Teknoloji:** Yalın Semantik HTML5 Belge Mimarisi (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<h1>`, `<main>`).
- **Özgünlük Gerekçesi:** Tüm sonraki deneylerin teknolojik yenilik iddiaları bu başlangıç referansına kıyasla değerlendirilecektir. Tarayıcının varsayılan kullanıcı aracısı stil sayfası (user-agent stylesheet) ile render edilen saf metin sunumudur.

## 3. Üç Alternatif ve Seçilen Tasarım
- **Alternatif A (Minimal / Standart Başlık):** Tek bir `<main>` kapsayıcısı içerisinde `<h1>Hello World</h1>` başlığı. (Seçilen yaklaşım).
- **Alternatif B (Anlamsal Paragraf):** `<p>` ve `<strong>` etiketleriyle vurgulu sunum.
- **Alternatif C (Preformatted Metin):** `<pre>` etiketi ile ASCII formatında sunum.
- **Seçim Gerekçesi:** `PROMPT.md` Kural 1 & 6 uyarınca ilk deney `001` için yalın HTML referansı zorunludur. `<h1>` başlığı ve `<main>` anlamsal yapısı web erişilebilirliği (a11y) ve saf semantik standartlara en uygun temel omurgayı sunar.

## 4. Kullanılan Önceki Teknolojiler
Bu deney ilk referans olduğu için önceki bir deney teknolojisi bulunmamaktadır.

## 5. Teknolojik Soy Ağacı Bağlantıları
- Laboratuvarın başlangıç (kök) düğümüdür (`Root`).
- Sonraki tüm görsel, dinamik ve etkileşimli deneyler bu temel anlamsal iskelet üzerinden türeyecektir.

## 6. Mimari ve Uygulama Özeti
- Dosya: `src/001.html`
- Kod Yapısı:
  - `<!DOCTYPE html>` ile standart HTML5 modu.
  - `<meta charset="UTF-8">` ve `<meta name="viewport">` ile uyumluluk.
  - `<main>` anlamsal gövdesi içinde odak noktası olan `<h1>Hello World</h1>`.
  - Sıfır inline CSS, sıfır inline JavaScript.

## 7. Doğrulama ve Test Sonuçları
- `validate.sh`: PASS (HTML5 iskeleti ve sözdizimi doğrulandı)
- `dependency-check.sh`: PASS (Sıfır harici bağımlılık)
- `browser-test.sh`: PASS (DOM_VISIBILITY: PASS, RUNTIME: PASS, NETWORK: PASS, PERMISSIONS: PASS)
- Yerel Sunucu URL: `http://localhost:7373/001.html`

## 8. Ekran Görüntüsü ve Önceki Deneylerle Karşılaştırma
- Ekran Görüntüsü: `reports/001/screenshot.png` (1280x800)
- Karşılaştırma ve Konum İncelemesi: Başlangıç referansı olduğundan karşılaştırılacak önceki bir deney yoktur. Ekran görüntüsünde görüldüğü üzere beyaz zemin üzerinde tarayıcının varsayılan kullanıcı aracısı serif siyah `<h1>Hello World</h1>` başlığı sol üst blok akışında yer alır ve tasarımın mutlak görsel/kavramsal odak noktasıdır (ekranın geometrik ortasında yer alması gerekmez; bu yerleşim semantik HTML için tam ve doğrudur).

## 9. Bilinen Sınırlamalar
- Herhangi bir görsel hizalama (flexbox/grid) veya tipografik stil uygulanmadığından, tarayıcının varsayılan kenar boşluklarıyla sol üst blok akışında konumlanır. Bu durum bir hata değil, müdahalesiz semantik referansın doğal sonucudur.

## 10. Sonuç ve Kaynaklar
- **Sonuç:** Hello World Lab için sıfır noktası referansı başarıyla oluşturulmuş ve doğrulanmıştır.
- **Kaynaklar:**
  - [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
  - [MDN HTML: HyperText Markup Language](https://developer.mozilla.org/en-US/docs/Web/HTML)
