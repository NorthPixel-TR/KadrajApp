package io.github.kadrajsosyalmedya.kadraj;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageDecoder;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Size;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

/* Telefon galerisi (MediaStore). Sayfadan: Capacitor.Plugins.KadrajGaleri
   izin() → {ok, kismi}, albumler() → {items:[{name,count,thumb}]},
   liste({offset,limit,album,thumb}) → {items:[{id,at,album,thumb}], total}, al({id,max}) → {data:"data:image/jpeg;base64,…", w, h}.
   Küçük resimler base64 JPEG (varsayılan 240 px); al() en fazla max px (varsayılan 2048), yön (EXIF) ImageDecoder ile düzelir. */
@CapacitorPlugin(
    name = "KadrajGaleri",
    permissions = {
        @Permission(alias = "foto", strings = { Manifest.permission.READ_MEDIA_IMAGES }),
        @Permission(alias = "fotoEski", strings = { Manifest.permission.READ_EXTERNAL_STORAGE }),
        @Permission(alias = "bildirim", strings = { "android.permission.POST_NOTIFICATIONS" })
    }
)
public class KadrajGaleri extends Plugin {

    private String alias() {
        return Build.VERSION.SDK_INT >= 33 ? "foto" : "fotoEski";
    }

    /* Android 14: kişi "Bazı fotoğrafları seç" derse yalnızca seçtikleri görünür (kısmi izin). */
    private boolean kismi() {
        return Build.VERSION.SDK_INT >= 34
            && ContextCompat.checkSelfPermission(getContext(), "android.permission.READ_MEDIA_VISUAL_USER_SELECTED") == PackageManager.PERMISSION_GRANTED;
    }

    private JSObject izinDurumu() {
        JSObject r = new JSObject();
        boolean tam = getPermissionState(alias()) == PermissionState.GRANTED;
        boolean k = !tam && kismi();
        r.put("ok", tam || k);
        r.put("kismi", k);
        return r;
    }

    @PluginMethod
    public void izin(PluginCall call) {
        JSObject r = izinDurumu();
        if (r.getBool("ok")) {
            call.resolve(r);
            return;
        }
        requestPermissionForAlias(alias(), call, "izinSonuc");
    }

    @PermissionCallback
    private void izinSonuc(PluginCall call) {
        call.resolve(izinDurumu());
    }

    private static final Uri BASE = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

    private String jpeg(Bitmap b, int q) {
        ByteArrayOutputStream o = new ByteArrayOutputStream();
        b.compress(Bitmap.CompressFormat.JPEG, q, o);
        return "data:image/jpeg;base64," + Base64.encodeToString(o.toByteArray(), Base64.NO_WRAP);
    }

    private String kucuk(long id, int ts) {
        try {
            ContentResolver cr = getContext().getContentResolver();
            Bitmap b;
            if (Build.VERSION.SDK_INT >= 29) {
                b = cr.loadThumbnail(ContentUris.withAppendedId(BASE, id), new Size(ts, ts), null);
            } else {
                b = MediaStore.Images.Thumbnails.getThumbnail(cr, id, MediaStore.Images.Thumbnails.MINI_KIND, null);
            }
            return b == null ? null : jpeg(b, 72);
        } catch (Exception e) {
            return null;
        }
    }

