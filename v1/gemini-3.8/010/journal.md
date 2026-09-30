# Deney 010 Günlüğü: Pointer Events API ve Elastik Dokunuş

Bu günlük, Deney 010 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:26] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 009'da SVG filtre boru hattıyla piksel seviyesinde sıvı manipülasyonu incelendi.
- Deney 010'da, kullanıcı girdisinin tarayıcıdaki en gelişmiş birleşik standardı olan **Pointer Events API** hedeflenmiştir.
- Temel amaç: Eski fare (`MouseEvent`) ve dokunmatik (`TouchEvent`) API'lerinin parçalı yapısını ortadan kaldıran; fare, dokunmatik ekran ve dijital kalem (stylus) donanımlarını ortak bir arayüzde birleştiren Pointer Events özelliklerini (`setPointerCapture`, `pressure`, `tiltX`, `tiltY`, `pointerType`) elastik bir yay fiziğiyle "Hello World" harflerine uygulamak.

### Tasarım Alternatifleri
1. **Alternatif A — Basit İmleç Takibi (Hover / Follow):** İmlecin konumuna göre harflerin hafifçe dönmesi. (Pointer capture ve çoklu dokunma yeteneklerini sergilemez).
2. **Alternatif B — Elastik Çek-Bırak Tipografisi ve Çoklu İşaretçi Takibi (Seçildi):** "Hello World" ifadesini oluşturan harfler ayrı glif kutuları olarak düzenlenir. Kullanıcı herhangi bir harfe bastığında `setPointerCapture` ile işaretçi o harfe kilitlenir; hızlı hareketlerde bile imleç harfi asla kaçırmaz. Harf sürüklendikçe elastik bağ vektörü (`dx`, `dy`) ve işaretçi basıncı (`pressure`) harfin açısını ve ışımasını gerer. Bırakıldığında yaylanma fiziğiyle yuvasına titreşerek oturur. Telemetri paneli aktif işaretçi tipini (`mouse`, `touch`, `pen`), basınç değerini ve koordinatlarını gerçek zamanlı raporlar.
3. **Alternatif C — Çizim Tuvali:** Pointer events ile canvas üzerine imza atarak Hello World yazmak. (006 Canvas deneyine çok benzeyeceği için elendi).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Ziyaretçinin doğrudan harflerle fiziksel bir etkileşime girmesini sağlayarak Pointer Events API'nin teknik gücünü (özellikle pointer capture ve basınç verisini) en sezgisel ve eğlenceli şekilde kanıtlar.


## [2026-09-29 01:28] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/010.dev.html` geliştirildi:
   - "Hello World" ifadesi semantik `<h1>` ve her harfi bağımsız fiziksel `.letter-body` içeren yaylanma yuvaları (`.letter-slot`) olarak yapılandırıldı.
   - `touch-action: none` ile tarayıcının varsayılan hareketleri engellendi.
   - `pointerdown` esnasında `element.setPointerCapture(e.pointerId)` uygulanarak işaretçinin harfe kilitlenmesi sağlandı.
   - Euler yay-sönümleyici (spring-damper) fizik motoru ile harfin çekilme mesafesine göre rotasyon, esneme ve serbest bırakıldığında Hooke kanunu osilasyonu simüle edildi.
   - `e.pressure`, `e.pointerType` ve aktif işaretçi sayısını canlı raporlayan HUD telemetri paneli ve "Dağıt" patlama butonu eklendi.
2. Pipeline Çıktıları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, `<h1>` 808x109px)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
3. Yayımlama:
   - `src/010.dev.html` -> `src/010.html` olarak terfi ettirildi ve kilitlendi.
