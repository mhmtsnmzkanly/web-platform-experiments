# Deney 001 İşlem Günlüğü (Journal)

Bu belge yalnızca sona ekleme (append-only) kuralıyla işletilir. Hiçbir blok silinmez veya geriye dönük değiştirilmez.

## 2026-09-29T00:20:25+03:00 | MAIN | INIT
İşlem: Laboratuvar başlatıldı. PROMPT.md incelendi.
Gerekçe: Proje misyonu ve kuralları tespit edildi; sıfır harici bağımlılık, tek dosya, izinsiz çalışma ve iki üst düzey dizin (src/, reports/) kuralları belirlendi.
Sonuç: Aşama A hazırlığı başlatıldı.

## 2026-09-29T00:22:00+03:00 | MAIN | SETUP
İşlem: Dizin yapısı ve ana Markdown belgeleri oluşturuldu.
Oluşturulan dosyalar: src/, reports/, README.md, TECHNOLOGIES.md, PROGRESS.md, CURRENT.md.
Sonuç: Aşama A başarıyla tamamlandı.

## 2026-09-29T00:24:50+03:00 | MAIN | SCRIPTS
İşlem: Beş yardımcı betik (web-server.sh, screenshot.sh, validate.sh, browser-test.sh, dependency-check.sh) yazıldı ve yürütme yetkileri (chmod +x) verildi.
Sonuç: Betikler hazırlandı, izole test aşamasına geçildi.

## 2026-09-29T00:25:55+03:00 | TEST | VERIFY_INFRA
İşlem: Yardımcı betikler /tmp üzerinde gerçek pozitif ve negatif test senaryolarıyla denendi.
- validate.sh: Geçerli HTML dosyasını onayladı (0), yinelenen ID ve JS syntax hatasını yakaladı (1).
- dependency-check.sh: Temiz dosyayı onayladı (0), harici CDN, @import, url(), fetch ihlallerini yakaladı (1).
- web-server.sh: 7373 portunda sunucuyu başlattı, ikinci çağrıda "Sunucu açık" dedi, curl ile 200 OK doğrulandı.
- browser-test.sh: Headless Chromium CDP ile DOM'daki 'Hello World' görünürlüğünü doğruladı (0), display:none durumunda başarısız oldu (1), JS runtime patlamasını yakaladı (1).
- screenshot.sh: 1280x800 çözünürlüğünde geçerli PNG üretti (0), geçersiz URL'de hata döndü (1).
Sonuç: Altyapı kapısı başarıyla aşıldı.

## 2026-09-29T00:26:30+03:00 | DEV | FILE_CREATE
İşlem: src/001.dev.html oluşturulması başlatıldı.
Amaç: Yalın semantik HTML5 başlangıç referansının kodlanması.
Kapsam: Hiçbir CSS veya JS olmadan doğrudan tarayıcı varsayılan başlığı ile Hello World sunumu.

## 2026-09-29T00:26:40+03:00 | TEST | COMMAND
Komut: ./validate.sh src/001.dev.html
Çıkış kodu: 1
Sonuç: FAIL — Dosya başındaki HTML yorum bloğu sebebiyle DOCTYPE regex eşleşmedi ("HTML5 DOCTYPE bildirimi eksik veya hatalı").

## 2026-09-29T00:26:48+03:00 | TEST | FIX
İşlem: validate.sh regex kuralı WHATWG HTML5 standardına uygun olarak DOCTYPE öncesi HTML yorumlarını destekleyecek şekilde güncellendi.
Sonraki adım: Test zincirinin yeniden çalıştırılması.




