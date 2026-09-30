# Deney 013 Raporu: CSS 3D Transforms ve Uzamsal İzometrik Tipografi

## 1. Deney Özeti
- **Deney No:** 013
- **Teknoloji:** CSS 3D Transforms (`transform-style: preserve-3d`, `perspective`, `perspective-origin`, `translate3d`, `rotate3d`) + DOM Tabanlı Hacimsel Katmanlama
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (GEÇTİ - PASS)
- **Dosya:** `src/013.html`

---

## 2. Hipotez ve Amaç
Tarayıcının 3D yetenekleri yalnızca WebGL veya harici kütüphanelerle sınırlı değildir; CSS 3D Dönüşüm motoru (`transform-style: preserve-3d`), standart DOM elemanlarını donanım hızlandırmalı gerçek bir 3 boyutlu kartezyen koordinat uzayına yerleştirebilir. Bu deneyin amacı, saf CSS 3D ve minimal etkileşim kodu ile "Hello World" ifadesini Z ekseni boyunca çok katmanlı, fiziksel derinliğe sahip izometrik bir monolite dönüştürmek; serbest yörüngesel sürükleme, izometrik/perspektif kamera projeksiyonları ve katman patlatma (exploded depth view) tekniklerini sıfır harici bağımlılıkla sergilemektir.

---

## 3. Mimari ve Uygulama Detayları
- **3D Sahne ve Perspektif Kökü:**
  - Ana konteynerde `perspective: 1200px` ve `perspective-origin: 50% 50%` ile derinlik konisi tanımlanır.
  - Sahne pivotu `transform-style: preserve-3d` ile alt öğelerinin aynı 3D uzamda birbirlerini kesebilmesini ve derinlik sıralamasını (z-buffer) korumasını sağlar.
- **Hacimsel Z-Eksen Katmanlama (DOM Slicing):**
  - "Hello World" başlığı Z ekseninde çok sayıda paralel düzleme (`translateZ(k * step)`) bölünür.
  - En ön katman ana anlamsal `<h1>` olarak ekran okuyuculara açıktır; alt katmanlar derinlik, ışık yansıması ve zemin gölgesini oluşturur.
- **Kamera ve Etkileşim:**
  - Pointer Events ile fare/dokunmatik sürüklemesi serbest küresel yörünge rotasyonuna (`rotateX`, `rotateY`) dönüştürülür.
  - Arayüz kontrolleri:
    - *İzometrik Görünüm:* Mimari aksonometrik projeksiyon açısı (`rotateX(35.264deg) rotateY(-45deg)`).
    - *Ön (Ortografik) Görünüm:* Sıfırlanmış ön açı (`rotateX(0deg) rotateY(0deg)`).
    - *Perspektif 3D Görünüm:* Dinamik 3D açılı süzülme.
    - *Katman Patlatma (Explode):* Z ekseni aralığını genişleterek katmanlar arası boşluğu artıran patlama modu.
    - *Otomatik Dönüş (Auto-Orbit):* 3D monolit etrafında yumuşak sinüzoidal yörünge animasyonu.
- **Erişilebilirlik ve Semantik:**
  - Tek anlamsal `<main>` ve `<h1>Hello World</h1>`. Dekoratif 3D derinlik katmanları `aria-hidden="true"` ile ekran okuyucu karmaşasını önler.

---

## 4. Test ve Doğrulama Bulguları
- **validate.sh:** GEÇTİ (PASS) - HTML5 semantik iskelet ve V8 JS sözdizimi doğrulandı.
- **dependency-check.sh:** GEÇTİ (PASS) - Sıfır harici ağ bağımlılığı.
- **browser-test.sh:** GEÇTİ (PASS) - DOM görünürlüğü (532x341px), sıfır JavaScript hatası, sıfır ağ isteği ve sıfır izin talebi.
- **Görsel Odak:** "Hello World" ifadesi ekranın merkezinde 3D uzayda katmanlanmış, izometrik mimari monolit formunda net biçimde konumlandırılmıştır.

---

## 5. Ekran Görüntüsü ve Görsel İnceleme
![Deney 013 Ekran Görüntüsü](screenshot.png)
- CSS 3D dönüşüm motoru, Z-eksen ekstrüzyonu ve sönümlü yörünge kamerası ile kusursuz bir 3D uzamsal tipografi deneyimi sağlamıştır.
