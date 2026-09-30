# Deney 021: IntersectionObserver API ve Çok Eşikli Kinetik Tipografik Telemetri

## 1. Amaç ve Kapsam
Bu deneyin amacı, W3C standartlarının en temel asenkron görünürlük motoru olan **IntersectionObserver API** (`new IntersectionObserver()`, `threshold`, `rootMargin`, `root`) yeteneğini sıfır harici bağımlılıkla kullanarak mikroskobik matematiksel telemetriye dayalı bir kinetik tipografi ve optik radar kokpiti geliştirmektir. "HELLO WORLD" ifadesinin her bir harfi bağımsız bir gözlem hedefi (`.glyph-unit`) olarak taranmakta; 101 kademeli (`0.00` - `1.00`) granüler eşik dizisi üzerinden piksel altı görünürlük yüzdesi (`intersectionRatio`), kesişim durumu (`isIntersecting`) ve geometrik koordinatlar (`boundingClientRect`) doğrudan CSS Custom Properties aracılığıyla harf ağırlığı, ölçek ve OKLCH/HSL ışımasına dönüştürülmektedir.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. 101 Kademeli Granüler Eşik Matrisi (`threshold: Array(101)`)
- Standart `threshold: 0` veya `threshold: [0, 1]` yerine `Array.from({ length: 101 }, (_, i) => +(i / 100).toFixed(2))` dizisi kullanılmıştır.
- Her harfin görüş alanına girdiği veya çıktığı her %1'lik değişimde IntersectionObserver geri çağrısı (callback) tetiklenir; bu sayede kaydırma olay dinleyicisi (`scroll` event listener) kullanılmadan tarayıcının yerel kompozitör frekansında pürüzsüz telemetrik veri akışı sağlanır.

### B. Bağımsız Glif Hedefleri ve CSS Custom Properties Modülasyonu
- "HELLO" ve "WORLD" kelimelerindeki 10 harf glifi DOM üzerinde bağımsız gözlem hedefi olarak kaydedilmiştir.
- Callback içerisinde yakalanan `entry.intersectionRatio` değeri doğrudan ilgili glifin yerel değişkenlerine aktarılır:
  - `--ratio`: `0.000` - `1.000`
  - `--weight`: `calc(300 + var(--ratio) * 600)` (İnce 300'den kalın 900'e akış)
  - `--hue`: `180 + var(--ratio) * 35` (Camgöbeğinden elektrik mavisine renk geçişi)
  - Glif ölçeklemesi ve ışıma yarıçapı orana bağlı olarak matematiksel olarak enterpole edilir.

### C. Çoklu Gözlemci Kökleri (`root: corridorScrollEl`)
- Ana viewport gözlemcisinin yanı sıra, alt panelde yer alan "Hassas Kesişim Koridoru" için bağımsız bir alt konteyner kökü (`root: corridorScrollEl`) tanımlanmıştır.
- İçerideki hedef işaretçi (`corridorTargetEl`) yukarı/aşağı devriye kaydırması yaptıkça görünürlük oranı canlı olarak `%0.0` ile `%100.0` arasında güncellenir ve renk/kenarlık durumları değişir.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** Bilimsel/havacılık telemetri tipografisi. Teknik göstergelerde monospaced (`ui-monospace`, `Menlo`, `Liberation Mono`), ana gliflerde ise geometrik grotesk (`system-ui`, `Inter`, `Segoe UI`). Harflerin kalınlığı kesişim oranına göre 300 ile 900 arasında parametrik olarak modüle edilir.
2. **Renk Paleti:** Uzay telemetri ve radar estetiği:
   - Derin uzay zemini (`#070a12`, `#0f172a`)
   - Parlak elektrik mavisi ve camgöbeği (`#38bdf8`)
   - Radar zümrütü (`#10b981`)
   - Dikkat/uyarı mercanı (`#f43f5e`)
   - Amber telemetri ışığı (`#fbbf24`)
3. **Kompozisyon:** Çift parçalı kokpit düzeni: Sol tarafta optik reticle ve hedef artı işaretli (crosshairs) anıtsal "HELLO WORLD" vitrini ve alt kesişim tüneli; sağ tarafta 10 harflik canlı kesişim çubukları matrisi ve W3C Observer durum kartları.
4. **Malzeme Hissi:** Yarı saydam cam paneller (`backdrop-filter: blur(12px)`), mikron hassasiyetli 32px ızgara deseni ve neon LED durum indikatörleri.
5. **Hareket:** Hem kullanıcının serbest koridor kaydırması hem de "OTO DEVRİYE" (Auto-Patrol) sinüzoidal tarama döngüsü; tepe başlıkta dönen sürekli radar tarama çizgisi (`@keyframes radar-sweep`).

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır dış kütüphane, CDN, harici font veya medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm modern CSS kuralları ve değişkenler geçerli; Chromium CSSOM tüm bildirimleri hatasız ayrıştırdı).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel IntersectionObserver API döngüsü doğrulandı)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Merkez Telemetri Görünümü (screenshot-center.png)](screenshot-center.png): "HELLO WORLD" harfleri tam odakta (%100 görünürlük, 900 ağırlık ve aktif radar).
- [Koridor Giriş Eşiği (screenshot-entry.png)](screenshot-entry.png): Kesişim koridoru üst tamponunda %0.0 kesişim durumu.
- [Koridor Çıkış Eşiği (screenshot-exit.png)](screenshot-exit.png): Kesişim koridoru alt tamponunda çıkış telemetrisi.
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa tam ekran genel kokpit görüntüsü.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak optik telemetri arayüzünün mikrosaniyelik tepki hassasiyeti ve görsel tatmin hissi otomasyonla tek başına tam olarak değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** Kullanıcı fare tekerleğiyle alt koridoru kaydırdığında veya OTO DEVRİYE butonuna bastığında, sağ paneldeki ilerleme çubuklarının ve glif parlama oranlarının pürüzsüz akıcılığı.
- **Mevcut Teknik Kanıt:** Chromium headless oturumunda 10 glif ve koridor hedefi için `IntersectionObserver` tetikleyicilerinin çalıştığı, `screenshot-entry.png` dosyasında %0.0, `screenshot-center.png` dosyasında %100.0 kesişim oranlarının kaydedildiği kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/021.html` adresini açınız. Sağ üstteki "OTO DEVRİYE" butonunu durdurup yeniden başlatınız; alt kısımdaki "Hassas Kesişim Koridoru"nu farenizle manuel olarak kaydırınız. "GÖZLEMLENEN ODAK" kutusu tünelden geçerken sağ paneldeki ve koridordaki telemetri sayacının milisaniyelik hassasiyetle değiştiğini gözlemleyiniz.
