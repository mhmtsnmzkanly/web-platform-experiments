# Deney 016 Günlüğü: Web Cryptography API ve Matris Şifre Çözücü Tipografi

Bu günlük, Deney 016 süresince atılan adımları, teknik kararları, deneme-yanılma süreçlerini ve test çıktılarını kronolojik ve eklemeli (append-only) olarak kaydeder.

---

## [2026-09-29 02:12] — Başlangıç ve Tasarım Belirleme

### Bağlam ve Hedef
- Laboratuvar şimdiye kadar DOM semantiği, CSS yerleşim/renk/animasyon/3D, SVG vektör/filtre, Canvas raster ve WebGL grafik, Web Audio ses ve CSS Grid mimarilerini başarıyla tamamladı.
- Deney 016'da hedef: Tarayıcının donanım hızlandırmalı yerel güvenlik ve kriptografi motoru olan **Web Cryptography API** (`crypto.subtle`, `crypto.getRandomValues`) standardını devreye almak.
- Temel amaç: Sıfır harici kütüphane (CryptoJS vb. olmadan), doğrudan tarayıcının yerleşik C++ kriptografik ilkel fonksiyonlarını kullanarak "Hello World" ifadesini 256-bit AES-GCM şifreleme blokları, SHA-256 özet doğrulaması ve canlı bir siber matris şifre çözücü terminali olarak işlemek.

### Tasarım Alternatifleri
1. **Alternatif A — Arka Planda Sabit Bir Hash Hesaplayıp Konsola Yazdırmak:** Basit bir SHA-256 hesaplama. (Görsel ve kavramsal odak ilkesini zayıf bırakır).
2. **Alternatif B — Siber Operasyon Terminali ve Dinamik Matris Şifre Çözücü (Seçildi):**
   - Sayfa yüklendiğinde, `crypto.subtle.generateKey` ile donanım seviyesinde 256-bitlik bir AES-GCM oturum anahtarı üretilir.
   - `crypto.getRandomValues` ile 96-bitlik kriptografik IV oluşturulur ve "HELLO WORLD" metni şifrelenir (`crypto.subtle.encrypt`).
   - Aynı zamanda standart SHA-256 özeti hesaplanır (`a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`).
   - Görsel Merkez: Ekranın ortasında şifreli heksadesimal bayt blokları ve SHA-256 doğrulama etiketi sergilenir.
   - Etkileşim: "Şifreyi Çöz (Decrypt Stream)" tıklandığında, donanım seviyesinde `crypto.subtle.decrypt` çağrılır ve ekranda heksadesimal karakterlerden yeşil neon "HELLO WORLD" metnine doğru süzülen gerçek zamanlı bir matris çözülme efekti oynatılır.
   - Canlı Kriptografik Blok Madenciliği (Proof-of-Work Miner): "Hello World + nonce" girdisiyle saniyede binlerce SHA-256 hash'i hesaplanarak hedeflenen zorlukta (`0000...`) blok hash aranır ve canlı H/s telemetrisi sunulur.
3. **Alternatif C — Basit Caesar / ROT13 Şifresi:** İlkel alfabe kaydırma. (Web Cryptography API'yi kullanmaz, matematiksel bir güvenlik sunmaz).

### Karar ve Mimari Tercih
- Alternatif B seçildi. Tarayıcının en gelişmiş güvenlik standardını eksiksiz sergiler; "Hello World" ifadesini modern siber güvenlik ve kriptografik doğruluğun odağına oturtur.

## [2026-09-29 02:14] — Test ve Doğrulama Sonuçları

### Test Koşumu Çıktıları
- **Statik Sözdizimi Denetimi (`validate.sh`):** GEÇTİ (PASS). HTML5 doküman iskeleti, meta etiketleri, inline CSS ve V8 motoru ile JavaScript sözdizimi doğrulandı.
- **Harici Bağımlılık Denetimi (`dependency-check.sh`):** GEÇTİ (PASS). Sıfır harici ağ veya kütüphane bağımlılığı; meşru tek dosya yapısı doğrulandı.
- **Tarayıcı Çalışma Zamanı Testi (`browser-test.sh`):** GEÇTİ (PASS).
  - DOM Görünürlüğü: `<h1 class="hw-title">` "HELLO WORLD" elemanı (1063x131px) ekran merkezinde tam görünür.
  - Runtime & JS Hata: Sıfır JavaScript hatası, sıfır konsol uyarısı.
  - Network & İzinler: Sıfır harici istek, sıfır izin talebi.
  - Yeni Teknoloji Denetimi: `crypto.subtle` (AES-256-GCM, SHA-256) ve `crypto.getRandomValues` donanım hızlandırmalı olarak başarıyla doğrulandı.
- **Görsel İnceleme (`screenshot.sh`):** `reports/016/screenshot.png` oluşturuldu ve incelendi. Siber güvenlik terminali üzerinde zümrüt yeşili neon "HELLO WORLD" ana başlığı, AES-GCM şifreli heksadesimal bloklar, SHA-256 özet doğrulaması ve canlı PoW madencilik paneli kusursuz şekilde görselleştirildi.

### Sonuç ve Yayınlama
- `src/016.dev.html` tüm testleri başarıyla tamamladıktan sonra `src/016.html` olarak kalıcılaştırıldı.
- Deney 016 başarıyla tamamlandı.
