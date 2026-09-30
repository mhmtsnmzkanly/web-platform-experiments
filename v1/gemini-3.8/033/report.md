# Hello World Lab — Teknik Rapor: Deney 033

**Deney Başlığı:** MutationObserver API & Sibernetik Tipografik Genom ve Canlı Mutasyon Odası  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/033.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  
**Soy Ağacı Bağı:** W3C Observer Dörtlüsü Tamamlandı (011 ResizeObserver, 021 IntersectionObserver, 025 PerformanceObserver, 033 MutationObserver)  

---

## 1. Deney Amacı ve Özeti
Deney 033, modern web tarayıcısının DOM ağacı üzerinde gerçekleşen yapısal ve anlamsal değişimleri asenkron microtask döngüsünde sıfır reflow maliyetiyle izlemesini sağlayan **MutationObserver API** standardını inceler. Projedeki Observer soy ağacının 4. ve son üyesi olan bu deneyde "HELLO WORLD" metni, 10 nükleotidlik sentetik bir kuantum genom dizisi (`[H][E][L][L][O] - [W][O][R][L][D]`) olarak modellenmiştir. Harici reaktör tetikleyicileriyle (nokta mutasyonu, epigenetik voltaj değişimi, nükleotid insersiyon/delesyon ve kozmik fırtına) canlı DOM üzerinde yapılan tüm operasyonlar MutationObserver tarafından yakalanarak eski/yeni değerleriyle Canlı Mutasyon Denetim Defteri'ne (Mutation Audit Stream) dökülür.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C DOM Level 4 MutationObserver API:**
  - `new MutationObserver(callback)`: DOM mutasyonlarını tek tek işlemek yerine aynı mikro-görev (microtask) döngüsündeki tüm değişiklikleri toplu bir dizi (`mutationsList`) halinde geri çağrıya iletir.
  - `observer.observe(targetNode, config)`:
    - `attributes: true` & `attributeOldValue: true`: Düğümün `data-charge` veya `class` niteliği değiştiğinde tetiklenir, `record.oldValue` ile eski değerini saklar.
    - `characterData: true` & `characterDataOldValue: true`: Metin düğümlerinin (`TextNode`) harf değişimlerini ve önceki glif değerini yakalar.
    - `childList: true`: Yeni nükleotid düğümlerinin eklenmesini (`record.addedNodes`) veya diziden silinmesini (`record.removedNodes`) raporlar.
    - `subtree: true`: Hedef kapsayıcının altındaki tüm torun düğümleri de derinlemesine gözlem havuzuna dahil eder.
  - `observer.disconnect()`: Canlı gözlemi anında durdurur; `observer.observe()` ile yeniden bağlanabilir.
- **Microtask Toplu İşleme (Batching) Mantığı:**
  - Kozmik Fırtına gibi tek seferde 20+ mutasyonun üretildiği senaryolarda tarayıcı sayfayı 20 kez yeniden boyamaz (paint); microtask sonunda tüm `MutationRecord` nesnelerini tek bir dizi içinde güvenle teslim eder.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezde yer alan monolitik "HELLO WORLD" metninin her bir harfi, kendi nükleotid kapsülü (`.codon-pill`) içinde barındırılır.
   - Her harfin altında genetik tanımlayıcısı (`CD-01`, `CD-02`...) yer alır; mutasyona uğradığında harf Yunan harflerine veya kuantum simgelerine evrilirken neon kızıl/sarı ışıma (`mutated-glow`) kazanır.
2. **Renk Paleti ve Kontrast:**
   - Koyu kuantum laboratuvarı zemini (`#030611`, `#050811`).
   - Siber mor (`#a855f7`, ana gözlemci rengi), elektrik siyanı (`#06b6d4`, attributes), neon yeşili (`#10b981`, bağlı durum) ve kozmik yakut kırmızısı (`#f43f5e`, mutasyon fırtınası).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (7:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda Genom Mutasyon Sahnesi, kodon kapsülleri ve alt mutasyon dağılım şeridi yer alır.
   - Sağ kolonda Nokta Mutasyonu, Epigenetik Yük, Nükleotid Ekle/Sil, Kozmik Fırtına tetikleyicileri ve Canlı Mutasyon Denetim Defteri bulunur.
4. **Mikro Etkileşim ve Hareket:**
   - Harflere mutasyon uygulandığında CSS `transform: translateY(-4px) scale(1.05)` ve renk geçişleriyle kinetik nabız etkisi verilir.
   - Yeni nükleotid eklendiğinde `@keyframes insertPulse` ile kuantum doğuşu canlandırılır.
5. **Kavramsal Odak (Hello World Merkeziligi):**
   - "HELLO WORLD" izlenen, korunan, mutasyona uğratılan ve genetik olarak onarılan ana veri organizmasıdır.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici URL/CDN/font, sistem yazı tipleri ve saf CSS/JS).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM üzerinde görünür "HELLO WORLD" kanıtı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Ekran Görüntüleri:**
  - `screenshot.png`: Başlangıç kararlı genom hali (Canonical HELLO WORLD, 0 mutasyon).
  - `screenshot-point-mutation.png`: Nokta mutasyonu ve epigenetik şarj uygulanmış durum (CharacterData ve Attributes kayıtları).
  - `screenshot-cosmic-storm.png`: Kozmik fırtına sonrası toplu mutasyon (Çoklu kızıl parıltılı kodonlar, eklenmiş nükleotid, dolu denetim defteri).
  - `screenshot-disconnected.png`: Gözlemci bağlantısı kesilmiş durum (`observer.disconnect()`, kırmızı durum rozeti).

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Microtask Toplu İşleme Davranışı:**
  - "KOZMİK RADYASYON FIRTINASI" butonuna tıklandığında onlarca düğümün aynı JavaScript çalıştırma anında değiştiği ve `MutationObserver` geri çağrısının tek bir toplu liste olarak tüm kayıtları denetim defterine aynı milisaniyede döktüğü gözlemlenmelidir.
- **Gen Onarımı (DNA Repair):**
  - Sayfa mutasyonlarla doluyken "GENOMU ONAR (RESET DNA)" butonuna basıldığında dizilimin hatasız bir şekilde orijinal "HELLO WORLD" dizisine döndüğü ve bu temizleme işleminin de `childList` olarak kaydedildiği doğrulanmalıdır.