    @PluginMethod
    public void albumler(PluginCall call) {
        if (!izinDurumu().getBool("ok")) {
            call.reject("izin yok", "IZIN");
            return;
        }
        String[] proj = { MediaStore.Images.Media._ID, MediaStore.Images.Media.BUCKET_DISPLAY_NAME };
        Map<String, long[]> m = new LinkedHashMap<>();
        try (Cursor c = getContext().getContentResolver().query(BASE, proj, null, null, MediaStore.Images.Media.DATE_ADDED + " DESC")) {
            if (c != null) {
                while (c.moveToNext()) {
                    String n = c.getString(1);
                    if (n == null) n = "Diğer";
                    long[] v = m.get(n);
                    if (v == null) m.put(n, new long[] { c.getLong(0), 1 });
                    else v[1]++;
                }
            }
        } catch (Exception e) {
            call.reject("Albümler okunamadı");
            return;
        }
        JSArray a = new JSArray();
        for (Map.Entry<String, long[]> e : m.entrySet()) {
            JSObject o = new JSObject();
            o.put("name", e.getKey());
            o.put("count", e.getValue()[1]);
            o.put("thumb", kucuk(e.getValue()[0], 160));
            a.put(o);
        }
        JSObject r = new JSObject();
        r.put("items", a);
        call.resolve(r);
    }

    @PluginMethod
    public void liste(PluginCall call) {
        if (!izinDurumu().getBool("ok")) {
            call.reject("izin yok", "IZIN");
            return;
        }
        final int off = Math.max(0, call.getInt("offset", 0));
        final int lim = Math.max(1, Math.min(200, call.getInt("limit", 60)));
        final int ts = Math.max(96, Math.min(512, call.getInt("thumb", 240)));
        String album = call.getString("album", null);
        String[] proj = {
            MediaStore.Images.Media._ID, MediaStore.Images.Media.DATE_TAKEN, MediaStore.Images.Media.DATE_ADDED, MediaStore.Images.Media.BUCKET_DISPLAY_NAME
        };
        String sel = album != null ? MediaStore.Images.Media.BUCKET_DISPLAY_NAME + "=?" : null;
        String[] args = album != null ? new String[] { album } : null;
        JSArray arr = new JSArray();
        int total = 0;
        try (Cursor c = getContext().getContentResolver().query(BASE, proj, sel, args, MediaStore.Images.Media.DATE_ADDED + " DESC")) {
            if (c != null) {
                total = c.getCount();
                if (c.moveToPosition(off)) {
                    int n = 0;
                    do {
                        long id = c.getLong(0);
                        long at = c.getLong(1);
                        if (at == 0) at = c.getLong(2) * 1000L;
                        JSObject o = new JSObject();
                        o.put("id", String.valueOf(id));
                        o.put("at", at);
                        o.put("album", c.getString(3));
                        o.put("thumb", kucuk(id, ts));
                        arr.put(o);
                        n++;
                    } while (n < lim && c.moveToNext());
                }
            }
        } catch (Exception e) {
            call.reject("Galeri okunamadı: " + e.getMessage());
            return;
        }
        JSObject r = new JSObject();
        r.put("items", arr);
        r.put("total", total);
        call.resolve(r);
    }

