# Deney 015 Raporu: CSS Grid & Subgrid Mimarisi ile Modüler İsviçre Tipografisi

## 1. Deney Özeti
- **Deney No:** 015
- **Teknoloji:** CSS Grid Layout Level 2 (`display: grid`, `grid-template-columns: subgrid`, `grid-template-rows: subgrid`, `grid-template-areas`)
- **Tarih:** 2026-09-29
- **Durum:** Tamamlandı (GEÇTİ - PASS)
- **Dosya:** `src/015.html`

---

## 2. Hipotez ve Amaç
CSS Grid Level 2'nin en güçlü yeniliği olan **Subgrid**, iç içe geçmiş (nested) bileşenlerin kendi bağımsız ızgaralarını oluşturmak yerine, doğrudan üst ebeveynin sütun ve satır raylarına kilitlenmesini sağlar. Bu deneyin amacı, Josef Müller-Brockmann ve Bauhaus'un İsviçre Uluslararası Tipografik Stilinden ilham alarak, 12x12 modüler bir mimari şablon üzerinde "Hello World" ifadesini subgrid kenetlemesi ile inşa etmek; asimetrik tipografik denge, negatif alan ritmi ve etkileşimli bir ızgara müfettişi (Grid Inspector) cetvelini sıfır harici bağımlılıkla sunmaktır.

---

## 3. Mimari ve Uygulama Detayları
- **12x12 Ana Şablon Izgara (Master Grid):**
  - Kök kapsayıcı: `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(12, minmax(0, 1fr)); gap: 12px;`.
- **CSS Subgrid Entegrasyonu:**
  - `<header class="grid-header">`, `<main class="grid-hero">` ve `<section class="grid-card">` gibi anlamsal bloklar:
    `grid-column: span 12; display: grid; grid-template-columns: subgrid;`
    Bu sayede iç öğeler ebeveynin 12 sütunluk rayları üzerinde piksel hassasiyetinde hizalanır.
- **Asimetrik İsviçre Tipografisi:**
  - "HELLO" üst sol koordinat bloğuna (`grid-column: 1 / span 8`, `grid-row: 3 / span 3`) yerleşirken, "WORLD" alt sağ bloğa (`grid-column: 4 / span 9`, `grid-row: 6 / span 4`) oturarak dinamik asimetrik gerilim ve odak oluşturur.
- **Etkileşimli Izgara Müfettişi (Grid Inspector HUD):**
  - Butonla açılıp kapanabilen neon kırmızı/camgöbeği ızgara çizgileri, ray numaraları (1..13) ve hücre sınırları.
  - 4 dinamik kompozisyon modu arasında anında CSS sınıfı değişimi.
- **Erişilebilirlik ve Semantik:**
  - Tam HTML5 anlamsal iskelet (`<main>`, `<article>`, `<header>`, `<h1>`, `<section>`, `<footer>`).
  - Yüksek kontrastlı grotesk tipografi, net okunabilirlik ve odaklanabilir kontroller.

---

## 4. Test ve Doğrulama Bulguları
- **validate.sh:** GEÇTİ (PASS) - HTML5 semantik iskelet ve V8 JS sözdizimi doğrulandı.
- **dependency-check.sh:** GEÇTİ (PASS) - Sıfır harici ağ bağımlılığı.
- **browser-test.sh:** GEÇTİ (PASS) - DOM görünürlüğü, sıfır JavaScript hatası, sıfır ağ isteği ve sıfır izin talebi.
- **Görsel Odak:** "Hello World" ifadesi 12x12 ızgara içinde "HELLO" ve "WORLD" olarak asimetrik, cesur ve mimari bir hiyerarşiyle odak noktasında sergilenmiştir.

---

## 5. Ekran Görüntüsü ve Görsel İnceleme
![Deney 015 Ekran Görüntüsü](screenshot.png)
- CSS Grid Level 2 ve Subgrid mimarisi, 144 hücrelik lazer ızgara cetveli ve İsviçre tipografik poster estetiği ile kusursuz bir 2D mizanpaj deneyimi sağlamıştır.
