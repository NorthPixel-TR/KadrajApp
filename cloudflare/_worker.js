/* Kadraj sitesi (Cloudflare Pages, gelişmiş kip): dosyalar KV'de (SITE, anahtar = göreli yol, metadata.ct = içerik türü).
   GitHub hesabı askıya alındığı için (7 Kasım 2026) site buradan sunulur. Video için Range (206) desteklenir. */
const NOCACHE = new Set(["index.html", "sw.js", "manifest.webmanifest", "testler/rapor.json", "kadraj.apk", "tanitim.html"]);
export default {
  async fetch(req, env) {
    if (req.method !== "GET" && req.method !== "HEAD") return new Response("", { status: 405 });
    const u = new URL(req.url);
    let p;
    try { p = decodeURIComponent(u.pathname); } catch { p = u.pathname; }
    p = p.replace(/^\/+/, "");
    if (p === "Kadraj" || p.startsWith("Kadraj/")) p = p.slice(6).replace(/^\/+/, ""); /* eski /Kadraj/ yolu */
    if (p === "" || p.endsWith("/")) p += "index.html";
    if (p.includes("..")) return new Response("", { status: 400 });
    const r = await env.SITE.getWithMetadata(p, { type: "arrayBuffer", cacheTtl: 300 });
    if (!r || !r.value) return new Response("Bulunamadı", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    const buf = r.value, len = buf.byteLength;
    const h = new Headers({ "content-type": (r.metadata && r.metadata.ct) || "application/octet-stream", "accept-ranges": "bytes", "x-content-type-options": "nosniff" });
    h.set("cache-control", NOCACHE.has(p) ? "no-cache" : (u.search ? "public, max-age=31536000, immutable" : "public, max-age=3600"));
    if (p === "kadraj.apk") h.set("content-disposition", 'attachment; filename="kadraj.apk"');
    const range = req.headers.get("range");
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m && (m[1] || m[2])) {
      let s, e;
      if (m[1] === "") { const n = Math.min(+m[2], len); s = len - n; e = len - 1; }
      else { s = +m[1]; e = m[2] === "" ? len - 1 : Math.min(+m[2], len - 1); }
      if (s >= len || s > e) return new Response("", { status: 416, headers: { "content-range": `bytes */${len}` } });
      h.set("content-range", `bytes ${s}-${e}/${len}`);
      h.set("content-length", String(e - s + 1));
      return new Response(req.method === "HEAD" ? null : buf.slice(s, e + 1), { status: 206, headers: h });
    }
    h.set("content-length", String(len));
    return new Response(req.method === "HEAD" ? null : buf, { status: 200, headers: h });
  }
};
