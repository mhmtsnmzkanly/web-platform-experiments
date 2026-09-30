# Deney 022: IndexedDB API ve Kalıcı Tipografik Bellek Kasası

## 1. Amaç ve Kapsam
Bu deneyin amacı, modern web platformunun en güçlü ve olgun istemci tarafı yapılandırılmış depolama standardı olan **IndexedDB API** (`indexedDB.open()`, `IDBTransaction`, `IDBObjectStore`, `createIndex`, `openCursor`) yeteneğini sıfır dış bağımlılıkla kullanarak "HELLO WORLD" tipografisinin geometrik, stilistik ve ağırlık parametrelerini ACID (Atomiklik, Tutarlılık, Yalıtım, Dayanıklılık) garantileriyle yerel NoSQL veritabanında saklayan, sürümleyen ve geri yükleyen kriptografik bir tipografi arşiv kasası inşa etmektir.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. Şema Yaşam Döngüsü ve Nesne Depoları (`IDBObjectStore`, `createIndex`)
- `indexedDB.open("HelloWorldVaultDB", 1)` ile veritabanı başlatılır.
- `onupgradeneeded` olayında iki temel nesne deposu ve ikincil indeksler oluşturulur:
  - `vault_snapshots`: Tipografik anlık durumları saklayan depo (`keyPath: "id"`, `autoIncrement: true`).
  - `glyph_audit`: Her ACID işleminin mikro-gecikmesini ve zaman damgasını kaydeden işlem denetim defteri (`keyPath: "txId"`).
  - İkincil İndeksler: `by_theme` ve `by_timestamp` ile tematik ve kronolojik hızlı sorgulama.

### B. ACID İşlem Yürütme ve Dayanıklılık (`IDBTransaction: 'readwrite'`)
- Yeni bir tipografi önayarı seçildiğinde veya kullanıcı "ACID COMMIT" düğmesine bastığında:
  - `db.transaction(["vault_snapshots", "glyph_audit"], "readwrite")` başlatılır.
  - Veri eşzamanlı olarak iki depoya birden yazılır; hata durumunda tüm işlem otomatik geri alınır (rollback); başarı durumunda `tx.oncomplete` tetiklenir.
  - `performance.now()` ile işlem gecikmesi mikrosaniye hassasiyetinde ölçülerek canlı telemetri paneline yazılır (ort. ~0.60ms - 1.90ms).

### C. Asenkron İmleç Gezinimi ve Zaman Makinesi (`openCursor()`)
- `IDBCursor` (`store.openCursor()`) API'si kullanılarak veritabanındaki tüm tarihsel commitler sıralı biçimde taranır.
- Kullanıcı "ÖNCEKİ" / "SONRAKİ" imleç butonlarıyla veritabanındaki eski tipografik anlık görüntüler arasında zamanda yolculuk yapabilir; seçilen kayıt anında DOM üzerinde "HELLO WORLD" gliflerine reaktif olarak yansıtılır.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** Arşiv kasası ve bankacılık telemetri tipografisi. Arayüz ve telemetri metriklerinde monospaced (`ui-monospace`, `SFMono-Regular`, `Menlo`), ana "HELLO WORLD" vitrininde ise 4 farklı felsefe:
   - *Altın Arşiv:* Klasik serif (`Charter`, `Georgia`), 800 ağırlık, asil altın parıltısı.
   - *Kuantum Neon:* Terminal monospace, 700 ağırlık, yüksek tracking (`0.12em`), camgöbeği ışıma.
   - *Monolit Brüt:* Brutalist sans-serif (`system-ui`), 900 blok ağırlık, titan grisi.
   - *Yakut Defter:* Zarif editoryal serif, 500 ağırlık, derin yakut/ahududu ışıltısı.
2. **Renk Paleti:**
   - Derin obsidyen zemin (`#080a11`, `#0f1322`)
   - Şifreli altın amber (`#f59e0b`)
   - Manyetik kuantum camgöbeği (`#38bdf8`, `#06b6d4`)
   - Onaylanmış commit zümrüdü (`#10b981`)
   - Yakut kırmızısı (`#f43f5e`)
3. **Kompozisyon:** Çift parçalı kasa mimarisi: Sol tarafta köşe montaj braketleri ve parametrik durum çubuğuyla anıtsal "HELLO WORLD" vitrini ve ACID eylem paneli; sağ tarafta canlı veritabanı istatistikleri ve akan denetim defteri (Audit Ledger).
4. **Malzeme Hissi:** Kasa donanım kasası, yarı saydam cam paneller (`backdrop-filter: blur(16px)`), mikro LED durum ışığı ve 36px kare ızgara arka planı.
5. **Hareket:** Tepe başlıkta dönen çift eksenli veritabanı durum çemberi (`@keyframes db-ring-rotate`), LED durum nabzı (`@keyframes dot-pulse`) ve commit anında pürüzsüz CSS Custom Properties geçişleri.

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır harici kütüphane, CDN, font veya medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm CSS bildirimleri ve değişkenler geçerli).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 2 adet Web/CSS animasyonu ve yerel IndexedDB API motoru doğrulandı)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Altın Kasa Görünümü (screenshot-amber.png)](screenshot-amber.png): Altın arşiv teması, 3 adet ACID commit kaydı, 1.90ms işlem gecikmesi.
- [Yakut Defter Görünümü (screenshot-ruby.png)](screenshot-ruby.png): Yakut defter durumu, 4 commit kaydı, 500 font ağırlığı.
- [Kuantum Neon Görünümü (screenshot-quantum.png)](screenshot-quantum.png): Otomatik commit edilen camgöbeği kuantum durumu.
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa tam ekran genel kasa mimarisi.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak yerel NoSQL veritabanının tarayıcı oturumları arasındaki kalıcılığı ve imleç geziniminin kullanıcıya hissettirdiği arşivsel dokunsallık otomasyonla tek başına tam olarak değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** Sayfa yenilendiğinde (F5 / reload) IndexedDB içindeki geçmiş commitlerin korunması ve "ÖNCEKİ / SONRAKİ" imleç butonlarına tıklandığında "HELLO WORLD" kelimelerinin eski sürümlerine anında dönme hissi.
- **Mevcut Teknik Kanıt:** Headless Chromium oturumunda `HelloWorldVaultDB` veritabanının başarıyla açıldığı, `vault_snapshots` ve `glyph_audit` depolarına 4 adet commit yazıldığı, ekran görüntülerinde audit ledger kayıtlarının doğrulandığı kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/022.html` adresini açınız. Üst menüden "02 KUANTUM NEON" seçip "ACID COMMIT" butonuna tıklayınız. Sağ panelde yeni bir TX kaydının milisaniye cinsinden eklendiğini görünüz. Ardından "İMLEÇ: ÖNCEKİ" butonuna basarak bir önceki "Altın Kasa" durumuna geri dönünüz. Sayfayı yenileyip (F5) önceki tüm sürümlerin IndexedDB'den eksiksiz geri yüklendiğini doğrulayınız.
