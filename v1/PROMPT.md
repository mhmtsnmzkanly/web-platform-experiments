# HELLO WORLD LAB — ANA ÇALIŞMA TALİMATI (PROMPT.MD)

> **Çalıştırma İlkesi:** Kullanıcı "PROMPT.md oku ve uygula" dediğinde bu dosyanın bulunduğu proje kökünde çalış. Bu belge projenin **tek ve nihai çalışma anayasasıdır**. Başka hiçbir belgeden çelişkili kural türetilmez. Gerçekte yapılmayan araştırmayı, testi veya görsel incelemeyi yapılmış gibi raporlama. Kullanıcı projeyi duraklatmışsa açık devam talimatı olmadan yeni deney başlatma.

---

# 1. Tek Ajan ve Kesin Sıralı Çalışma

Projeyi tek bir ana ajan yürütecektir.

Alt ajan, `invoke_subagent` veya benzeri bir görev dağıtım sistemi kesinlikle kullanılmayacaktır. Bütün araştırma, tasarım, kodlama, test, hata ayıklama ve belgeleme adımları tek bir ana oturum bağlamında yürütülür.

Her deney aşağıdaki sıralı fazlardan geçecektir:

1. **Durum kontrolü:** `CURRENT.md` ve `PROGRESS.md` üzerinden mevcut durumun ve sıradaki deney numarasının tespiti.
2. **Teknoloji ve tasarım araştırması:** `TECHNOLOGIES.md` indekslerinin incelenmesi ve yeni yetenek veya kombinasyonun belirlenmesi.
3. **Üç alternatif fikir üretimi:** Birbirinden teknik mekanizma, Hello World'e etkisi ve görsel karakter bakımından belirgin şekilde ayrışan 3 aday fikir tasarlanması.
4. **Fikir seçimi:** Adayların değerlendirilerek en uygun olanının seçilmesi ve gerekçesinin kaydedilmesi.
5. **`src/NNN.dev.html` geliştirme:** Seçilen fikrin sıfır dış bağımlılıkla tek dosya olarak kodlanması.
6. **Otomatik doğrulama:** `./verify.sh src/NNN.dev.html reports/NNN` ile statik bağımlılık, sözdizimi, CSSOM ve tarayıcı çalışma zamanı denetimi.
7. **Görsel inceleme:** Üretilen `screenshot.png` (ve gerekiyorsa çoklu ekran görüntülerinin) açılıp Hello World odağının ve görsel kalitenin incelenmesi.
8. **Teknik raporlama:** `reports/NNN/report.md` dosyasının hazırlanması ve gerekiyorsa `İNSAN DOĞRULAMASI GEREKLİ` notunun eklenmesi.
9. **Başarılıysa `src/NNN.html` olarak mühürleme:** Dosyanın `mv` ile taşınması (yetim `.dev.html` bırakılmaması).
10. **İndeks ve durum belgelerini güncelleme:** `TECHNOLOGIES.md`, `PROGRESS.md` ve `CURRENT.md` dosyalarının güncellenmesi; kullanıcıya bitiş mesajı verilmesi.

Bir deney tamamlanmadan, test edilmeden ve mühürlenmeden sonraki deneyin geliştirilmesine kesinlikle başlanmayacaktır.

---

# 2. İki Başlangıç Senaryosu

`PROMPT.md` tek başına başka bir dizine kopyalandığında da anlaşılır, kendi kendine yeterli ve uygulanabilir olmalıdır.

## Senaryo A — Sıfırdan Kurulum

Dizinde yalnızca `PROMPT.md` varsa veya mevcut Hello World Lab yapısı bulunmuyorsa:

1. `src/` dizinini oluştur.
2. `reports/` dizinini oluştur.
3. Gerekli ana belgeleri oluştur:
   - `README.md`
   - `TECHNOLOGIES.md`
   - `PROGRESS.md`
   - `CURRENT.md`
