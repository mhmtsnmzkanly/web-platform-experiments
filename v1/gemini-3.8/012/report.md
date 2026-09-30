# Deney 012 Raporu: WebGL Shader ve 3D Hacimsel Tipografi

## 1. Deney Özeti
- **Deney No:** 012
- **Teknoloji:** WebGL (1.0 / 2.0) GPU Shader Pipeline (`createShader`, `createProgram`, `texImage2D`, GLSL Fragment Shader)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (GEÇTİ - PASS)
- **Dosya:** `src/012.html`

---

## 2. Hipotez ve Amaç
CPU tabanlı 2D render motorlarının sınırlarını aşarak, tarayıcının doğrudan grafik kartına (GPU) erişimini sağlayan WebGL donanım boru hattını devreye almak. Harici hiçbir 3D kütüphanesi (Three.js vb.) kullanmadan, saf GLSL (OpenGL Shading Language) gölgelendirici kodları ile "Hello World" ifadesini paralel GPU iş parçacıklarında işlemek; kromatik sapma, hacimsel neon ışıma ve imlece duyarlı dinamik ışıklandırma üretmektir.

---

## 3. Mimari ve Uygulama Detayları
- **Tam Ekran Dörtgen (Full-Screen Quad):** `[-1, -1]` ile `[1, 1]` aralığında iki üçgenden oluşan bir vertex buffer oluşturulur ve ekranı kaplar.
- **Yüksek Çözünürlüklü Doku Örnekleme (`gl.texImage2D`):** Görünmez bir tuvalde rasterize edilen keskin "Hello World" tipografisi GPU video belleğine doku (`sampler2D`) olarak yüklenir.
- **GLSL Fragment Shader Matematiği:**
  - `u_time`: Zaman parametresiyle sinüzoidal dalgalanan enerji alanı.
  - `u_mouse`: Kullanıcının imleç koordinatlarına göre dinamik ışık ve gölge odağı.
  - `u_resolution`: Ekran en-boy oranına göre dokunun bozulmadan merkezlenmesi.
  - Kromatik Kırınım (Chromatic Aberration): R, G ve B renk kanallarının radyal mesafeye göre farklı koordinatlardan örneklenerek optik prizma etkisi oluşturulması.
  - Hacimsel Işıma (Bloom / Glow Accumulation): Metin sınırlarının dışındaki piksellere doğru türetilen çok katmanlı radyal ışık alanı.
- **Erişilebilirlik ve Semantik:** `<canvas role="img" aria-label="Hello World WebGL 3D GPU Shader">Hello World</canvas>` etiketi hem ekran okuyucular hem de grafik desteği olmayan ortamlar için semantik içeriği korur.

---

## 4. Test ve Doğrulama Bulguları
- **validate.sh:** GEÇTİ (PASS) - HTML5 semantik iskelet ve V8 JS sözdizimi doğrulandı.
- **dependency-check.sh:** GEÇTİ (PASS) - Sıfır harici ağ bağımlılığı.
- **browser-test.sh:** GEÇTİ (PASS) - Canvas ve WebGL bağlamı, piksel çizimi, sıfır hata ve sıfır izin isteği.
- **Görsel Odak:** "Hello World" ifadesi GPU fragment shader içinde merkezlenmiş, RGB kromatik ayrışma ve parlama filtreleriyle yüksek kontrastlı olarak işlenmiştir.

---

## 5. Ekran Görüntüsü ve Görsel İnceleme
![Deney 012 Ekran Görüntüsü](screenshot.png)
- WebGL GPU shader boru hattı, ekran merkezinde 60 FPS hızında dalgalanan prizmatik "Hello World" görseli ve neon ışık saçılımı ile tam başarı sağladı.
