# Deney 024: Selection & Range API ve Tipografik Lazer Dilimleme Geometrisi

## 1. Amaç ve Kapsam
Bu deneyin amacı, W3C DOM standartlarının temel metin seçim ve aralık belirleme altyapısı olan **Selection & Range API** (`window.getSelection()`, `document.createRange()`, `range.setStart()`, `range.setEnd()`, `range.getBoundingClientRect()`) yeteneklerini kullanarak, "HELLO WORLD" metninin alt-karakter seviyesindeki geometrik koordinat sınırlarını dinamik olarak ölçen, analiz eden ve üzerine lazer optik kumpasları kenetleyen bir metroloji kokpiti geliştirmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. Programatik DOM Aralık Tanımlama (`document.createRange()`)
- Metin düğümleri (text nodes) üzerinde `range.setStart(node, startOffset)` ve `range.setEnd(node, endOffset)` çağrılarıyla tekil karakterler ("H", "E", "L"...), kelimeler veya tüm metin bloğu seçilir.
- `window.getSelection().removeAllRanges()` ve `addRange(range)` ile tarayıcının yerel seçim motoruna aktarılır.

### B. Piksel Seviyesinde Geometrik Sınır Kutuları (`range.getBoundingClientRect()`)
- Seçilen herhangi bir harf veya kelime aralığının ekran üzerindeki fiziksel koordinatları (`width`, `height`, `left`, `top`) mikrometre hassasiyetinde hesaplanır.
- Bu koordinatlar doğrudan dinamik bir lazer kumpas çerçevesine (`#caliper-box`) aktarılarak seçili harflerin etrafında parıldayan neon yeşili lazer braketleri oluşturulur.

### C. Çift Yönlü Kullanıcı Etkileşimi (`selectionchange`)
- Yalnızca otomatik lazer devriyesi değil, kullanıcının fare veya dokunmatik ekranla metin üzerinde yaptığı serbest seçimler de `selectionchange` olayı ile gerçek zamanlı dinlenir; anında telemetri paneline ve kumpas vizörüne yansıtılır.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** Yüksek hassasiyetli optik metroloji tipografisi. Teknik göstergelerde monospaced (`ui-monospace`, `Menlo`, `Consolas`), ana "HELLO WORLD" manşetinde ise yüksek kontrastlı, cesur grotesk (`system-ui`, `-apple-system`, `Helvetica Neue`, 900 weight).
2. **Renk Paleti:** Lazer optik ve karanlık oda estetiği:
   - Simsiyah optik zemin (`#05070d`, `#0b0f19`)
   - Parlak lazer zümrüdü (`#10b981`)
   - Vektörel camgöbeği (`#38bdf8`)
   - Dikkat kırmızısı (`#f43f5e`)
   - Temiz beyaz ve titanyum grisi (`#f8fafc`, `#94a3b8`)
3. **Kompozisyon:** Merkezde optik eksen çaprazları ve anıtsal "HELLO WORLD" vitrini; üzerinde hareketli lazer kumpas çerçevesi; sağ tarafta canlı Range telemetri matrisi (genişlik, yükseklik, ofsetler); altta manuel seçim denetim araçları.
4. **Malzeme Hissi:** Optik cam tüneli, lazer cetvelleri, mikrometre çerçevesi ve 32px teknik ızgara deseni.
5. **Hareket:** Otomatik lazer karakter devriyesi (patrol), dönen optik hedef vizörü (`@keyframes laser-spin`) ve yanıp sönen LED lazer indikatörü (`@keyframes laser-pulse`).

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır dış kütüphane, CDN, font veya medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm CSS bildirimleri ve değişkenler geçerli).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel Selection & Range API döngüsü doğrulandı)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Kelime Ayrışımı Görünümü (screenshot-word.png)](screenshot-word.png): "HELLO" kelimesi seçili, 393.9px genişlik, 170.0px yükseklik kumpas kutusu.
- [Tekil Karakter Lazer Kumpası (screenshot-char.png)](screenshot-char.png): "E" harfi seçili, 66.0px genişlik, 1 &rarr; 2 ofset aralığı.
- [Tümünü Seç Görünümü (screenshot-all.png)](screenshot-all.png): Tüm "HELLO WORLD" metni seçili ve ölçülmüş.
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa tam ekran genel metroloji kokpiti.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak serbest fare seçimi yaparken lazer kumpas kutusunun kullanıcı hareketine eşzamanlı kenetlenme hissi otomasyonla tek başına tam olarak değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** Kullanıcı fare imleciyle "HELLO WORLD" metninin herhangi bir kısmını sürükleyerek seçtiğinde, lazer kumpas kutusunun pürüzsüzce o aralığın üstüne yerleşmesi ve sağdaki Range metriklerinin anlık güncellenmesi.
- **Mevcut Teknik Kanıt:** Chromium headless oturumunda `createRange`, `setStart`, `setEnd`, `getBoundingClientRect` fonksiyonlarının 66.0px ve 393.9px koordinat değerleri ürettiği, ekran görüntülerinde lazer kumpas kutusunun tam metin sınırlarına oturduğu kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/024.html` adresini açınız. Üstteki "01 OTO LAZER TARA" butonuna basarak harflerin tek tek taranmasını izleyiniz. Ardından farenizle metin üzerinde serbestçe örneğin "ELLO W" gibi bir aralığı seçiniz. Lazer kumpasının seçtiğiniz harfleri tam içine alacak şekilde çerçevelediğini ve sağ panelde karakter sayısının anında güncellendiğini doğrulayınız.
