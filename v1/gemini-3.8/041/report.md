# Deney 041 Teknik Raporu: CSS Anchor Positioning API & Kuantum Aviyonik Telemetri Ağı

## 1. Amaç
Bu deneyin temel amacı, W3C CSS Anchor Positioning Module Level 1 standardını kullanarak, tek bir satır JavaScript koordinat hesaplaması (`getBoundingClientRect`, `scroll`, `resize` dinleyicileri) olmaksızın tamamen modern deklaratif CSS kuralları ile "HELLO WORLD" gliflerine kenetlenen dinamik bir aviyonik HUD telemetri ağı kurmaktır. Harfler CSS keyframe animasyonları ile dalgalandığında veya kullanıcı tarafından eksen boyunca kaydırıldığında, harflere bağlı mikro rozetlerin ve ana vizörün tarayıcının yerel C++ kompozitör motoru tarafından milisaniyelik doğrulukla takip edilmesi ve ekran taşmalarında `@position-try` deklaratif fallback kurallarıyla yön değiştirmesi sergilenmektedir.

## 2. Teknoloji ve Çalışma Mantığı

### Kullanılan API'ler ve Standartlar
- **`anchor-name: --anchor-id`**: "HELLO WORLD" kelimesindeki her bir harf DOM elemanına bağımsız bir CSS Çapa Referansı (`--anchor-h`, `--anchor-e`, `--anchor-l1`, `--anchor-l2`, `--anchor-o1`, `--anchor-w`, `--anchor-o2`, `--anchor-r`, `--anchor-l3`, `--anchor-d`) tanımlar.
- **`position-anchor: --anchor-id`**: Mutlak konumlandırılmış (`position: absolute`) hedef elemanın hangi çapaya bağlanacağını doğrudan bildirir.
- **`position-area` / `anchor()` Fonksiyonları**:
  - `position-area: top center` ve `bottom: anchor(top)`: Çapa hedefinin üst merkezine kenetlenir.
  - `position-area: bottom center` ve `top: anchor(bottom)`: Çapa hedefinin alt merkezine kenetlenir.
  - `top: anchor(center)` ve `left: anchor(right)`: Dinamik vizörü aktif harfin sağ tarafına bağlar.
- **`@position-try` ve `position-try-fallbacks`**:
  - Taşma (overflow) durumlarında devreye giren deklaratif alternatif yerleşim stilleri:
    - `@position-try --visor-flip-left`: Sağ kenara çarpıldığında vizörü harfin soluna atar (`right: anchor(left)`).
    - `@position-try --visor-flip-top`: Sol ve sağ tıkandığında üst tarafa alır.
- **CSS Değişkenleri ile Dinamik Çapa Geçişi**:
  - `#masterVisor` öğesi `position-anchor: var(--active-anchor)` kuralı ile kontrol edilir; JavaScript yalnızca tek bir CSS değişkenini (`--active-anchor`) günceller, tüm yerleşim ve takip tarayıcı motoru tarafından yürütülür.

### Veri Akışı ve Yerleşim Şeması
```
[DOM: 10 Adet .glyph-anchor (H, E, L, L, O, W, O, R, L, D)]
                 │
                 ▼
       [anchor-name: --anchor-*]
                 │
  ┌──────────────┴──────────────┐
  ▼                             ▼
[Üst Rozetler (Top)]     [Alt Kapsüller (Bottom)]
(position-area: top)     (position-area: bottom)
  └──────────────┬──────────────┘
                 ▼
    [Dinamik Master Vizör (#masterVisor)]
    (position-anchor: var(--active-anchor))
                 │
                 ▼
  [@position-try: Taşmalarda Otomatik Flip]
                 │
                 ▼
[Tarayıcı C++ Yerleşim Motoru: 0 JS Koordinat Takibi]
```

## 3. 5 Boyutlu Tasarım Özeti

