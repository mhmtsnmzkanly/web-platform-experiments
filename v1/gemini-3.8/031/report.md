# Hello World Lab — Teknik Rapor: Deney 031

**Deney Başlığı:** Screen Orientation & Fullscreen API: Havacılık Yapay Ufuk ve Jiroskopik Uçuş Göstergesi  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/031.html`  
**Döngü:** 4. Onluk Döngü Başlangıcı (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 031, modern web platformunun iki kritik çevre ve görüntüleme standardı olan **Screen Orientation API** (`screen.orientation`) ve **Fullscreen API** (`requestFullscreen()`, `:fullscreen`) arayüzlerini havacılık ve uzay aviyonik sistemleri (Primary Flight Display - PFD / Heads-Up Display - HUD) estetiği içinde derinlemesine inceler. Deneyde "HELLO WORLD" metni, yapay ufuk (artificial horizon) üzerinde dengelenen ve hedef kilitlenme nişangahı içinde korunan ana odak tipografisidir. Gerçek cihaz ekran açısı ve yönelimi dinamik olarak izlenirken, masaüstü ve test ortamları için 4 yönlü simülatör (0° Landscape, 90° Portrait Saat Yönü, 180° Inverted Uçuş, 270° Portrait Ters) ve serbest Pitch/Roll eğim denetleyicisi entegre edilmiştir. Fullscreen API ile kokpit tüm ekranı kaplayarak sinematik bir uçuş vizörüne dönüştürülür.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C Screen Orientation API:**
  - `screen.orientation.type`: Cihazın geçerli yönelim tipini (`portrait-primary`, `portrait-secondary`, `landscape-primary`, `landscape-secondary`) okur.
  - `screen.orientation.angle`: Cihazın dikey eksenden dönüş açısını (0°, 90°, 180°, 270°) anlık olarak sağlar.
  - `screen.orientation.addEventListener('change', callback)`: Cihaz döndürüldüğünde aviyonik sahneyi ve telemetri çiplerini dinamik olarak günceller.
- **W3C Fullscreen API:**
  - `document.documentElement.requestFullscreen()` / `document.exitFullscreen()`: Tarayıcı pencere çerçevelerini kaldırarak kullanıcının tüm ekranını aviyonik HUD vizörüne tahsis eder.
  - `document.addEventListener('fullscreenchange', callback)`: Tam ekran durum geçişlerini dinleyerek arayüzü ve düğme etiketlerini senkronize eder.
  - CSS `:fullscreen` Sözde Sınıfı: Tam ekrana geçildiğinde HUD sahnesini tam ekrana yayar, arayüz kenarlıklarını genişletir ve odaklanmayı maksimize eder.
- **Jiroskopik Uçuş Dinamiği ve Tipografik Modlar:**
  - **Ufuk Kilitli (Horizon Locked):** "HELLO WORLD" nişangahı yapay ufuk ile aynı eksende döner; uçak yatış yaptıkça metin ufuk çizgisine paralel kalır.
  - **Gimbal Denge (Gimbal Stabilized):** "HELLO WORLD" pilotun görüş düzleminde daima dik durur; yapay ufuk ve zemin/gök küresi metnin arkasında serbestçe döner.
  - **Auto Gyro (Otonom Salınım):** Harmonik trigonometrik dalgalar ile Pitch ve Roll açılarını sürekli canlı salınımda tutar.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezde yer alan monolitik "HELLO WORLD" hedef nişangahı, neon yeşili 4 köşeli lazer köşebentleri (`[ ]`) ve nabız atan hedef kilitlenme göstergesi (`HEDEF NİŞANGAH: KİLİTLİ`) ile aviyonik bir odak noktası oluşturur.
   - Hız (IAS), İrtifa (ALT), Pusula başlığı (HDG) ve Pitch merdivenleri (+20°, +10°, -10°, -20°) askeri HUD tipografisiyle yerleştirilmiştir.
2. **Renk Paleti ve Kontrast:**
   - Derin uzay/gece kokpit siyahı (`#02060c`, `#040810`).
   - Neon aviyonik yeşili (`#00ff88`, fosfor ışıması), havacılık kehribarı (`#f59e0b`) ve siyan telemetrisi (`#00f0ff`).
   - Gök mavisi (`#0c2d48`) ve yer kahvesi (`#3b2207`) yapay ufuk kontrastı. WCAG AAA standartlarında yüksek kontrast (7:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda devasa Primary Flight Display (PFD) ve yapay ufuk küresi, sağ kolonda Aviyonik Kontrol Masası, altta aviyonik olay akışı ve görüş alanı çözünürlük telemetrisi.
4. **Mikro Etkileşim ve Hareket:**
   - Sürgüler hareket ettirildiğinde gök/yer yarım küreleri mikrosaniyelik CSS değişkeni transformasyonu (`rotate(var(--roll-angle)) translateY(var(--pitch-offset))`) ile akıcı bir şekilde süzülür.
   - Roll arkı ibresi teğetsel açıyı donanım hızlandırmalı olarak takip eder.
5. **Kavramsal Odak (Hello World Merkeziligi):**
   - "HELLO WORLD" uçuş bilgisayarının nişan aldığı, dengelediği ve odaklandığı ana görev hedefini temsil eder.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici URL/CDN/font, sistem yazı tipleri ve saf SVG vektörleri).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM ve SVG yüzeylerinde %100 görünürlük kanıtı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Ekran Görüntüleri:**
  - `screenshot.png`: Düz uçuş başlangıç hali (0° Roll, 0° Pitch, Landscape Primary).
  - `screenshot-pitch-roll.png`: Tırmanış ve yatış manevrası (+15° Pitch, +30° Roll).
  - `screenshot-portrait-90.png`: 90° Ekran Yönelimi (Dikey Tırmanış / Portrait Secondary HUD modu).
  - `screenshot-gimbal.png`: Gimbal Stabilized modu (Yatışta dahi pilot görüşünde dik kalan "HELLO WORLD").

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Fiziksel Mobil / Tablet Cihaz Dönüş Testi:**
  - Sayfa jiroskop ve ivmeölçer barındıran fiziksel bir mobil veya tablet cihazda açıldığında, cihaz fiziksel olarak 90° döndürüldüğünde `screen.orientation` olayının tetiklenip telemetri açısını güncellediği doğrulanmalıdır.
- **Tam Ekran Donanım Deneyimi:**
  - "TAM EKRAN KOKPİT" butonuna tıklandığında tarayıcının yerel `:fullscreen` moduna geçerek adres çubuğunu ve işletim sistemi panellerini gizlediği, Esc tuşuna basıldığında pencere moduna sorunsuz döndüğü gözlemlenmelidir.
