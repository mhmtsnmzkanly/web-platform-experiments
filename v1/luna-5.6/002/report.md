# Deney 002 — Ölçülen ışık alanında Hello World

## Amaç

`Hello World` ifadesini HTML metni olarak yerleştirmek yerine Canvas 2D yüzeyinde üretmek ve yüzeyin gerçek boyutunu `ResizeObserver` ile çizim mekanizmasına aktarmak.

## Üç aday fikir ve seçim

1. **Ölçülen ışık alanı — Canvas 2D + ResizeObserver:** Gözlemcinin bildirdiği CSS boyutu Canvas backing store çözünürlüğünü ve yazı kompozisyonunu yeniden hesaplar. Hello World, çok renkli ışık halesi ve yörünge çizgileriyle doğrudan canvas üzerine çizilir; koyu, teknik bir sahne oluşturur.
2. **Kırılan başlık — SVG filtreleri + Pointer Events:** İşaretçi konumu bir SVG displacement filtresine bağlanır; Hello World harfleri kullanıcının imlecinden uzaklaşan bir cam yüzeyi gibi deforme olur. Etkileşimli ve reaktif olurdu, ancak otomatik doğrulamada anlamlı etkileşim kanıtı üretmek daha zordur.
3. **Ritimli kelime — Web Animations API + CSS custom properties:** Animasyon zaman çizelgesi CSS değişkenlerini günceller; her kelime parçası farklı gecikmeyle yükselip alçalır. Canvas gerektirmeyen, tipografik ve açık renkli bir editoryal görünüm üretirdi.

**Seçim:** Birinci fikir seçildi. 001'in statik varsayılan HTML görünümünden teknik olarak en belirgin ayrımı sağlar; `ResizeObserver` çıktısı yalnızca dekoratif değil, Canvas çözünürlüğünü ve Hello World'ün ölçüsünü doğrudan belirler. Ayrıca Canvas 2D render kanıtı mevcut doğrulama motoruyla ölçülebilir.

## Teknolojik mekanizma

`ResizeObserver` canvas kapsayıcısının `contentRect` boyutunu ve `devicePixelRatio` değerini alır. Bu veriler canvas'ın piksel backing store'unu günceller, ardından her animasyon karesinde gradyan, yörünge çizgileri ve `Hello World` metni yeni ölçülere göre yeniden çizilir. Böylece API çıktısı → çizim yüzeyi → metin görünümü akışı oluşur.

## Tasarım kararı

Koyu gece laciverti zemin, amber-mavi ışık geçişleri ve geniş geometrik yazı karakteri kullanıldı. Canvas sahnesi geniş negatif alanla çevrildi; hareketli yörüngeler ifadeyi çevreler fakat okunaklı metni ikinci plana atmaz.

## Test kanıtı

Beklenen doğrulama:

```text
./verify.sh src/002.dev.html reports/002
```

Doğrulama ve ekran görüntüsü üretimi tamamlandıktan sonra bu dosya `src/002.html` olarak mühürlenecektir.

Gerçek sonuç:

```text
[DOM_VISIBILITY]        PASS
[GRAPHICS_RENDER]       PASS
[TEST_INFRASTRUCTURE]   PASS
[NEW_TECHNOLOGY_ACTIVE] REVIEW_REQUIRED
./verify.sh src/002.dev.html reports/002
OK
```

## Ekran görüntüsü incelemesi

`reports/002/screenshot.png` 1280x800 olarak doğrudan incelendi. `Hello World` merkezde yüksek kontrastla okunuyor; amber-mavi parçacıklar ve elips yörüngeleri canvas'ın boş veya tek renk olmadığını gösteriyor. Yörünge çizgileri ifadeyi örtmüyor.

## İNSAN DOĞRULAMASI GEREKLİ

- **Somut özellik:** `ResizeObserver` ölçümünün canvas backing store boyutunu ve Hello World kompozisyonunu gerçekten yeniden hesaplaması.
- **Neden otomatik olarak doğrulanamadı:** Mevcut tarayıcı testinin Canvas grafik kontrolü `PASS` verdi, ancak `[NEW_TECHNOLOGY_ACTIVE]` kanıtı Canvas için `REVIEW_REQUIRED` döndürdü; observer olayının yeniden boyutlandırma sonrası veri akışını tek oturumda raporlamıyor.
- **Mevcut teknik kanıt:** `GRAPHICS_RENDER PASS`, animasyonlu Canvas yüzeyi, footer'daki canlı piksel ölçüsü ve `stage.dataset.renderSize` güncellemesi; görsel incelemede çok renkli render doğrulandı.
- **İnsan kontrolü:** `http://localhost:7373/002.html` adresini açın, pencereyi daraltıp genişletin; footer piksel ölçüsünün değiştiğini ve `Hello World` yazısının orantılı, kesilmeden yeniden çizildiğini gözlemleyin.

`src/002.dev.html`, doğrulama ve görsel inceleme sonrasında `mv` ile `src/002.html` olarak mühürlendi; yetim `.dev.html` dosyası bırakılmadı.
