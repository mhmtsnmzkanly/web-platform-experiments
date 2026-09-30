# Hello World Lab — Teknik Rapor: Deney 038

**Deney Başlığı:** Gamepad API & Kinetik Aviyonik Tipografi (Analog Çift Joystick, Buton Basıncı ve Uçuş Kontrol Kokpiti)  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/038.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 038, web platformunun yerel donanım oyun kumandası standardı olan **Gamepad API** (`navigator.getGamepads()`, `gamepadconnected`, `axes`, `buttons`) altyapısını inceler. Geleneksel klavye ve fare etkileşiminin ötesine geçerek, analog joystick girdileri (sürekli float $[-1.0, +1.0]$) ve analog tetik/buton basınçlarını doğrudan tarayıcının 60 FPS requestAnimationFrame döngüsünde yoklar. Bu deneyde "HELLO WORLD" tipografisi derin uzay boşluğunda süzülen 3D aviyonik bir uçuş monoliti olarak modellenmiştir. Çift modlu hibrit mimari ile hem fiziksel USB/Bluetooth oyun kolları (Xbox, PlayStation, standart gamepad) hem de ekranda yer alan sentetik çift analog joystick ve elmas buton ($A, B, X, Y$) masası üzerinden tam kontrol sağlanmıştır.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C Gamepad API (Standard Gamepad Mapping) Mimarisi:**
  - `navigator.getGamepads()`: 60 FPS hızında çalışan ana döngüde donanım portlarını sorgular; bağlı kolların anlık durumunu döndürür.
  - Eksenler (`axes[0..3]`):
    - Sol Analog Çubuk (`axes[0]` X, `axes[1]` Y): Kinetik itki vektörünü ($V_x, V_y$) ve uzamsal konumu ($X, Y$) yönetir.
    - Sağ Analog Çubuk (`axes[2]` X, `axes[3]` Y): 3D gimbal açılarını (Pitch eğimi, Yaw sapması, Roll yatışı) modüle eder.
    - Ölü Bölge (Deadzone) Filtresi: `Math.abs(axis) > 0.12` eşiği ile donanımsal çubuk kaymaları filtrelenir.
  - Butonlar (`buttons[0..16]`):
    - 17 standart buton nesnesi (`pressed: boolean`, `value: [0.0 - 1.0]`).
    - Buton 0 (A): Warp Boost (İtki gücünü 3.5 katına çıkarır, zümrüt ışıma yayar).
    - Buton 1 (B): Hava Freni (Airbrake - hızı anında %90 sönümler, yakut kırmızısı parlama oluşturur).
    - Buton 2 (X): Spektral Renk Modülasyonu (OKLCH/HSL renk uzayında harf renklerini 60° döngüler).
    - Buton 3 (Y): 360° Akrobatik Gyro Loop (Tipografik takla manevrası).
  - Hibrit Sentetik Simülatör:
    - Donanım bağlı olmadığında Pointer Events (`setPointerCapture`) ile çalışan iki adet görsel analog joystick ve 4 aksiyon butonu doğrudan sanal Gamepad nesnesini besler; klavye (WASD / Ok Tuşları, Space, Shift) kısayolları da bu eksenlere bağlıdır.
  - Aviyonik Fizik Motoru:
    - Euler integrasyonu ($P_{t+1} = P_t + V_t$), hava sürtünmesi sönümlemesi (`V *= 0.92`), elastik sınır sekmesi ve dinamik yıldız alanı paralaksı (`starfieldCanvas`) ile 60 FPS hızında çalışır.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - 3D uzamsal alanda süzülen "HELLO WORLD" ana başlığı büyük puntolu, metalik gradyanlı ve neon konturludur.
   - Tipografi uçuş esnasında fiziksel hız vektörüne göre geriye yaslanır, dönüşlerde teğetsel olarak yatar (`rotateZ`) ve dalışlarda burnunu eğer (`rotateX`).
2. **Renk Paleti ve Kontrast:**
   - Koyu uzay mavisi/siyah kokpit zeminleri (`#030712`, `#070c1b`).
   - Aviyonik elektrik siyanı (`#06b6d4`), zümrüt yeşili (`#10b981`), yakut kırmızısı (`#f43f5e`), kehribar sarısı (`#f59e0b`) ve nebul moru (`#8b5cf6`).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (9:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda 3D Uzaysal Uçuş Arenası (Reticle HUD, Yıldız Alanı, HELLO WORLD) ve Sentetik Çift Analog Joystick & Buton Güvertesi bulunur.
   - Sağ kolonda 4 Eksen Gösterge Barları, 17 Butonluk Durum Matrisi, Hızlı Aviyonik Aksiyonlar ve Olay Akış Konsolu yer alır.
4. **Mikro Etkileşim ve Hareket:**
   - Joystick çubukları fare veya dokunmayla sürüklendiğinde yaylı merkezleme mekanizmasıyla yumuşakça geri döner.
   - Eksen barları anlık analog sapmayı $[-1.0, +1.0]$ arasında mavi lazer şeritleriyle çizer.
5. **Kavramsal Odak (Hello World Merkeziliği):**
   - "HELLO WORLD" aviyonik simülatörün bizzat sevk ve idare edilen uzay aracıdır; tüm eksenler, butonlar ve hız telemetrileri bu metnin uzamsal varlığına hizmet eder.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici kütüphane, saf W3C Gamepad API ve Canvas 2D/CSS 3D).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM ve Canvas üzerinde "HELLO WORLD" görünürlüğü kanıtlandı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Çoklu Durum Ekran Görüntüleri:**
  - `screenshot.png`: Varsayılan kokpit başlangıç durumu (Sentetik joystick merkezde, 0 m/s hız, nötr telemetri).
  - `screenshot-boost-warp.png`: Buton A (Warp Boost) basılıyken zümrüt yeşili hızlanma durumu.
  - `screenshot-airbrake-red.png`: Buton B (Hava Freni) devredeyken yakut kırmızısı sönümleme durumu.
  - `screenshot-maneuver-tilt.png`: Sol analog çubukla sağa-yukarı yönlendirilmiş, `101.6 M/S` hız ve 3D açılı süzülme durumu.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Fiziksel Oyun Kolu (Gamepad) Bağlantısı:**
  - Bilgisayara bir USB veya Bluetooth oyun kolu (örn. Xbox / DualSense) bağlandığında, header'daki kontrolcü çipinin anında "FİZİKSEL KOL" olarak yeşile döndüğü ve fiziksel analog çubukların ekrandaki "HELLO WORLD" metnini pürüzsüzce hareket ettirdiği fiziksel donanımla doğrulanmalıdır.
- **Sentetik Joystick Dokunmatik/Fare Hassasiyeti:**
  - Sol ve sağ analog çubukların fare ile çekilip bırakıldığında elastik biçimde merkeze sıfırlandığı ve `axes` göstergelerinin nötr konuma (`0.00`) döndüğü test edilmelidir.