    @PluginMethod
    public void al(PluginCall call) {
        String sid = call.getString("id");
        final int max = Math.max(256, Math.min(4096, call.getInt("max", 2048)));
        if (sid == null) {
            call.reject("id yok");
            return;
        }
        try {
            Uri u = ContentUris.withAppendedId(BASE, Long.parseLong(sid));
            ContentResolver cr = getContext().getContentResolver();
            Bitmap b;
            if (Build.VERSION.SDK_INT >= 28) {
                ImageDecoder.Source s = ImageDecoder.createSource(cr, u);
                b = ImageDecoder.decodeBitmap(s, (dec, info, src) -> {
                    int w = info.getSize().getWidth(), h = info.getSize().getHeight();
                    float k = Math.min(1f, (float) max / Math.max(w, h));
                    if (k < 1f) dec.setTargetSize(Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
                    dec.setAllocator(ImageDecoder.ALLOCATOR_SOFTWARE);
                });
            } else {
                BitmapFactory.Options o = new BitmapFactory.Options();
                o.inJustDecodeBounds = true;
                try (InputStream is = cr.openInputStream(u)) {
                    BitmapFactory.decodeStream(is, null, o);
                }
                int smp = 1;
                while (Math.max(o.outWidth, o.outHeight) / (smp * 2) >= max) smp *= 2;
                BitmapFactory.Options o2 = new BitmapFactory.Options();
                o2.inSampleSize = smp;
                try (InputStream is = cr.openInputStream(u)) {
                    b = BitmapFactory.decodeStream(is, null, o2);
                }
                if (b != null && Math.max(b.getWidth(), b.getHeight()) > max) {
                    float k = (float) max / Math.max(b.getWidth(), b.getHeight());
                    b = Bitmap.createScaledBitmap(b, Math.round(b.getWidth() * k), Math.round(b.getHeight() * k), true);
                }
            }
            if (b == null) {
                call.reject("Fotoğraf açılamadı");
                return;
            }
            JSObject r = new JSObject();
            r.put("data", jpeg(b, 88));
            r.put("w", b.getWidth());
            r.put("h", b.getHeight());
            call.resolve(r);
        } catch (Exception e) {
            call.reject("Fotoğraf açılamadı: " + e.getMessage());
        }
    }

    /* Durum ve gezinme çubuğu rengi sayfanın theme-color'ına uyar: renk({c:"#0A110F"}). Açık renkte simgeler koyu olur. */
    @PluginMethod
    public void renk(PluginCall call) {
        int col;
        try { col = android.graphics.Color.parseColor(call.getString("c", "#0A110F").trim()); } catch (Exception e) { call.reject("renk"); return; }
        final int fc = col | 0xFF000000;
        getActivity().runOnUiThread(() -> MainActivity.boya(getActivity(), fc));
        call.resolve();
    }

    /* Uygulamanın yerel sürümü: Java tarafı değişince SURUM'u artır, index.html'deki APK_NATIVE da aynı sayı olsun.
       Sayfa küçükse "Güncelleme var" penceresi çıkar. */
    static final int SURUM = 9;

    @PluginMethod
    public void surum(PluginCall call) {
        JSObject r = new JSObject();
        r.put("surum", SURUM);
        r.put("fcm", fcmVar());
        r.put("yerel", true);
        r.put("eylem", true);
        r.put("paket", getContext().getPackageName());
        r.put("guncelle", true);
        try { r.put("ad", getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0).versionName); } catch (Exception e) { r.put("ad", ""); }
        call.resolve(r);
    }

    /* 6.8.20 bildirimler: google-services.json ile derlendiyse (Firebase Cloud Messaging kullanılabilir) true. Yoksa sayfa bildirim kaydı denemez. */
    private boolean fcmVar() {
        try { return getContext().getResources().getIdentifier("google_app_id", "string", getContext().getPackageName()) != 0; } catch (Exception e) { return false; }
    }

    /* Bildirime dokunarak açılınca gidilecek yer (FCM data "key", ör. u:<uid>, g:<grup>, post:<id>). MainActivity yazar, sayfa bir kez okur. */
    static volatile String bekleyen = null;
    static volatile long bekleyenAt = 0;

    @PluginMethod
    public void acilis(PluginCall call) {
        JSObject r = new JSObject();
        String k = bekleyen;
        if (k != null && System.currentTimeMillis() - bekleyenAt < 10 * 60 * 1000) r.put("key", k);
        bekleyen = null;
        call.resolve(r);
    }

    /* 6.8.22 yerel bildirim: uygulama açıkken ya da arka plandayken sayfa telefon bildirimi gösterir (FCM olmadan da).
       bildirimIzin() → {ok}, bildirim({title, body, tag, key}), bildirimSil({tag}). Dokununca MainActivity "key" ile ilgili yere gider. */
    private boolean bildirimAcik() {
        boolean izin = Build.VERSION.SDK_INT < 33 || getPermissionState("bildirim") == PermissionState.GRANTED;
        return izin && androidx.core.app.NotificationManagerCompat.from(getContext()).areNotificationsEnabled();
    }

