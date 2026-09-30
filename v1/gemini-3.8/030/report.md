# Hello World Lab — Teknik Rapor: Deney 030

**Deney Başlığı:** Web Locks API & Dağıtık Tipografik Mutex ve Kaynak Tahsis Odası  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/030.html`  
**Kilometre Taşı:** 3. Onluk Döngü (Decade 3 Milestone)  

---

## 1. Deney Amacı ve Özeti
Deney 030, web tarayıcısının çoklu sekme (multi-tab), iframe ve Web Worker ortamlarında eşzamanlı veri yarış koşullarını (race conditions) çözmek üzere W3C tarafından standartlaştırılan **Web Locks API** (`navigator.locks`) yeteneğini inceler. Hello World Lab'in 30. kilometre taşı olarak tasarlanan bu deneyde "HELLO WORLD" metni, korunan kritik bir paylaşılan kaynak matrisi (`hw_master_mutex`) haline getirilmiştir. Farklı işlemci düğümleri (Düğüm Alfa, Düğüm Beta, Düğüm Gamma) exclusive ve shared kilitler talep ederek kaynak üzerinde işlem yapar. Canlı kuyruk denetleyicisi (`navigator.locks.query()`) aracılığıyla tutulan (`held`) ve bekleyen (`pending`) kilitler gerçek zamanlı olarak izlenir.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C Web Locks API:**
  - `navigator.locks.request(name, options, callback)`: Belirtilen ada (`hw_master_mutex`) sahip bir asenkron kilit talep eder. Kilit elde edildiğinde `callback` asenkron fonksiyonu çalışır; `callback` çözümlendiğinde (resolved/rejected) kilit otomatik olarak serbest bırakılır.
  - **Exclusive Lock (Tekil Yazma Kilidi):**
    - `mode: 'exclusive'` (varsayılan): Yalnızca tek bir yürütme bağlamının kaynağı değiştirmesine izin verir. Düğüm Alfa ve Beta, "HELLO WORLD" tipografisini dönüştürmek için exclusive kilit alır. Kilit tutulurken sahne koyu kırmızı lazer kafesiyle kuşatılır ve harf glifleri `LOCKED` durumuna geçer.
  - **Shared Lock (Paylaşılan Okuma Kilidi):**
    - `mode: 'shared'`: Birden çok okuyucu düğümün çakışma olmadan kaynağı eşzamanlı olarak incelemesine izin verir. Düğüm Gamma shared kilit aldığında glifler siyan renkte telemetri taramasına tabi tutulur.
  - **Preemption (Steal):**
    - `steal: true`: Kritik durumlarda mevcut tutulan kilidi iptal ederek (preempt) öncelikli kilit alma mekanizması gösterilir.
  - **navigator.locks.query():**
    - `navigator.locks.query()` ile sistemdeki aktif kilitlerin (`held`) istemci ID'leri, modları ve bekleyen kuyruk (`pending`) talepleri sorgulanarak UI telemetri tablosuna yansıtılır.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezde yer alan monolitik "HELLO WORLD" glifleri, her harfe entegre edilmiş mikro kilit durumu etiketleri (`FREE`, `EXCLUSIVE`, `SHARED`) ile doğrudan mutex durumunu ifade eder.
   - JetBrains Mono ve modern sistem yazı tipleriyle siber güvenlik ve dağıtık sistemler kontrol masası estetiği sağlanmıştır.
2. **Renk Paleti ve Kontrast:**
   - Koyu grafit arka plan (`#080c14`), derin panel arayüzleri (`rgba(13, 20, 36, 0.75)`).
   - Exclusive modda kuantum yakut kırmızısı (`#f43f5e`, glow efekti), shared modda elektrik mavisi/siyan (`#00f0ff`), serbest durumda ise neon zümrüt yeşili (`#10b981`).
   - Kontrast oranı WCAG AAA standartlarını eksiksiz karşılar (4.5:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - 2 sütunlu yüksek yoğunluklu konsol düzeni: Sol kolonda büyük Kuantum Mutex Sahnesi ve Lazer Kafesi, sağ kolonda Düğüm ve Kilit Kontrol Masası, altta `navigator.locks.query()` Canlı Kilit ve Kuyruk Olay Akışı.
4. **Mikro Etkileşim ve Hareket:**
   - Kilit alındığında lazer kafesi ızgarası aktifleşir; harf glifleri neon parlama ve ölçeklenme animasyonuna girer.
   - Kuyrukta bekleyen talepler için sarı kehribar nabız sinyalleri verilir.
5. **Kavramsal Odak (Hello World Merkeziligi):**
   - "HELLO WORLD" yalnızca pasif bir başlık değil; kilitlenen, paylaşılan, okunan ve korunan ana bellek kaynağının kendisidir.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici URL/CDN/font, yerleşik sistem yazı tipleri ve SVG).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, Web Locks API aktif çalışma tespiti).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Ekran Görüntüleri:**
  - `screenshot.png`: Başlangıç serbest kaynak durumu (Resource Unlocked, Free glyphs).
  - `screenshot-exclusive.png`: Düğüm Alfa exclusive kilit tutarken (Ruby laser cage, LOCKED state).
  - `screenshot-shared.png`: Düğüm Gamma shared kilit tutarken (Cyan telemetry reader state).
  - `screenshot-queue.png`: Eşzamanlı istekler sonucunda `held` ve `pending` kuyruğunun eşzamanlı izlenmesi.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Çoklu Sekme (Multi-Tab) Yarış Koşulu Testi:**
  - Sayfadaki "Yeni Dolanık Sekme Aç" butonuna basılarak veya aynı URL (`http://localhost:7373/030.html`) iki ayrı tarayıcı penceresinde yan yana açılarak test edilmelidir.
  - Birinci sekmede Düğüm Alfa'ya basılıp kilit tutulurken, ikinci sekmede Düğüm Beta'ya basıldığında; ikinci sekmenin kilidi kapmak için birinci sekmenin süresinin dolmasını (veya serbest kalmasını) beklediği ve yarış durumu olmadan ardışık işlendiği gözlemlenmelidir.
