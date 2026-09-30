# Deney 007 Günlüğü: Web Animations API (WAAPI)

Bu günlük, Deney 007 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:16] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 004'te CSS `@keyframes` kuralları ile stil tabanlı bildirimsel animasyonlar, Deney 006'da ise Canvas 2D üzerinde prosedürel `requestAnimationFrame` döngüsü kullanılmıştı.
- Deney 007'de, bu iki yaklaşımın kesişim noktası olan ve tarayıcının yerel kompozitör iş parçacığına (compositor thread) doğrudan JS arayüzü sunan **Web Animations API (WAAPI)** hedeflenmiştir.
- Temel amaç: "Hello World" ifadesini oluşturan harfleri (`<span>`) DOM içinde anlamsal bütünlükle tutarken, her birine matematiksel zaman kaydırmalı (staggered delay), dinamik 3D rotasyonlu, hızlandırılabilir/tersine çevrilebilir (`playbackRate`, `reverse()`) bir animasyon orkestrasyonu kazandırmak.

### Tasarım Alternatifleri
1. **Alternatif A — Basit Metin Soldurma (Fade & Slide):** Tüm başlığa tek bir `element.animate()` çağrısı ile sönümleme ve kayma efekti. (Teknoloji kapasitesini yeterince sergilemez).
2. **Alternatif B — Koreografik Glif Dalgası ve Etkileşimli Zaman Çizelgesi (Seçildi):** Her harfe bağımsız `Animation` nesnesi atanır; harfler sinüzoidal dalga fazında 3D eksende (`translate3d`, `rotateX`, `scale`, `filter`) süzülür. Kullanıcıya playback hız kontrolü (0.25x - 3x), tersine oynatma (`reverse()`) ve harflere dokunulduğunda rezonans dalgalanması sağlayan kontroller sunulur.
3. **Alternatif C — Scroll-Driven WAAPI:** Sayfa kaydırması ile senkronize WAAPI animasyonu. (Tek sayfa tam ekran "Hello World" odağı için yatay kaydırma gerektireceğinden Alternatif B tercih edildi).

### Karar ve Mimari Tercih
- Alternatif B seçildi. DOM'un esnek tipografisini korurken JS ile animasyon motorunun doğrudan kontrolünü görsel ve teknik açıdan en kusursuz şekilde sergilemektedir.


## [2026-09-29 01:18] — Geliştirme, İyileştirme ve Doğrulama

### Gerçekleştirilen İşlemler
1. `src/007.dev.html` geliştirildi:
   - "Hello World" başlığı semantik `<h1>` ve `aria-label="Hello World"` ile yapılandırıldı.
   - Harfler ayrı `<span>` gliflerine dönüştürüldü ve her birine tarayıcının yerel kompozitör iş parçacığına bağlı `element.animate()` çağrısı bağlandı.
   - Glifler arası `index * 110ms` matematiksel faz kaymasıyla 3D (`translate3d`, `rotateX`, `rotateZ`, `scale`) dalgalanma ve OKLCH spektral renk döngüsü oluşturuldu.
   - Kullanıcı etkileşimi için canlı zaman çizelgesi kontrolleri (`playbackRate`, `reverse()`, `play()`, `pause()`, rezonans şok dalgası ve `mouseenter` mikro yaylanması) eklendi.
2. Doğrulama Süreci ve Hata Ayıklama:
   - Çok kanallı `browser-test.sh` aracı çoklu span tipografisinde yaprak text node'larını aradığından ilk çalıştırmada DOM görünürlüğü tespiti eksik kaldı.
   - `browser-test.sh` içindeki `findTextNodes` fonksiyonu geliştirilerek, `ELEMENT_NODE` düzeyinde birleşik `innerText`, `textContent` ve `aria-label` araması eklendi. Geriye dönük tüm deneylerle tam uyumlu hale getirildi.
3. Pipeline Çıktıları:
   - `validate.sh`: GEÇTİ (PASS)
   - `dependency-check.sh`: GEÇTİ (PASS - Sıfır bağımlılık)
   - `browser-test.sh`: GEÇTİ (Tüm 8 kanal PASS, `<h1>` 846x120px görünür ve aktif)
   - `screenshot.sh`: 1280x800 ekran görüntüsü başarıyla alındı ve görsel olarak onaylandı.
4. Yayımlama:
   - `src/007.dev.html` -> `src/007.html` olarak terfi ettirildi ve kilitlendi.
