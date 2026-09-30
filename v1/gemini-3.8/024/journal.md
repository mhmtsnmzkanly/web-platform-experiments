# Deney 024 İşlem Günlüğü (Journal)

Bu belge, Deney 024 (Selection & Range API ve Tipografik Lazer Dilimleme Geometrisi) sürecindeki anlamlı kararları, aşamaları, testleri ve sonuçları kronolojik ve append-only olarak kaydeder.

---

## [2026-09-30 00:55] Faz 1: Durum Kontrolü ve Başlangıç
- **İşlem:** Deney 024 çalışma alanı (`reports/024/`) oluşturuldu.
- **Hedef:** Modern W3C **Selection & Range API** (`window.getSelection()`, `document.createRange()`, `range.getBoundingClientRect()`, `range.getClientRects()`, `range.setStart()`, `range.setEnd()`) yeteneklerini kullanarak, "HELLO WORLD" metninin glif seviyesindeki piksel koordinat sınırlarını programatik olarak tarayan, dinamik lazer vizörü ve canlı çift yönlü metin manipülasyonu sunan bir tipografi geometri sahnesi geliştirmek.
- **Teknoloji Tespiti:** Selection ve Range arayüzleri, tarayıcının DOM ağacındaki ham metin düğümlerini (text nodes) ve alt-karakter aralıklarını piksel altı hassasiyetle sınırlandırmaya yarayan temel standarttır. Sıfır harici bağımlılıkla yerel olarak çalışır.

## [2026-09-30 00:55] Faz 2 & 3: Teknoloji Araştırması ve 3 Alternatif Fikir
- **İncelenen API:** Selection & Range API (W3C DOM Level 2/3 Traversal and Range / Selection API).
- **Temel Yetenekler:**
  1. `document.createRange()` ve metin sınırlarının belirlenmesi (`range.setStart(node, offset)`, `range.setEnd(node, offset)`).
  2. `range.getBoundingClientRect()` ve `range.getClientRects()` ile seçili alt dizginin gerçek ekran koordinatlarının piksel cinsinden okunması.
  3. `window.getSelection().addRange(range)`, `selection.removeAllRanges()`.
  4. Lazer hedefleme çerçevesinin hesaplanan koordinatlara göre CSS transform ile dinamik konumlandırılması.
- **Alternatif 1 (Seçilen):** *Lazer Dilimleme Geometrisi ve Canlı Range Ölçüm Kokpiti.* "HELLO WORLD" ana metni üzerinde otonom veya kullanıcı kontrollü bir lazer optik seçici çalışır. Seçim tek tek harfleri (H, E, L, L, O, W, O, R, L, D), kelimeleri veya dinamik aralıkları seçtikçe, `range.getBoundingClientRect()` verisi okunarak neon lazer vizörü doğrudan harfin üzerine kilitlenir. Sağ panelde aktif Range metrikleri (startOffset, endOffset, width, height, top, left, collapsed) anlık telemetriyle yansıtılır.
- **Alternatif 2:** *Statik Metin Kopyalama Butonu.* Yalnızca metni seçip panoya kopyalayan basit bir arayüz.
- **Alternatif 3:** *Görsel İpucu Olmayan Seçim.* Koordinat göstergesi olmadan sadece tarayıcı varsayılan mavi vurgusunu kullanan seçim.

## [2026-09-30 00:55] Faz 4: Fikir Seçimi
- **Karar:** Alternatif 1 seçildi.
- **Gerekçe:** Selection ve Range API'nin sadece kullanıcı fare hareketlerinden ibaret olmadığını, programatik geometrik analiz ve piksel düzeyinde tipografik koordinat çıkarma (`range.getBoundingClientRect()`) yeteneğini "HELLO WORLD" merkezli bir lazer tarayıcı estetiğiyle en etkileyici biçimde ortaya koyması.

## [2026-09-30 00:57] Faz 5: `src/024.dev.html` Geliştirme
- **Geliştirilen Dosya:** `src/024.dev.html`.
- **Uygulanan Standartlar:**
  - `document.createRange()`, `window.getSelection()`.
  - `range.setStart()`, `range.setEnd()`, `range.getBoundingClientRect()`.
  - `document.addEventListener('selectionchange')` ile reaktif serbest seçim takibi.
  - Lazer kumpas çerçevesi (#caliper-box) ve mikrometre koordinat rozetleri.
  - 3 tarama modu: Otomatik Lazer Tara, Kelime Ayrışımı, Tümünü Seç.

## [2026-09-30 00:57] Faz 6: Otomatik Doğrulama
- **Komut:** `./verify.sh src/024.dev.html reports/024`
- **Sonuç:** `OK` (Exit Code 0).
- **Ayrıntılar:**
  - `dependency-check.sh`: PASS (Sıfır harici kütüphane, CDN, font veya medya).
  - Chrome CSSOM & `CSS.supports()`: PASS (Tüm CSS bildirimleri ve değişkenler geçerli).
  - Konsol / Çalışma Zamanı: PASS (0 hata, 0 istisna).
  - Teknoloji Kanıtı: `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel Selection & Range API döngüsü doğrulandı)`.

## [2026-09-30 00:57] Faz 7: Görsel İnceleme ve Ekran Görüntüleri
- **Alınan Ekran Görüntüleri:**
  - `screenshot-word.png`: "HELLO" kelimesi seçili, 393.9px genişlik lazer kumpası.
  - `screenshot-char.png`: "E" harfi tekil lazer kumpası (66.0px genişlik, 1→2 ofset).
  - `screenshot-all.png`: Tüm metin seçili görünüm.
  - `screenshot.png`: Birincil sahne genel görünümü.
- **İnceleme Sonucu:** Lazer optik metroloji teması, neon zümrüt kumpas çizgileri, tipografi netliği ve Range telemetrisi kusursuz.

## [2026-09-30 00:57] Faz 8: Teknik Raporlama
- **Oluşturulan Belge:** `reports/024/report.md`
- **Bölümler:** Amaç, Teknoloji ve Mekanizma, 5 Boyut Tasarım, Test Kanıtları, İNSAN DOĞRULAMASI GEREKLİ.

## [2026-09-30 00:57] Faz 9: Mühürleme
- **İşlem:** `mv src/024.dev.html src/024.html`
- **Doğrulama:** `./verify.sh src/024.html reports/024` -> `OK` (Exit Code 0).
- **Mühürleme Durumu:** `src/024.html` tamamlandı; `src/` dizininde hiçbir `.dev.html` kalmadı.

## [2026-09-30 00:57] Faz 10: İndeks ve Durum Güncellemesi
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` belgeleri güncelleniyor.
