# Deney 002 İşlem Günlüğü (Journal)

Bu belge yalnızca sona ekleme (append-only) kuralıyla işletilir. Hiçbir blok silinmez veya geriye dönük değiştirilmez.

## 2026-09-29T01:02:25+03:00 | MAIN | INIT
İşlem: Deney 002 hazırlık aşaması başlatıldı.
Amaç: CSS Flexible Box Layout (Flexbox) ve akışkan tipografi (clamp, dvh) yeteneklerinin araştırılması ve uygulanması.
Hedef Teknoloji: CSS Flexbox (`display: flex`, `justify-content`, `align-items`, `gap`, `flex-direction`) + Akışkan Tipografi (`clamp()`, `100dvh`).
Tasarım Alternatifleri:
- Alternatif A (Minimal Hizalama): Yalnızca justify-content/align-items merkezlemesi.
- Alternatif B (Akışkan Tipografi ve Koyu Tema): 100dvh esnek kapsayıcı, clamp(2.5rem, 8vw, 7rem) akışkan başlık, koyu tema kontrastı ve semantik flex hiyerarşisi.
- Alternatif C (Flex-Wrap Harf Blokları): Harflerin wrap ile elastik kutular halinde dizilmesi.
Seçilen Tasarım: Alternatif B (Görsel ve tipografik etkiyi en net vurgulayan, esnek kutu ve akışkan ölçeklemeyi kanıtlayan yaklaşım).
Sonraki Adım: CURRENT.md ve reports/002/report.md taslağının hazırlanması.

## 2026-09-29T01:03:15+03:00 | DEV | FILE_CREATE
İşlem: src/002.dev.html dosyası oluşturuldu.
Hedef: CSS Flexbox (display: flex, justify-content, align-items, gap) ve clamp() akışkan tipografi ile koyu tema odaklı Hello World tasarımı.
Özellikler: Sıfır harici font (system-ui), 100dvh esnek kapsayıcı, clamp(2.5rem, 8vw, 7rem) akışkan başlık, yüksek kontrastlı dark mode.
Sonraki Adım: Test zincirinin (validate.sh, dependency-check.sh, browser-test.sh, screenshot.sh) çalıştırılması.

## 2026-09-29T01:03:30+03:00 | TEST | VERIFY_DEV
Komutlar ve Çıkış Kodları:
- ./validate.sh src/002.dev.html -> Çıkış kodu: 0 (PASS) - CSS sözdizimi, HTML5 iskeleti doğrulandı.
- ./dependency-check.sh src/002.dev.html -> Çıkış kodu: 0 (PASS) - Sıfır dış bağımlılık, sistem fontu (system-ui).
- ./browser-test.sh http://localhost:7373/002.dev.html -> Çıkış kodu: 0 (PASS) - DOM_VISIBILITY: PASS (571x108px, x=354, y=330), RUNTIME: PASS, NETWORK: PASS, PERMISSIONS: PASS.
- ./screenshot.sh http://localhost:7373/002.dev.html reports/002 -> Çıkış kodu: 0 (PASS) - 1280x800 PNG kaydedildi.

## 2026-09-29T01:03:35+03:00 | TEST | VISUAL_REVIEW
İşlem: reports/002/screenshot.png doğrudan görüntülendi ve incelendi.
Bulgular: Derin koyu zemin (#0a0a0c) üzerinde, flex dikey ekseninde iki öğeli hiyerarşi (üstte rozet, altta devasa clamp() ölçekli beyaz Hello World) başarıyla gözlemlendi.
001 ile Görsel Karşılaştırma: 001'in beyaz zemin ve sol üst serif yazısına karşılık, 002 koyu tema üzerinde modern sans-serif tipografi ve flex düzeni ile güçlü bir görsel/kavramsal odak sunmaktadır.

## 2026-09-29T01:03:45+03:00 | MAIN | PUBLISH
İşlem: src/002.dev.html dosyası src/002.html olarak yeniden adlandırıldı.
Doğrulama: http://localhost:7373/002.html üzerinden çalışan tarayıcı testi (browser-test.sh) ile 0 hata ve görünürlük onaylandı.
Durum: Deney 002 tamamlandı ve yayımlandı. Dosya salt okunur ve değiştirilemez hale getirildi.
