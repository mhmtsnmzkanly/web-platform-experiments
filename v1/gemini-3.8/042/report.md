# Deney 042 — Web Cryptography API & Asimetrik ECDSA Dijital İmza Monoliti

**Tarih:** 2026-09-30  
**Dosya:** `src/042.html`  
**Durum:** ✅ TAMAMLANDI

---

## 1. Amaç

`crypto.subtle` (SubtleCrypto) API'sinin asimetrik imza yeteneklerini — ECDSA algoritması üzerinden P-256 / P-384 / P-521 eğrileriyle — canlı ve etkileşimli biçimde görselleştirmek.

"HELLO WORLD" metninin gerçek zamanlı imzalanması, hash hesabı, doğrulanması ve kasıtlı bozulma simülasyonu ile kriptografik güven döngüsünü doğrudan ekrana taşımak.

---

## 2. Teknoloji & Mekanik

### Kullanılan Teknoloji
- **Web Cryptography API (SubtleCrypto):** `crypto.subtle.generateKey`, `crypto.subtle.sign`, `crypto.subtle.verify`, `crypto.subtle.digest`
- **ECDSA P-256 / P-384 / P-521:** Üç NIST eğrisi arasında çalışma zamanında geçiş
- **contenteditable H2:** Canlı re-imzalama tetikleyicisi
- **CSS custom property cascade:** `--theme-status` aracılığıyla renk teması geçişi (emerald ↔ ruby)

### Mekanizma Zinciri

```
generateKey(ECDSA, namedCurve)
  → publicKey + privateKey çifti
  → hwPayload.textContent → TextEncoder → Uint8Array
  → crypto.subtle.sign(ECDSA+SHA-256, privateKey, data) → 64-byte (r,s) imza
  → imza hex panele yazılır
  → crypto.subtle.verify(ECDSA+SHA-256, publicKey, signature, data) → boolean
  → body.classList: "tampered" / "" → --theme-status: ruby / emerald
```

Bozulma senaryoları:
- **Metin kurcalama:** `hwPayload` içeriği `"[TAHRİF]"` ile değiştirilir → imza veriyle uyuşmaz → `INVALID`
- **İmza bayt bozma:** `sig[4] ^= 0xFF` XOR → kriptografik imzayı bozar → `INVALID`
- **Geri yükleme:** `btnRestoreOriginal` → orijinal metin geri gelir + yeniden imzalanır

### Çalışma Zamanı Kanıtı
`window.__E042_VERIFIED` nesnesi:
```json
{
  "ecdsaSupported": true,
  "curve": "P-256",
  "isValidSignature": true,
  "payload": "HELLO WORLD",
  "sigLength": 64
}
```

---

## 3. 5D Tasarım

| Boyut | Tasarım kararı |
|-------|---------------|
| **Form** | İki sütun: sol = imza odası (monolith), sağ = kriptografik detay panelleri |
| **Renk** | Yeşil (emerald) = geçerli; Kırmızı (ruby) = geçersiz; CSS `--theme-status` cascade |
| **Hareket** | İmza durumu pulse animasyonu; güvenli icon titremesi (tampering durumunda) |
| **Etkileşim** | contenteditable payload, eğri seçim butonları, kurcalama / geri yükleme aksiyonları |
| **Bilgi yoğunluğu** | SHA-256 hash hex, 64-byte imza hex, SPKI public key fingerprint canlı olarak ekranda |

---

## 4. Doğrulama Kanıtı

```
./verify.sh src/042.dev.html reports/042
→ OK  (exit 0)
```

Geçen kontroller:
- `[NETWORK]` PASS — harici istek yok
- `[PERMISSIONS]` PASS — izin gerektiren API kullanılmıyor
- `[DOM_VISIBILITY]` PASS — "HELLO WORLD" görünür, aria-label mevcut
- `[NEW_TECHNOLOGY_ACTIVE]` REVIEW_REQUIRED (bkz. bölüm 5)
- `[TEST_INFRASTRUCTURE]` PASS

---

## 5. İNSAN DOĞRULAMASI GEREKLİ

`browser-test.sh` otomatik doğrulama, `crypto.subtle.sign` / `crypto.subtle.verify`'nin gerçek kriptografik sonuçlarını çalışma zamanında doğrulayamaz. Aşağıdaki kontroller insan tarafından yapılmalıdır:

**Gerekli kontroller:**
1. Sayfa açıldığında "İmza: GEÇERLİ ✓" ve yeşil emerald tema görünmeli.
2. "Metni Kurcala" butonuna basıldığında tema kırmızıya geçmeli ve "GEÇERSİZ ✗" yazmalı.
3. "Geri Yükle" butonuyla metin geri geldiğinde yeniden yeşile dönmeli.
4. "İmza Bytını Boz" ile de kırmızı alarm oluşmalı.
5. P-384 / P-521 butonlarına basıldığında yeni anahtar çifti üretilmeli ve imza uzunluğu değişmeli (P-256: 64 byte, P-384: 96 byte, P-521: 132 byte).

**Ekran görüntüleri:** `reports/042/screenshot*.png`

---

## 6. Ekran Görüntüleri

| Dosya | Durum |
|-------|-------|
| `screenshot.png` | Varsayılan — emerald yeşil, geçerli imza |
| `screenshot-tampered-text.png` | Metin kurcalama — ruby kırmızı alarm |
| `screenshot-tampered-sig.png` | İmza bayt bozma — ruby kırmızı alarm |
| `screenshot-p384.png` | P-384 eğrisi — yeni keypair, 96 byte imza |
