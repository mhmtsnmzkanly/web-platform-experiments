# Çalışma Günlüğü: Deney 038

**Tarih:** 2026-09-30  
**Konu:** Gamepad API & Kinetik Aviyonik Tipografi (Analog Çift Joystick, Buton Basıncı ve Uçuş Kontrol Kokpiti)  
**Durum:** TAMAMLANDI  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `037.html` (37 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 4. Onluk Döngünün 8. deneyi (038) başlatılıyor.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** Gamepad API (W3C Working Draft / WHATWG Standard).
- **Temel API ve Tarayıcı Yetenekleri:**
  - `navigator.getGamepads()`: Sisteme bağlı tüm fiziksel oyun kollarını (gamepad) sorgulayan 60 FPS yoklama döngüsü.
  - Olaylar: `window.addEventListener('gamepadconnected')`, `window.addEventListener('gamepaddisconnected')`.
  - Gamepad Veri Yapısı:
    - `gamepad.id`: Cihaz kimliği (örn. "STANDARD GAMEPAD", "DualSense", "Xbox Controller").
    - `gamepad.axes`: 4 standart analog eksen (Sol Çubuk X/Y: `axes[0]`, `axes[1]`; Sağ Çubuk X/Y: `axes[2]`, `axes[3]`) $[-1.0, +1.0]$ aralığında.
    - `gamepad.buttons`: 17 standart buton nesnesi (`button.pressed: boolean`, `button.value: number`).
    - Haptik Geri Bildirim: `gamepad.vibrationActuator.playEffect('dual-rumble', ...)`.
  - Çift Modlu Mimari (Hibrit Donanım & Sentetik Simülatör):
    - Fiziksel kol takılıysa doğrudan donanım okunur.
    - Fiziksel kol yoksa (örn. headless test veya klavye/fare kullanımı), ekranda iki adet etkileşimli sentetik analog joystick ve 4 aksiyon butonu ($A, B, X, Y$) çalışarak aynı Gamepad veri nesnesini besler.
- **Tasarım Yaklaşımı:**
  - Aviyonik Uzay Kokpiti ve Tipografik Uçuş Kontrol İstasyonu (Avionic Flight Control Cockpit).
  - Merkezde 3D uzamsal alanda süzülen monolitik "HELLO WORLD" uçuş monoliti yer alır.
  - Sol Analog Çubuk: Konum ($X, Y$) ve itki vektörünü kontrol eder.
  - Sağ Analog Çubuk: 3D eğim (Pitch, Yaw, Roll) ve derinlik ($Z$-ekseni) perspektifini modüle eder.
  - Aksiyon Butonları ($A, B, X, Y$):
    - Buton A: Warp / İtki Takviyesi (Boost).
    - Buton B: Hava Freni / Sönümleyici (Airbrake).
    - Buton X: Spektral Renk Modülasyonu.
    - Buton Y: 360° Akrobatik Gyro Loop.
  - Canlı Aviyonik Telemetri: Anlık eksen değerleri, 17 buton matrisi, itki vektörü ve 60 FPS yoklama frekansı.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Aviyonik Uçuş Kokpiti ve Analog Çift Joystick Tipografisi (Avionic Gamepad Flight Simulator)**  
   - 3D uzay boşluğunda süzülen "HELLO WORLD" gemisi; Sol ve Sağ analog joystick'ler, buton basınç göstergeleri, aviyonik HUD göstergeleri, sentetik dokunmatik/fare joystick simülatörü ve 60 FPS `navigator.getGamepads()` yoklama döngüsü.
2. **Fikir 2: Klasik 16-Bit Retro Arcade Tipografi Dövüşçüsü (Retro Arcade Brawler)**  
   - D-Pad ve kombo tuşları ile harflerin animasyonu.
3. **Fikir 3: Manyetik Parçacık Çekim Gemisi (Gravitational Gamepad Tug)**  
   - Analog çubukla parçacıkların yönlendirilmesi.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Aviyonik Uçuş Kokpiti ve Analog Çift Joystick Tipografisi** seçildi.
- **Gerekçe:** W3C Gamepad standardının hem sürekli eksen verilerini (`axes[0..3]`) hem de analog/dijital buton basışlarını (`buttons[0..16]`) gerçek zamanlı Euler fiziğiyle birleştirir. Ekrana entegre sentetik joystick ve gamepad paneli sayesinde donanım bağlı olmasa dahi hem test ortamında hem de son kullanıcı için %100 etkileşimli, kesintisiz bir deneyim sunar. "HELLO WORLD" doğrudan kokpitin ana kontrol ve uçuş nesnesidir.

---

## Faz 5: `src/038.dev.html` Geliştirme
- 3D uzaysal arena, Canvas 2D yıldız alanı paralaksı (`starfieldCanvas`) ve aviyonik HUD nişangahı kuruldu.
- Sentetik Çift Analog Joystick (Sol: İtki $X, Y$; Sağ: Açısal Rotasyon $Pitch, Yaw, Roll$) `pointerdown`/`pointermove`/`pointerup` ile yaylı merkezlemeli olarak kodlandı.
- Elmas buton grubu ($A, B, X, Y$) bağlandı:
  - Buton A: Warp Boost (İtki 3.5x).
  - Buton B: Hava Freni (Airbrake).
  - Buton X: Spektral Renk Döngüsü (Hue rotasyonu).
  - Buton Y: 360° Gyro Loop akrobasisi.
- 60 FPS `navigator.getGamepads()` yoklama döngüsü ve `gamepadconnected`/`gamepaddisconnected` olayları entegre edildi.
- Euler fizik motoru, hız sönümleme ve 3D `transform: translate3d(...) rotateX(...) rotateY(...) rotateZ(...)` uygulandı.
- 4 eksen için canlı analog göstergeler ve 17 butonluk durum matrisi bağlandı.

---

## Faz 6: Otomatik Doğrulama
- `./verify.sh src/038.dev.html reports/038` çalıştırıldı.
- `dependency-check.sh`: 0 harici bağımlılık, geçerli yerel kaynaklar.
- `browser-test.sh`: 0 konsol hatası, 0 runtime istisnası, DOM ve Canvas üzerinde "HELLO WORLD" görünürlüğü kanıtlandı.
- Sonuç: `OK` (Çıkış kodu: 0).

---

## Faz 7: Görsel İnceleme & Çoklu Durum Ekran Görüntüleri
- `reports/038/screenshot.png`: Varsayılan başlangıç durumu (Nötr sentetik joystick, 0 m/s hız).
- `reports/038/screenshot-boost-warp.png`: Buton A ile Warp Boost devredeyken zümrüt yeşili hızlanma durumu.
- `reports/038/screenshot-airbrake-red.png`: Buton B ile Hava Freni sıkılmış yakut kırmızısı sönümleme durumu.
- `reports/038/screenshot-maneuver-tilt.png`: Sol analog çubukla sağa-yukarı yönlendirilmiş, `101.6 M/S` hız ve 3D açılı süzülme durumu.
- Görsel hiyerarşi, WCAG AAA kontrastı ve odak prensipleri incelendi ve onaylandı.

---

## Faz 8: Teknik Raporlama
- `reports/038/report.md` 5 temel başlık altında eksiksiz yazıldı:
  1. Deney Amacı ve Özeti
  2. Kullanılan Teknoloji ve Çalışma Mantığı
  3. 5 Boyutlu Tasarım Değerlendirmesi
  4. Doğrulama Kanıtları ve Test Sonuçları
  5. İnsan Doğrulaması Gereken Durumlar

---

## Faz 9: Mühürleme
- `mv src/038.dev.html src/038.html` komutu ile dosya mühürlendi.
- `./verify.sh src/038.html reports/038` çalıştırıldı.
- Çıktı: `OK` (Çıkış kodu: 0).
- Orphan `.dev.html` dosyası kalmadığı teyit edildi.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `reports/038/journal.md` tamamlandı.
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Deney 038 başarıyla mühürlendi.

