# Deney 006 — Shader alanında Hello World

## Amaç

WebGL fragment shader ile üretilen canlı renk alanını, DOM üzerinde görünen `Hello World` ifadesinin arka plan ve kontrast katmanına bağlamak.

## Üç aday fikir ve seçim

1. **Shader alanı — WebGL fragment shader:** GPU, zaman ve çözünürlük uniform'larıyla radyal ışık, dalgalı ızgara ve spektral renk geçişleri üretir; DOM Hello World bunun üzerinde yüksek kontrastlı bir odak olarak durur.
2. **İş parçacığı tuvali — OffscreenCanvas + Web Worker:** Çizim döngüsü Blob Worker içine taşınır; ana sayfa Hello World'ün ölçümünü iş parçacığına gönderir. Tek dosya içinde güçlü olurdu, ancak doğrulama motorunun worker içindeki piksel kanıtını ayrı ölçmesi daha belirsizdir.
3. **Spektral selam — Web Audio AnalyserNode + CSS variables:** Sentetik osilatörün analiz verisi CSS custom property'lerine aktarılır; Hello World genişliği ve ışıması frekans bantlarına göre değişir. Otomatik ses başlatma politikaları ve işitsel doğrulama görsel deney için risklidir.

**Seçim:** Birinci fikir seçildi. WebGL, 002'nin Canvas 2D çiziminden farklı olarak GPU fragment pipeline'ını kullanır; shader çıktısı doğrudan Hello World'ün kontrastını ve odak halesini taşıyan yüzeydir. Tarayıcı testinin WebGL piksel kanıtı bunu ölçülebilir kılar.

## Teknolojik mekanizma

İki üçgenlik tam ekran geometri, `u_time` ve `u_resolution` uniform'larını fragment shader'a taşır. Shader, normalize koordinatlarda radyal halkalar ve sinüzoidal renk akışları hesaplar. Her animation frame'de WebGL yeniden çizilir; DOM başlık, aynı sahnenin üst katmanında kalır.

## Tasarım kararı

Kömür siyahı zemin, elektrik moru, turkuaz ve sıcak pembe ışıklar kullanıldı. Büyük beyaz başlık merkezde sabit ve okunaklı tutuldu; GPU alanı onun arkasında derinlik ve hareket üretir, bağımsız bir dekorasyon olarak ayrışmaz.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/006.dev.html reports/006
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/006.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       PASS (WebGL yüzeyi)
[NEW_TECHNOLOGY_ACTIVE] REVIEW_REQUIRED
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/006.dev.html reports/006
OK
```

## Ekran görüntüsü incelemesi

`reports/006/screenshot.png` 1280x800 olarak doğrudan incelendi. WebGL alanı çok renkli ve derinlikli; beyaz `Hello World` yüksek kontrastla okunuyor, shader ışığı metni örtmüyor.

## İNSAN DOĞRULAMASI GEREKLİ

- **Somut özellik:** WebGL fragment shader'ın zaman ve çözünürlük uniform'larıyla ışık alanını her karede güncellemesi.
- **Neden otomatik olarak doğrulanamadı:** Tarayıcı testinin WebGL grafik kontrolü `PASS` verdi, ancak `[NEW_TECHNOLOGY_ACTIVE]` satırı WebGL için `REVIEW_REQUIRED` döndürdü; shader uniform akışını teknoloji kanıtı olarak ayrı raporlamıyor.
- **Mevcut teknik kanıt:** `GRAPHICS_RENDER PASS`, aktif WebGL canvas, çok renkli piksel render'ı ve `requestAnimationFrame` döngüsü; ekran görüntüsünde radyal spektral alan görünür.
- **İnsan kontrolü:** `http://localhost:7373/006.html` adresini açın; birkaç saniye bekleyin ve mor/turkuaz/pembe radyal alanın yavaşça değiştiğini, `Hello World` metninin merkezde sabit ve okunaklı kaldığını gözlemleyin.

`src/006.dev.html`, `mv` ile `src/006.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
