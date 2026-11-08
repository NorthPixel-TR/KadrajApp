# Kadraj: yeni oturum için başlangıç notu (8 Kasım 2026, sürüm 7.0.18)

Bu notu yeni bir Claude oturumuna (Claude Code ya da sohbet) **ilk mesaj olarak** ver ve `kadraj-7.0.18-tam.zip` dosyasını ekle.

## Sahibi hakkında
- Kadraj'ı yapan bir öğrenci; yaklaşık 7 arkadaşı kullanıyor. Kısa, sade Türkçe yanıt ister, uzun açıklama sevmez.
- Kendisi kod yazmaz; adım adım, nereye basacağını tarif et. Ekran fotoğrafı gönderir.
- Gizli anahtarları sohbete yazdırma; Claude Code'da güvenli kutu (request_credential) kullan.

## Kadraj nedir, nerede çalışır
- Instagram benzeri Türkçe sosyal medya: Akış, Klaket (kısa video), hikâye, sohbet, Rota (yapay zekâ), satranç, Cephe oyunu, yönetici paneli.
- Kod: `index.html` (~3 KB) + `app.js` (~1,6 MB, bütün JS) + `app.css` + ayrı dosyalar (cephe.js, kurgu.js, oyunlar.js, satranc4.js, acil.js, sw.js). Kütüphane yok.
- **Ayrıntılı kod haritası ve bütün kurallar `CLAUDE.md` içinde. Önce onu oku.** En alttaki 7.0.x notları en güncel olanlar.
- Veriler: **Firebase** (proje `kadraj-6f1e0`; Firestore + Auth). Videolar: **Cloudinary** (`jw9koecu`, imzasız ön ayar `Kadraj`). Yedek: **Supabase** (`yedek/ayar.js`).
- Rota'nın yapay zekâ köprüsü: Cloudflare Worker `kadraj-ai` (kodu `ai-worker/`).

## 7 Kasım 2026: GitHub hesabı askıya alındı
- `kadrajsosyalmedya` GitHub hesabı askıya alındı (gerekçe: Hizmet Şartları). Eski adres `kadrajsosyalmedya.github.io/Kadraj` 404 veriyor; depoya erişilemiyor.
- Site artık **Cloudflare**'de: **https://kadraj-4cz.pages.dev/**
  - Cloudflare hesabı: `228b798766fc498febeebcec96411f62` (sahibin hesabı).
  - Dosyalar KV ad alanı `kadraj-site` (`160ef006a19a4a7ab675c80b0a2593e2`) içinde: anahtar = dosyanın yolu, metadata `ct` = içerik türü.
  - Cloudflare Pages projesi `kadraj`, gelişmiş kipte `cloudflare/_worker.js` ile bu dosyaları sunar.
  - Güncelleme yüklemek için: `python3 cloudflare/kvup.py <site klasörü> [dosyalar…]`.
    - Site klasörü: zip'in içeriği, `.github`, `android-app`, `ai-worker`, `arsiv` ve `CLAUDE.md` çıkarılmış hali.
    - Bir Cloudflare API token'ı gerekir. Sahibin token'ı 15 Kasım 2026'da bitiyor; yenisini oluştururken "Edit Cloudflare Workers" şablonunu ve "No expiration" seçeneğini kullan.
    - Claude Code ortamında `api.cloudflare.com` ağ gizlisi olarak eklenmeli.
- **Android uygulaması:** https://kadraj-4cz.pages.dev/kadraj.apk
  - Paket `io.github.kadrajsosyalmedya.kadrajapp`, imzası yeni (SHA-256 `0d2445c4…`).
  - İmza anahtarı sahipte: `kadraj-imza.keystore`, parola `kadraj-android`, alias `kadraj`. Sonraki APK'lar bununla imzalanmalı, yoksa telefona güncelleme olarak kurulamaz.
  - Derleme adımları `android-app/` klasöründe ve `.github/workflows/apk.yml` içinde (Android SDK 34, JDK 17, Capacitor 6).
- GitHub Actions işleri (APK derleme, Supabase uyandırma, köprünün otomatik kurulumu) çalışmıyor.

## Bilinen açık işler
- **Meme Klaketleri gelmiyor:** YouTube API anahtarı Google Cloud'da yalnızca github.io'ya izinli. Sahibi `https://kadraj-4cz.pages.dev/*` adresini anahtarın "Website restrictions" listesine eklemeli.
- **31 Mart 2027 Zirve günü kodda hazır** (bölge 70ZIRVE); kendiliğinden çalışır.
- **Her yıl güncellenecek tarihler:** dini bayramlar `GUN_DIN` (şu an yalnızca 2027 var), okul tarihleri `OKUL_*`, LGS tarihi.

## Sahibin kalıcı kuralları (kısa; tamamı CLAUDE.md'de)
- **Arayüz:**
  - Arayüz Türkçe, emoji yok, ikonlar SVG.
  - Alt menü her zaman altta, sırası: Akış, Keşfet, Sohbet, +, Klaket, Bildirim, Ben.
  - Klaket videosu kırpılmaz.
  - @bahsetme tema renginde, #etiket mavi.
  - `backdrop-filter` ve sonsuz animasyon yok.
- **Gizli tutulacaklar:**
  - 4 kişilik satranç gizli kalır, hiçbir yazıda anılmaz.
  - Yönetici giriş sözü hiçbir yere yazılmaz.
  - Gizli anahtarlar koda ya da depoya yazılmaz.
- **Bütçe ve hesaplar:**
  - Firebase ücretsiz planda; yeni canlı dinleyici, sık yoklama ve toplu okuma ekleme.
  - Android paket adı ve imza değiştirilmez.
  - Spotify önerme; memelerin kaynağını (YouTube) Kadraj yazılarında anma.
- **Sürüm:** her değişiklikte `APP_V`/`APP_VER` (app.js) ve index.html'deki üç yer birlikte artar. Küçük değişiklik yamayı, büyük güncelleme ara sürümü artırır.
