# Deney 005 — Kesit içinden Hello World

## Amaç

`Hello World` ifadesini görünürlük kesişimiyle tetiklenen bir CSS geometrik reveal olarak sunmak; metni önceki deneylerin doğrudan çizim ve karakter animasyonu yüzeylerinden ayırmak.

## Üç aday fikir ve seçim

1. **Kesit içinden — IntersectionObserver + CSS `clip-path`:** Panel viewport ile kesiştiğinde observer `.is-visible` sınıfını ekler; CSS clip-path metni soldan açar ve ince cursor çizgisi sürekli titreşir. Hello World, minimal bir editoryal pencerenin içeriği gibi görünür.
2. **Zamanın içinden — CSS scroll-driven animation + `view-timeline`:** Metin, sayfa kaydırıldıkça bir dikey kolonun içinden maskelenerek çıkar. Güçlü bir modern CSS kombinasyonudur ancak sabit viewport doğrulamasında kaydırma olayı üretmek gerekir.
3. **Paylaşılan selam — Web Share API + DOM state:** Kullanıcı etkileşimiyle paylaşım paneli açılır ve Hello World metni durum değişimine göre yeniden düzenlenir. İzin/panel davranışı ve kullanıcı jesti gerektirdiği için sıfır-izin ilkesine uygun birincil deney olamaz.

**Seçim:** Birinci fikir seçildi. Observer'ın ürettiği olay, dekoratif olarak kaydedilmek yerine doğrudan clip-path görünürlük geometrisini başlatıyor; CSS animasyonu ise test motorunun çalışan teknoloji kanıtını destekliyor. Tasarım 004'ün yoğun kinetik karakter ritminden daha sakin ve mekânsal.

## Teknolojik mekanizma

`IntersectionObserver` panelin viewport ile kesişim oranını izler. `isIntersecting` olduğunda panel `.is-visible` sınıfını alır; bu sınıf `clip-path: inset(0 0 0 0)` animasyonunu başlatır. Reveal tamamlandıktan sonra cursor çizgisi sonsuz ve düşük genlikli CSS animasyonuyla hareket eder.

## Tasarım kararı

Sis grisi zemin, kömür metin ve neon turuncu işaretler kullanıldı. Hello World dikey bir editoryal pencerenin merkezinde tutuldu; kesim çizgileri metnin etrafında teknik bir çerçeve oluşturuyor ancak okunabilirliği azaltmıyor.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/005.dev.html reports/005
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/005.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (DOM tipografisi)
[NEW_TECHNOLOGY_ACTIVE] VERIFIED (Aktif çalışan 1 adet Web/CSS animasyonu tespit edildi)
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/005.dev.html reports/005
OK
```

## Ekran görüntüsü incelemesi

`reports/005/screenshot.png` 1280x800 olarak doğrudan incelendi. Reveal tamamlandıktan sonra `Hello World` tamamen görünür ve yüksek kontrastlı; turuncu cursor çizgisi metni örtmüyor, köşe işaretleri kesit kompozisyonunu destekliyor.

İlk 1.6 saniyelik reveal süresi otomatik ekran görüntüsünde son harfi kısmen görünmez bırakabildiği için 0.8 saniyeye indirildi. Yeniden doğrulama ve görsel inceleme sonrası final görüntü tam okunaklıdır.

`src/005.dev.html`, `mv` ile `src/005.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