### 1. Görsel Hiyerarşi
- **Ana Odak**: Ekran merkezinde büyük, yüksek kontrastlı ve neon kenarlıklı 10 adet "HELLO WORLD" glif monoliti.
- **Hedef Katmanı**: Her harfin üstünde kuantum glif kodu (`GLYPH 0x48`), altında aviyonik frekans telemetrisi (`CH-1: 142.0 MHz`).
- **Gezici Vizör**: Aktif seçili harfin yanında süzülen, cam morfolojili (`backdrop-filter: blur(14px)`) ve camgöbeği lazer çerçeveli ana telemetri paneli.
- **Kontrol Paneli**: Sağ tarafta harf seçici ızgarası, kinetik dalga anahtarı ve viewport taşma/fallback kaydırıcıları.

### 2. Tipografi
- Ana Glifler: 54px `900` ağırlığında sans-serif sistem glifleri (`system-ui, -apple-system, sans-serif`).
- HUD Rozetleri ve Telemetri: `ui-monospace, Consolas, monospace` ile 10px - 11px teknik aviyonik font hiyerarşisi.

### 3. Renk Paleti
- **Arka Plan**: Koyu siber uzay siyahı (`#07090e`) ve 32px'lik teknik ızgara.
- **Camgöbeği (`#00f0ff`)**: Aktif harf, ana çapa vizörü ve üst telemetri rozetleri.
- **Zümrüt Yeşili (`#05ffa1`)**: Alt frekans kapsülleri ve durum göstergeleri.
- **Grafit Mavi (`#161e30`)**: İnaktif glif panelleri ve kontrol kartları.

### 4. Hareket ve Animasyon
- **Kinetik Dalga**: Glifler `glyphFloat` keyframe animasyonuyla 3.2 saniyelik periyotta yukarı-aşağı salınır; çapalanmış rozetler ve vizör tarayıcı yerel motoru tarafından piksel kayması olmadan harflerle birlikte akar.
- **Geçiş Efektleri**: Harf değiştiğinde vizörün pürüzsüzce yeni harfe doğru süzülmesi.

### 5. Etkileşim
- **Harf Tıklaması**: Ekranda herhangi bir harfe tıklandığında ana vizör o harfe kenetlenir.
- **Glif Seçici Panel**: Kontrol dokundaki 10 buton ile harfler doğrudan seçilebilir.
- **X/Y Kaydırma Sürgüleri**: Monolit kenarlara doğru kaydırılarak `@position-try` flip davranışı canlı olarak test edilebilir.

## 4. Doğrulama Kanıtları

### Otomasyon Testleri (`verify.sh`)
- `dependency-check.sh`: Sıfır harici ağ bağımlılığı, harici betik veya CDN yok. Tamamen saf W3C CSS Anchor Positioning kuralları.
- `browser-test.sh`:
  - `console.error()`: Sıfır hata.
  - DOM Görünürlüğü: `PASS` (`isDomVisible: true`).
  - Doğrulama Nesnesi: `window.__E041_VERIFIED`:
    - `anchorPositioningSupported: true`
    - `anchorFunctionSupported: true`
    - `positionTrySupported: true`
    - `targetGlyphCount: 10`
  - CSSOM İncelemesi: Geçerli CSSOM kuralları, sıfır geçersiz bildirim.
  - Test Sonucu: Tek satır `OK` (çıkış kodu 0).

### Çalışma Zamanı Metrikleri
- Çapalanmış Eleman Sayısı: 21 adet bağımsız DOM hedefi (10 üst rozet, 10 alt rozet, 1 master vizör).
- JavaScript Koordinat Yükü: 0 bayt (Tüm hesaplamalar tarayıcı yerleşim motorunda).
- Çapa Doğrulama Oranı: 10/10 glif eksiksiz bağımsız çapa adına sahip.

## 5. İnsan Doğrulaması Gereken Durumlar

1. **Kinetik Takip Doğruluğu**: "Kinetik Dalga" açıkken harfler yukarı aşağı dalgalanırken rozetlerin harflere yapışık kalması.
2. **Taşma Kaçınması (Fallback)**: "X Ekseni Kaydırma" sürgüsü sağa çekildiğinde vizörün ekran dışına taşmak yerine harfin sol tarafına atlaması (`--visor-flip-left`).
3. **Akıcı Geçiş**: Kontrol panelinden farklı harflere tıklandığında vizörün hedeflenen harfe kusursuzca kenetlenmesi.
