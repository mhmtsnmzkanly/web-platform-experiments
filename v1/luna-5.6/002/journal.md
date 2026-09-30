# Deney 002 Günlüğü

## 2026-09-30

- `CURRENT.md`, `PROGRESS.md` ve `TECHNOLOGIES.md` okundu; 001'de kullanılmayan teknolojiler arasından seçim yapıldı.
- Üç aday fikir üretildi: Canvas 2D + ResizeObserver ışık alanı, SVG filtre + Pointer Events deformasyonu ve Web Animations API + CSS custom properties ritmik tipografi.
- Canvas 2D + ResizeObserver seçildi; gerekçe `report.md` içinde kaydedildi.
- `src/002.dev.html` geliştirmesi başlatıldı.
- İlk tarayıcı denemesinde 7373 portunun eski `/home/duldul/Belgeler/hw_lab` sunucusunu gösterdiği ve 002 için 404 döndürdüğü görüldü; belirli eski süreç kapatılıp mevcut projenin `src/` kökü sunuldu.
- `validate.sh` ve `dependency-check.sh` geçti.
- `./verify.sh src/002.dev.html reports/002` `OK` döndürdü; kategori raporunda DOM, grafik ve altyapı `PASS`, teknoloji satırı `REVIEW_REQUIRED` oldu.
- `reports/002/screenshot.png` doğrudan incelendi; merkezî Hello World, renkli parçacıklar ve yörüngeler görünür.
- `mv src/002.dev.html src/002.html` ile deney mühürlendi; yetim `.dev.html` bırakılmadı.
