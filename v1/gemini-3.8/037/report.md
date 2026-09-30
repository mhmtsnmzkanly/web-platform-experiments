# Hello World Lab — Teknik Rapor: Deney 037

**Deney Başlığı:** HTML5 &lt;dialog&gt; Element & Modal Architecture (Yerel Odak Hapsi, Deklaratif Form ve Çok Durumlu Güvenlik Kasası)  
**Tarih:** 2026-09-30  
**Durum:** TAMAMLANDI (Mühürlendi)  
**Dosya:** `src/037.html`  
**Döngü:** 4. Onluk Döngü (Decade 4: 031-040)  

---

## 1. Deney Amacı ve Özeti
Deney 037, modern HTML standartlarının yerleşik diyalog ve modal kutu standardı olan **HTML5 `<dialog>` Element** mimarisini inceler. Yıllardır JavaScript kütüphaneleri (Bootstrap Modal, SweetAlert vb.) ve elle kodlanmış odak döngüleri (focus loop trap) ile çözülmeye çalışılan modal problemleri, W3C HTML5 `<dialog>` standardıyla tarayıcının çekirdek arayüz motoruna entegre edilmiştir. Bu deneyde "HELLO WORLD" kriptografik çekirdeği bir güvenlik monoliti olarak modellenmiş; `dialog.showModal()` metoduyla tarayıcının yerleşik En Üst Katmanında (Top Layer) tam ekran `::backdrop` karartması, zemin düzleminin pasifleştirilmesi (`inert`) ve yerel odak hapsi (focus trap) ile kuantum güvenlik kasası açılmıştır. `<form method="dialog">` deklaratif standart formu kullanılarak sıfır JavaScript satırıyla `returnValue` üretilmiş, sonuca göre ana sahnedeki "HELLO WORLD" tipografisi zümrüt yeşili rezonans veya yakut kırmızısı alarm moduna geçirilmiştir. Ayrıca `dialog.show()` ile modeless (odak hapsetmeyen) yüzen telemetri penceresi sunulmuştur.

---

## 2. Kullanılan Teknoloji ve Çalışma Mantığı
- **W3C HTML5 `<dialog>` Standart Mimarisi:**
  - `<dialog id="vaultModal">`: Standart HTML5 diyalog öğesi.
  - Metotlar ve Açılış Modları:
    - `dialog.showModal()`: Diyaloğu tarayıcının En Üst Katmanına (Top Layer) modal olarak terfi ettirir. Sayfanın geri kalanını erişilebilirlik ve klavye/fare etkileşimi açısından `inert` (etkisiz) kılar. Klavye odağını otomatik olarak diyalog içine (`autofocus` alanına) hapseder.
    - `dialog.show()`: Modeless diyalog açar; zeminle etkileşime izin verir ve `::backdrop` oluşturmaz.
    - `dialog.close(returnValue)`: Diyaloğu kapatır ve sonuca dair dizeyi `dialog.returnValue` içine yazar.
  - Deklaratif Form İşleme:
    - `<form method="dialog">`: Tarayıcının yerleşik form gönderme yöntemi. Form içerisindeki submit butonunun `value` özniteliği (`value="AUTHORIZED"`, `value="REJECTED"`), sayfa yenilenmeksizin doğrudan `dialog.returnValue` olarak atanır ve diyalog anında kapanır.
  - Olaylar:
    - `close`: Diyalog kapandığında tetiklenir; `vaultModal.returnValue` okunarak terminal rengi ve rezonansı ayarlanır.
    - `cancel`: Kullanıcı klavyedeki `Esc` tuşuna bastığında tetiklenir; istenirse `event.preventDefault()` ile engellenebilir.
  - CSS Top Layer ve Sözde Öğeler:
    - `dialog::backdrop`: `showModal()` ile açıldığında otomatik üretilen ve tüm sayfayı kaplayan donanım hızlandırmalı karartma/buğulama katmanı (`backdrop-filter: blur(14px)`).
    - `dialog:modal`: Yalnızca `showModal()` ile açılan modalları seçen yerel CSS sözde sınıfı.

---

