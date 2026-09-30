# Deney 003 Günlüğü

## 2026-09-30

- `CURRENT.md`, `PROGRESS.md` ve `TECHNOLOGIES.md` okundu; tamamlanmış 001 ve 002 dosyaları değiştirilmedi.
- Üç aday fikir üretildi: SVG filter + SMIL hareketli baskı, CSS scroll-driven reveal posteri ve Web Animations API ile elastik harfler.
- SVG filter primitives + SMIL seçildi; karar ve mekanizma `report.md` içinde kaydedildi.
- `src/003.dev.html` geliştirmesi başlatıldı.
- `validate.sh`, `dependency-check.sh` ve `./verify.sh src/003.dev.html reports/003` başarılı oldu.
- İlk ekran görüntüsünde gereksiz dikey kaydırma çubuğu görüldü; `body { overflow: hidden; }` ile düzeltildi ve doğrulama tekrar `OK` verdi.
- Tarayıcı kategori raporu DOM ve altyapı için `PASS`, SVG SMIL teknoloji kanıtı için `VERIFIED` döndürdü.
- `reports/003/screenshot.png` doğrudan incelendi; yüksek kontrastlı Hello World, baskı kaymaları ve editoryal kompozisyon doğrulandı.
- `mv src/003.dev.html src/003.html` ile deney mühürlendi; yetim `.dev.html` bırakılmadı.
