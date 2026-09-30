# Hello World Lab — Teknik Rapor: Deney 034

**Deney Başlığı:** HTML5 Popover API ve Top Layer Morfolojisi (Yerel Katmanlama ve Boyutsal Tipografik HUD)  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/034.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 034, modern web standartlarının en yenilikçi yerel katmanlama yeteneği olan **HTML5 Popover API** (`popover`, `:popover-open`, `::backdrop`) standardını inceler. Web geliştiricilerini yıllardır zorlayan `z-index` savaşları ve `overflow: hidden` kırpma problemlerini tarayıcının yerleşik **Top Layer (En Üst Katman)** yığınıyla kökten çözen Popover API, bu deneyde yüksek teknolojili bir siber HUD süper vizörü olarak kurgulanmıştır. "HELLO WORLD" metni hem ana zemin düzleminde hem de Top Layer seviyesine terfi ettirilen monolitik cam vizörde başroldedir. Deklaratif tetikleyiciler (`popovertarget`), programatik API çağrıları (`showPopover()`, `hidePopover()`), `popover="auto"` (light-dismiss) ve `popover="manual"` modları ile canlı katman telemetrisi sunulmaktadır.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **HTML5 Popover API ve Top Layer Mimarisi:**
  - `popover="auto"`: Tarayıcının yerleşik hafif kapatma (light-dismiss) mekanizmasını etkinleştirir. Kullanıcı popover dışına tıkladığında veya `Esc` tuşuna bastığında öğe otomatik ve erişilebilir olarak kapanır. Aynı anda yalnızca tek bir auto popover açık kalabilir (yığın hiyerarşisi hariç).
  - `popover="manual"`: Yalnızca açık bir tetikleme komutuyla (`hidePopover()` veya ilgili buton) kapanır; dışarı tıklamalar katmanı kapatmaz.
  - Deklaratif Tetikleme: `<button popovertarget="topLayerHud" popovertargetaction="toggle">` ile sıfır JavaScript satırıyla popover kontrol edilir.
  - JavaScript Metotları: `element.showPopover()`, `element.hidePopover()`, `element.togglePopover()`.
  - Olaylar: `beforetoggle` ve `toggle` (`event.newState: 'open' | 'closed'`) ile katman geçişleri milisaniyelik telemetri günlüğüne kaydedilir.
  - CSS Sözde Sınıf ve Elemanları:
    - `:popover-open`: Katman açıldığında devreye giren transformasyon ve şeffaflık kuralları.
    - `::backdrop`: Tarayıcının donanım hızlandırmalı Top Layer seviyesinde tüm sayfayı kaplayan, `backdrop-filter: blur(16px)` ile arka planı buğulayan yerel katman.
    - `z-index` hilesi olmaksızın en üst katmana terfi (promotion to Top Layer).

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Zemin düzleminde yer alan "HELLO WORLD" glifleri, her bir harfin altında ASCII onaltılık kodunu (`0x48`, `0x45`...) taşıyan etkileşimli düğmelerdir.
   - Top Layer vizörü açıldığında, merkezde devasa monolitik gradyanlı "HELLO WORLD" başlığı belirir; buğulu arka plan ve neon siyan/mor ışımalarla tam bir odak derinliği sağlanır.
2. **Renk Paleti ve Kontrast:**
   - Koyu uzay mavisi/siyah zemin (`#020612`, `#050814`).
   - Elektrik siyanı (`#0ea5e9`), kehribar glif rengi (`#f59e0b`), zümrüt toast ışığı (`#10b981`) ve neon moru (`#8b5cf6`).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (7:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda Zemin Kuantum Sahnesi, merkezde "HELLO WORLD", sağ kolonda Katman Kontrol Masası ve Top Layer Olay Günlüğü bulunur.
   - Açılan Popover ise ekranın tam merkezinde Top Layer üzerinde konumlanır.
4. **Mikro Etkileşim ve Hareket:**
   - Popover açılışında `transform: scale(0.92) → scale(1)` ve `opacity` geçişleri ile pürüzsüz bir derinlik hissi verilir.
   - `::backdrop` geçişiyle sayfa odak noktası dışında kalan tüm unsurlardan arındırılır.
5. **Kavramsal Odak (Hello World Merkeziligi):**
   - "HELLO WORLD" zemin katmandan Top Layer seviyesine terfi ettirilen, her harfi mikro-popover ile detaylandırılan ana mimari unsurdur.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici URL/CDN/font, sistem yazı tipleri ve saf CSS/JS).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM üzerinde görünür "HELLO WORLD" kanıtı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Ekran Görüntüleri:**
  - `screenshot.png`: Zemin düzlemi başlangıç hali (Base DOM, 10 glif butonu).
  - `screenshot-top-layer-open.png`: Top Layer Süper Vizörü açıkken (Buğulu `::backdrop`, monolitik gradyanlı "HELLO WORLD" modalı).
  - `screenshot-glyph-popover.png`: 'W' harfi mikro-popover'ı açıkken (Glif ASCII telemetrisi).
  - `screenshot-manual-toast.png`: Sağ alt köşede açık `popover="manual"` toast kartı.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Light-Dismiss ve Klavye Erişilebilirliği (Esc Tuşu):**
  - "TOP LAYER SÜPER VİZÖRÜ" butonuna basılıp vizör açıldıktan sonra klavyedeki `Esc` tuşuna basıldığında veya vizör dışındaki buğulu alana tıklandığında popover'ın sıfır JavaScript kodu gerekmeksizin tarayıcının yerel davranışı olarak kapandığı test edilmelidir.
- **Top Layer Z-Index Bağımsızlığı:**
  - Sayfada hiçbir `z-index` değeri tanımlanmamış olmasına rağmen, açılan modalın tüm sayfa elemanlarının ve sabit başlıklı header'ın üzerinde kusursuz bir şekilde en öne çıktığı doğrulanmalıdır.
