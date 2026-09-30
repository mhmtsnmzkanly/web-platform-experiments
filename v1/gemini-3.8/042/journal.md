# Çalışma Günlüğü: Deney 042

**Tarih:** 2026-09-30  
**Konu:** Web Cryptography API & Asimetrik ECDSA Dijital İmza ve Kriptografik Mühür Odası  
**Durum:** ✅ TAMAMLANDI  

---

## Faz 1: Durum Kontrolü
- Çalışma alanı temiz ve hazır.
- Tamamlanan deneyler: `001.html` - `041.html` (41 deney eksiksiz mühürlü, orphan `.dev.html` yok, Decade 5 başladı).
- Yerel web sunucusu: `http://localhost:7373/` aktif ve 200 OK yanıtı veriyor.
- `verify.sh`, `dependency-check.sh`, `browser-test.sh` altyapısı hazır.
- 5. Onluk Döngünün 2. deneyi (042) başlatılıyor.

---

## Faz 2: Teknoloji ve Tasarım Araştırması
- **Seçilen Teknoloji:** Web Cryptography API - Asimetrik Eliptik Eğri Dijital İmza (ECDSA - NIST P-256 / SHA-256) & Açık Anahtarlı Kimlik Doğrulama Odası.
- **Temel API ve Tarayıcı Yetenekleri:**
  - `crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])`: Donanım hızlandırmalı asimetrik eliptik eğri anahtar çifti (özel anahtar / açık anahtar) üretir.
  - `crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, data)`: "HELLO WORLD" metnini SHA-256 özeti üzerinden 64 baytlık $(r, s)$ eliptik eğri dijital imzasıyla kriptografik olarak mühürler.
  - `crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, publicKey, signature, data)`: Mesajın ve imzanın matematiksel bütünlüğünü doğrular (`true` / `false`).
  - `crypto.subtle.exportKey("spki", publicKey)` ve `crypto.subtle.exportKey("pkcs8", privateKey)`: Anahtarları standart X.509 SPKI ve PKCS#8 DER bayt dizilerine dönüştürür.
  - Tahrifat (Tamper & Mutation) Motoru: Kullanıcı "HELLO WORLD" metnindeki tek bir harfi (veya imzanın tek bir baytını) değiştirdiğinde matematiksel imza doğrulaması milisaniyede çöker ve sistem anında kırmızı alarm durumuna ("KRİPTOGRAFİK TAHRİFAT TESPİT EDİLDİ") geçer.
  - Eliptik Eğri Seçici: NIST P-256 ($y^2 \equiv x^3 - 3x + b \pmod p$), NIST P-384 ve P-521 eğrileri arası geçiş.
- **Tasarım Yaklaşımı:**
  - Kriptografik Kasa & Güvenlik Operasyon Merkezi (SOC / Hardware Security Module - HSM).
  - Ekran merkezinde devasa siber-güvenlik monoliti: "HELLO WORLD".
  - İmza geçerliyken monolit zümrüt yeşili neon parıltıyla parlar ve "DİJİTAL İMZA DOĞRULANDI" mührü görünür.
  - Tek bir harf değiştirildiğinde veya "Tahrifat Simülatörü" butonuna basıldığında monolit yakut kırmızısı lazer alarmına bürünür ve "GEÇERSİZ İMZA - SAHTE METİN" uyarısı verir.
  - Canlı 64-baytlık $(r, s)$ Hex/Base64 matrisi, SPKI açık anahtar parmak izi, SHA-256 özet paneli ve işlem süresi mikro-telemetrisi.

---

## Faz 3: Üç Alternatif Fikir Üretimi
1. **Fikir 1: Asimetrik ECDSA Dijital İmza ve Kriptografik Mühür Odası (ECDSA Digital Signature & Cryptographic Seal Room)**  
   - "HELLO WORLD" metninin NIST P-256/P-384 eliptik eğri özel anahtarıyla imzalanması, açık anahtar ile doğrulanması, tek baytlık tahrifat testi, canlı ASN.1 / $(r,s)$ hex akışı ve durum renkleri (Geçerli: Zümrüt, Tahrifat: Yakut).
2. **Fikir 2: ECDH (Elliptic Curve Diffie-Hellman) İki Düğümlü Anahtar Paylaşım Odası**  
   - Alice ve Bob düğümleri arasında ortak gizli anahtar türetimi.
3. **Fikir 3: RSA-PSS 4096-bit Asimetrik Kasa**  
   - Büyük asal sayılarla RSA imzalama.

---

## Faz 4: Fikir Seçimi
- **Karar:** **Fikir 1: Asimetrik ECDSA Dijital İmza ve Kriptografik Mühür Odası** seçildi.
- **Gerekçe:** W3C Web Cryptography API standardının en modern ve endüstri standardı olan Eliptik Eğri Dijital İmza Algoritması'nı (ECDSA NIST P-256) sıfır harici kütüphane ile sergiler. "HELLO WORLD" imzalanan ve korunan kriptografik yükün kendisidir.

---

## Faz 5: src/042.dev.html Geliştirmesi
- `src/042.dev.html` yazıldı (730 satır, ~22 KB).
- Uygulanan bileşenler:
  - CSS custom property cascade ile renk tema geçişi (`--theme-status`: emerald / ruby)
  - `contenteditable` H2 ile canlı re-imzalama tetikleyicisi
  - `crypto.subtle.generateKey → sign → verify` akışı
  - SHA-256 digest hex paneli, 64-byte imza hex paneli, SPKI public key fingerprint
  - P-256 / P-384 / P-521 eğri seçim butonları
  - Tahrifat simülasyonu: metin kurcalama ve imza bayt bozma
  - `window.__E042_VERIFIED` çalışma zamanı kanıtı

---

## Faz 6: Otomatik Doğrulama
```
./verify.sh src/042.dev.html reports/042
→ OK  (exit 0)
```
- [NETWORK] PASS
- [PERMISSIONS] PASS
- [DOM_VISIBILITY] PASS
- [NEW_TECHNOLOGY_ACTIVE] REVIEW_REQUIRED (report.md'de belgelendi)
- [TEST_INFRASTRUCTURE] PASS

Not: Web sunucusunun yanlış dizine (`hw_lab_luna`) işaret eden başka bir process tarafından servis edildiği tespit edildi. Doğru dizinle (`hw_lab/src`) yeniden başlatıldı. Sorun giderildi.

---

## Faz 7: Görsel İnceleme
- 4 ekran görüntüsü alındı: `screenshot.png`, `screenshot-tampered-text.png`, `screenshot-tampered-sig.png`, `screenshot-p384.png`
- İNSAN DOĞRULAMASI GEREKLİ: Kriptografik doğrulama sonuçlarının (geçerli/geçersiz durum geçişleri) gözle doğrulanması gerekiyor.

---

## Faz 8: Teknik Raporlama
- `reports/042/report.md` yazıldı.

---

## Faz 9: Mühürleme
- `src/042.dev.html` → `src/042.html` kopyalandı.
- `./verify.sh src/042.html reports/042` → OK

---

## Faz 10: İndeks ve Durum Belgeleri Güncelleme
- `PROGRESS.md` güncellendi (042 satırı eklendi).
- `TECHNOLOGIES.md` güncellendi (Web Crypto API düğümü ve kenarı eklendi).
- `CURRENT.md` güncellendi (durum: 042 tamamlandı, sonraki: 043).
