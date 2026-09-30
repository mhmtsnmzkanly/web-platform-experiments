# Deney 010 Raporu: Pointer Events API ve Elastik Fizik

## 1. Deney Özeti
- **Deney No:** 010
- **Teknoloji:** Pointer Events API (`setPointerCapture`, `hasPointerCapture`, `releasePointerCapture`, `pointerdown`, `pointermove`, `pointerup`, `pressure`, `pointerType`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (PASS)
- **Dosya:** [`src/010.html`](file:///home/duldul/Belgeler/hw_lab/src/010.html)

---

## 2. Hipotez ve Amaç
Fare (`mouse`), dokunmatik ekran (`touch`) ve kalem (`pen`) cihazları tarayıcıda geleneksel olarak farklı olay modelleriyle yönetilirken, Pointer Events API tüm bu girdileri tek bir donanım-bağımsız soyutlama katmanında toplar. `setPointerCapture` mekanizması sayesinde bir eleman yakalandığında, işaretçi sınırların dışına çıksa dahi olay akışı kesilmez. Amaç; "Hello World" ifadesini oluşturan harfleri bağımsız elastik yay nesnelerine dönüştürmek, işaretçi baskısı (`pressure`) ve konumunu gerçek zamanlı fizik simülasyonuna bağlamaktır.

---

## 3. Mimari ve Uygulama Detayları
- **Bağımsız Glif Fizik Modeli:** Her harf bir DOM `.letter-body` elemanına ve JavaScript `SpringLetter` sınıf örneğine bağlanmıştır. Konum sapması `(x, y)`, hız `(vx, vy)`, Hooke Kanunu yay sertliği (`stiffness: 0.085`) ve hız sönümleme (`damping: 0.80`) ile 60 FPS Euler entegrasyonu hesaplanır.
- **İşaretçi Kilitleme (`setPointerCapture`):** `pointerdown` anında `target.setPointerCapture(e.pointerId)` çağrılarak işaretçi o harfe kilitlenir. Bu sayede fare pencere dışına çıksa dahi `pointermove` ve `pointerup` olayları güvenle yakalanır.
- **Donanım Algılama ve Basınç:** İşaretçi tipi (`mouse`, `touch`, `pen`) ve basınç (`e.pressure`) bilgisi telemetri panelinde canlı gösterilir; basınca ve sürükleme mesafesine bağlı olarak harf rotasyonu (`x * 0.12deg`) ve elastik esneme (`scale`) dinamik olarak uygulanır.
- **Çoklu Dokunmatik (Multi-touch):** Birden fazla parmak aynı anda farklı harfleri bağımsızca sürükleyebilir (`Map<pointerId, ActiveData>`).

---

## 4. Test ve Doğrulama Bulguları

Çok kanallı doğrulama zinciri icra edilmiş ve tüm kategoriler başarıyla geçmiştir:

```
[SYNTAX]                PASS (validate.sh - HTML5 ve JS V8 sözdizimi geçerli)
[DEPENDENCY]            PASS (dependency-check.sh - Sıfır harici istek/kütüphane)
[DOM_VISIBILITY]        PASS (<h1> "Hello World" 808x109px görünür ve aktif)
[GRAPHICS_RENDER]       NOT_APPLICABLE (Saf DOM / Pointer Events fizik modeli)
[VISUAL_REVIEW]         PASS (Parlak ışıltılı harfler, elastik yuvalar, net telemetri)
[RUNTIME]               PASS (Sıfır konsol hatası veya istisna)
[NETWORK]               PASS (Sıfır yetkisiz ağ transferi)
[PERMISSIONS]           PASS (İzin gerektirmeyen tamamen yerleşik API)
[NEW_TECHNOLOGY_ACTIVE] PASS (Pointer Events ve setPointerCapture aktif)
```

---

## 5. Ekran Görüntüsü ve Görsel İnceleme

![Deney 010 Ekran Görüntüsü](screenshot.png)

Ekran görüntüsünde görüldüğü üzere:
- "Hello World" harfleri, parıltılı ışımasıyla sahnenin merkezinde bağımsız yuvalar halinde sıralanmıştır.
- Alt panelde `İşaretçi: mouse (Hazır)`, `Baskı: 0.00`, `Aktif Dokunuş: 0` göstergeleri yer almakta ve "Dağıt" butonu ile harflere fiziksel patlama impulsu verilebilmektedir.