4. Gerekli yardımcı betikleri oluştur (`web-server.sh`, `screenshot.sh`, `dependency-check.sh`, `browser-test.sh`, `verify.sh`).
5. Çalışma ortamı gereksinimlerini kontrol et (Python 3, Node.js, Google Chrome/Chromium, Bash).
6. Betikleri `/tmp` altında pozitif ve negatif test senaryolarıyla doğrula.
7. Test altyapısı güvenilir biçimde çalışmadan ilk deneye başlama.
8. `reports/001/` çalışma alanını (`report.md`, `journal.md`) oluştur.
9. `src/001.dev.html` ile başla.
10. Bu belgenin sonundaki referans `001.html` örneğini temel al.

## Senaryo B — Mevcut Projeye Devam

Mevcut bir laboratuvar yapısı bulunuyorsa:

1. Projeyi sıfırlama. Mevcut dosya ve klasörleri silme.
2. `CURRENT.md` dosyasını oku.
3. `PROGRESS.md` üzerinden son tamamlanan deneyi belirle.
4. `src/*.dev.html` kontrolü yap (yarım kalmış dosya var mı?).
5. Yarım kalmış deney varsa ilgili `reports/NNN/journal.md` ve gerekiyorsa `report.md` dosyasını oku.
6. Yardımcı betiklerin mevcut olup olmadığını ve sunucunun çalıştığını kontrol et.
7. Son tamamlanan HTML ile karşılık gelen `reports/NNN/` dizininin tutarlı olduğunu doğrula.
8. Yarım kalan deney varsa kaldığı yerden devam et.
9. Yarım deney yoksa sıradaki numarayı belirle.
10. Tamamlanmış HTML dosyalarını hiçbir koşulda değiştirme.

Bütün geçmişi otomatik ve gereksiz olarak yeniden okuma; hedefli okuma yap.

---

# 3. Çalışma Ortamı Gereksinimleri

Şimdilik mevcut Python altyapısı korunacaktır. Python → Node.js tam geçişi bu görevin kapsamında değildir; mevcut çalışan Python kodlarını yalnızca bağımlılığı kaldırmak amacıyla yeniden yazma.

- **Python 3:** Mevcut yardımcı betiklerin içindeki Python kodları (`dependency-check.sh`), yerel HTTP sunucusu (`python3 -m http.server 7373`) ve test yardımcı altyapısı için.
- **Node.js:** JavaScript sözdizimi, yardımcı test mantığı, CSSOM ve Chrome DevTools Protocol (CDP) otomasyonu için.
- **Google Chrome veya Chromium:** Gerçek tarayıcı doğrulaması, headless çalışma zamanı denetimi, CSS parsing ve ekran görüntüleri için.
- **Bash:** `.sh` yardımcı betiklerini çalıştırmak ve süreçleri orkestre etmek için.

---

# 4. Hello World Odak İlkesi

"Hello World merkezde olacak" ifadesini geometrik ekran merkezi olarak yorumlama.

Anlamı:

- `Hello World` deneyin görsel ve kavramsal ana konusu olmalıdır.
- Kullanılan yeni teknoloji veya teknoloji kombinasyonu doğrudan `Hello World` ile ilişkili olmalıdır (onun çizimi, animasyonu, deformasyonu, hesaplanması veya etkileşimi).
- `Hello World` ekranın herhangi bir bölgesinde bulunabilir.
- Hareket edebilir, dönüşebilir veya Canvas, WebGL, SVG gibi bir yüzeyde oluşturulabilir.
- Dekoratif yan unsurlar (paneller, cetveller, arka plan efektleri) `Hello World`'ü ikinci plana atmamalı veya okunaksız kılmamalıdır.

---

# 5. Teknolojik Yenilik Modeli

Deneyler iki farklı yolla teknolojik yenilik üretebilir:

## A — Yeni Teknoloji

Daha önce kullanılmamış bir yerleşik tarayıcı teknolojisi veya Web API'si kullanılır (örneğin WebGL, Web Audio, Web Cryptography, CSS Container Queries).

## B — Yeni Teknoloji Kombinasyonu

Daha önce kullanılmış iki veya daha fazla teknoloji arasında daha önce uygulanmamış işlevsel bir ilişki kurulur.

