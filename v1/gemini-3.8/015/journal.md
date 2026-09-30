# Deney 015 Günlüğü: CSS Grid & Subgrid Mimarisi ile Modüler İsviçre Tipografisi

Bu günlük, Deney 015 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 01:54] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Deney 002'de tek boyutlu eksen akışı sunan CSS Flexbox kullanılmıştı.
- Deney 015'te hedef: Modern CSS'in en yetkin iki boyutlu mizanpaj standardı olan **CSS Grid Layout Level 2 (Subgrid)** (`grid-template-columns: subgrid`, `grid-template-rows: subgrid`, `grid-template-areas`, `grid-auto-flow`) motorunu devreye almak.
- Temel amaç: Sıfır harici kütüphane olmaksızın, katı matematiksel oranlara dayalı 12x12 modüler İsviçre Uluslararası Tipografik Stili (International Typographic Style / Bauhaus) bir poster mimarisi kurmak; "Hello World" ifadesini bu ızgaraya asimetrik, cesur ve hiyerarşik olarak kenetlemek; ebeveyn ızgara raylarını çocuk elemanlara kusursuz aktaran `subgrid` yeteneğini ve etkileşimli bir Izgara Müfettişi (Grid Inspector) cetvelini sergilemektir.

### Tasarım Alternatifleri
1. **Alternatif A — Sıradan Basit 2x2 Izgara:** Sayfayı 4 eşit parçaya bölüp ortasına metin koymak. (CSS Grid'in karmaşık hizalama, alanlar ve özellikle `subgrid` potansiyelini yansıtmaz).
2. **Alternatif B — 12x12 Modüler İsviçre Poster Mizanpajı & Subgrid Kenetleme (Seçildi):**
   - Ana sahne: 12 eşit sütun ve 12 dinamik satırdan oluşan matematiksel bir şablon ızgara (`repeat(12, 1fr)`).
   - Alt bileşenler (`<header>`, `<main class="hero-block">`, `<section class="subgrid-card">`, `<footer>`) doğrudan `grid-template-columns: subgrid` ve `grid-template-rows: subgrid` kullanarak üst ızgara çizgilerine fiziksel olarak kilitlenir.
   - Tipografik Mimari: Devasa, grotesk, ultra-bold "HELLO" ve "WORLD" kelimeleri asimetrik kontrastla ızgara koordinatlarına oturur (`grid-column: 1 / span 8`, `grid-column: 5 / span 8`).
   - Etkileşimli Izgara Müfettişi (Grid Overlay Inspector): Kullanıcı bir butonla ızgara hatlarını, sütun ray numaralarını (`1..13`) ve subgrid sınırlarını neon lazer cetvelleriyle açıp inceleyebilir.
   - Kompozisyon Modları:
     - *İsviçre Posteri (Müller-Brockmann Stili)*: Katı asimetrik orantı ve negatif alanlar.
     - *Kinetik Yoğunluk (Dense Matrix)*: Tüm 12x12 hücrelerin harf bloklarıyla dolduğu yapısal matris.
     - *Diyagonal / Altın Oran*: Çapraz eksende kayan tipografik dinamizm.
     - *Minimalist Monolit*: Tek bir anıtsal bloğa odaklanan saf geometri.
3. **Alternatif C — CSS Multi-Column (Gazete Mizanpajı):** `column-count: 3` ile metin akıtmak. (Hello World odağı için uygun değildir; yapısal iki boyutlu kontrol sunmaz).

### Karar ve Mimari Tercih
- Alternatif B seçildi. 20. yüzyılın en etkili grafik tasarım disiplinini en modern web mizanpaj motoru (CSS Subgrid) ile birleştirir; "Hello World" ifadesini okunabilir, anıtsal ve kusursuz matematiksel oranlarla çevreler.

## [2026-09-29 02:03] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 semantik iskelet, meta etiketleri, inline CSS ve V8 motoru ile JavaScript sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici istek, sıfır harici CDN/font/script; meşru tek dosya yapısı doğrulandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<div class="word-hello">` ve `<div class="word-world">` elemanları ile alt bilgi metni 12x12 ızgara içinde eksiksiz görünür.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi.
  - Yeni Teknoloji Denetimi: `CSS.supports('grid-template-columns', 'subgrid') === true` ile modern CSS Subgrid desteği ve 12x12 matris yerleşimi doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/015/screenshot.png` oluşturuldu ve incelendi. Koyu mimari zemin üzerinde 144 hücrelik lazer ızgara cetveli, asimetrik oranlarla yerleşmiş grotesk beyaz "HELLO" ve camgöbeği "WORLD" tipografisi ile alt kontrol paneli kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/015.dev.html` tüm testleri başarıyla tamamladıktan sonra `src/015.html` olarak kalıcılaştırıldı.
- Deney 015 başarıyla tamamlandı.
