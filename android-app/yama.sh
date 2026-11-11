#!/usr/bin/env bash
# npx cap add android'den sonra çalışır: eklenti, izinler, simge, sürüm numarası.
set -euo pipefail
P=android/app/src/main/java/io/github/kadrajsosyalmedya/kadraj
mkdir -p "$P"
cp native/KadrajGaleri.java native/MainActivity.java native/KadrajYanit.java "$P/"
M=android/app/src/main/AndroidManifest.xml
perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />\n    <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />\n    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />\n    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n</manifest>#' "$M"
# 6.8.20 bildirimler: POST_NOTIFICATIONS izni, beyaz K bildirim simgesi, renk ve varsayılan kanal (FCM). google-services.json yoksa bildirim yok, derleme yine olur.
perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n</manifest>#' "$M"
# 7.1.9: Android 11+ telefonun metin okuma (TTS) servisini görebilsin diye (İstiklal Marşı sesli okuma).
perl -0pi -e 's#</manifest>#    <queries><intent><action android:name="android.intent.action.TTS_SERVICE" /></intent></queries>\n</manifest>#' "$M"
# 6.8.26 uygulama içinden güncelleme: APK kurma penceresini açma izni ve indirilen dosya için FileProvider'da cache-path.
perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n</manifest>#' "$M"
perl -0pi -e 's#(<application[^>]*>)#$1\n        <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="\@drawable/ic_stat_kadraj" />\n        <meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="\@color/kadraj_bildirim" />\n        <meta-data android:name="com.google.firebase.messaging.default_notification_channel_id" android:value="kadraj" />\n        <receiver android:name=".KadrajYanit" android:exported="false" />#' "$M"
R=android/app/src/main/res
mkdir -p "$R/drawable" "$R/values"
# 6.9.0: bildirim simgesi Kadraj logosu (vizör köşeleri + K + nokta), Android bunu beyaz gösterir; büyük simge renkli logo (KadrajGaleri.goster).
cat > "$R/drawable/ic_stat_kadraj.xml" <<'XML'
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:strokeColor="#FFFFFFFF" android:strokeWidth="2.8" android:strokeLineCap="round" android:strokeLineJoin="round" android:fillColor="#00000000" android:pathData="M8,5.2v13.6M8,14.6L16,8M11.3,11.9L16.8,18.8" />
    <path android:fillColor="#FFFFFFFF" android:pathData="M16,5.75a2.25,2.25 0 1,1 0,4.5a2.25,2.25 0 1,1 0,-4.5z" />
</vector>
XML
cat > "$R/values/kadraj_bildirim.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="kadraj_bildirim">#0C7A63</color>
</resources>
XML
if [ -f google-services.json ]; then cp google-services.json android/app/google-services.json; echo "google-services.json eklendi (bildirimler açık)"; else echo "UYARI: google-services.json yok, bildirimler kapalı derlenir"; fi
FP="$R/xml/file_paths.xml"
if [ -f "$FP" ]; then grep -q "cache-path" "$FP" || perl -0pi -e 's#</paths>#    <cache-path name="kadraj_cache" path="." />\n</paths>#' "$FP"; else mkdir -p "$R/xml"; printf '<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android">\n    <external-path name="my_images" path="." />\n    <cache-path name="kadraj_cache" path="." />\n</paths>\n' > "$FP"; fi
cat "$FP"; grep -n "fileprovider\|REQUEST_INSTALL" "$M"
rm -rf "$R"/mipmap-anydpi-v26
for d in "$R"/mipmap-*; do
  cp ../icon-192.png "$d/ic_launcher.png"; cp ../icon-192.png "$d/ic_launcher_round.png"
  [ -f "$d/ic_launcher_foreground.png" ] && cp ../icon-192.png "$d/ic_launcher_foreground.png" || true
done
VER=$(grep -o 'APP_VER_RAW="[0-9.]*"' ../app.js | head -1 | cut -d'"' -f2 | awk -F. '{printf "%d.%s.%s", ($1>3?$1-3:0), $2, $3}')
G=android/app/build.gradle
# 6.8.25: paket adı io.github.kadrajsosyalmedya.kadrajapp. Eski paket (…kadraj) farklı imzayla kurulmuş telefonlarda kaldırınca bile
# "paket çakışıyor" hatası veriyordu (veri saklanarak kaldırma, ikinci alan vb.); yeni ad eskisinin yanına sorunsuz kurulur.
# Java paketi (namespace) aynı kalır, yalnızca applicationId değişir. FCM'de (google-services.json) bu ad kullanılır.
sed -i 's/applicationId "io.github.kadrajsosyalmedya.kadraj"/applicationId "io.github.kadrajsosyalmedya.kadrajapp"/' "$G"
grep -q 'applicationId "io.github.kadrajsosyalmedya.kadrajapp"' "$G"
sed -i "s/versionCode 1$/versionCode ${GITHUB_RUN_NUMBER:-1}/; s/versionName \"1.0\"/versionName \"${VER:-1.0}\"/" "$G"
grep -n "applicationId\|versionCode\|versionName" "$G"
grep -c READ_MEDIA_IMAGES "$M"
grep -c "default_notification_icon\|POST_NOTIFICATIONS" "$M"
# Sabit imza: anahtar GitHub önbelleğinde (~/.android/kadraj.keystore), iş akışı yoksa oluşturur. Depoda anahtar yok.
cat >> "$G" <<'GR'

android {
    signingConfigs {
        kadraj {
            storeFile file(System.getenv("KADRAJ_KS") ?: (System.getProperty("user.home") + "/.android/kadraj.keystore"))
            storePassword "kadraj-android"
            keyAlias "kadraj"
            keyPassword "kadraj-android"
        }
    }
    buildTypes {
        debug { signingConfig signingConfigs.kadraj }
    }
}
GR