- Sadece aynı dosyada iki API bulunması kombinasyon sayılmaz.
- Gerçek bir veri veya davranış akışı bulunmalıdır (`A'nın çıktısı/olayı → B'nin davranışı → Hello World'e katkı`).
- Örnek mekanizma mantığı: `ResizeObserver -> boyut verisi -> Canvas parçacık sisteminin yeniden hesaplanması`.
- Aynı API kombinasyonu daha önce kullanılmış olsa bile yeni ve gerçekten farklı bir mekanizma oluşturuyorsa tekrar kullanılabilir.
- Yeni kombinasyonlar ve mekanizmalar `TECHNOLOGIES.md` içerisinde kaydedilmelidir.

---

# 6. API Kombinasyon Algoritması

Yeni deney seçilirken şu sıralı mantık uygulanır:

1. `TECHNOLOGIES.md` içerisindeki kısa teknoloji ve mekanizma indeksini incele.
2. Kullanılmamış tarayıcı yeteneklerini belirle.
3. Daha önce kullanılan teknolojiler arasında tamamlayıcı yetenekler ara.
4. Teknolojilerin girdi/çıktı veya olay/veri akışlarını birbirine bağlama olasılıklarını değerlendir.
5. Daha önce uygulanmış aynı mekanizmaları ele.
6. `Hello World` üzerinde somut etki üretmeyen kombinasyonları ele.
7. Üç güçlü aday fikir oluştur.
8. Teknik ve görsel açıdan en anlamlı olanı seç.

Her yeni deney için bütün geçmiş HTML dosyalarını baştan sona okuma. Benzer mekanizma tespit edilirse yalnızca ilgili geçmiş deneylerin raporlarını ve gerektiğinde kaynak kodunu incele.

---

# 7. Tasarım Kombinasyon Sistemi

Tasarımı sabit birkaç tema arasında deterministik döngüye sokma. Tasarımı bileşenlerine ayır.

En az şu 5 boyutu kullan:

1. **Tipografi:** Yazı tipi karakteri, oran, hiyerarşi, ritim.
2. **Renk:** Algısal palet, doygunluk, kontrast, zemin ilişkisi.
3. **Kompozisyon:** Mizanpaj, ızgara, asimetri, negatif alan, odak yönü.
4. **Malzeme hissi:** Doku, yüzey, cam, kâğıt, mat, parıltı, derinlik.
5. **Hareket / davranış:** İvmelenme, sönümleme, yaylanma, akışkanlık, tepki.

Başlangıç tasarım aileleri (şablon değil, esinlenme kataloğu):

1. İsviçre Modernizmi (Swiss Style / Grid / Akılcı Tipografi)
2. Bauhaus (Geometrik saflık, birincil formlar)
3. Brütalizm (Ham kontrast, monospaced tipografi, tavizsiz çizgiler)
4. Editoryal Tasarım (Dergi mizanpajı, zengin serif, asimetrik sütunlar)
5. Organik / Akışkan (Doğal hareket, amorf formlar, yumuşak geçişler)
6. Retro Dijital (Erken bilgisayar estetiği, CRT, monokrom fosfor, piksel)
7. Japon Minimalizmi (Ma boşluğu, asimetrik dinginlik, yalınlık)
8. Siber Fütürizm (Neon, koyu zemin, teknik şematik katmanlar)
9. Kâğıt / Kolaj (Dokulu katmanlar, kesik formlar)
10. Matematiksel / Generatif Sanat (Harmonikler, fraktallar, algoritmik düzen)
11. Kinetik Tipografi (Karakter morfolojisi, gerilme, elastik deformasyon)
12. Cam / Işık (Saydamlık, kromatik kırılma, ışıma alanları)

Bu aileler hazır şablon değildir; farklı tasarım ailelerinin bileşenleri birleştirilebilir (örneğin İsviçre tipografisi + pastel renk sistemi + organik hareket + kâğıt malzeme hissi).

Her deneyde son birkaç deneyin görsel karakterini incele ve belirgin tekrarları önle. Yeni deney farklı bir estetik karakter oluşturmalı; ancak sırf farklı görünmek için teknolojik amaç bozulmamalıdır.

---

# 8. Üç Alternatif Fikir

