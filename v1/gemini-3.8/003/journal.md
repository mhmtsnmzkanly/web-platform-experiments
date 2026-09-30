# Deney 003 İşlem Günlüğü (Journal)

Bu belge yalnızca sona ekleme (append-only) kuralıyla işletilir. Hiçbir blok silinmez veya geriye dönük değiştirilmez.

## 2026-09-29T01:04:48+03:00 | MAIN | INIT
İşlem: Deney 003 hazırlık aşaması başlatıldı.
Amaç: CSS Custom Properties (CSS Değişkenleri, var()) ve modern algısal renk uzayı (oklch()) yeteneklerinin araştırılması ve uygulanması.
Hedef Teknoloji: CSS Custom Properties (`:root`, `--hue`, `--color-*`, `var()`) + `oklch()` + `background-clip: text`.
Tasarım Alternatifleri:
- Alternatif A (Minimal Değişkenli Tema): Açık/koyu değişken anahtarlaması.
- Alternatif B (OKLCH Gradyan Işıltısı ve Değişken Parametreli Tipografi): CSS değişkenleri ile türetilen algısal oklch renk gradyanı, text-clip ile harflerin içine ışıma, değişken tabanlı glow/kontur.
- Alternatif C (Harf İndisli Spektrum): Her harfe inline CSS değişkeni (--i) atanarak spektrum dağılımı.
Seçilen Tasarım: Alternatif B (Merkezi değişken sisteminin tipografik renk matematiği üzerindeki gücünü ve görsel derinliğini en net sergileyen yaklaşım).
Sonraki Adım: CURRENT.md ve reports/003/report.md taslağının hazırlanması.

## 2026-09-29T01:06:20+03:00 | DEV | FILE_CREATE
İşlem: src/003.dev.html dosyası oluşturuldu.
Hedef: CSS Custom Properties (:root, var(), calc()) ve oklch() algısal renk uzayı ile Hello World harflerine gradyan ve ışıma kazandırma.
Özellikler: Tek bir --base-hue kök değişkeninden türetilen harmonik oklch paleti, linear-gradient + background-clip: text ile harf dolgusu, drop-shadow ışıma halesi.
Sonraki Adım: Test zincirinin (validate.sh, dependency-check.sh, browser-test.sh, screenshot.sh) çalıştırılması.

## 2026-09-29T01:06:30+03:00 | TEST | VERIFY_DEV
Komutlar ve Çıkış Kodları:
- ./validate.sh src/003.dev.html -> Çıkış kodu: 0 (PASS) - HTML5 iskelet ve CSS değişken sözdizimi doğrulandı.
- ./dependency-check.sh src/003.dev.html -> Çıkış kodu: 0 (PASS) - Sıfır dış bağımlılık, yerleşik CSS motoru.
- ./browser-test.sh http://localhost:7373/003.dev.html -> Çıkış kodu: 0 (PASS) - DOM_VISIBILITY: PASS (571x108px, x=354, y=333, background-clip: text dolgusu), RUNTIME: PASS, NETWORK: PASS, PERMISSIONS: PASS.
- ./screenshot.sh http://localhost:7373/003.dev.html reports/003 -> Çıkış kodu: 0 (PASS) - 1280x800 PNG kaydedildi.

## 2026-09-29T01:06:38+03:00 | TEST | VISUAL_REVIEW
İşlem: reports/003/screenshot.png doğrudan görüntülendi ve incelendi.
Bulgular: Derin oklch zemin üzerinde, Hello World harflerinin içine mükemmel dökülen mor-eflatun-mercan renk geçişi ve harflerin arkasındaki yumuşak difüze ışıma (glow) doğrulandı.
001 ve 002 ile Görsel Karşılaştırma:
- 001'in tek renkli sol üst serif ve 002'nin düz beyaz flex başlığına kıyasla;
- 003, değişken tabanlı OKLCH renk uzayı ile çok katmanlı spektral bir ışık derinliği ve yüksek kontrastlı modern bir görsel odak sunmaktadır.

## 2026-09-29T01:06:46+03:00 | MAIN | PUBLISH
İşlem: src/003.dev.html dosyası src/003.html olarak yeniden adlandırıldı.
Doğrulama: http://localhost:7373/003.html adresi üzerinden çalışan tarayıcı testi (browser-test.sh) ile 0 hata ve görünürlük onaylandı.
Durum: Deney 003 başarıyla tamamlandı ve yayımlandı. Dosya salt okunur ve değiştirilemez hale getirildi.