## 2026-09-29T00:27:05+03:00 | TEST | VERIFY_DEV
Komutlar:
- ./validate.sh src/001.dev.html -> Çıkış kodu: 0 (PASS)
- ./dependency-check.sh src/001.dev.html -> Çıkış kodu: 0 (PASS)
- ./browser-test.sh http://localhost:7373/001.dev.html -> Çıkış kodu: 0 (PASS)
- ./screenshot.sh http://localhost:7373/001.dev.html reports/001 -> Çıkış kodu: 0 (PASS)
Görsel İnceleme: reports/001/screenshot.png incelendi. 1280x800 çözünürlükte sol üstte siyah, serif <h1>Hello World</h1> tarayıcı varsayılan başlığı net şekilde doğrulandı.

## 2026-09-29T00:27:30+03:00 | MAIN | PUBLISH
İşlem: src/001.dev.html dosyası src/001.html olarak yeniden adlandırıldı.
Erişim Kontrolü: http://localhost:7373/001.html adresi üzerinden HTTP 200 OK ve tarayıcı çalışma zamanı testi (browser-test.sh) ile doğrulandı.
Durum: Deney 001 başarıyla tamamlandı ve yayımlandı. Dosya salt okunur ve değiştirilemez hale getirildi.

## 2026-09-29T00:56:00+03:00 | MAIN | DÜZELTME
İşlem: DUZELTME_PROMPT.md talimatı doğrultusunda kavramsal düzeltme yapıldı.
Açıklama: 'Hello World merkezde' tanımının ekranın geometrik ortasına yerleştirme zorunluluğu taşımadığı, görsel ve kavramsal odak noktası olması anlamına geldiği netleştirildi.
Yapılan Değişiklik: reports/001/report.md dosyasında görüntüyü 'merkezdedir' şeklinde ifade eden yanıltıcı ibare düzeltildi; sol üst blok akışında yer almasının saf semantik HTML referansı için tam ve doğru olduğu teyit edildi. screenshot.png dosyası korunmuştur.
Sonraki Adım: browser-test.sh betiğinin çok kanallı (DOM/SVG, Canvas/WebGL, ağ, izin) modelle güçlendirilmesi ve doğrulama testleri.

## 2026-09-29T00:56:30+03:00 | TEST | VERIFY_SUITE
İşlem: Güçlendirilmiş browser-test.sh betiği /tmp altında 6 farklı pozitif/negatif senaryo ile test edildi:
- Case 1 (Görünür semantik h1): PASS (0)
- Case 2 (Örtülü/occluded metin): FAIL (1) - "başka bir eleman tarafından örtülmüş" tespiti yapıldı.
- Case 3 (Canvas üzerinde çizim, DOM metni yok): PASS (0) - DOM_VISIBILITY: NOT_APPLICABLE, GRAPHICS_RENDER: PASS olarak doğru sınıflandırıldı.
- Case 4 (Boş canvas): FAIL (1) - "Canvas yüzeyi mevcut ancak boş veya çizim yapılmamış" tespiti yapıldı.
- Case 5 (JS runtime hatası): FAIL (1) - İstisna yakalandı.
- Case 6 (Yasak harici ağ isteği): FAIL (1) - Harici resim isteği ORB / CDP Network filtresi ile yakalandı.
Sonuç: Çok kanallı test mimarisi başarıyla doğrulandı.

## 2026-09-29T00:57:00+03:00 | TEST | REVERIFY_001
İşlem: Mevcut tamamlanmış src/001.html dosyası yeni doğrulama betikleriyle tekrar test edildi.
Komutlar:
- ./validate.sh src/001.html -> Çıkış kodu: 0 (PASS)
- ./dependency-check.sh src/001.html -> Çıkış kodu: 0 (PASS)
- ./browser-test.sh http://localhost:7373/001.html -> Çıkış kodu: 0 (PASS)
Kategori Çıktısı: DOM_VISIBILITY: PASS, GRAPHICS_RENDER: NOT_APPLICABLE, RUNTIME: PASS, NETWORK: PASS, PERMISSIONS: PASS.
Sonuç: src/001.html dosyasının bütünlüğü ve geçerliliği değişmeksizin korunmuştur.