Kod yazmaya başlamadan önce 3 farklı fikir oluşturulmalıdır:

- Teknik mekanizma bakımından,
- `Hello World`'e etkisi bakımından,
- Görsel karakter bakımından

birbirinden gerçekten farklı olmalıdır. Üç farklı isimle aynı tasarımı tekrar üretme.

Ajan her zaman en karmaşık fikri seçmek zorunda değildir. Seçimde şu kriterler birlikte değerlendirilir:

- Teknolojik yenilik
- API'ler arası gerçek etkileşim ve veri akışı
- `Hello World`'e katkı
- Görsel özgünlük
- Önceki deneylerden farklılaşma
- Gereksiz karmaşıklıktan kaçınma
- Test edilebilirlik

*(Not: Deney 001 yalın başlangıç referansı olduğundan 3 alternatif kuralının tek istisnasıdır.)*

---

# 9. Tasarım Araştırması

Ajan:

- Tarayıcı teknolojilerinin teknik dokümantasyonunu (MDN, W3C, WHATWG specs),
- Deneysel web tasarımlarını,
- Yaratıcı kodlama örneklerini,
- Üretken sanat çalışmalarını,
- Tipografi ve grafik tasarım referanslarını

araştırabilir.

**Kesin Kural:** Dışarıdan hazır kod, kütüphane veya tasarım kopyalanamaz. Araştırmanın amacı fikir ve teknik ilke edinmektir.

---

# 10. Sıfır Dış Bağımlılık Politikası

Her deney kendi HTML dosyası içerisinde tamamen bağımsız, kendi kendine yeten tek bir dosya olmalıdır.

**Kesinlikle Yasaktır:**
- CDN bağlantıları
- NPM veya harici browser paketleri
- Harici JavaScript dosyaları (`<script src="...">`)
- Harici CSS dosyaları (`<link rel="stylesheet">`)
- Harici fontlar (Google Fonts, web font dosyaları)
- Harici görsel dosyaları (`.png`, `.jpg`, `.webp`)
- Harici video ve ses dosyaları
- `<iframe>` kullanımı
- CSS `@import`
- Harici SVG dosyaları
- Zorunlu yerel yardımcı yan dosyalar
- Backend, sunucu tarafı mantık veya harici API çağrıları
- Sayfa çalışırken gerekli herhangi bir dış ağ kaynağı

**İzin Verilen Mekanizmalar:**
Şunlar ancak HTML dosyasının kendi içindeki verilerden veya kodundan üretiliyorsa meşrudur:
- `data:` URI'leri (örneğin satır içi data resimleri veya SVG)
- `Blob` ve `URL.createObjectURL(blob)`
- Satır içi koddan üretilen Blob Worker (`new Worker(URL.createObjectURL(blob))`)
- Canvas veya WebGL tarafından çalışma zamanında üretilmiş dokular ve pikseller

Bu mekanizmalar dış kod veya harici içeriği gizlice sayfaya yüklemek için kesinlikle kullanılamaz.

---

# 11. Katı Dış Kaynak Denetimi

Doğrulama motoru bağımlılıkları iki aşamada denetler:

## Faz 1 — Statik Bağımlılık Denetimi

Önce `dependency-check.sh` çalıştırılır. Şu noktalar statik olarak incelenir:
- HTML etiketleri: `script[src]`, `link[rel]`, `base[href]`, `img`, `audio`, `video`, `source`, `track`, `embed`, `iframe`, `image`, `use`.
- `srcset` niteliği: WHATWG standardında adaylara ayrıştırılır. Birden fazla aday bağımsız olarak değerlendirilir. Harici/göreli aday varsa reddedilir; meşru `data:` ve `blob:` adayları kabul edilir.
- Satır içi CSS: `@import` ve `url(...)` çağrıları taranır.
- SVG: `href` ve `xlink:href` nitelikleri denetlenir.
- JavaScript: `fetch()`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon()`, dinamik `import()`, `new Worker()`.
- Dinamik `fetch()` denetimi: Değişken birleştirmeleri (`+`), şablon dizgisi enterpolasyonları (`` `https://${host}/api` ``), kodlanmış fonksiyonlar (`atob`, `decodeURI`, `fromCharCode`, `eval`), veya güvenliği statik olarak belirlenemeyen dinamik değişken argümanları doğrudan reddedilir.
- Kod içi harici URL dizgileri (`http://`, `https://`, `//`) taranır (XMLNS ve localhost/127.0.0.1 istisnaları hariç).

