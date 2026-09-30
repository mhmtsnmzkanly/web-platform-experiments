# Deney 005 Günlüğü

## 2026-09-30

- `CURRENT.md`, `PROGRESS.md` ve `TECHNOLOGIES.md` okundu; tamamlanmış deney dosyalarına dokunulmadı.
- Üç aday fikir üretildi: IntersectionObserver + CSS clip-path kesit reveal, CSS scroll timeline ve Web Share durumlu selam.
- IntersectionObserver + CSS clip-path seçildi; karar ve veri akışı `report.md` içinde kaydedildi.
- `src/005.dev.html` geliştirmesi başlatıldı.
- İlk `verify.sh` çalışması `OK` verdi ancak ekran görüntüsünde 1.6 saniyelik reveal son harfi kesiyordu; süre 0.8 saniyeye indirildi.
- `validate.sh`, `dependency-check.sh` ve tekrar `./verify.sh src/005.dev.html reports/005` başarılı oldu.
- Tarayıcı kategori raporu DOM için `PASS`, çalışan CSS cursor animasyonu için `VERIFIED` döndürdü.
- `reports/005/screenshot.png` doğrudan incelendi; tam Hello World metni, kesit çizgileri ve cursor kompozisyonu doğrulandı.
- `mv src/005.dev.html src/005.html` ile deney mühürlendi; yetim `.dev.html` bırakılmadı.
