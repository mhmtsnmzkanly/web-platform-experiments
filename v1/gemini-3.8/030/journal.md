# Çalışma Günlüğü: Deney 030

**Tarih:** 2026-09-30  
**Konu:** Web Locks API & Dağıtık Tipografik Mutex ve Kaynak Tahsis Odası  
**Durum:** TAMAMLANDI  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `029.html` (29 deney eksiksiz mühürlü, orphan `.dev.html` yok).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 30. Deney, projenin 3. onluk döngüsünü (Decade 3 Milestone) taçlandıran büyük bir kilometre taşıdır.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** Web Locks API (W3C Recommendation).
- **Temel API Yetenekleri:**
  - `navigator.locks.request(name, options, callback)`: Eşzamanlı asenkron kaynak kilitlenmesi.
  - Kilit Modları:
    - `mode: 'exclusive'` (Varsayılan): Tekil yazıcı kilidi; aynı ada sahip başka hiçbir kilit tutulamaz.
    - `mode: 'shared'`: Çoklu okuyucu kilidi; aynı anda birden çok okuyucu çakışma olmadan kilidi tutabilir.
  - Seçenekler:
    - `ifAvailable: true`: Kilit o anda meşgulse beklemeden vazgeçme.
    - `steal: true`: Bekleyen veya tutulan mevcut kilidi zorla ele geçirme (preemption).
  - `navigator.locks.query()`: Aktif tutulan (`held`) ve kuyrukta bekleyen (`pending`) tüm kilitlerin canlı dökümünü alma.
- **Tasarım Yaklaşımı:**
  - Yüksek Güvenlikli Kuantum Mutex Kasası (Distributed Typographic Mutex Vault).
  - "HELLO WORLD" metni paylaşılan kritik bir kaynak matrisidir.
  - Düğüm Alfa (Yazıcı), Düğüm Beta (Yazıcı) ve Düğüm Gamma (Okuyucu Havuzu) "HELLO WORLD" gliflerini manipüle etmek için Web Locks API üzerinden yarışır.
  - Bir düğüm `exclusive` kilit aldığında "HELLO WORLD" kilitlenir, neon kehribar/kırmızı lazer kafesiyle çevrilir ve o düğümün dalga/renk mutasyonu işlenir; diğer istekler `pending` kuyruğunda düzenli olarak bekler.
  - Çoklu pencereli test: Başka bir sekme açıldığında, iki bağımsız sekme yarış durumu (race condition) olmadan tarayıcının yerel Web Locks yöneticisi tarafından adil biçimde sıralanır.
  - Canlı Kilit ve Kuyruk Denetleyicisi: `navigator.locks.query()` ile `held` ve `pending` kilitler gerçek zamanlı görselleştirilir.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Kuantum Mutex Kasası ve Dağıtık Kaynak Tahsisi (Distributed Mutex Vault)**  
   - Koyu siber güvenlik / kriptografik kasa teması. Merkezde lazer kafesiyle korunan "HELLO WORLD", her harfin üzerinde 🔓 / 🔒 kilit durumu. Sağda düğüm istek butonları, altta canlı kilit kuyruğu ve `query()` durumu.
2. **Fikir 2: Veritabanı ACID Transaction Kilitleyicisi (Database Isolation Grid)**  
   - Kurumsal veritabanı konsolu estetiği; satır ve tablo seviyesinde kilit hiyerarşisi.
3. **Fikir 3: Çok İş Parçacıklı Demiryolu Sinyalizasyonu (Railway Semaphore Controller)**  
   - Mekanik demiryolu sinyalleri ile harflerin tekil tren bloklarına girmesi.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Kuantum Mutex Kasası ve Dağıtık Kaynak Tahsisi** seçildi.
- **Gerekçe:** 30. Deney kilometre taşına yaraşır yüksek teknoloji ve siber güvenlik estetiği sunarken, Web Locks API'sinin `exclusive` ve `shared` modlarını, `pending` kuyruğunu ve sekmeler arası dağıtık mutex koordinasyonunu mükemmel şekilde sergilemektedir.

---

## Faz 5: `src/030.dev.html` Geliştirme
- Sıfır harici CDN/kütüphane kuralına tam uyum ile `src/030.dev.html` kodlandı.
- `hw_master_mutex` isimli kilit kaynağı üzerinde `navigator.locks.request` exclusive ve shared çağrıları uygulandı.
- `navigator.locks.query()` entegrasyonu ile aktif kilit ve bekleyen kuyruk sayısı canlı panellere bağlandı.
- Lazer kafesi CSS ızgarası, harf bazlı mikro kilit etiketleri (`FREE` / `EXCLUSIVE` / `SHARED`) ve kuantum kızılı/siyan/zümrüt renk geçişleri kodlandı.
- Steal özelliği ile preemption müdahale butonu eklendi.

---

## Faz 6: Otomatik Doğrulama
- `./verify.sh src/030.dev.html reports/030` çalıştırıldı.
- `dependency-check.sh`: 0 harici bağımlılık, geçersiz ağ isteği yok.
- `browser-test.sh`: 0 konsol hatası, 0 runtime istisnası, Web Locks API çalışma zamanı doğrulaması başarılı.
- Sonuç: `OK` (Çıkış kodu 0).

---

## Faz 7: Görsel İnceleme & Çoklu Durum Ekran Görüntüleri
- `reports/030/screenshot.png`: Başlangıç serbest kilit durumu (Free glyphs).
- `reports/030/screenshot-exclusive.png`: Düğüm Alfa exclusive kilit tutarken yakut kırmızısı lazer kafesi ve kilitli glifler.
- `reports/030/screenshot-shared.png`: Düğüm Gamma shared telemetri okuması yaparken siyan ışıma durumu.
- `reports/030/screenshot-queue.png`: Eşzamanlı taleplerin kuyruğa girdiği `held` ve `pending` telemetri görünümü.
- Görsel hiyerarşi, kontrast (WCAG AAA) ve Hello World odaklılığı onaylandı.

---

## Faz 8: Teknik Raporlama
- `reports/030/report.md` 5 temel başlık altında eksiksiz yazıldı:
  1. Deney Amacı ve Özeti
  2. Kullanılan Teknoloji ve Çalışma Mantığı
  3. 5 Boyutlu Tasarım Değerlendirmesi
  4. Doğrulama Kanıtları ve Test Sonuçları
  5. İnsan Doğrulaması Gereken Durumlar

---

## Faz 9: Mühürleme
- `mv src/030.dev.html src/030.html` komutu ile dosya mühürlendi.
- `./verify.sh src/030.html reports/030` çalıştırıldı.
- Çıktı: `OK` (Çıkış kodu: 0).
- Orphan `.dev.html` dosyası kalmadığı teyit edildi.

---

## Faz 10: İndeks ve Durum Güncellemesi
- `reports/030/journal.md` tamamlandı.
- `PROGRESS.md`, `TECHNOLOGIES.md` ve `CURRENT.md` güncellendi.
- Kilometre taşı tamamlandı: 3. Onluk Döngü (Decade 3: 021-030) başarıyla mühürlendi.
