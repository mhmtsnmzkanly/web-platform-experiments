# Deney 013 Günlüğü: CSS 3D Transforms ve Uzamsal İzometrik Tipografi

Bu günlük, Deney 013 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:46] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 012'de GPU seviyesinde WebGL fragment shader ile çalışan bir grafik boru hattı kuruldu.
- Deney 013'te hedef: Tarayıcının yerleşik CSS 3D motorunu (`transform-style: preserve-3d`, `perspective`, `perspective-origin`, `rotate3d`, `translate3d`, `matrix3d`) kullanarak doğrudan DOM elemanlarını 3D uzayda konumlandırmak ve derinlik kazandırmak.
- Temel amaç: Sıfır harici 3D kütüphanesi olmadan, saf HTML/CSS ve minimal etkileşim JavaScript'i ile "Hello World" ifadesini 3 boyutlu uzamsal bir anıta/monolite dönüştürmek; izometrik ve perspektif kamera modları, serbest yörüngesel sürükleme (orbit controls), katman patlatma (exploded depth slice view) ve dinamik ışık gölgelendirmesi sunmak.

### Tasarım Alternatifleri
1. **Alternatif A — Basit 3D Döndürme (`rotateY(20deg)`):** Düz bir `<h1>` başlığına hafif bir açı vermek. (Fazla basit, 3D uzamın derinlik potansiyelini göstermez).
2. **Alternatif B — Çok Katmanlı Z-Eksen Derinlikli Dilimleme & İzometrik Monolit (Seçildi):**
   - 3D Sahne (`perspective: 1200px`, `transform-style: preserve-3d`).
   - "Hello World" ifadesini Z ekseni boyunca ardışık katmanlar halinde dilimlemek (`translateZ(-60px)`'ten `translateZ(+60px)`'e kadar 12-16 katman).
   - Ön yüzeyde ışıltılı OKLCH cam gradyanı, ara katmanlarda akrilik derinlik efekti, arka katmanda ise zemin ızgarasına düşen gerçekçi gölge projeksiyonu.
   - İzometrik / Aksonometrik kamera açısı kilidi (`rotateX(30deg) rotateY(-45deg)`).
   - Kullanıcının fare / dokunmatik sürüklemesiyle sönümlü serbest yörünge kamerası (inertial orbit drag).
   - "Katman Patlatma (Explode)" butonu ile Z eksenindeki katmanların birbirinden uzaklaşarak 3D iç yapıyı sergilemesi.
3. **Alternatif C — CSS 3D Dönen Küp:** Her yüzünde "Hello World" olan 6 yüzlü CSS 3D küpü. (Küp dönerken bazı açılarda metin ters döner veya arkada kalır; odak ve okunabilirlik zayıflayabilir).

### Karar ve Mimari Tercih
- Alternatif B seçildi. "Hello World" odağını hem doğrudan okunabilir kılan hem de gerçek bir 3D mimari heykel gibi her açıdan incelenebilen hacimsel bir deneyime dönüştürür. Ekran okuyucular için tek bir semantik `<main>` ve `<h1>` etiketini temel alır; katmanlar dekoratif ARIA gizli (`aria-hidden="true"`) biçimde yapılandırılır.

## [2026-09-29 01:50] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 doküman iskeleti, meta etiketleri, inline CSS ve V8 motoru ile JavaScript sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici istek, sıfır harici CDN/font/script; meşru tek dosya yapısı doğrulandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<span class="hw-slice">` ve `<h1 class="hw-slice hw-front">` elemanları (532x341px) 3D uzayda eksiksiz görünür.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi.
  - Yeni Teknoloji Denetimi: CSS 3D dönüşümleri (`transform-style: preserve-3d`, `perspective`, `translateZ`, `rotateX/Y`) yerel kompozitör üzerinde donanım hızlandırmalı olarak doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/013/screenshot.png` oluşturuldu ve incelendi. Karanlık uzaysal ızgara zemin üzerinde izometrik açıyla konumlanmış, 14 katmanlı Z-eksen ekstrüzyonuna sahip neon cam monoliti ve interaktif HUD arayüzü kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/013.dev.html` tüm testleri başarıyla tamamladıktan sonra `src/013.html` olarak kalıcılaştırıldı.
- Deney 013 başarıyla tamamlandı.
