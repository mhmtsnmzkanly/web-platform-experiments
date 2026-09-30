# Deney 017 Günlüğü: Web Workers API ve Çok İş Parçacıklı Boids Sürü Tipografisi

Bu günlük, Deney 017 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 02:17] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- JavaScript normalde tek iş parçacıklı (single-threaded event loop) bir dildir; ağır matematiksel ve fiziksel hesaplamalar ana UI iş parçacığında yürütüldüğünde kare düşüşlerine (jank / frame drop) ve kullanıcı arayüzünün kilitlenmesine neden olur.
- Deney 017'de hedef: Tarayıcının çok çekirdekli donanım mimarisini doğrudan kullanmasını sağlayan **Web Workers API** (`new Worker`, `postMessage`, `Transferable ArrayBuffer`) standardını devreye almak.
- Temel amaç: Tek dosya kuralını ihlal etmeden satır içi Blob (`URL.createObjectURL(new Blob([...]))`) ile bağımsız bir arka plan işletim sistemi iş parçacığı oluşturmak; 4.000 adet otonom ajanın Reynolds Boids sürü fiziğini (Ayrılma, Uyum, Birleşme) ve "HELLO WORLD" hedef çekim vektörlerini bu arka plan çekirdeğinde hesaplamak; sıfır-kopyalama (zero-copy) ikili `Float32Array` tamponlarıyla ana iş parçacığına aktararak kusursuz 60 FPS grafik çıktısı elde etmektir.

### Tasarım Alternatifleri
1. **Alternatif A — Basit Arka Plan Sayacı:** Worker içinde sadece bir döngüde sayı artırmak. (Görsel ve tipografik değer oluşturmaz; yetersizdir).
2. **Alternatif B — Çok İş Parçacıklı Otonom Boids Sürüsü & Hello World Şekillendirme (Seçildi):**
   - Ana iş parçacığı: Görünmez bir tuvalde "HELLO WORLD" harflerini rasterize edip 4.000 adet hedef koordinatı örnekler (`targetX, targetY`).
   - Bu hedefler Worker iş parçacığına gönderilir.
   - Worker iş parçacığı: Ayrı bir CPU çekirdeğinde saniyede 60 fizik adımı (ticks) hesaplar. Her ajan komşularıyla sürü dinamiklerini (ayrılma, uyum, birleşme) korurken harflerin hedeflerine doğru uçar.
   - Koordinatlar `Float32Array(count * 4)` (x, y, vx, vy) tamponuna yazılır ve `postMessage(buffer, [buffer.buffer])` ile ana iş parçacığına sıfır-kopyalama ile iletilir.
   - Ana iş parçacığı: Alınan tamponu Canvas 2D üzerinde neon camgöbeği/altın parçacık izleri olarak çizer.
   - Arayüz Kontrolleri:
     - "Sürü Halinde Toplan (Flock to Hello World)"
     - "Şok Dalgasıyla Dağıt (Disperse Swarm)"
     - "Yerçekimsel Vorteks (Vortex Orbit)"
     - Ajan sayısı (1.000 - 5.000) ve sürü gücü kaydırıcıları.
     - Canlı Çift İş Parçacığı Telemetrisi: Main Render FPS vs. Worker Physics TPS.
3. **Alternatif C — Paylaşılan Bellek (SharedArrayBuffer):** Ekstra HTTP Cross-Origin-Opener-Policy başlıkları gerektirdiği için sade yerel sunucularda uyumluluk sorunları yaratabilir. Transferable ArrayBuffer ise evrensel ve güvenlidir.

### Karar ve Mimari Tercih
- Alternatif B seçildi. Sıfır harici bağımlılık ve tek dosya kuralı içinde Web Workers API'nin tüm gücünü ve modern çok iş parçacıklı hesaplama mimarisini sergiler; "Hello World" ifadesini canlı bir biyolojik sürü zekasıyla şekillendirir.

## [2026-09-29 02:23] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 doküman iskeleti, meta etiketleri, inline CSS ve V8 motoru ile JavaScript sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici ağ veya kütüphane bağımlılığı; satır içi Blob Web Worker kullanımı tek dosya kuralı içinde meşru olarak onaylandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<canvas>` ve `<div class="watermark-guide">` "HELLO WORLD" elemanları tam görünür.
  - Grafik Yüzeyi Çizimi: 1280x713px canvas üzerinde 3.600 parçacıklı aktif çizim doğrulandı.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi.
  - Yeni Teknoloji Denetimi: `Worker` iş parçacığı ve `Transferable ArrayBuffer` donanım çoklu çekirdeğinde 60 TPS hızında başarıyla doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/017/screenshot.png` oluşturuldu ve incelendi. Derin okyanus mavisi zemin üzerinde 3.600 biyolüminesans camgöbeği Boids parçacığının "HELLO WORLD" harflerini yoğun bir şekilde oluşturduğu, canlı çift iş parçacığı telemetrisi ve kontrol paneli kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/017.dev.html` tüm testleri başarıyla tamamladıktan sonra `src/017.html` olarak kalıcılaştırıldı.
- Deney 017 başarıyla tamamlandı.
