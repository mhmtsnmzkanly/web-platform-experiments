# Çalışma Günlüğü: Deney 035

**Tarih:** 2026-09-30  
**Konu:** HTML5 Drag and Drop API & Kinetik Tipografik Taşınabilirlik ve Yuva Matrisi  
**Durum:** TAMAMLANDI  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `034.html` (34 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 4. Onluk Döngünün 5. deneyi (035) başlatılıyor.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** HTML5 Drag and Drop API (W3C HTML5 / WHATWG HTML Living Standard).
- **Temel API ve Tarayıcı Yetenekleri:**
  - Nitelik: `draggable="true"`.
  - Sürükleyici Olayları (Drag Source):
    - `dragstart`: `event.dataTransfer.setData()`, `event.dataTransfer.effectAllowed = 'move'`.
    - `drag`: Sürekli koordinat takibi.
    - `dragend`: Sürükleme bitişi ve görsel durum sıfırlama.
  - Hedef Yuva Olayları (Drop Target):
    - `dragenter`: Hedef alanın manyetik olarak vurgulanması.
    - `dragover`: `event.preventDefault()` (bırakmanın geçerli sayılması için zorunlu W3C kuralı).
    - `dragleave`: Vurgunun kaldırılması.
    - `drop`: `event.dataTransfer.getData()`, harfin yuvaya kenetlenmesi ve dizilim doğrulaması.
  - `DataTransfer` Protokolü:
    - `text/plain` ve özel MIME türleri (`application/json`) ile harf metadata'sının (glif, orijinal indeks, renk) taşınması.
- **Tasarım Yaklaşımı:**
  - Kuantum Tipografik Montaj İstasyonu (Quantum Slot Assembler).
  - Merkezde "HELLO WORLD" harflerinin manyetik montaj yuva matrisi yer alır.
  - 10 glif blokunun her biri sürüklenebilir (`draggable="true"`).
  - Kullanıcı harfleri karışık sıradan alıp hedef yuvalara yerleştirebilir, yerlerini değiştirebilir veya otomatik karıştırma/çözme yapabilir.
  - Canlı Dizilim ve Bütünlük Telemetrisi (Alignment Telemetry): "HELLO WORLD" doğru sırada tamamlandığında yeşil kuantum rezonans ışıması (`DİZİLİM %100 DOĞRU`) devreye girer.
  - Canlı Dnd Olay Akışı: Sürükleme koordinatları ($X, Y$), olay türü ve taşınan veri yükü gerçek zamanlı listelenir.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Kinetik Tipografik Taşınabilirlik ve Kuantum Yuva Matrisi (Quantum Slot Assembler)**  
   - Kuantum montaj istasyonu estetiği. 10 bağımsız sürüklenebilir harf, 10 manyetik yuva, `DataTransfer` JSON yükü ve canlı dizilim doğrulayıcısı.
2. **Fikir 2: Mekanik Linotip Dizgi Kasası ve Montaj Tezgahı (Letterpress Composing Stick)**  
   - 19. yüzyıl matbaa kasası; harflerin tek tek satır tezgahına taşınması.
3. **Fikir 3: Moleküler Genetik Nükleotid Eşleştirici (Molecular DNA Splicer)**  
   - Biyosiber nükleotid tüplerinden harflerin sarmal üzerine sürüklenmesi.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Kinetik Tipografik Taşınabilirlik ve Kuantum Yuva Matrisi** seçildi.
- **Gerekçe:** HTML5 Drag and Drop standardının tüm olay zincirini (`dragstart`, `dragover`, `drop`, `dragend`, `dataTransfer`) ve tarayıcının yerel fare/dokunma taşıma kabiliyetini yüksek kontrastlı ve etkileşimli bir siber montaj istasyonu formatında sergiler. "HELLO WORLD" hem parçalanabilen hem de yeniden birleştirilen ana hedef nesnesidir.

---

## Faz 5: `src/035.dev.html` Geliştirme
- 10 adet sürüklenebilir glif karosu (`draggable="true"`, ASCII kodlu) ve 10 adet hedef yuva (`data-expected`, `data-slot-idx`) oluşturuldu.
- `dragstart`, `dragend`, `dragover` (`e.preventDefault()`), `dragenter`, `dragleave`, `drop` olayları bağlandı.
- `e.dataTransfer.setData("application/json")` ve `"text/plain"` ile çift formatlı veri aktarımı entegre edildi.
- Alt kaynak depolama havuzuna (dock) ters yönlü bırakma (eject / return) desteği eklendi.
- Fisher-Yates rastgele karıştırma (`btnShuffle`), kusursuz otomatik montaj (`btnAutoAssemble`) ve kaynak havuzuna boşaltma (`btnEjectAll`) eylemleri yazıldı.
- Gerçek zamanlı doğruluk puanı (%0 - %100) ve canlı olay akışı günlüğü entegre edildi.

---

## Faz 6: Otomatik Doğrulama
- `./verify.sh src/035.dev.html reports/035` çalıştırıldı.
- `dependency-check.sh`: 0 harici bağımlılık, geçerli yerel kaynaklar.
- `browser-test.sh`: 0 konsol hatası, 0 runtime istisnası, DOM üzerinde "HELLO WORLD" metninin varlığı ve görünürlüğü teyit edildi.
- Sonuç: `OK` (Çıkış kodu: 0).

---

## Faz 7: Görsel İnceleme & Çoklu Durum Ekran Görüntüleri
- `reports/035/screenshot.png`: Varsayılan kusursuz dizilim (%100 doğru, 10/10 glif yuvada).
- `reports/035/screenshot-shuffled.png`: Entropik karıştırılmış rastgele sıra (örn. `H L E R L D O L W O`, %20 doğruluk).
- `reports/035/screenshot-ejected.png`: Tüm gliflerin kaynak havuzuna tahliye edildiği durum (0/10 doğruluk, şeffaf kılavuz yuvaları).
- `reports/035/screenshot-assembled.png`: Otomatik montaj ile yeniden kurulan %100 dizilim.
- Görsel hiyerarşi, WCAG AAA kontrastı ve odak prensipleri incelendi ve onaylandı.

---

## Faz 8: Teknik Raporlama
- `reports/035/report.md` 5 temel bölüm altında eksiksiz yazıldı:
  1. Deney Amacı ve Özeti
  2. Kullanılan Teknoloji ve Çalışma Mantığı
  3. 5 Boyutlu Tasarım Değerlendirmesi
  4. Doğrulama Kanıtları ve Test Sonuçları
  5. İnsan Doğrulaması Gereken Durumlar

---

## Faz 9: Mühürleme
- `mv src/035.dev.html src/035.html` komutu ile dosya mühürlendi.
- `./verify.sh src/035.html reports/035` çalıştırıldı.
- Çıktı: `OK` (Çıkış kodu: 0).
- Orphan `.dev.html` dosyası kalmadığı teyit edildi.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `reports/035/journal.md` tamamlandı.
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 035 başarıyla mühürlendi.

