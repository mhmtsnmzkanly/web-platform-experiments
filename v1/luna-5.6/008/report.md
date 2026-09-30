# Deney 008 — İçeriğin renk portresi: Hello World

## Amaç

Web Crypto API ile `Hello World` metninin SHA-256 özetini hesaplamak ve özetteki byte değerlerini CSS renklerine dönüştürerek ifadenin kendi içeriğinden türeyen bir görsel kimlik üretmek.

## Üç aday fikir ve seçim

1. **İçeriğin renk portresi — Web Crypto API + CSS custom properties:** SHA-256 digest byte'ları HSL renklerine dönüştürülür; başlık gradyanı, zemin halesi, çizgiler ve renk kartuşları bu değerleri kullanır. Aynı ifade her zaman aynı deterministik portreyi üretir.
2. **Temaya uyarlanan selam — MediaQueryList + CSS variables:** `prefers-color-scheme` ve `prefers-contrast` sonuçları Hello World'ün palette ve ağırlığını değiştirir. Kullanıcı ortamına duyarlı olurdu ancak sabit doğrulama makinesinde yalnızca tek dal kanıtlanabilirdi.
3. **Ölçülen ilk iz — PerformanceObserver + CSS variables:** Paint ve layout timing girdileri renk doygunluğu ile harf aralığına bağlanır. Cihaz ve yük durumuna bağlı nondeterministik sonuçlar üreteceği için daha zayıf bir laboratuvar referansı olurdu.

**Seçim:** Birinci fikir seçildi. Web Crypto çıktısı, Hello World'ün dekoratif çevresinden değil doğrudan ifadenin byte temsilinden gelir; API sonucu CSS'e gerçek veri akışıyla bağlanır ve deterministik olarak yeniden üretilebilir.

## Teknolojik mekanizma

`TextEncoder` metni UTF-8 byte dizisine çevirir. `crypto.subtle.digest("SHA-256", bytes)` Promise'i 32 byte özet döndürür. İlk byte'lar farklı HSL hue, saturation ve lightness değerlerine dönüştürülür; `document.documentElement.style.setProperty()` bu renkleri CSS custom property olarak yayınlar.

## Tasarım kararı

Sıcak açık zemin üzerinde büyük koyu Hello World, digest'ten türetilen mercan-turkuaz-menekşe renk alanıyla çevrelendi. Üç küçük kartuş aynı byte akışını görünür kılar; hash etiketi, görsel kimliğin kaynağını açıkça belgeler.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/008.dev.html reports/008
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/008.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[CONSOLE_ERROR]         PASS
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (DOM tipografisi)
[RUNTIME]               PASS
[NEW_TECHNOLOGY_ACTIVE] REVIEW_REQUIRED
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/008.dev.html reports/008
OK
```

## Ekran görüntüsü incelemesi

`reports/008/screenshot.png` 1280x800 olarak doğrudan incelendi. Siyah `Hello World` yüksek kontrastla okunuyor; digest'ten türetilen üç renk kartuşu, gölgeler ve arka plan halesi aynı veri akışını görünür kılıyor. Hash etiketi metni ikinci plana atmıyor.

## İNSAN DOĞRULAMASI GEREKLİ

- **Somut özellik:** Renklerin gerçekten SHA-256 digest'ten türetilmesi.
- **Neden otomatik olarak doğrulanamadı:** Tarayıcı testi DOM ve CSS render'ını doğrular, ancak async Web Crypto byte çıktısını bağımsız olarak beklenen hash ile karşılaştırmaz.
- **Mevcut teknik kanıt:** Sayfa içindeki digest etiketi, üç renk kartuşu ve CSS custom property güncellemeleri; statik bağımlılık ve runtime testleri.
- **İnsan kontrolü:** `http://localhost:7373/008.html` adresini açın, görünen digest'i aynı metnin SHA-256 özetiyle karşılaştırın; kartuş ve arka plan renklerinin digest'ten türediğini gözlemleyin.

`src/008.dev.html`, doğrulama ve görsel inceleme sonrasında `mv` ile `src/008.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
