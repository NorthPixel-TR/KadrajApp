#!/usr/bin/env bash
# Kadraj'ın ana testlerini tek komutla çalıştırır: bash testler/betikler/hepsi.sh [hizli]
# Betikleri /home/user/kadraj-test'e kopyalar (bazıları bu yolu bekler), sırayla çalıştırır,
# her birinin son satırını ve en sonda özet verir. Çıkış kodu: geçmeyen test sayısı.
set -u
SRC="$(cd "$(dirname "$0")" && pwd)"; T=/home/user/kadraj-test
mkdir -p "$T" /tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70CHAT
cp -r "$SRC"/. "$T"/; cd "$T"
L=(
 "hunt/crawl.js 390"
 "t69.js 390"
 "perf7/eq.js 390"
 "masa/t.js 390"
 "clawd/t.js 390"
 "marsi/t.js 390"
 "an711/t.js 390"
 # m702/intro.js sahte Firebase SDK ister (eski scratchpad/fbsdk/fake), konteyner sıfırlanınca yok
 "m702/wn.js"
 "np/np.js 390"
 "v714/t.js"
)
[ "${1:-}" = "hizli" ] || L+=("hunt/crawl.js 360 koyu klasik" "t69.js 800" "m70/70chat_t70.js 390" "m70/av704.js 390" "m70/fx703.js 390" "kn.js" "kln.js" "kln2.js" "rz.js" "gu.js" "pk.js")
bad=0; ok=0
for t in "${L[@]}"; do
 out=$(timeout 300 node $t 2>&1); rc=$?; last=$(echo "$out" | grep -v '^\s*$' | tail -1)
 frac=$(echo "$out" | grep -oE '^[0-9]+/[0-9]+$' | tail -1); fb=0; [ -n "$frac" ] && [ "${frac%/*}" != "${frac#*/}" ] && fb=1
 if [ $rc -ne 0 ] || [ $fb = 1 ] || echo "$out" | grep -qE '^(FAIL|HATA|X )|SORUN SAYISI [1-9]'; then bad=$((bad+1)); echo "GEÇMEDİ  $t  | $last"; echo "$out" | grep -E '^(FAIL|HATA|X )' | head -5
 else ok=$((ok+1)); echo "geçti    $t  | $last"; fi
done
echo "ÖZET: $ok geçti, $bad geçmedi"; exit $bad
