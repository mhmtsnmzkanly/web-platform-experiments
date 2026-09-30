# Deney 019: Modern CSS Scroll-Driven Animations ve Kinetik Editoryal Tipografi

## 1. Amaç ve Kapsam
Bu deneyin amacı, web geliştirme dünyasındaki en modern standartlardan biri olan **CSS Scroll-Driven Animations API** (`animation-timeline: scroll()`, `animation-timeline: view()`, `animation-range`) yeteneğini sıfır dış kütüphane ve sıfır JavaScript kompozitör yükü ile hayata geçirmektir. Kullanıcının dikey kaydırma (scroll) hareketini doğrudan bir zaman çizelgesi (timeline) girdisine dönüştüren deklaratif bir kinetik tipografi sahnesi inşa edilmiştir.

---

## 2. Kullanılan Yeni Teknoloji ve Mekanizma

### A. Kök Kaydırma Zaman Çizelgesi (`animation-timeline: scroll(root)`)
- Sayfanın en üstünde yer alan dinamik ilerleme çubuğu (`.scroll-progress-bar`) ve ana tipografi sahnesi (`.main-typography-title`), `scroll(root)` deklarasyonu ile kök belge kaydırma oranına (0%..100%) bağlanmıştır.
- Geleneksel `window.addEventListener('scroll', ...)` yaklaşımının getirdiği ana iş parçacığı darboğazları ve jank (takılma) riskleri tamamen ortadan kaldırılmıştır; animasyonlar doğrudan tarayıcının GPU kompozitör iş parçacığında çalışır.

### B. Özneye Dayalı Zaman Çizelgesi (`animation-timeline: view()`)
- Editoryal kartlar (`.editorial-card`) ve anlatı blokları (`.stream-block`), her bir öğenin viewport penceresine giriş ve çıkış mesafesini ölçen `view()` zaman çizelgelerine bağlanmıştır.
- `animation-range: entry 10% cover 40%` gibi ince ayarlı aralıklar kullanılarak, her bir kartın görünür alana girdiği anda ölçeklenme, saydamlıktan netliğe geçiş ve Y-eksen paralaks hareketi deklaratif olarak kodlanmıştır.

---

## 3. Tasarım ve Estetik Kimlik (5 Boyut)

1. **Tipografi:** Editoryal İsviçre zarafeti. Başlık ve vurgularda yüksek kontrastlı klasik serif (`Charter`, `Georgia`), teknik göstergelerde monospaced (`ui-monospace`, `Menlo`), gövde metinlerinde ise okunaklı sistem groteski (`system-ui`, `Segoe UI`).
2. **Renk Paleti:** Sıcak parşömen/fildişi zemin (`#f9f7f2`), derin mürekkep kömürü (`#111827`), pas turuncusu / pişmiş toprak (`#c2410c`) ve kobalt mavisi (`#1d4ed8`) aksanlar.
3. **Kompozisyon:** Asimetrik dergi mizanpajı, sticky kahraman sahnesi ve akışkan kart ızgarası (`grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`).
4. **Malzeme Hissi:** Mat kâğıt dokusu hissi, hafif saydamlıklar ve camlaşma (`backdrop-filter: blur(12px)`), mikro kenarlıklar (`rgba(17, 24, 39, 0.08)`).
5. **Hareket:** Kaydırma derinliğiyle orantılı yakınsama ve nefes alan kinetik harf yakınlaşması.

---

## 4. Doğrulama ve Test Kanıtları

- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** PASS (Sıfır dış kütüphane, CDN, harici font veya harici medya).
- **Chrome CSSOM & `CSS.supports()`:** PASS (Tüm CSS bildirimleri geçerli; Chrome CSSOM tüm kuralları başarıyla ayrıştırdı).
- **DOM & Tipografi Görünürlüğü:** PASS (`Hello World` metni DOM'da açık ve görünür; occlusion veya şeffaflık engeli yok).
- **Konsol ve Çalışma Zamanı:** PASS (Sıfır `console.error()`, sıfır runtime exception).
- **Teknoloji Kanıtı:** `VERIFIED (Aktif çalışan 7 adet Web/CSS animasyonu tespit edildi)`.
- **Birleşik Test (`verify.sh`):** Tek satır `OK` çıktısı ve çıkış kodu `0`.

### Ekran Görüntüleri
- [Birincil Görünüm (screenshot.png)](screenshot.png): Sayfa başı, "HELLO WORLD" başlığının başlangıç kompozisyonu.
- [Kaydırma Başlangıcı (screenshot-start.png)](screenshot-start.png): 0px kaydırma anı.
- [Orta Kaydırma (screenshot-mid.png)](screenshot-mid.png): ~600px kaydırma; tepe ilerleme çubuğunun dolumu ve başlık yakınsaması.
- [Derin Kaydırma (screenshot-end.png)](screenshot-end.png): ~1400px kaydırma; `view()` ile açılan editoryal kartların paralaks kompozisyonu.

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

Otomatik doğrulama testleri başarıyla `OK` sonucunu üretmiştir. Ancak kaydırma tabanlı animasyonların dokunsal/fiziksel hissi otomasyonla tek başına değerlendirilemez.

- **Otomatik Olarak Doğrulanamayan Özellik:** Farenin tekerleği veya dokunmatik yüzey ile kaydırma yapıldığında, harflerin yakınsama hızının ve `view()` kartlarının ekrana giriş yumuşaklığının estetik/hissiyat uyumu.
- **Mevcut Teknik Kanıt:** Chromium headless oturumunda 7 adet aktif Web/CSS animasyonunun çalıştığı, tepe ilerleme çubuğunun `scaleX` değerinin kaydırma oranına göre lineer dönüştüğü ve ekran görüntülerinde kartların açıldığı kanıtlanmıştır.
- **İnsan Tarafından Yapılacak Kontrol:**
  Tarayıcıda `http://localhost:7373/019.html` adresine gidiniz; sayfayı aşağı ve yukarı doğru yavaşça ve hızlıca kaydırınız. "HELLO" ve "WORLD" kelimelerinin sticky alanda yakınsamasını ve alttaki kartların viewport'a girerken pürüzsüzce belirdiğini gözlemleyiniz.
