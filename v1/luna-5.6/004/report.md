# Deney 004 — Kinetik indeks: Hello World

## Amaç

`Hello World` ifadesini karakterlerine ayırıp Web Animations API ile bağımsız ritimler vermek; CSS Properties & Values API ile kayıtlı custom property değerlerini doğrudan CSS transform ve gölge hesaplarına bağlamak.

## Üç aday fikir ve seçim

1. **Kinetik indeks — Web Animations API + CSS `registerProperty`:** Her karakter için WAAPI sonsuz keyframe akışı, `CSS.registerProperty()` ile typed olarak tanımlanan `--lift` değerini üretir; CSS bu değeri karakterin yükselmesine ve gölgesine dönüştürür. Swiss grid ve teknik ölçüm işaretleri, hareketli metni bir tasarım sistemi numunesi gibi sunar.
2. **Kesilen cümle — CSS mask + `clip-path` + IntersectionObserver:** Görünürlük oranı gözlemlenen kutunun viewport kesişimine göre değişir; Hello World bir editoryal kolonun içinden açılır. API ilişkisi anlamlıdır, ancak sabit ekran görüntüsünde gözlem akışı sınırlı kanıt üretir.
3. **Duyulan yazı — Web Audio AnalyserNode + CSS variables:** Kullanıcı izni istemeden üretilen sentetik osilatör spektrumu, harflerin genişliğini ve ışık yoğunluğunu sürer. Ses API'si tarayıcı politikaları ve otomatik ses durumu nedeniyle daha belirsiz bir doğrulama yüzeyi oluşturur.

**Seçim:** Birinci fikir seçildi. 003'ün SVG yüzeyinden farklı olarak doğrudan DOM tipografisi üzerinde çalışır; `CSS.registerProperty()` ile WAAPI arasında gerçek typed veri akışı vardır ve test motoru çalışan Web Animations API efektini doğrudan kanıtlayabilir.

## Teknolojik mekanizma

`CSS.registerProperty()` çağrısı, `--lift` değişkenini `<length>` olarak kaydeder. JavaScript, her harfte `Element.animate()` çağırarak `--lift` değerini `0px → -18px → 0px` arasında döndürür. CSS `transform: translateY(var(--lift))` ve `text-shadow` bu değeri kullanır; gecikmeler, metnin tek bir blok yerine dalga halinde hareket etmesini sağlar.

## Tasarım kararı

Kırık beyaz mat zemin, siyah büyük grotesk harfler, kobalt grid ve kırmızı kayıt işaretleri kullanıldı. Hello World ekranın merkezinde en büyük görsel ağırlığı taşır; teknik etiketler yalnızca ritmi ve ölçü fikrini çerçeveler.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/004.dev.html reports/004
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/004.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (DOM tipografisi)
[NEW_TECHNOLOGY_ACTIVE] VERIFIED (Aktif çalışan 10 adet Web/CSS animasyonu tespit edildi)
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/004.dev.html reports/004
OK
```

## Ekran görüntüsü incelemesi

`reports/004/screenshot.png` 1280x800 olarak doğrudan incelendi. Kırık beyaz yüzeyde büyük siyah `Hello World` yüksek kontrastla okunuyor; kobalt ölçüm çizgileri ve gölgeler karakter ritmini çerçeveliyor, metni bastırmıyor.

İlk uygulamada doğrulama motoru CSS `@property` descriptor'larını hatalı biçimde geçersiz CSS olarak raporladı. Typed custom property kaydı `CSS.registerProperty()` içine taşındı; görsel mekanizma korundu ve yeniden doğrulama `OK` verdi.

`src/004.dev.html`, `mv` ile `src/004.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
