#!/usr/bin/env python3
"""cfsite klasöründeki bütün dosyaları Cloudflare KV'ye (kadraj-site) toplu yazar. Anahtar = göreli yol, metadata.ct = içerik türü."""
import os, sys, json, base64, mimetypes, subprocess
A = "228b798766fc498febeebcec96411f62"
NS = "160ef006a19a4a7ab675c80b0a2593e2"
root = sys.argv[1]
only = set(sys.argv[2:])  # verilirse yalnızca bu yollar
CT = {".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8",
      ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8",
      ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4": "video/mp4", ".svg": "image/svg+xml",
      ".md": "text/plain; charset=utf-8", ".sql": "text/plain; charset=utf-8", ".txt": "text/plain; charset=utf-8",
      ".apk": "application/vnd.android.package-archive", ".webp": "image/webp", ".gif": "image/gif"}
items = []
for d, _, fs in os.walk(root):
    for f in fs:
        p = os.path.join(d, f)
        k = os.path.relpath(p, root).replace(os.sep, "/")
        if only and k not in only:
            continue
        ext = os.path.splitext(f)[1].lower()
        ct = CT.get(ext) or mimetypes.guess_type(f)[0] or "application/octet-stream"
        items.append({"key": k, "value": base64.b64encode(open(p, "rb").read()).decode(), "base64": True, "metadata": {"ct": ct}})
batch, size, n = [], 0, 0
def send(b):
    body = json.dumps(b).encode()
    r = subprocess.run(["curl", "-s", "--max-time", "300", "-X", "PUT",
                        f"https://api.cloudflare.com/client/v4/accounts/{A}/storage/kv/namespaces/{NS}/bulk",
                        "-H", "Content-Type: application/json", "--data-binary", "@-"], input=body, capture_output=True)
    out = r.stdout.decode()[:300]
    ok = '"success":true' in out
    print(("OK " if ok else "HATA ") + str(len(b)) + " dosya " + ("" if ok else out))
    return ok
allok = True
for it in items:
    s = len(it["value"])
    if batch and size + s > 20_000_000:
        allok &= send(batch); batch, size = [], 0
    batch.append(it); size += s; n += 1
if batch:
    allok &= send(batch)
print("toplam", n, "dosya", "tamam" if allok else "HATALI")