Harici ağ bağımlılığı tespit edilirse tarayıcı testine kesinlikle geçilmez; derhal durulur.

---

# 12. verify.sh Ana Doğrulama Girişi

Deney doğrulamasının tek ve ana giriş noktası `verify.sh` betiğidir.

Genel Akış Sırası:
1. **Statik dış bağımlılık kontrolü** (`dependency-check.sh`)
2. **Birleşik Chrome tabanlı kod ve tarayıcı çalışma zamanı testi** (`browser-test.sh`)
3. **Hello World görünürlük ve render doğrulaması**
4. **Yeni teknolojiye özgü çalışma zamanı kanıtı kontrolü**
5. **Ekran görüntüsü oluşturma ve kaydetme** (`screenshot.sh` / CDP)
6. **Görsel inceleme**
7. **Nihai sonuç üretimi**

**Çıktı Sözleşmesi:**
- Bütün zorunlu kontroller başarılı olduğunda terminal çıktısı **YALNIZCA:**
  ```text
  OK
  ```
  olmalıdır. Çıkış kodu `0`dır.
- Başarısızlık durumunda çıktı:
  ```text
  ERRORS
  ```
  ile başlamalı; ardından kategorilere ayrılmış, somut ve eyleme dönüştürülebilir hata açıklamaları listelenmelidir. Çıkış kodu `1` (sıfırdan farklı) olmalıdır.

---

# 13. browser-test.sh

`browser-test.sh` hem statik sözdizim denetimlerini hem de gerçek tarayıcı çalışma zamanı testlerini tekil birleşik oturumda yürütür. Ayrı bir `validate.sh` zorunlu doğrulama adımı olarak kullanılmaz.

Google Chrome veya Chromium gerçek doğrulama motorudur. Denetimler en az şunları kapsar:

- HTML5 DOCTYPE bildirimi
- Yinelenen DOM `id` kontrolü
- JavaScript V8 sözdizimi ayrıştırması
- **Chrome Tabanlı CSSOM ve `CSS.supports()` Denetimi:**
  - Elle yazılmış yüzeysel süslü parantez sayma kontrolleriyle yetinilmez.
  - Chrome'un CSS parser, CSSOM (`document.styleSheets`, `cssRules`) ve yerleşik `CSS.supports()` arayüzleri kullanılır.
  - `<style>` blokları ve satır içi `style="..."` nitelikleri incelenir.
  - Chrome'un geçersiz CSS bildirimlerini (`display: invalid_value`, `color: not_a_color`) sessizce yok saydığı dikkate alınarak her deklarasyon doğrulanır ve geçersiz olanlar raporlanır.
  - Modern ve geçerli CSS kuralları (`animation-timeline: scroll(root)`, `view()`, `color-mix()`, `clamp()`, vb.) yanlışlıkla reddedilmez.
- Çalışma zamanı JavaScript istisnaları (`Runtime.exceptionThrown`)
- Yakalanan konsol hata mesajları (`console.error`)
- DOM ve Shadow DOM metin görünürlüğü (geometri, stil, donukluk, örtülme / occlusion, şeffaflık)
- Canvas 2D / WebGL / SVG render doğrulaması ve renk entropisi (tek renk boyanmış sahte yüzeylerin elenmesi)
- Sayfa canlılığı ve donma kontrolü
- Navigasyon öncesi ağ izleme
- Navigasyon öncesi CDP izin tuzakları
- Yeni teknolojinin gerçekten çalışıp çalışmadığının kanıtı

---

# 14. Hata Kategorileri

Tespit edilen hatalar şu standart 11 kategori altında raporlanır:

