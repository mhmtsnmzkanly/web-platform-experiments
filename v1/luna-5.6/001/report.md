# Deney 001 — Yalın semantik Hello World

## Amaç

Hello World Lab için dış bağımlılığı olmayan, tarayıcının HTML5 belge işleme ve varsayılan render davranışını referans alan ilk deney oluşturmak.

## Teknolojik mekanizma

Belge, HTML5 doctype bildirimiyle parse edilir. `main` içindeki `h1` öğesi, ek CSS veya JavaScript olmadan tarayıcının varsayılan stil kurallarıyla görünür hale gelir. Bu deneyde API kombinasyonu yoktur; sonraki deneylerin teknolojik ve görsel karşılaştırma tabanıdır.

## Tasarım kararı

Yalın semantik HTML kullanıldı. Özel tipografi, renk, kompozisyon, malzeme veya hareket eklenmedi; amaç başlangıç davranışını süslemeden kaydetmektir.

## Test kanıtı

Kurulum altyapısı için `/tmp` altında pozitif ve negatif senaryolar çalıştırıldı:

```text
./validate.sh <geçerli HTML>                 PASS
./dependency-check.sh <geçerli HTML>        PASS
./validate.sh <geçersiz CSS HTML>           beklenen FAIL
./dependency-check.sh <harici link HTML>    beklenen FAIL
./web-server.sh && curl -fsS ...             PASS
./browser-test.sh http://localhost:7373/001.dev.html  PASS
```

Deney doğrulaması:

```text
./verify.sh src/001.dev.html reports/001
OK
```

## Durum

Otomatik doğrulama başarılıdır. `reports/001/screenshot.png` 1280x800 olarak üretildi ve doğrudan incelendi; beyaz zemin üzerinde okunaklı `Hello World` başlığı beklenen yalın referans görünümünü vermektedir. `src/001.dev.html`, `mv` ile `src/001.html` olarak mühürlenmiştir.