## 3. 5 Boyutlu Tasarım Değerlendirmesi
1. **Tipografi ve Hiyerarşi:**
   - Merkezdeki monolitik terminalde büyük puntolu, neon gradyanlı "HELLO WORLD" ana başlığı yer alır.
   - Her bir harfin altında ASCII onaltılık kod dizilimi (`0x48`, `0x45`, `0x4C`...) bulunmaktadır.
   - Kasa onaylandığında (`AUTHORIZED`) "HELLO WORLD" zümrüt yeşili rezonansa bürünür; reddedildiğinde (`REJECTED`) yakut kırmızısı alarm moduna kilitlenir.
2. **Renk Paleti ve Kontrast:**
   - Koyu uzay mavisi/siyah terminal zeminleri (`#030712`, `#080d1a`).
   - Neon siyanı (`#06b6d4`), zümrüt yeşili (`#10b981`), yakut kırmızısı (`#f43f5e`), kehribar sarısı (`#f59e0b`) ve siber mor (`#8b5cf6`).
   - Kontrast oranları WCAG AAA standardı olan 7:1 seviyesinin oldukça üzerindedir (9:1 üstü).
3. **Mizanpaj ve Kompozisyon:**
   - Sol kolonda Güvenlik Odası Durum Rozeti, Monolitik Terminal ("HELLO WORLD"), Modal/Modeless Tetikleyicileri ve Popover vs Dialog Karşılaştırma Matrisi bulunur.
   - Sağ kolonda Yetki Aksiyonları, Canlı Diyalog ve Odak Telemetrisi (`activeElement`, `open`, `:modal`, `returnValue`) ve Olay Akış Konsolu yer alır.
4. **Mikro Etkileşim ve Hareket:**
   - Modal açıldığında pürüzsüz `transform: scale(0.92) → scale(1)` ve `opacity` geçişi yapılır.
   - `::backdrop` geçişiyle tüm arka plan derin bir bulanıklıkla karanlığa gömülür.
5. **Kavramsal Odak (Hello World Merkeziliği):**
   - "HELLO WORLD" doğrudan kuantum kriptografik çekirdeğin kendisidir; modal penceresi bu ifadenin SHA-256 yetkilendirmesini yönetir ve diyalog kararları doğrudan "HELLO WORLD" metninin görsel varlığını belirler.

---

## 4. Doğrulama Kanıtları ve Test Sonuçları
- **Statik Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (0 harici kütüphane, saf HTML5 `<dialog>` ve yerel CSS/JS).
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (Sıfır `console.error()`, sıfır runtime exception, DOM üzerinde "HELLO WORLD" görünürlüğü kanıtlandı).
- **Entegre Doğrulama (`verify.sh`):** Tek satır `OK` (Çıkış kodu: 0).
- **Çoklu Durum Ekran Görüntüleri:**
  - `screenshot.png`: Varsayılan durum (Protokol Beklemede, Zemin Düzlemi, Kasa Kilitli).
  - `screenshot-modal-open.png`: `showModal()` ile Top Layer odak hapsi ve `::backdrop` buğulaması açıkken.
  - `screenshot-state-authorized.png`: `method="dialog"` ile `AUTHORIZED` onayı verilmiş zümrüt yeşili rezonans hali.
  - `screenshot-state-rejected.png`: `method="dialog"` ile `REJECTED` reddi verilmiş yakut kırmızısı alarm hali.
  - `screenshot-modeless-open.png`: `show()` ile sağ üstte açılan modeless yüzen telemetri diyaloğu.

---

## 5. İnsan Doğrulaması Gereken Durumlar
- **Yerel Odak Hapsi (Focus Trap) ve Tab Tuşu Gezinimi:**
  - `showModal()` ile kasa açıldığında klavyedeki `Tab` tuşuna ardışık basılarak odak döngüsünün yalnızca modal içindeki 3 buton arasında döndüğü, zemin düzlemindeki butonlara asla sıçramadığı doğrulanmalıdır.
- **Esc Tuşu ile İptal (cancel Olayı):**
  - Modal açıkken klavyeden `Esc` tuşuna basıldığında diyaloğun yerel olarak kapandığı ve olay konsoluna `[CANCEL]` kaydının düştüğü gözlemlenmelidir.