- `[DEPENDENCY]`: Harici ağ bağımlılığı, CDN veya tek dosya kuralı ihlali.
- `[CONSOLE_ERROR]`: Çalışma zamanında tetiklenen `console.error()` mesajı.
- `[RUNTIME_EXCEPTION]`: Yakalanmamış JavaScript çalışma zamanı istisnası.
- `[DOM_VISIBILITY]`: `Hello World` metninin DOM'da bulunamaması, gizli veya örtülü olması.
- `[GRAPHICS_RENDER]`: Canvas/WebGL/SVG yüzeyinin boş kalması veya tek renkli düz boyama içermesi.
- `[SECURITY_VIOLATION]` / `[PERMISSIONS]`: Kullanıcı izni isteyen hassas bir Web API'sinin çağrılması.
- `[STATIC_SYNTAX]`: HTML5 doctype, yinelenen ID veya JS sözdizimi hatası.
- `[CSS]`: Geçersiz CSS özelliği veya değeri kullanımı.
- `[ANIMATION_STALL]`: Animasyonun veya render döngüsünün donması/durması.
- `[TIMEOUT]`: Testin zaman aşımına uğraması (18 saniye sınırının aşılması).
- `[TEST_INFRASTRUCTURE]`: Chrome'un bulunamaması, başlatılamaması, CDP bağlantısının kurulamaması veya test altyapısı istisnaları.

Chrome bulunamadığında, açılamadığında veya CDP koptuğunda açıklamasız `ERRORS` üretilmez; somut neden `[TEST_INFRASTRUCTURE]` altında bildirilir.

---

# 15. Kullanıcı İzni Politikası

Deneyler kullanıcıdan kesinlikle tarayıcı izni istememelidir.

Hassas API girişimleri, sayfanın kendi JavaScript'i çalışmadan önce navigasyon öncesi CDP tuzaklarıyla (`Page.addScriptToEvaluateOnNewDocument`) izlenir ve engellenir:
- Kamera ve mikrofon (`getUserMedia`, `getDisplayMedia`)
- Coğrafi konum (`geolocation.getCurrentPosition`, `watchPosition`)
- Bildirimler (`Notification.requestPermission`)
- Pano okuma (`clipboard.read`, `clipboard.readText`)
- Donanım seçimi (`bluetooth.requestDevice`, `usb.requestDevice`, `serial.requestPort`, `hid.requestDevice`)

Bu API'ler deneyin zorunlu parçası olamaz. Tarayıcının izin istemini sessizce reddetmesi uygulamanın kurala uyduğunu kanıtlamaz; izin isteme girişiminin varlığı doğrudan güvenlik ihlalidir (`[PERMISSIONS]`).

---

# 16. Görsel Doğrulama

Otomatik piksel veya DOM kontrolü, insanın görsel değerlendirmesinin kusursuz yerine geçemez.

- Canvas üzerinde birkaç renkli piksel bulunması veya metnin DOM ağacında yer alması `Hello World`'ün doğru ve estetik render edildiğini tek başına kanıtlamaz.
- Ekran görüntüsü gerçekten açılarak incelenmelidir.
- Birincil ekran görüntüsü her deney için `screenshot.png`'dir (1280x800).
- Animasyonlu, dinamik veya etkileşimli deneylerde anlamlıysa şu ek ekran görüntüleri kaydedilebilir:
  - `screenshot-start.png`
  - `screenshot-mid.png`
  - `screenshot-end.png`
  - `screenshot-late.png`
  - `screenshot-interaction.png`
- Her deney bunların hepsini üretmek zorunda değildir; yalnızca doğrulama açısından anlamlı olanlar kullanılır ve `report.md` içinde zamanı/etkileşimi belirtilir.

---

# 17. İnsan Doğrulaması Gerekli Durumu

Otomatik testler başarıyla tamamlanmış olabilir; ancak ajan bazı görsel veya davranışsal özellikleri güvenilir biçimde otomatik olarak doğrulayamayabilir (örneğin akışkan bir fizik hissi, ses frekansı estetiği, karmaşık bir izometrik perspektif veya optik illüzyon).

Bu durumda başarılıymış gibi kesin iddia üretilmeyecektir.

`reports/NNN/report.md` içerisinde:

## İNSAN DOĞRULAMASI GEREKLİ

