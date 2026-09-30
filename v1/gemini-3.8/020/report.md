# Deney 020: View Transitions API ve Çok Durumlu Morfolojik Tipografi

## 1. Amaç ve Kapsam
Bu deneyin amacı, modern web platformunun en güçlü yerel görsel geçiş standardı olan **View Transitions API** (`document.startViewTransition()`, `view-transition-name`, `::view-transition-old()`, `::view-transition-new()`) yeteneğini kullanarak, harici hiçbir kütüphane veya animasyon çatısı olmadan çok durumlu kinetik tipografi sahnesi inşa etmektir. Sayfa üzerinde tanımlanan dört farklı grafik tasarım felsefesi (İsviçre Modernizmi, Bauhaus Geometrisi, Siber Monospace Konsol ve Klasik Editoryal Manşet) arasında geçiş yapılırken "HELLO" ve "WORLD" gliflerinin konum, boyut, renk, açı ve harf aralığı parametreleri tarayıcının yerleşik GPU kompozitörü tarafından pürüzsüzce morfolojik olarak birbirine dönüştürülür.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. Bildirime Dayalı Görünüm Geçişi (`document.startViewTransition()`)
- DOM durumu güncellenmeden önce `document.startViewTransition(callback)` çağrılır.
- Tarayıcı, eski DOM ağacının görsel temsilini bir anlık görüntü (pseudo-element ağacı) olarak dondurur; `callback` içerisinde DOM `data-theme` özniteliği ve metinleri değiştirilir; ardından tarayıcı yeni DOM görüntüsünü yakalar.
- İki görüntü arasındaki piksel enterpolasyonu ve geometrik dönüşüm ana iş parçacığını (main thread) kilitlemeden GPU kompozitöründe asenkron yürütülür.

### B. Bağımsız Eleman Morfolojisi (`view-transition-name`)
- Ana odak unsuru olan kelimelere tekil geçiş adları atanmıştır:
  - `word-hello` -> `view-transition-name: word-hello;`
  - `word-world` -> `view-transition-name: word-world;`
  - `masthead-pill` -> `view-transition-name: masthead-pill;`
- Bu sayede tarayıcı, sayfa genelindeki opaklık geçişinden bağımsız olarak bu iki kelimeyi özel birer görsel nesne olarak izler; eski boyut ve konumdan yeni boyut ve konuma matematiksel matris enterpolasyonu ile pürüzsüzce kaydırır ve ölçekler.

### C. Özel Sözde Eleman Denetimi (`::view-transition-*`)
- `::view-transition-group(word-hello)` ve `::view-transition-group(word-world)` hedeflerine `cubic-bezier(0.16, 1, 0.3, 1)` yaylanma eğrisi atanarak dinamik, organik bir his kazandırılmıştır.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** 4 farklı tarihsel/dijital dönemin tipografik karakteri:
   - *İsviçre Modernizmi:* Katı sans-serif (`system-ui`, `-apple-system`, `Helvetica Neue`), dik ve net formlar.
   - *Bauhaus Geometrisi:* Dinamik açılı rotasyon (`transform: rotate(-2deg)` ve `rotate(2deg)`), kalın geometrik harfler.
   - *Siber Monospace:* Teknik monospaced (`ui-monospace`, `Menlo`), geniş harf aralığı (`letter-spacing: 0.1em`) ve neon ışıldaması (`text-shadow`).
   - *Klasik Editoryal:* Asil serif (`Charter`, `Georgia`), italik vurgular ve zarif manşet düzeni.
2. **Renk Paleti:**
   - *İsviçre:* Buz mavisi zemin (`#f8fafc`), vermilion kırmızısı (`#ef4444`), derin grafit (`#0f172a`).
   - *Bauhaus:* Güneş sarısı (`#fef08a`), kobalt mavisi (`#2563eb`), bayrak kırmızısı (`#dc2626`).
   - *Siber:* Gece siyahı (`#090d16`), terminal zümrüdü (`#10b981`), elektrik camgöbeği (`#06b6d4`).
   - *Editoryal:* Sıcak parşömen (`#f5f0e6`), derin mürdüm (`#4a044e`), sıcak kehribar (`#d97706`).
3. **Kompozisyon:** Merkezde anıtsal ve ölçeklenebilir (`clamp(4rem, 14vw, 11rem)`) "HELLO WORLD" ikilisi; üstte minimal kontrol ve durum navigasyonu; altta monospaced telemetri göstergesi.
4. **Malzeme Hissi:** Temaya bağlı olarak sıfır ovallikten (İsviçre, 0px) organik kıvrımlara (Bauhaus, 24px) ve konsol paneline (Siber) geçiş yapan kenarlık ve yüzey dinamizmi.
5. **Hareket:** Hem kullanıcının isteğe bağlı buton etkileşimiyle hem de 4 saniyelik periyodik döngüyle tetiklenen, takılmasız ve organik GPU morfolojik geçişleri.

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır dış kütüphane, CDN, harici font veya medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm CSS ve View Transition kuralları geçerli, ayrıştırma hatası yok).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 1 adet CSS animasyonu ve yerel document.startViewTransition API desteği doğrulandı)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Durum 01: İsviçre Modernizmi (screenshot-start.png)](screenshot-start.png): Asimetrik ızgara, tavizsiz sans-serif ve vermilion vurgusu.
- [Durum 02: Bauhaus Geometrisi (screenshot-mid.png)](screenshot-mid.png): Birincil renk üçlüsü, dinamik dönüş açıları ve dairesel yarıçaplar.
- [Durum 03: Siber Monospace (screenshot-end.png)](screenshot-end.png): Terminal zümrüt ışığı, siber konsol ve monospaced telemetri.
- [Durum 04: Klasik Editoryal (screenshot-late.png)](screenshot-late.png): Sıcak parşömen dokusu, asil mürdüm dengesi ve zarif serif tipografisi.
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa ilk yüklenme anı.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak iki DOM ağacı arasındaki ara karelerin geçiş akıcılığı ve morfolojik optik his otomasyonla tek başına tam olarak değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** `document.startViewTransition()` tetiklendiğinde "HELLO" ve "WORLD" kelimelerinin font boyutları, renkleri ve rotasyonları arasındaki ara enterpolasyonun insan gözüne sunduğu kesintisiz estetik akış.
- **Mevcut Teknik Kanıt:** Chromium çalışma zamanında `document.startViewTransition` fonksiyonunun mevcut olduğu, tema geçiş fonksiyonunun başarıyla çalıştığı ve 4 durumun da ekran görüntülerinde hatasız oluşturulduğu kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/020.html` adresini açınız. Üst çubuktaki "01 İsviçre", "02 Bauhaus", "03 Siber", "04 Editoryal" butonlarına sırayla tıklayınız veya 4 saniyede bir gerçekleşen otomatik geçişi izleyiniz. Kelimelerin sıçrama yapmadan, elastik bir yaylanmayla yeni biçimlerine pürüzsüzce aktığını çıplak gözle doğrulayınız.
