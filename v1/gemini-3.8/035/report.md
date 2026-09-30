# Hello World Lab — Teknik Rapor: Deney 035

**Deney Başlığı:** HTML5 Drag and Drop API & Yuva Matrisi (Kinetik Tipografik Taşınabilirlik ve W3C DataTransfer Protokolü)  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/035.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 035, web platformunun temel yerel etkileşim standartlarından biri olan **HTML5 Drag and Drop API** (`draggable`, `dragstart`, `dragover`, `drop`, `dragend`, `DataTransfer`) standardını inceler. Harici sürükleme veya fizik kütüphanelerine (interact.js, Sortable vb.) ihtiyaç duymadan, doğrudan tarayıcının yerleşik girdi alt sistemini kullanarak "HELLO WORLD" gliflerinin kinetik manipülasyonunu gerçekleştirir. 10 harften oluşan "HELLO WORLD" dizilimi, fiziksel/dijital bir montaj istasyonu olarak modellenmiş; glifler hedef yuvalar (drop targets) ile kaynak depolama havuzu (source staging dock) arasında W3C `DataTransfer` protokolü üzerinden JSON ve düz metin yükleriyle çift yönlü taşınabilir kılınmıştır. Canlı dizilim doğruluğu ve olay akış telemetrisi sunulmaktadır.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **HTML5 Drag and Drop API (W3C / WHATWG Living Standard):**
  - `draggable="true"`: Glif kartlarının yerel olarak işletim sistemi ve tarayıcı seviyesinde sürüklenebilir olmasını sağlar.
  - Sürükleme Kaynağı Olayları (Drag Source Events):
    - `dragstart`: Kullanıcı sürüklemeye başladığında tetiklenir. `e.dataTransfer.setData("text/plain", char)` ve `e.dataTransfer.setData("application/json", JSON.stringify(payload))` ile aktarılacak veri yükü (karakter, orijinal indeks, tileId) kaydedilir. `e.dataTransfer.effectAllowed = "move"` ayarlanır.
    - `dragend`: Sürükleme bittiğinde (başarılı bırakma veya iptal) tetiklenir; görsel `is-dragging` sınıfı temizlenir ve doğruluk matrisi güncellenir.
  - Hedef Yuva Olayları (Drop Target Events):
    - `dragenter`: İmleç hedef yuva üzerine geldiğinde tetiklenir, `slot-hover` neon vurgusu aktifleşir.
    - `dragover`: **Kritik W3C Kuralı:** Tarayıcının varsayılan bırakmayı engelleme davranışını devre dışı bırakmak için `e.preventDefault()` çağrılır. `e.dataTransfer.dropEffect = "move"` bildirilir.
    - `dragleave`: İmleç yuvadan ayrıldığında `slot-hover` vurgusu kaldırılır.
    - `drop`: Bırakma anında tetiklenir. `e.preventDefault()` çağrılır; `e.dataTransfer.getData("application/json")` veya `"text/plain"` üzerinden veri okunur. Eğer yuvada halihazırda bir glif varsa takas (swap) mekanizması devreye girer.
  - Kaynak Havuzu Çift Yönlü Bırakma:
    - Alt bölümdeki kaynak depolama havuzu da bir `drop` hedefidir; kullanıcı glifleri hedef yuvalardan çekip tekrar havuza bırakabilir.
  - Montaj ve Entropi Kontrolü:
    - `btnShuffle`: Fisher-Yates algoritması ile glifleri rastgele yuvalara dağıtır ve doğruluğu dinamik olarak yeniden hesaplar.
    - `btnAutoAssemble`: Tüm glifleri doğru sıralı yuvalarına otomatik montajlar ve %100 kusursuzluk neon bildirimini yakar.
    - `btnEjectAll`: Tüm glifleri hedef yuvalardan kaynak havuzuna tahliye eder.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - 10 adet monolitik glif karosu (`H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D`). Her glifin üzerinde büyük harf karakteri ve altında onaltılık ASCII değeri yer alır.
   - Doğru yuvaya oturan glifler zümrüt yeşili (`#10b981`), yanlış veya havuzdaki glifler kehribar/yakut gradyanı ile ışıldar.
2. **Renk Paleti ve Kontrast:**
   - Koyu uzay mavisi/siyah endüstriyel montaj zeminleri (`#030712`, `#070c1b`).
   - Neon kehribar (`#f59e0b`), zümrüt yeşili (`#10b981`), kobalt mavi (`#3b82f6`) ve elektrik siyanı (`#06b6d4`).
   - Kontrast oranı WCAG AAA uyumludur (arka plan ile metinler arasında 8:1 üzerinde kontrast).
3. **Mizanpaj ve Kompozisyon:**
   - Sol ana alanda Tipografik Hedef Matrisi (10 yuva) ve Glif Depolama/Fırlatma Havuzu (Dock) yer alır.
   - Sağ alanda Montaj Aksiyon Masası, W3C DataTransfer Protokol Özeti ve Canlı Sürükle-Bırak Olay Akışı konsolu yer alır.
4. **Mikro Etkileşim ve Hareket:**
   - Sürükleme esnasında kart yarı saydamlaşır (`opacity: 0.45`, kesikli çerçeve).
   - Yuva üzerine gelindiğinde zümrüt/siyan kılavuz çerçevesi nabız atışı yapar.
   - Bırakma anında yumuşak kubik geçişle yuvaya kilitlenme hissi verilir.
5. **Kavramsal Odak (Hello World Merkeziliği):**
   - Deneyin tüm amacı "HELLO WORLD" kelimesinin harf harf montajıdır; kullanıcı etkileşimi doğrudan kelimenin doğruluğunu (%0'dan %100'e) belirler.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici kütüphane, saf HTML5/CSS/JavaScript).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM üzerinde görünür "HELLO WORLD" metni ve geçerli CSS).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Çoklu Durum Ekran Görüntüleri:**
  - `screenshot.png`: Başlangıç montaj durumu (10/10 doğru dizilim, %100 başarı rozeti).
  - `screenshot-shuffled.png`: Entropik karıştırma sonrası karışık dizilim (örn. `H L E R L D O L W O`, %20 doğruluk).
  - `screenshot-ejected.png`: Tüm gliflerin boşaltılıp kaynak havuzuna gönderildiği durum (0/10 doğruluk, şeffaf yuva hayalet harfleri).
  - `screenshot-assembled.png`: Otomatik montaj ile %100 dizilimin yeniden tesis edildiği durum.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Fiziksel Fare ve İmleç Sürükle-Bırak Hissi:**
  - Bir glif karosu fareyle tutulup sürüklendiğinde tarayıcının yerel yarı saydam "hayalet görsel" (drag ghost image) oluşturduğu ve hedef yuvaya bırakıldığında yuvaya kilitlendiği fiziksel olarak doğrulanmalıdır.
- **Glif Takas (Swap) Davranışı:**
  - Dolu bir yuvanın üzerine başka bir glif karosu sürüklendiğinde, yuvadaki mevcut karonun sürüklenen karonun eski yuvasına veya kaynak havuzuna geri geçtiği el ile test edilmelidir.