başlığı açılır. Altında açıkça şunlar yazılır:
- Otomatik olarak doğrulanamayan somut özellik
- Neden otomatik olarak doğrulanamadığı
- Ajanın elindeki mevcut teknik kanıt (log, sayaç, render entropisi)
- İnsan tarafından tarayıcıda yapılması gereken somut kontrol ve gözlem adımı

Bu durum otomatik test hatasıyla (`FAIL`) aynı şey değildir; otomatik testlerin `OK` çıktısını engellemez ancak dürüst belgelemenin zorunlu bir parçasıdır.

---

# 18. Öz-Kontrol ve Döngü Kırma Mekanizması

Ajan kendi geliştirme sürecinde tekrar eden başarısızlıkları sayaçlarla takip etmelidir. Aynı hata veya aynı temel başarısızlık üzerinde gerçek ilerleme olmadan tekrar tekrar işlem yapılmaz.

**Zorunlu Koruma Kuralları:**
- Aynı temel hata veya başarısızlık üzerinde **üç ilerlemesiz denemeden sonra** strateji değiştir.
- Bir deney içerisinde en fazla **iki büyük strateji değişikliği** yap.
- Bir deneyde toplam geliştirme-test döngüsü **12'yi geçerse** durumu yeniden değerlendir ve dur.
- Dokuz ciddi fikir adayından hiçbiri anlamlı yenilik üretmiyorsa durumu `YENİLİK TIKANMASI` olarak kaydet ve dur.
- Stratejiler tükendiyse deney numarasını sırf ilerlemek için artırma.
- `.dev.html` dosyasını ve işlem günlüklerini koru.
- `CURRENT.md` içerisine engeli yaz ve durumu `BLOKE` yap.
- Kullanıcıya deneyin neden durduğunu bildir (`DENEY NNN DURAKLATILDI` veya `DENEY NNN TAMAMLANAMADI`).

`CURRENT.md` içinde her deneme döngüsünde güncellenen makine tarafından okunabilir öz-kontrol bloğu tutulmalıdır:

```text
Deney: NNN
Durum: ARAŞTIRMA | TASARIM | GELİŞTİRME | TEST | İNCELEME | KOŞULLU | TAMAMLANDI | BLOKE
Hedef ve kabul ölçütü: ...
Son doğrulanmış ilerleme: ...
Son hata imzası: ...
Aynı hatanın tekrarı: 0
İlerlemesiz deneme: 0
Strateji değişikliği: 0
Toplam geliştirme-test döngüsü: 0
Son denenmiş çözümler: ...
Sonraki TEK somut adım: ...
```

Ajan gerçekten donarsa veya araç altyapısı yanıt vermiyorsa prompt tabanlı öz-kontrolün bunu tek başına çözemeyeceği kabul edilir; işletim sistemi zaman aşımları (`timeout`) ve insan müdahalesi devreye girer.

---

# 19. Belge Okuma Maliyetini Azalt

Her deneyde bütün proje geçmişi ve yüzlerce satırlık eski dosyalar baştan sona okunmaz.

**Hedefli Okuma Politikası:**
- `PROMPT.md`: Oturum başlangıcında veya ana bağlam kaybında okunur.
- `CURRENT.md`: Her deney başlangıcında ve kesinti sonrası okunur.
- `PROGRESS.md`: Son deney numarasını ve genel durumu belirlemek gerektiğinde okunur.
- `TECHNOLOGIES.md`: Teknoloji, kombinasyon veya tasarım seçerken ilgili indeks tabloları okunur.
- `reports/NNN/report.md`: Yalnızca ilgili eski deneyle teknik bir karşılaştırma yapılacaksa okunur.
- `reports/NNN/journal.md`: Yalnızca yarım kalmış bir deney sürdürülüyorsa veya hata araştırması yapılıyorsa son kısmı okunur.

Önce indeksler kullanılır; ardından yalnızca hedefli ayrıntı okunur.

---

# 20. Belge Sorumluluk Ayrımı

Aynı bilgi gereksiz yere birden fazla dosyada tekrar edilmez. Her belgenin sınırları nettir:

