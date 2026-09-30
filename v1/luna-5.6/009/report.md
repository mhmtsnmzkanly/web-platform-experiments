# Deney 009 — Ortama uyarlanan Hello World

## Amaç

`MediaQueryList` sonuçlarını doğrudan Hello World'ün görsel durumuna bağlamak; viewport genişliği ve renk şeması değiştiğinde başlığın kompozisyon, ağırlık ve kontrastını birlikte güncellemek.

## Üç aday fikir ve seçim

1. **Ortama uyarlanan selam — MediaQueryList + CSS custom properties:** Genişlik ve `prefers-color-scheme` sorguları `data-mode` durumunu günceller; CSS bu durumu başlığın ölçüsü, grid yoğunluğu ve renk değişkenlerine çevirir. Aynı Hello World ifadesi cihaz bağlamına göre farklı ama okunabilir bir poster olur.
2. **Kontrast laboratuvarı — CSS `color-contrast()` + `light-dark()`:** CSS motoru arka plana göre en okunur mürekkep rengini seçer. Yeni deklaratif renk kabiliyeti ilginçtir, ancak destek ve CSSOM kanıtı tarayıcı sürümüne daha bağımlıdır.
3. **Yük ölçüsünde selam — PerformanceObserver + CSS variables:** Paint timing sonuçları başlığın harf aralığı ve çizgi yoğunluğunu belirler. Cihaz yükü değişken olduğu için deterministik görsel karşılaştırma zayıflar.

**Seçim:** Birinci fikir seçildi. MediaQueryList hem ölçülebilir bir tarayıcı olayı hem de kullanıcı tercihi girdisi sağlar; olay çıktısı doğrudan Hello World'ün görsel ağırlığına ve kompozisyonuna akar.

## Teknolojik mekanizma

`matchMedia("(min-width: 900px)")` ve `matchMedia("(prefers-color-scheme: dark)")` iki `MediaQueryList` nesnesi üretir. `applyMode()` her iki `matches` değerini `data-mode` olarak köke yazar; `change` olayları aynı fonksiyonu yeniden çalıştırır. CSS, `wide-light`, `compact-light`, `wide-dark` ve `compact-dark` durumlarını başlık font boyutu, letter-spacing, panel rengi ve ölçüm çizgileriyle eşler.

## Tasarım kararı

Swiss grid yaklaşımı, mat ekran zeminleri ve kobalt/kireç vurgu renkleri kullanıldı. Hello World her durumda en büyük görsel öğe kalır; adaptasyon, ifadenin okunabilirliğini bozmak yerine bağlama göre daha sıkı veya daha ferah bir ritim verir.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/009.dev.html reports/009
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/009.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[CONSOLE_ERROR]         PASS
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (DOM tipografisi)
[RUNTIME]               PASS
[NEW_TECHNOLOGY_ACTIVE] REVIEW_REQUIRED
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/009.dev.html reports/009
OK
```

## Ekran görüntüsü incelemesi

Doğrulama sonrası `reports/009/screenshot.png` doğrudan açılacak. Varsayılan viewport durumunda Hello World kontrastı, mod etiketi ve adaptif çizgiler kontrol edilecek.

## İNSAN DOĞRULAMASI GEREKLİ

- **Somut özellik:** Pencere genişliği veya renk şeması değiştiğinde MediaQueryList `change` olayının Hello World görünümünü güncellemesi.
- **Neden otomatik olarak doğrulanamadı:** Headless test tek bir viewport ve tek renk şemasıyla çalışır; iki alternatif medya dalını aynı oturumda tetiklemez.
- **Mevcut teknik kanıt:** `data-mode` güncellemesi, runtime hatasızlığı ve varsayılan mod ekran görüntüsü.
- **İnsan kontrolü:** `http://localhost:7373/009.html` adresini açın; pencereyi 900px altına indirip genişletin ve sistem koyu/açık tema tercihini değiştirin; başlık boyutu, aralık ve renklerin güncellendiğini gözlemleyin.

`reports/009/screenshot.png` 1280x800 olarak doğrudan incelendi. Varsayılan geniş-açık modda siyah `Hello World` tam okunuyor; kobalt gölge, kireç ölçüm çizgileri ve adaptif panel kompozisyonu metni destekliyor.

`src/009.dev.html`, `mv` ile `src/009.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
