# Hello World Lab — Teknik Rapor: Deney 032

**Deney Başlığı:** Compression Streams API & Kuantum Entropi ve Biyoinformatik Veri Yoğunlaştırma Odası  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/032.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 032, web tarayıcısının yerel donanım ve C++ motorları üzerinde çalışan akış tabanlı veri sıkıştırma standardı olan **Compression Streams API** (`CompressionStream`, `DecompressionStream`) yeteneklerini inceler. "HELLO WORLD" metni, kuantum gen dizisi veya yüksek yoğunluklu veri kristali olarak modellenmiştir. Deney, tarayıcının ek hiçbir JavaScript kütüphanesine veya harici derlenmiş WebAssembly modülüne ihtiyaç duymaksızın doğrudan `gzip`, `deflate` ve `deflate-raw` algoritmalarıyla asenkron akışlar (`ReadableStream` / `pipeThrough`) üzerinden ikili veri yoğunlaştırmasını ve bayt düzeyinde geri açma doğrulaması yapmasını sağlar. Shannon bilgi entropisi ve canlı hex dökümü ile veri mühendisliği ve bilgi teorisi prensipleri görselleştirilmiştir.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C / WHATWG Compression Streams API:**
  - `CompressionStream(format)`: `ReadableStream` boru hattına entegre edilen bir `TransformStream` nesnesidir. Verilen bayt akışını sıkıştırılmış baytlara dönüştürür.
  - `DecompressionStream(format)`: Sıkıştırılmış ikili akışı orijinal ham karakter dizisine geri açar.
  - Desteklenen Algoritmalar:
    - `'gzip'`: RFC 1952 standardı. GZIP sihirli baytları (`1F 8B`), sıkıştırma yöntemi, zaman damgası, LZ77+Huffman sıkıştırılmış blokları ve CRC-32 sağlama toplamını içerir.
    - `'deflate'`: RFC 1950 (ZLIB) standardı. 2 baytlık başlık (`78 9C` vb.), LZ77+Huffman veri gövdesi ve Adler-32 sağlama toplamı içerir.
    - `'deflate-raw'`: RFC 1951 standardı. Herhangi bir sarmalayıcı veya sağlama toplamı olmayan yalın DEFLATE bayt akışıdır.
- **Akış Boru Hattı (Streams Pipeline Execution):**
  - `new Blob([rawBytes]).stream().pipeThrough(new CompressionStream(format))` zinciriyle bellek tahsisatı minimumda tutulur ve asenkron akış güvencesi sağlanır.
- **Shannon Bilgi Entropisi Hesabı:**
  - $H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$ formülüyle metnin karakter çeşitliliği ve belirsizlik yoğunluğu (bit/karakter) gerçek zamanlı hesaplanır.
- **Bütünlük Doğrulaması (Byte-Exact Verification):**
  - Açılan metin orijinal metin ile karşılaştırılarak %100 sağlama toplamı ve veri kaybı olmaksızın (lossless) çalıştığı teyit edilir.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezde yer alan monolitik "HELLO WORLD" tipografisi, her bir harfin altında ASCII onaltılık (hex) bayt karşılığını (`48 45 4C 4C 4F...`) taşır.
   - Sıkıştırıldığında harfler kuantum kristalleşmesi gibi yatay eksende büzülerek yoğunlaşır (`state-compressed`), açıldığında ise tam genişliğe ulaşarak parıldayan neon zümrüt/siyan ışımasına kavuşur.
2. **Renk Paleti ve Kontrast:**
   - Derin kuantum laboratuvarı siyahı (`#030712`, `#060911`).
   - Kuantum siyanı (`#38bdf8`), fosfor zümrüt yeşili (`#10b981`), başlık kehribarı (`#f59e0b`) ve entropi moru (`#a855f7`).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (7:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda devasa Kuantum Sıkıştırma Sahnesi, Canlı Hex Akış Matrisi ve Orijinal vs Sıkıştırılmış boyut karşılaştırma çubukları yer alır.
   - Sağ kolonda Sıkıştırma/Açma tetikleyicileri, algoritma seçicileri (GZIP, DEFLATE, RAW), veri tekrar çarpanları (1x, 16x, 64x, 256x) ve telemetri olay akışı bulunur.
4. **Mikro Etkileşim ve Hareket:**
   - Sıkıştırma butonuna tıklandığında gliflerin aralıkları CSS `letter-spacing` ve `transform: scaleX()` ile yoğunlaşır; Hex matrisinde baytlar tek tek parıldayarak yerleşir.
   - Gecikme süresi mikrosaniyelik (`performance.now()`) telemetriyle anlık gösterilir.
5. **Kavramsal Odak (Hello World Merkeziligi):**
   - "HELLO WORLD" sıkıştırılan, dönüştürülen, yoğunlaştırılan ve kayıpsız olarak geri açılan temel veri yükünün kendisidir.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici URL/CDN/font, sistem yazı tipleri ve saf CSS/JS).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM üzerinde görünür "HELLO WORLD" kanıtı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Ekran Görüntüleri:**
  - `screenshot.png`: Başlangıç sıkıştırılmış durumu (GZIP 1x, 31 Bayt, Hex Matrisi).
  - `screenshot-decompressed.png`: Geri açılmış ve doğrulanmış durum (DOĞRULANDI: %100 BÜTÜNLÜK, Genişletilmiş Glifler).
  - `screenshot-high-ratio.png`: 256x Tekrar modu (2.81 KB metin → ~110 Bayt, devasa sıkıştırma tasarruf çubuğu).
  - `screenshot-deflate-raw.png`: Başlıksız saf Deflate-Raw algoritması.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Farklı Metin Boyutlarında Sıkıştırma Tasarrufu Davranışı:**
  - 1x (11 bayt) gibi çok küçük metinlerde GZIP/DEFLATE başlıklarının (overhead) dosya boyutunu geçici olarak artırabildiği, ancak 16x ve 256x tekrar modlarında LZ77 algoritmasının tekrarlayan kalıpları yakalayarak %95'in üzerinde inanılmaz bir alan tasarrufu sağladığı arayüzdeki kıyaslama çubuklarından incelenmelidir.
