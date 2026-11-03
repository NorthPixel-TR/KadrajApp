package io.github.kadrajsosyalmedya.kadraj;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.JSObject;

/* 6.8.24: bildirimdeki Yanıtla / Kalp at / Görüldü düğmeleri. Yanıt bildirimin içinde yazılır (RemoteInput), uygulama açılmaz.
   Eylem sayfaya (KadrajGaleri "bildirimEylem") gider; sayfa mesajı gönderir ve sonucu sessiz bir bildirimle yazar.
   Bildirim hemen güncellenir ki Android'in "gönderiliyor" dönen simgesi takılı kalmasın. */
public class KadrajYanit extends BroadcastReceiver {
    static final String YAZI = "kadraj_yanit";

    @Override
    public void onReceive(Context c, Intent it) {
        try {
            String act = it.getStringExtra("act");
            if (act == null) return;
            JSObject d = new JSObject();
            d.put("action", act);
            for (String k : new String[] { "title", "body", "tag", "key", "kind", "mid", "cid", "from" }) d.put(k, it.getStringExtra(k) == null ? "" : it.getStringExtra(k));
            d.put("at", System.currentTimeMillis());
            String text = "";
            Bundle ri = androidx.core.app.RemoteInput.getResultsFromIntent(it);
            if (ri != null) { CharSequence cs = ri.getCharSequence(YAZI); if (cs != null) text = cs.toString().trim(); }
            d.put("text", text);
            if ("reply".equals(act) && text.isEmpty()) return;
            boolean canli = KadrajGaleri.ben != null;
            KadrajGaleri.eylem(c, d);
            String tag = d.getString("tag");
            if ("seen".equals(act)) { androidx.core.app.NotificationManagerCompat.from(c).cancel(tag, 1); return; }
            JSObject o = new JSObject();
            o.put("title", d.getString("title"));
            o.put("tag", tag);
            o.put("key", d.getString("key"));
            o.put("sessiz", true);
            String son = "reply".equals(act) ? "Sen: " + text : "Kalp attın";
            o.put("body", canli ? son : son + " (Kadraj açılınca gönderilecek)");
            KadrajGaleri.goster(c, o);
        } catch (Exception e) { }
    }
}