    @PluginMethod
    public void bildirimIzin(PluginCall call) {
        if (Build.VERSION.SDK_INT < 33 || getPermissionState("bildirim") == PermissionState.GRANTED) {
            JSObject r = new JSObject();
            r.put("ok", bildirimAcik());
            call.resolve(r);
            return;
        }
        if (call.getBoolean("sor", true)) requestPermissionForAlias("bildirim", call, "bildirimSonuc");
        else { JSObject r = new JSObject(); r.put("ok", false); call.resolve(r); }
    }

    @PermissionCallback
    private void bildirimSonuc(PluginCall call) {
        JSObject r = new JSObject();
        r.put("ok", bildirimAcik());
        call.resolve(r);
    }

    static void kanal(android.content.Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        android.app.NotificationManager nm = (android.app.NotificationManager) c.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel("kadraj") != null) return;
        android.app.NotificationChannel ch = new android.app.NotificationChannel("kadraj", "Kadraj", android.app.NotificationManager.IMPORTANCE_HIGH);
        ch.setDescription("Mesajlar, beğeniler, yorumlar ve takipler");
        ch.enableVibration(true);
        nm.createNotificationChannel(ch);
    }

    @PluginMethod
    public void bildirim(PluginCall call) {
        try {
            if (!bildirimAcik()) { call.reject("izin"); return; }
            JSObject o = new JSObject();
            for (String k : new String[] { "title", "body", "tag", "key", "kind", "mid", "cid", "from" }) o.put(k, call.getString(k, ""));
            o.put("sessiz", call.getBoolean("sessiz", false));
            goster(getContext(), o);
            call.resolve();
        } catch (SecurityException e) {
            call.reject("izin");
        } catch (Exception e) {
            call.reject("bildirim: " + e.getMessage());
        }
    }

    /* 6.8.24: bildirimi çizer. Mesaj bildiriminde (kind=msg) Yanıtla (bildirimden yazılır), Kalp at ve Görüldü düğmeleri;
       düğmeler KadrajYanit'e gider, o da sayfaya "bildirimEylem" olayı yollar. sessiz: ses/titreşim yok, düğme yok (sonuç bildirimi). */
    static void goster(android.content.Context c, JSObject o) {
        kanal(c);
        String tag = o.optString("tag", "kadraj"); if (tag.isEmpty()) tag = "kadraj";
        String key = o.optString("key", "");
        String title = o.optString("title", "Kadraj"); if (title.isEmpty()) title = "Kadraj";
        String body = o.optString("body", "");
        boolean sessiz = o.optBoolean("sessiz", false);
        android.content.Intent it = new android.content.Intent(c, MainActivity.class);
        it.addFlags(android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP | android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if (!key.isEmpty()) it.putExtra("key", key);
        android.app.PendingIntent pi = android.app.PendingIntent.getActivity(c, tag.hashCode(), it,
            android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
        int ic = c.getResources().getIdentifier("ic_stat_kadraj", "drawable", c.getPackageName());
        if (ic == 0) ic = c.getApplicationInfo().icon;
        androidx.core.app.NotificationCompat.Builder b = new androidx.core.app.NotificationCompat.Builder(c, "kadraj")
            .setSmallIcon(ic)
            .setColor(0xFF0C7A63)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new androidx.core.app.NotificationCompat.BigTextStyle().bigText(body))
            .setCategory(androidx.core.app.NotificationCompat.CATEGORY_MESSAGE)
            .setAutoCancel(true)
            .setContentIntent(pi);
        try {
            int li = c.getResources().getIdentifier("ic_launcher", "mipmap", c.getPackageName());
            android.graphics.Bitmap bm = li != 0 ? BitmapFactory.decodeResource(c.getResources(), li) : null;
            if (bm != null) b.setLargeIcon(bm);
        } catch (Exception e) { }
        if (sessiz) b.setOnlyAlertOnce(true).setSilent(true).setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW);
        else b.setPriority(androidx.core.app.NotificationCompat.PRIORITY_HIGH).setDefaults(androidx.core.app.NotificationCompat.DEFAULT_ALL);
        if (!sessiz && "msg".equals(o.optString("kind", "")) && (key.startsWith("u:") || key.startsWith("g:") || key.equals("meydan"))) {
            androidx.core.app.RemoteInput ri = new androidx.core.app.RemoteInput.Builder(KadrajYanit.YAZI).setLabel("Yanıt yaz").build();
            b.addAction(new androidx.core.app.NotificationCompat.Action.Builder(0, "Yanıtla", eylemPi(c, o, "reply", true)).addRemoteInput(ri).setAllowGeneratedReplies(false).build());
            b.addAction(new androidx.core.app.NotificationCompat.Action.Builder(0, "Kalp at", eylemPi(c, o, "heart", false)).build());
            b.addAction(new androidx.core.app.NotificationCompat.Action.Builder(0, "Görüldü", eylemPi(c, o, "seen", false)).build());
        }
        androidx.core.app.NotificationManagerCompat.from(c).notify(tag, 1, b.build());
    }

    private static android.app.PendingIntent eylemPi(android.content.Context c, JSObject o, String act, boolean yazi) {
        android.content.Intent it = new android.content.Intent(c, KadrajYanit.class);
        it.setAction(c.getPackageName() + ".EYLEM." + act);
        it.putExtra("act", act);
        for (String k : new String[] { "title", "body", "tag", "key", "kind", "mid", "cid", "from" }) it.putExtra(k, o.optString(k, ""));
        int fl = android.app.PendingIntent.FLAG_UPDATE_CURRENT | (yazi && Build.VERSION.SDK_INT >= 31 ? android.app.PendingIntent.FLAG_MUTABLE : android.app.PendingIntent.FLAG_IMMUTABLE);
        return android.app.PendingIntent.getBroadcast(c, (o.optString("tag", "") + act).hashCode(), it, fl);
    }

    /* Bildirim düğmesinden gelen eylemi sayfaya iletir; sayfa yoksa (uygulama kapalı) saklar, açılınca gönderilir. */
    static volatile KadrajGaleri ben = null;

    static void eylem(android.content.Context c, JSObject d) {
        KadrajGaleri g = ben;
        if (g != null && g.getBridge() != null) { g.notifyListeners("bildirimEylem", d, true); return; }
        try {
            android.content.SharedPreferences sp = c.getSharedPreferences("kadraj", 0);
            org.json.JSONArray a = new org.json.JSONArray(sp.getString("eylem", "[]"));
            a.put(d);
            sp.edit().putString("eylem", a.toString()).apply();
        } catch (Exception e) { }
    }

    @Override
    public void load() {
        ben = this;
        try {
            android.content.SharedPreferences sp = getContext().getSharedPreferences("kadraj", 0);
            org.json.JSONArray a = new org.json.JSONArray(sp.getString("eylem", "[]"));
            sp.edit().remove("eylem").apply();
            for (int i = 0; i < a.length(); i++) notifyListeners("bildirimEylem", JSObject.fromJSONObject(a.getJSONObject(i)), true);
        } catch (Exception e) { }
    }

    /* Telefonun bu uygulamaya ait bildirim ayarlarını açar (izin kalıcı reddedildiyse). */
    @PluginMethod
    public void bildirimAyar(PluginCall call) {
        try {
            android.content.Intent it = new android.content.Intent(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            it.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
            it.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(it);
            call.resolve();
        } catch (Exception e) { call.reject("ayar"); }
    }

    @PluginMethod
    public void bildirimSil(PluginCall call) {
        try { androidx.core.app.NotificationManagerCompat.from(getContext()).cancel(call.getString("tag", "kadraj"), 1); } catch (Exception e) { }
        call.resolve();
    }

    /* Bağlantıyı telefonun tarayıcısında açar (yeni APK'yı indirmek için). */
    @PluginMethod
    public void ac(PluginCall call) {
        String u = call.getString("url", "");
        if (!u.startsWith("https://")) { call.reject("adres"); return; }
        try {
            android.content.Intent it = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(u));
            it.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(it);
            call.resolve();
        } catch (Exception e) { call.reject("acilamadi"); }
    }

    /* 6.8.26 uygulama içinden güncelleme: yeni APK'yı uygulamanın kendisi indirir ve Android'in "Güncelle" penceresini açar
       (tarayıcıya, Dosyalar'a gitmek yok). Aynı paket ve aynı imza olduğu için eskisinin üstüne kurulur, veriler kalır.
       İlk seferde Android "bu kaynaktan uygulama yükleme" iznini ister: izin yoksa o ayar açılır, {izin:false} döner.
       İlerleme "guncelle" olayıyla ({p: 0-100}). Yalnızca GitHub'daki Kadraj sürümünden indirir. */
    private static volatile boolean gIniyor = false;

    @PluginMethod
    public void guncelle(PluginCall call) {
        final String u0 = call.getString("url", "");
        if (!u0.startsWith("https://github.com/kadrajsosyalmedya/") && !u0.startsWith("https://kadraj-4cz.pages.dev/") && !u0.startsWith("https://northpixel-tr.github.io/")) { call.reject("adres"); return; }
        final android.content.Context c = getContext();
        if (Build.VERSION.SDK_INT >= 26 && !c.getPackageManager().canRequestPackageInstalls()) {
            try {
                android.content.Intent it = new android.content.Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + c.getPackageName()));
                it.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                c.startActivity(it);
            } catch (Exception e) { }
            JSObject r = new JSObject(); r.put("izin", false); call.resolve(r); return;
        }
        if (gIniyor) { call.reject("suruyor"); return; }
        gIniyor = true;
        new Thread(() -> {
            java.io.File dir = new java.io.File(c.getCacheDir(), "guncelle");
            java.io.File f = new java.io.File(dir, "kadraj.apk");
            try {
                dir.mkdirs();
                java.net.HttpURLConnection h = null; String u = u0;
                for (int i = 0; i < 6; i++) {
                    java.net.URL url = new java.net.URL(u);
                    String host = url.getHost();
                    if (!"https".equals(url.getProtocol()) || !(host.equals("github.com") || host.endsWith(".githubusercontent.com") || host.equals("kadraj-4cz.pages.dev") || host.equals("northpixel-tr.github.io"))) throw new Exception("adres");
                    h = (java.net.HttpURLConnection) url.openConnection();
                    h.setInstanceFollowRedirects(false); h.setConnectTimeout(20000); h.setReadTimeout(30000);
                    int code = h.getResponseCode();
                    if (code >= 300 && code < 400) { u = new java.net.URL(url, h.getHeaderField("Location")).toString(); h.disconnect(); h = null; continue; }
                    if (code != 200) throw new Exception("http " + code);
                    break;
                }
                if (h == null) throw new Exception("yonlendirme");
                long top = h.getContentLengthLong(), al = 0; int son = -1;
                try (InputStream in = h.getInputStream(); java.io.FileOutputStream out = new java.io.FileOutputStream(f)) {
                    byte[] b = new byte[65536]; int n;
                    while ((n = in.read(b)) > 0) {
                        out.write(b, 0, n); al += n;
                        int p = top > 0 ? (int) (al * 100 / top) : -1;
                        if (p != son && (p % 5 == 0)) { son = p; JSObject e = new JSObject(); e.put("p", p); notifyListeners("guncelle", e); }
                    }
                }
                h.disconnect();
                if (al < 100000) throw new Exception("kucuk");
                Uri fu = androidx.core.content.FileProvider.getUriForFile(c, c.getPackageName() + ".fileprovider", f);
                android.content.Intent it = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                it.setDataAndType(fu, "application/vnd.android.package-archive");
                it.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION | android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                c.startActivity(it);
                JSObject r = new JSObject(); r.put("ok", true); call.resolve(r);
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()));
            } finally { gIniyor = false; }
        }).start();
    }
}
