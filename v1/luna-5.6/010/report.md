# Deney 010 — İlk çizimden sonra Hello World

## Amaç

Tarayıcının ilk paint zamanlamasını `PerformanceObserver` ile izlemek ve ölçülen değeri Hello World'ün altındaki vurgu çizgisinin genişliğine bağlamak.

## Üç aday fikir ve seçim

1. **İlk çizimden sonra — PerformanceObserver + CSS custom properties:** Paint timing girdisi geldiğinde ilk paint milisaniyesi CSS `--paint-progress` değerine çevrilir; Hello World alt çizgisi ve durum etiketi gerçek render ölçümünü gösterir.
2. **Bağlanan başlık — CSS Anchor Positioning:** Teknik işaretler, Hello World kutusuna anchor üzerinden bağlanır; pencere boyutuna göre metni takip eder. Destek durumu ve CSSOM kanıtı tarayıcı sürümüne daha bağlıdır.
3. **Öncelikli selam — `scheduler.postTask` + DOM state:** Başlık güncellemesi user-visible priority ile kuyruğa alınır; görev tamamlanma süresi görsel katmana aktarılır. Scheduler davranışı kısa sayfalarda anlamlı bir fark üretmeyebilir.

**Seçim:** Birinci fikir seçildi. PerformanceObserver çıktısı doğrudan Hello World'ün görsel sunumuna katkı verir ve ölçüm, deneyin kendi ilk çiziminden alınır.

## Teknolojik mekanizma

`PerformanceObserver` `{ type: "paint", buffered: true }` ile first-paint girdilerini izler. İlk uygun girdinin `startTime` değeri normalize edilerek `--paint-progress` custom property olarak yazılır; CSS bu değeri underline genişliği ve `PAINT ... MS` durum etiketinin görsel vurgusuna dönüştürür.

## Tasarım kararı

Koyu grafit terminal yüzeyi, asit yeşili ölçüm çizgisi ve sıcak beyaz tipografi kullanıldı. Hello World merkezde sabit odaktır; timing arayüzü metnin anlamını değil, tarayıcı tarafından çizilme anını görünür kılar.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/010.dev.html reports/010
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/010.html` olarak mühürlendi.

Gerçek sonuç:

```text
[SYNTAX]                PASS
[CSS]                   PASS
[DEPENDENCY]            PASS
[CONSOLE_ERROR]         PASS
[DOM_VISIBILITY]        PASS
[RUNTIME]               PASS
[NETWORK]               PASS
[PERMISSIONS]           PASS
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/010.dev.html reports/010
OK
```

## Ekran görüntüsü incelemesi

`reports/010/screenshot.png` 1280x800 olarak doğrudan incelendi. Sıcak beyaz `Hello World` yüksek kontrastla okunuyor; `PAINT / 76.00 MS` etiketi gerçek ölçüm değerini gösteriyor ve asit yeşili vurgu çizgisi metni destekliyor.

## İNSAN DOĞRULAMASI GEREKLİ

- **Somut özellik:** Gösterilen paint milisaniyesinin PerformanceObserver girdisinden gelmesi.
- **Neden otomatik olarak doğrulanamadı:** Tarayıcı testi runtime ve DOM görünürlüğünü doğrular, ancak timing değerini bağımsız beklenen performans girdisiyle karşılaştırmaz.
- **Mevcut teknik kanıt:** `paint` observer callback'i, DOM durum etiketi ve CSS custom property güncellemesi.
- **İnsan kontrolü:** `http://localhost:7878/010.html` adresini açın; `PAINT ... MS` değerinin oluştuğunu ve alt çizginin görünür bir genişlikte olduğunu kontrol edin.

`src/010.dev.html`, doğrulama ve görsel inceleme sonrasında `mv` ile `src/010.html` olarak mühürlendi; geliştirme dosyası artık mevcut değil.
