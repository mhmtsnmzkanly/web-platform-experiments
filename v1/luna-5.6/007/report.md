# Deney 007 — Geçişte Hello World

## Amaç

View Transition API ile Hello World başlığının iki tipografik durumunu tek belge içinde bağlamak: ilk outline durumu, geçiş sonrası dolu mürekkep durumu.

## Üç aday fikir ve seçim

1. **Geçişte Hello World — View Transition API:** `document.startViewTransition()` bir durum sınıfı eklenmesini snapshot'lar; adlandırılmış `hello-title` view-transition pseudo-elements eski outline ve yeni dolu başlık arasında compositor geçişi yapar. Galeri duvarı estetiği üretir.
2. **Kaydırma hattı — CSS scroll-driven animation + `view-timeline`:** Başlık, sayfa kaydırıldıkça iki renkli bir yatay hatta dönüşür. Scroll bağımlılığı ve sabit viewport gözlemi ek etkileşim gerektirir.
3. **Ölçüm günlüğü — PerformanceObserver + CSS variables:** İlk paint ve layout ölçümleri CSS değişkenlerine aktarılır; Hello World harf aralığı ve çizgi kalınlığı performans verisine göre değişir. Görsel sonuç cihaz zamanlamasına bağımlı kalır.

**Seçim:** Birinci fikir seçildi. View Transition API, önceki deneylerdeki sürekli animasyonlardan farklı olarak bir belge durum değişimini tarayıcı snapshot compositor'ına devreder; Hello World'ün iki sunum biçimini doğrudan birbirine bağlar.

## Teknolojik mekanizma

Başlık `view-transition-name: hello-title` ile adlandırılır. Sayfa açıldıktan sonraki durum güncellemesi `document.startViewTransition()` içine alınır ve `settled` sınıfı başlığın outline görünümünü dolu mürekkep görünümüne çevirir. `::view-transition-old(hello-title)` ve `::view-transition-new(hello-title)` pseudo-elements geçiş süresini ve yönünü tanımlar.

## Tasarım kararı

Fildişi galeri duvarı, ultramarin çerçeve, siyah display başlık ve limon renkli ölçüm işaretleri kullanıldı. Hello World sabit odaktır; geçiş izi ve teknik etiketler yalnızca iki tipografik durum arasındaki farkı görünür kılar.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/007.dev.html reports/007
```

Doğrulama ve ekran görüntüsü incelemesi sonrasında geliştirme dosyası `src/007.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       NOT_APPLICABLE (DOM tipografisi)
[RUNTIME]               PASS
[NEW_TECHNOLOGY_ACTIVE] VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu tespit edildi)
[TEST_INFRASTRUCTURE]   PASS
./verify.sh src/007.dev.html reports/007
OK
```

## Ekran görüntüsü incelemesi

`reports/007/screenshot.png` 1280x800 olarak doğrudan incelendi. Final siyah `Hello World` başlığı tam ve yüksek kontrastla görünür; limon geçiş gölgesi metni örtmeden eski outline durumunu ima ediyor. Ultramarin çerçeve görsel odağı koruyor.

`src/007.dev.html`, `mv` ile `src/007.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
