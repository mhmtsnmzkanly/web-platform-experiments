# Deney 006 Günlüğü: Canvas 2D API ve Parçacık Tipografisi

Bu günlük, Deney 006 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:13] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 005 ile tamamlanan SVG 2 vektörel çizim mimarisinin ardından, raster piksel tabanlı grafik işleme yeteneklerini laboratuvara kazandırmak üzere **HTML5 Canvas 2D API** seçildi.
- Temel amaç: Tarayıcının ham piksel manipülasyonu (`getImageData`), yüksek performanslı 2D render bağlamı (`CanvasRenderingContext2D`) ve donanımla senkronize çizim döngüsü (`requestAnimationFrame`) kullanarak "Hello World" ifadesini dinamik bir parçacık sistemiyle (particle typography) hayata geçirmek.

### Tasarım Alternatifleri
1. **Alternatif A — Temel Canvas 2D Metin ve Gölge:** `ctx.fillText()`, `ctx.strokeText()`, gradyanlar ve temel bulanıklık filtreleri. (Çok statik ve CSS/SVG deneylerine kıyasla sıradan).
2. **Alternatif B — Piksel Tabanlı Parçacık Tipografisi (Seçildi):** Arka planda gizli (offscreen) bir canvas üzerinde "Hello World" metni çizilip pikselleri `getImageData` ile taranır. Piksel koordinatları hedef konum olarak alınarak parçacık nesneleri (`Particle`) oluşturulur. Parçacıklar rastgele konumlardan başlayıp yaylanma (spring) ve sürtünme (friction) fiziği ile harf konumlarına toplanır. Fare/işaretçi yaklaştığında parçacıklar dağılır, uzaklaştığında tekrar orijinal "Hello World" formunu alır.
3. **Alternatif C — Prosedürel Matris Yağmuru (Digital Rain):** Canvas üzerinde düşen glifler arasında "Hello World" oluşturulması.

### Karar ve Mimari Tercih
- Alternatif B seçildi. Zira hem DOM/CSS dünyasının ötesinde piksel analizi ve fizik simülasyonunu kanıtlamakta, hem de "Hello World" odağını görsel olarak büyüleyici, 60fps akıcı ve interaktif bir deneyime dönüştürmektedir.
- Erişilebilirlik ve semantik bütünlük için `<canvas>` etiketi içine `Hello World` yedek metni ve `role="img" aria-label="Hello World Parçacık Simülasyonu"` öznitelikleri eklenecektir.


## [2026-09-29 01:14] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/006.dev.html` geliştirildi:
   - Offscreen Canvas ile "Hello World" metni çizildi, `getImageData` ile alfa haritası tarandı.
   - 3.102 adet fiziksel parçacık nesnesi (`Particle`) oluşturuldu.
   - Her parçacığa yaylanma (`spring: 0.05`), sönümleme (`friction: 0.88`) ve organik mikro salınım (`wobblePhase`) atandı.
   - `requestAnimationFrame` döngüsü ve hareket izi (motion blur trails: `rgba(5, 6, 11, 0.28)`) oluşturuldu.
   - İmleç etkileşimi (ters kare itme kuvveti) ve tıklama patlama efekti eklendi.
2. Görsel İnceleme ve İyileştirme:
   - İlk ekran görüntüsünde parçacıkların yayılım evresinde metnin difüz kaldığı tespit edildi.
   - Parçacıklar başlangıçta doğrudan harf hedeflerine konumlandırıldı ve örnekleme adımı 3px'e çekilerek tipografinin ilk andan itibaren jilet gibi keskin ve okunur olması sağlandı.
3. Doğrulama Pipeline Sonuçları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, Canvas aktif ve 1280x713px)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
4. Yayımlama:
   - `src/006.dev.html` -> `src/006.html` olarak terfi ettirildi ve kilitlendi.
