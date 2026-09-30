# Deney 003 — Hareketli baskı yüzeyinde Hello World

## Amaç

`Hello World` ifadesinin kendisine SVG filtreleri ve SMIL animasyonu uygulayarak, Canvas tabanlı 002'den farklı bir yüzey ve hareket dili oluşturmak.

## Üç aday fikir ve seçim

1. **Hareketli baskı — SVG filter primitives + SMIL:** `feTurbulence` ve `feDisplacementMap` filtreleri canlı bir lif/mürekkep dokusu üretir; SMIL animasyonu gürültü frekansını değiştirerek Hello World katmanını yavaşça titreştirir. Krem kâğıt ve kobalt-mor baskı kaymasıyla editoryal bir kapak görünümü oluşturur.
2. **Kaydırılan cümle — CSS scroll-driven animations + `view-timeline`:** Sayfa kaydırma ilerlemesi harflerin kırpılma alanını ve renk geçişini kontrol eder; Hello World uzun bir dikey posterin içinden açılır. Yeni CSS zaman çizelgesi güçlü olurdu, ancak sabit viewport testinde etkileşim kanıtı sınırlı kalır.
3. **Elastik harfler — Web Animations API + CSS custom properties:** Her kelime parçası bağımsız `KeyframeEffect` ile yaylanır; yazı geometrik olarak nefes alan bir başlığa dönüşür. DOM metni görünür kalırdı, fakat 002'nin sürekli parçacık hareketine daha yakın bir kinetik sonuç üretirdi.

**Seçim:** Birinci fikir seçildi. SVG filtreleri, 002'nin Canvas piksel çiziminden farklı bir yerleşik render katmanı sunuyor; SMIL çıktısı doğrudan Hello World yüzeyinin dokusunu değiştiriyor. Test motoru ayrıca SVG SMIL deklarasyonunu teknoloji kanıtı olarak tanıyabiliyor.

## Teknolojik mekanizma

Inline SVG içindeki `feTurbulence`, deterministik bir fraktal gürültü yüzeyi üretir. `feDisplacementMap`, bu yüzeyi Hello World'in kopya katmanının koordinatlarına uygular. SVG `animate`, `baseFrequency` değerini döngüsel olarak değiştirerek gürültü ve harf kenarlarının canlı ama yavaş bir baskı titreşimi göstermesini sağlar.

## Tasarım kararı

Krem kâğıt zemin, yoğun siyah ana harfler, kobalt baskı gölgesi ve küçük mercan işaretler kullanıldı. Asimetrik üst bilgi ve büyük merkezî kelime, Hello World'ü dekoratif yüzeyin önünde tutar; doku okunabilirliği bozmayacak düşük frekanslı bir hareketle sınırlandırıldı.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/003.dev.html reports/003
```

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (inline SVG metni)
[NEW_TECHNOLOGY_ACTIVE] VERIFIED (Aktif SVG SMIL animasyon deklarasyonu tespit edildi)
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/003.dev.html reports/003
OK
```

## Ekran görüntüsü incelemesi

`reports/003/screenshot.png` 1280x800 olarak doğrudan incelendi. Krem kâğıt yüzeyinde siyah `Hello World` yüksek kontrastla okunuyor; kobalt ve mercan kaymalar filtre katmanlarını görünür kılıyor. Asimetrik açıklama çizgileri metni ikinci plana atmıyor ve viewport'ta gereksiz kaydırma çubuğu bulunmuyor.

`src/003.dev.html`, `mv` ile `src/003.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