## CURRENT.md
Yalnızca anlık aktif operasyonel durum yer alır:
- Aktif deney numarası
- Aktif faz
- Son doğrulanmış ilerleme
- Varsa engel ve hata imzası
- Öz-kontrol sayaçları (aynı hata tekrarı, ilerlemesiz deneme, strateji değişikliği, toplam döngü)
- Sıradaki **tek** somut işlem

## PROGRESS.md
Kısa deney indeksi tablosudur:
- Deney numarası, başlık, yeni teknoloji/kombinasyon, test durumu, rapor yolu, ekran görüntüsü ve tarih.
- Uzun tasarım hikâyeleri veya kod parçaları içermez.

## TECHNOLOGIES.md
- Yerleşik Web API envanteri
- Kullanıldığı deneyler
- API kombinasyonları ve mekanizma akışları
- Teknolojik soy ağacı
- 5 boyutlu tasarım kombinasyon indeksi

## reports/NNN/report.md
Deneyin nihai teknik, mimari ve görsel değerlendirmesidir:
- Amaç, teknolojik mekanizma, tasarım kararı, test kanıtı, ekran görüntüsü incelemesi, sınırlamalar ve gerekiyorsa `İNSAN DOĞRULAMASI GEREKLİ` bölümü.

## reports/NNN/journal.md
Append-only (yalnızca sona eklenen) işlem günlüğüdür:
- Anlamlı dosya değişiklikleri, çalıştırılan önemli komutlar, test çıktıları, karşılaşılan hatalar, denenen stratejiler ve alınan kararlar kaydedilir.
- Her önemsiz kabuk çıktısı uzun uzun yazılmaz.
- Eski günlük kayıtları kesinlikle silinmez veya geriye dönük değiştirilmez; hata varsa yeni bir düzeltme kaydı eklenir.

---

# 21. Deney Başlangıç ve Bitiş Mesajları

Her deneyin başında ve sonunda kullanıcıya net durum mesajları verilir:

- Deney başlangıcında:
  ```text
  DENEY NNN İÇİN ÇALIŞMAYA BAŞLADIM
  ```
  Altında kısaca: teknoloji/kombinasyon, hedeflenen mekanizma ve tasarım yaklaşımı belirtilir.
- Başarıyla tamamlandığında:
  ```text
  DENEY NNN İÇİN ÇALIŞMA BİTTİ
  ```
  Altında URL, test durumu ve varsa insan inceleme notu belirtilir.
- Tamamlanamadığında veya durdurulduğunda:
  ```text
  DENEY NNN TAMAMLANAMADI
  ```
  (veya `DENEY NNN DURAKLATILDI`) yazılarak engel, sayaçlar ve neden açıkça izah edilir.

---

# 22. .dev.html ve Mühürleme

- Geliştirme aşamasındaki aktif dosya her zaman:
  `src/NNN.dev.html`
  olmalıdır.
- Tüm testler, otomatik doğrulama (`verify.sh`) ve görsel inceleme başarıyla tamamlandıktan sonra dosya:
  `src/NNN.html`
  olarak **`mv` ile yeniden adlandırılır**. Kopyalama yapılarak yetim `NNN.dev.html` dosyaları bırakılmaz.
- Tamamlanan `NNN.html` dosyaları kalıcıdır ve **kesinlikle değiştirilemez**.
- Geçmiş deneyleri "iyileştirmek" veya "düzeltmek" amacıyla geriye dönük HTML düzenlemesi yapılmaz.

---

# 23. İlk Deney Referansı

Aşağıdaki referans kod yalnızca sıfırdan kurulumda (`Senaryo A`) `001.dev.html` hazırlanırken temel alınmalıdır. Mevcut bir projedeki tamamlanmış `001.html` dosyasını değiştirmek için kesinlikle kullanılmaz.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
</head>
<body>
  <!--
    DENEY 001: Yalın semantik HTML.

    Tarayıcının varsayılan görüntüleme
    yeteneğini başlangıç referansı olarak
    kullanıyoruz.

    CSS ve JavaScript özellikle eklenmemiştir.
  -->

  <main>
    <h1>Hello World</h1>
  </main>
</body>
</html>
```
