/* Kadraj 7.2.2 Çiz Bil: biri çizer, diğerleri tahmin eder (arkadaşlarla canlı, 2-6 kişi). app.js bölge 7122 ilk kullanımda yükler (czLoad/czGo).
   Kadraj'ın genel adlarını kullanır: S, DB, LS, I, esc, toast, openLayer, closeLayer, dialog, sheet, write, guard, sendMessage, copyText, vib, cleanText, kbReduce.
   Oda games/cz-<KOD> (games kuralı; kural değişikliği yok). Canlı dinleyici yalnızca odadayken (DB.watchDoc), çıkınca kapanır.
     {cz:1, host, seats:[uid] (≤6), names:{uid:ad}, st:"lobby"|"play"|"over", gone:{uid:1}, at,
      s: JSON metin, yalnızca kurucu yazar {g:oyun no, r:tur, n:tur sayısı, dr:çizen uid, ph:"ch"|"dr"|"rv"|"end", op:[şifreli 3 kelime], w:şifreli kelime, sc:{uid:puan}, last:{uid:kazanılan}},
      pk:{g,r,i} çizenin seçtiği kelime (kurucu görünce ph:"dr" yapar),
      sk:{g,r,d} çizim (yalnızca çizen yazar; en sık 0,9 sn'de bir ve çizgi bitince), d = çizgiler "|" ile: renk (0-9) + kalınlık (a-c) + noktalar (her koordinat 0-255, tek karakter 48+v),
      gu:{uid:{g,r,l:[son 3 yanlış tahmin]}}, ok:{uid:{g,r,ms}} bilenin kendi cihazında turun başından geçen süre}
   Puan: bilen 100 + hıza göre en çok 100; çizen her bilen için 60. Tur: herkes iki kez çizer, en çok 8 tur; çizim 75 sn, seçim 12 sn, sonuç 4,5 sn.
   Kelime cevabı belgede şifreli durur (oda kodu + tur ile XOR); tahmin cihazda karşılaştırılır (Türkçe harfler katlanır, boşluk önemsiz).
   Kurucu çıkarsa oda kapanır (st:"over", s:""); çizen çıkarsa tur hemen biter. Testler için window.CIZ._t (W, fold, near, enc, dec, set). */
(()=>{"use strict";
if(window.CIZ)return;
let TD=75000,TC=12000,TR=4500;const MAXP=6,MAXR=8,FL=900;
const WORDS="kardan adam,kar tanesi,kamp ateşi,futbol topu,oyuncak ayı,trafik lambası,posta kutusu,diş fırçası,deniz feneri,kum kalesi,güneş gözlüğü,kuyruklu yıldız,kedi,köpek,ev,güneş,ağaç,araba,balık,elma,muz,çiçek,bulut,yağmur,şemsiye,gözlük,saat,telefon,kitap,kalem,top,bisiklet,uçak,gemi,tren,roket,yıldız,ay,dağ,deniz,kale,köprü,pizza,dondurma,pasta,simit,çay,kahve,bardak,kaşık,çatal,makas,anahtar,kapı,pencere,sandalye,masa,yatak,lamba,televizyon,bilgisayar,kulaklık,gitar,davul,piyano,kalp,şapka,ayakkabı,çorap,tişört,eldiven,atkı,örümcek,kelebek,arı,karınca,yılan,kaplumbağa,tavşan,fil,zürafa,aslan,maymun,penguen,baykuş,ördek,tavuk,inek,at,deve,köpekbalığı,ahtapot,yengeç,dinozor,ejderha,robot,hayalet,uzaylı,korsan,kral,taç,kılıç,kalkan,ok,hazine,harita,pusula,çadır,gökkuşağı,şimşek,volkan,ada,palmiye,kaktüs,mantar,havuç,domates,karpuz,çilek,üzüm,armut,ananas,hamburger,sosis,yumurta,peynir,ekmek,balon,hediye,mum,fener,merdiven,çekiç,ampul,pil,mıknatıs,dürbün,kamera,mikrofon,zar,basketbol,kaykay,paten,salıncak,kaydırak,uçurtma,otobüs,taksi,ambulans,itfaiye,helikopter,denizaltı,zarf,saksı,kova,süpürge,ayna,tarak,kurbağa,yunus,balina,kuş,yuva,bayrak,okul,çanta,silgi,cetvel,tahta,yastık,battaniye,buzdolabı,fırın,tencere,çaydanlık,kupa,madalya,ödül,tekne,yelkenli,plaj,şato,gezegen,astronot,uydu,ayı,kirpi,sincap,tilki,kurt,geyik,papağan,flamingo".split(",");
const COL=["#111827","#FFFFFF","#E11D48","#F97316","#FACC15","#16A34A","#2563EB","#7C3AED","#92400E","#EC4899"],WID=[3,7,14];
const rnd=n=>Math.floor(Math.random()*n),shuf=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const rp=c=>"games/cz-"+c,me=()=>S.uid||"me",myNm=()=>{const p=(S.profiles||{})[S.uid]||{};return String(p.name||p.username||"Oyuncu").slice(0,20)};
const fold=s=>String(s||"").toLocaleLowerCase("tr").replace(/[çğıöşüâîû]/g,c=>({ç:"c",ğ:"g",ı:"i",ö:"o",ş:"s",ü:"u",â:"a",î:"i",û:"u"}[c])).replace(/[^a-z0-9]/g,"");
function lev(a,b){if(Math.abs(a.length-b.length)>1)return 9;const m=[];for(let i=0;i<=a.length;i++){m[i]=[i];for(let j=1;j<=b.length;j++)m[i][j]=i?Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1)):j}return m[a.length][b.length]}
const near=(g,w)=>{const a=fold(g),b=fold(w);return b.length>=4&&a!==b&&lev(a,b)===1};
const kk=(c,r)=>{let k=String(c||"solo")+":"+r;return i=>31+(k.charCodeAt(i%k.length)&63)};
const enc=(w,c,r)=>{const k=kk(c,r);return[...String(w)].map((ch,i)=>ch.codePointAt(0)^k(i)).join(".")};
const dec=(x,c,r)=>{if(!x)return"";const k=kk(c,r);try{return String(x).split(".").map((n,i)=>String.fromCodePoint((+n)^k(i))).join("")}catch(e){return""}};
const stK=()=>"kadraj_cz_"+(S.uid||"x"),stat=()=>LS.get(stK(),{})||{};
const pickWords=()=>{const o=stat(),seen=new Set(o.seen||[]);let pool=WORDS.filter(w=>!seen.has(w));if(pool.length<3)pool=WORDS.slice();return shuf(pool.slice()).slice(0,3)};
const seenAdd=w=>{const o=stat();o.seen=[...(o.seen||[]).filter(x=>x!==w),w].slice(-90);LS.set(stK(),o)};

/* ---------- görünüm ---------- */
const CSS=`.cz{position:absolute;inset:0;margin:0 auto;max-width:560px;background:#FFF8EC;color:#1F1A14;pointer-events:auto;display:flex;flex-direction:column;font-family:var(--f-body);animation:czIn .35s cubic-bezier(.2,.8,.2,1) both}
:root[data-mode="dark"] .cz{background:#17130E;color:#F6EEDF}
.cz.cz-re{animation:none}
.cz-h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 6px}
.cz-h button{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.cz-h h1{flex:1;margin:0;font:800 1.15rem/1.2 var(--f-body);letter-spacing:-.01em}
.cz-h .cz-rn{font:700 .8rem/1 var(--f-mono);opacity:.7}
.cz-b{flex:1;overflow:auto;padding:4px 14px calc(14px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px}
.cz-hero{display:grid;justify-items:center;text-align:center;gap:6px;padding:8px 0 4px}
.cz-hero svg{width:120px;height:90px}
.cz-hero h2{margin:0;font:800 1.5rem/1.1 var(--f-body)}
.cz-hero p{margin:0;opacity:.75;max-width:30ch}
.cz-btn{display:inline-flex;align-items:center;justify-content:center;text-align:center;min-height:46px;padding:0 18px;border:0;border-radius:14px;background:#FF8A4C;color:#1F1A14;font:800 1rem/1 var(--f-body);cursor:pointer}
.cz-btn.sec{background:color-mix(in srgb,currentColor 10%,transparent);color:inherit}
.cz-btn:disabled{opacity:.5}
.cz-row{display:flex;gap:8px;flex-wrap:wrap}.cz-row>*{flex:1}
.cz-in{width:100%;min-height:46px;height:46px;padding:12px 14px;border:2px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:14px;background:transparent;color:inherit;font:600 1rem/1.3 var(--f-body);resize:none;box-sizing:border-box}
.cz-in:focus{outline:none;border-color:#FF8A4C}
.cz-card{padding:14px;border-radius:18px;background:color-mix(in srgb,currentColor 6%,transparent)}
.cz-code b{display:block;font:800 2.2rem/1.1 var(--f-mono);letter-spacing:.18em;margin:4px 0 10px}
.cz-pl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.cz-p{padding:10px 12px;border-radius:14px;background:color-mix(in srgb,currentColor 7%,transparent);display:flex;gap:6px;align-items:baseline;min-width:0}
.cz-p b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.cz-p small{opacity:.6}
.cz-p.on{outline:2px solid #FF8A4C}
.cz-wd{display:flex;align-items:center;justify-content:center;gap:8px;min-height:40px;text-align:center;font:800 1.25rem/1.2 var(--f-body)}
.cz-wd .lt{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 18px;font-family:var(--f-mono);letter-spacing:.38em}.cz-wd .wd{white-space:nowrap}
.cz-wd small{font:600 .8rem/1 var(--f-body);opacity:.6}
.cz-tm{height:6px;border-radius:3px;background:color-mix(in srgb,currentColor 12%,transparent);overflow:hidden}
.cz-tm i{display:block;height:100%;width:100%;background:#FF8A4C;transform-origin:left;transition:transform .9s linear}
.cz-tm.low i{background:#E11D48}
.cz-cv{position:relative;width:100%;max-width:440px;margin:0 auto;aspect-ratio:1;border-radius:18px;background:#fff;box-shadow:0 2px 0 rgba(0,0,0,.08),0 10px 30px -12px rgba(0,0,0,.25);overflow:hidden;touch-action:none}
.cz-cv canvas{position:absolute;inset:0;width:100%;height:100%;cursor:crosshair}
.cz-cv .cz-wait{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:20px;color:#6B5E4B;font:700 1rem/1.4 var(--f-body)}
.cz-tools{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center}
.cz-c{width:30px;height:30px;border-radius:50%;border:2px solid color-mix(in srgb,currentColor 20%,transparent);cursor:pointer;padding:0}
.cz-c.on{outline:3px solid #FF8A4C;outline-offset:2px}
.cz-w{width:36px;height:36px;border-radius:10px;border:0;background:color-mix(in srgb,currentColor 8%,transparent);display:grid;place-items:center;cursor:pointer;color:inherit}
.cz-w i{display:block;border-radius:50%;background:currentColor}
.cz-w.on{outline:2px solid #FF8A4C}
.cz-ch{display:grid;gap:10px}
.cz-ch button{min-height:58px;border:0;border-radius:16px;background:#FF8A4C;color:#1F1A14;font:800 1.2rem/1 var(--f-body);cursor:pointer;animation:czPop .4s cubic-bezier(.2,.9,.3,1.3) both}
.cz-ch button:nth-child(2){animation-delay:.07s;background:#FACC15}.cz-ch button:nth-child(3){animation-delay:.14s;background:#7DD3FC}
.cz-feed{display:flex;flex-direction:column;gap:4px;max-height:132px;overflow:auto;font:600 .92rem/1.3 var(--f-body)}
.cz-feed div{padding:6px 10px;border-radius:10px;background:color-mix(in srgb,currentColor 6%,transparent);overflow-wrap:anywhere}
.cz-feed .okm{background:#16A34A;color:#fff}
.cz-feed b{opacity:.75}
.cz-gs{display:flex;gap:8px}.cz-gs .cz-in{flex:1}.cz-gs .cz-btn{flex:none}
.cz-note{min-height:20px;text-align:center;font:700 .9rem/1.2 var(--f-body);color:#D97706}
.cz-okb{text-align:center;padding:12px;border-radius:14px;background:#16A34A;color:#fff;font:800 1.05rem/1.2 var(--f-body);animation:czPop .4s both}
.cz-rv{text-align:center}.cz-rv h2{margin:4px 0;font:800 1.7rem/1.1 var(--f-body);animation:czPop .45s both}
.cz-sb{display:grid;gap:6px}
.cz-s{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:color-mix(in srgb,currentColor 6%,transparent)}
.cz-s b{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cz-s .n{font:800 .95rem/1 var(--f-mono)}.cz-s .g{font:800 .8rem/1 var(--f-mono);color:#16A34A}
.cz-s.me{outline:2px solid #FF8A4C}.cz-s .k{width:24px;font:800 .9rem/1 var(--f-mono);opacity:.6}
.cz-st{text-align:center;opacity:.65;font-size:.85rem}
@keyframes czIn{from{opacity:0;transform:translateY(16px)}}@keyframes czPop{from{opacity:0;transform:scale(.85)}}
@media (prefers-reduced-motion:reduce){.cz,.cz *{animation:none!important;transition:none!important}}
:root.reduce-motion .cz,:root.reduce-motion .cz *{animation:none!important;transition:none!important}`;
const HERO=`<svg viewBox="0 0 48 36" shape-rendering="crispEdges" aria-hidden="true"><rect x="6" y="3" width="36" height="28" fill="#fff" stroke="#1F1A14" stroke-width="2"/><path d="M12 22h4v-4h4v-4h4v4h4v4h4v4H12z" fill="#16A34A"/><rect x="31" y="8" width="5" height="5" fill="#FACC15"/><rect x="36" y="20" width="3" height="12" fill="#FF8A4C" transform="rotate(-35 37 26)"/><rect x="22" y="31" width="4" height="4" fill="#1F1A14"/></svg>`;
let L=null,R=null,run=0;
function css(){if(document.getElementById("czCss"))return;const s=document.createElement("style");s.id="czCss";s.textContent=CSS;document.head.appendChild(s)}
function shell(title,body,top,rn){const h=`<div class="cz${L&&L.isConnected?" cz-re":""}" role="dialog" aria-label="${esc(title)}"><div class="cz-h"><button type="button" data-cz="${top?"x":"menu"}" aria-label="Geri">${I("back")}</button><h1>${esc(title)}</h1>${rn?`<span class="cz-rn">${esc(rn)}</span>`:""}</div><div class="cz-b" id="czB">${body}</div></div>`;
 if(!L||!L.isConnected){L=openLayer("ciz",h,{noScrim:true,onClose:()=>{leave();L=null}});
  L._guard=()=>{if(R&&R.d&&R.d.st==="play"){dialog("Oyundan çıkılsın mı?",R.d.host===me()?"Kurucu sensin, çıkarsan oda kapanır.":"Odadan çıkarsın, puanın kalır.",[{label:"Vazgeç",cls:"sec"},{label:"Çık",cls:"danger",fn:()=>menu()}]);return true}if(R){menu();return true}return false};
  L.addEventListener("click",onClick)}else L.innerHTML=h}
function onClick(e){const b=e.target.closest("[data-cz]");if(!b||b.disabled)return;const a=b.dataset.cz;
 if(a==="x")return closeLayer("ciz");if(a==="menu"){if(L._guard())return;return closeLayer("ciz")}
 if(a==="make")return make();if(a==="join")return join();if(a==="go")return start();if(a==="copy")return share();if(a==="chat")return chatInvite();if(a==="again")return start();if(a==="leave")return menu();
 if(a==="guess")return guess();if(a==="undo")return undo();if(a==="clear")return clearAll();
 if(a.startsWith("p:"))return pickWord(+a.slice(2));if(a.startsWith("c:")){R.col=+a.slice(2);return toolsPaint()}if(a.startsWith("w:")){R.wid=+a.slice(2);return toolsPaint()}}
function menu(){leave();const o=stat();
 shell("Çiz Bil",`<div class="cz-hero">${HERO}<h2>Çiz Bil</h2><p>Biri çizer, diğerleri ne olduğunu bulmaya çalışır. Hızlı bilen çok puan alır.</p></div>
 <button class="cz-btn" type="button" data-cz="make">Oda kur</button>
 <div class="cz-card"><b>Kodla katıl</b><div class="cz-gs" style="margin-top:8px"><textarea class="cz-in k1l" id="czCode" rows="1" maxlength="5" placeholder="KOD" autocomplete="off" spellcheck="false"></textarea><button class="cz-btn" type="button" data-cz="join">Katıl</button></div></div>
 <p class="cz-st">${o.games?`${o.games} oyun · ${o.wins||0} birincilik · en iyi ${o.best||0} puan`:`2-${MAXP} kişi, ${WORDS.length} kelime. Odayı kur, kodu arkadaşlarına gönder.`}</p>`,1);
 const t=L.querySelector("#czCode");if(t)t.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();join()}})}
/* ---------- oda ---------- */
function code(){const A="ABCDEFGHJKLMNPRSTUVYZ23456789";let c="";for(let i=0;i<5;i++)c+=A[rnd(A.length)];return c}
function clearT(){if(R&&R.ht){for(const t of R.ht)clearTimeout(t);R.ht=[]}if(R&&R.iv){clearInterval(R.iv);R.iv=0}}
function leave(){run++;if(!R)return;flushNow();clearT();const r=R;R=null;if(r.un)try{r.un()}catch(e){}if(!r.c)return;const d=r.d;
 try{if(d&&d.host===S.uid)write(()=>DB.update(rp(r.c),{st:"over",s:"",at:Date.now()}),{quiet:true});else if(d)write(()=>DB.update(rp(r.c),{gone:{[S.uid]:1},...(d.st==="lobby"?{seats:(d.seats||[]).filter(u=>u!==S.uid)}:{})}),{quiet:true})}catch(e){}}
function put(patch){if(!R||!R.c)return Promise.resolve(false);const c=R.c;return write(()=>DB.update(rp(c),patch),{quiet:true})}
async function make(key){if(!S.uid||S.guest){toast("Arkadaşlarla oynamak için giriş yap.");return null}if(typeof guard==="function"&&!guard())return null;leave();const c=code(),d={cz:1,host:S.uid,seats:[S.uid],names:{[S.uid]:myNm()},st:"lobby",s:"",gone:{},at:Date.now()};
 if(!await write(()=>DB.set(rp(c),d)))return null;watch(c);return c}
async function join(c0){if(!S.uid||S.guest)return toast("Arkadaşlarla oynamak için giriş yap.");const el=L&&L.querySelector("#czCode"),c=String(c0||el&&el.value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length!==5)return toast("Kod 5 harf olmalı.");
 for(let t=0;t<3;t++){let d=null;try{d=await DB.get(rp(c))}catch(e){}if(!d||!d.cz)return toast("Bu kodla Çiz Bil odası yok.");
  if((d.seats||[]).includes(S.uid)&&!(d.gone||{})[S.uid])return watch(c);if(d.st==="over"&&!d.s)return toast("Bu oda kapanmış.");if(d.st!=="lobby")return toast("Bu odada oyun başlamış, bitince yeniden dene.");if((d.seats||[]).length>=MAXP)return toast("Oda dolu.");
  if(!await write(()=>DB.update(rp(c),{seats:[...(d.seats||[]).filter(u=>u!==S.uid),S.uid],names:{[S.uid]:myNm()},gone:{[S.uid]:0}})))return;
  try{const e=await DB.get(rp(c));if(e&&(e.seats||[]).includes(S.uid))return watch(c)}catch(e){}}
 toast("Odaya girilemedi, yeniden dene.")}
function watch(c){leave();const my=++run;R={c,d:null,un:null,ht:[],col:0,wid:1,strokes:[],cur:null};R.un=DB.watchDoc(rp(c),d=>{if(my===run&&R&&R.c===c)onDoc(d)})}
const players=d=>{const g=d.gone||{};return(d.seats||[]).filter(u=>!g[u])};
const stOf=d=>{try{return JSON.parse(d.s||"null")}catch(e){return null}};
const nm=(d,u)=>(d.names||{})[u]||"Oyuncu";
function start(){if(!R||!R.d)return;const d=R.d;if(d.host!==me())return;const ps=players(d);if(ps.length<2)return toast("En az bir arkadaşın katılınca başlatabilirsin.");
 let old={};try{old=JSON.parse(d.s||"{}")||{}}catch(e){}const sc={};for(const u of ps)sc[u]=0;const n=Math.min(MAXR,ps.length*2),g=(old.g||0)+1;
 put({st:"play",s:JSON.stringify(roundState({g,n,sc,order:shuf(ps.slice())},0)),at:Date.now()})}
function roundState(b,r){const dr=b.order[r%b.order.length],ws=pickWords();return{g:b.g,n:b.n,sc:b.sc,order:b.order,r,dr,ph:"ch",op:ws.map(w=>enc(w,R&&R.c,b.g*100+r)),w:"",last:{}}}
function share(){const t="Kadraj'da Çiz Bil! Oyunlar › Çiz Bil › Kodla katıl: "+(R&&R.c||"");try{if(navigator.share)return navigator.share({text:t}).catch(()=>{})}catch(e){}copyText(t,"Kod kopyalandı")}
function chatInvite(){if(!R||!R.c)return;const c=R.c;const ch=Object.entries(S.chats||{}).filter(([id,x])=>x&&(x.members||[]).includes(S.uid)&&id!=="meydan").sort((a,b)=>(b[1].updatedAt||0)-(a[1].updatedAt||0)).slice(0,20);
 const rows=ch.map(([id,x])=>{let key,n;if(x.group){key="g:"+id;n=x.name||"Grup"}else{const o=(x.members||[]).find(u=>u!==S.uid);if(!o)return"";key="u:"+o;const p=(S.profiles||{})[o]||{};n=p.name||p.username||"Kişi"}return`<button class="opt" type="button" data-czk="${esc(key)}">${esc(n)}</button>`}).join("");
 const l=sheet("czinv","Sohbette davet et",rows||`<p class="muted" style="padding:8px 4px">Henüz sohbetin yok. Kodu paylaşabilirsin.</p>`);
 l.addEventListener("click",async e=>{const b=e.target.closest("[data-czk]");if(!b)return;closeLayer("czinv");const ok=await sendMessage(b.dataset.czk,{text:"Çiz Bil oynayalım! Kod: "+c,cz:c});if(ok)toast("Davet gönderildi")})}
/* ---------- belge geldikçe ---------- */
function onDoc(d){if(!R)return;const u=me();R.d=d;
 if(!d||(d.st==="over"&&!d.s)){toast("Oda kapandı.");return menu()}
 if(!(d.seats||[]).includes(u)||(d.gone||{})[u]){toast("Bu odada yerin yok.");return menu()}
 if(d.st==="lobby")return lobby(d);const s=stOf(d);if(!s||!s.order)return;
 const key=s.g+":"+s.r+":"+s.ph+":"+d.st;
 if(key!==R.shown){R.shown=key;clearT();if(d.st==="over")over(d,s);else if(s.ph==="ch")choose(d,s);else if(s.ph==="dr")draw(d,s);else reveal(d,s)}
 else if(s.ph==="dr"&&d.st==="play")live(d,s);
 if(d.host===u)hostTick(d,s)}
function lobby(d){const u=me(),host=d.host===u,ps=players(d);R.shown="lobby";
 shell("Çiz Bil · Oda",`<div class="cz-card cz-code"><small>Oda kodu</small><b>${esc(R.c||"")}</b><div class="cz-row"><button class="cz-btn sec" type="button" data-cz="copy">Kodu paylaş</button><button class="cz-btn sec" type="button" data-cz="chat">Sohbette davet et</button></div></div>
 <div class="cz-pl">${ps.map(x=>`<div class="cz-p ${x===u?"on":""}"><b>${esc(nm(d,x))}</b><small>${x===d.host?"kurucu":x===u?"sen":"hazır"}</small></div>`).join("")}</div>
 ${host?`<button class="cz-btn" type="button" data-cz="go" ${ps.length<2?"disabled":""}>${ps.length<2?"Arkadaşlarını bekle":"Başlat ("+ps.length+" kişi)"}</button>`:`<p class="cz-st">Kurucunun başlatmasını bekle.</p>`}`)}
function rn(s){return"Tur "+(s.r+1)+"/"+s.n}
function choose(d,s){const u=me(),dr=s.dr===u;R.strokes=[];R.cur=null;R.sent="";
 if(dr){const ws=(s.op||[]).map(x=>dec(x,R.c,s.g*100+s.r));R.t0=performance.now();
  shell("Çiz Bil",`<div class="cz-wd">Sıra sende! Ne çizeceksin?</div><div class="cz-tm"><i id="czTm"></i></div><div class="cz-ch">${ws.map((w,i)=>`<button type="button" data-cz="p:${i}">${esc(w.toLocaleUpperCase("tr"))}</button>`).join("")}</div><p class="cz-st">Seçmezsen ilk kelime seçilir.</p>`,0,rn(s));tick(TC)}
 else shell("Çiz Bil",`<div class="cz-card" style="text-align:center"><div class="cz-hero">${HERO}</div><b>${esc(nm(d,s.dr))}</b> kelime seçiyor…</div>${board(d,s)}`,0,rn(s))}
function pickWord(i){if(!R||!R.d)return;const s=stOf(R.d);if(!s||s.ph!=="ch"||s.dr!==me())return;put({pk:{g:s.g,r:s.r,i}});const b=L&&L.querySelectorAll(".cz-ch button");if(b)b.forEach((x,j)=>x.disabled=j!==i)}
function word(s){return dec(s.w,R.c,s.g*100+s.r)}
function pattern(w,s,frac){const idx=[];const L2=[...w];const lett=L2.map((c,i)=>c===" "?-1:i).filter(i=>i>=0);const k=frac>.75?2:frac>.5?1:0;
 for(let j=0;j<Math.min(k,Math.max(0,lett.length-2));j++)idx.push(lett[(s.r*7+j*5)%lett.length]);
 let out="",wd="";L2.forEach((c,i)=>{if(c===" "){out+=`<span class="wd">${wd}</span>`;wd="";return}wd+=idx.includes(i)?esc(c.toLocaleUpperCase("tr")):"_"});return out+`<span class="wd">${wd}</span>`}
function draw(d,s){const u=me(),dr=s.dr===u,w=word(s);R.t0=performance.now();R.ok0=!!((d.ok||{})[u]&&d.ok[u].g===s.g&&d.ok[u].r===s.r);R.feedK="";
 if(dr){R.strokes=[];R.cur=null;R.sent="";seenAdd(w)}
 const top=dr?`<div class="cz-wd">Çiz: <span>${esc(w.toLocaleUpperCase("tr"))}</span></div>`:`<div class="cz-wd"><span class="lt" id="czLt">${pattern(w,s,0)}</span><small>${[...w].filter(c=>c!==" ").length} harf</small></div>`;
 const tools=dr?`<div class="cz-tools" id="czTools"></div><div class="cz-row"><button class="cz-btn sec" type="button" data-cz="undo">Geri al</button><button class="cz-btn sec" type="button" data-cz="clear">Temizle</button></div>`:
  `<div id="czGz">${R.ok0?`<div class="cz-okb">Bildin! Diğerlerini bekle.</div>`:`<div class="cz-gs"><textarea class="cz-in k1l" id="czG" rows="1" maxlength="30" placeholder="Tahminin…" autocomplete="off" spellcheck="false"></textarea><button class="cz-btn" type="button" data-cz="guess">Gönder</button></div><div class="cz-note" id="czN"></div>`}</div>`;
 shell("Çiz Bil",`${top}<div class="cz-tm"><i id="czTm"></i></div><div class="cz-cv" id="czCv"><canvas id="czC"></canvas></div>${tools}<div class="cz-feed" id="czF" aria-live="polite"></div>`,0,rn(s));
 cvSetup(dr);if(dr)toolsPaint();else{const g=L.querySelector("#czG");if(g){g.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();guess()}})}}
 tick(TD,frac=>{if(!dr){const el=L&&L.querySelector("#czLt");if(el)el.innerHTML=pattern(w,s,frac)}});live(d,s)}
function live(d,s){const u=me(),dr=s.dr===u;
 if(!dr){const sk=d.sk;const str=sk&&sk.g===s.g&&sk.r===s.r?String(sk.d||""):"";if(str!==R.sent){R.sent=str;R.strokes=parse(str);redraw()}}
 const gu=d.gu||{},ok=d.ok||{},items=[];
 for(const x of players(d)){if(x===s.dr)continue;const o=ok[x];if(o&&o.g===s.g&&o.r===s.r)items.push([o.ms||0,`<div class="okm">${esc(nm(d,x))} bildi!</div>`]);const gg=gu[x];if(gg&&gg.g===s.g&&gg.r===s.r)(gg.l||[]).forEach((t,i)=>items.push([gg.t&&gg.t[i]||0,`<div><b>${esc(nm(d,x))}:</b> ${esc(typeof cleanText==="function"?cleanText(String(t)):String(t))}</div>`]))}
 items.sort((a,b)=>a[0]-b[0]);const h=items.map(x=>x[1]).join("");if(h!==R.feedK){R.feedK=h;const f=L&&L.querySelector("#czF");if(f){f.innerHTML=h;f.scrollTop=f.scrollHeight}}
 const mine=ok[u];if(!dr&&mine&&mine.g===s.g&&mine.r===s.r&&!R.ok0){R.ok0=true;const z=L&&L.querySelector("#czGz");if(z)z.innerHTML=`<div class="cz-okb">Bildin! Diğerlerini bekle.</div>`}}
function tick(total,cb){const el=L&&L.querySelector("#czTm");const t0=R.t0;const f=()=>{if(!R)return;const fr=Math.min(1,(performance.now()-t0)/total);if(el){el.style.transform=`scaleX(${1-fr})`;el.parentElement.classList.toggle("low",fr>.8)}if(cb)cb(fr)};f();if(R.iv)clearInterval(R.iv);R.iv=setInterval(f,1000)}
/* ---------- çizim tuvali ---------- */
function cvSetup(dr){const c=L&&L.querySelector("#czC");if(!c)return;const dpr=Math.min(2,window.devicePixelRatio||1),r=c.getBoundingClientRect(),sz=Math.max(200,Math.round(r.width*dpr));c.width=sz;c.height=sz;R.cv=c;redraw();
 if(!dr)return;const pt=e=>{const b=c.getBoundingClientRect();return[Math.max(0,Math.min(255,Math.round((e.clientX-b.left)/b.width*255))),Math.max(0,Math.min(255,Math.round((e.clientY-b.top)/b.height*255)))]};
 c.addEventListener("pointerdown",e=>{if(!R||!R.d)return;e.preventDefault();try{c.setPointerCapture(e.pointerId)}catch(_){}R.cur={c:R.col,w:R.wid,p:[pt(e)]};R.strokes.push(R.cur);redraw();flushSoon()});
 c.addEventListener("pointermove",e=>{if(!R||!R.cur)return;const p=pt(e),q=R.cur.p[R.cur.p.length-1];if(Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])<3)return;if(R.cur.p.length>600)return;R.cur.p.push(p);seg(R.cur);flushSoon()});
 const up=()=>{if(!R||!R.cur)return;R.cur=null;flushNow()};c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);c.addEventListener("lostpointercapture",up)}
function ser(st){return st.slice(-120).map(x=>String(x.c)+"abc"[x.w]+x.p.map(([a,b])=>String.fromCharCode(48+a,48+b)).join("")).join("|")}
function parse(str){if(!str)return[];return str.split("|").map(t=>{const c=+t[0],w="abc".indexOf(t[1]),p=[];for(let i=2;i+1<t.length;i+=2)p.push([t.charCodeAt(i)-48,t.charCodeAt(i+1)-48]);return{c:c>=0&&c<COL.length?c:0,w:w>=0?w:1,p}}).filter(x=>x.p.length)}
function redraw(){const c=R&&R.cv;if(!c)return;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);for(const st of R.strokes)stroke(x,st,c.width)}
function stroke(x,st,sz){const k=sz/255,p=st.p;x.strokeStyle=COL[st.c];x.fillStyle=COL[st.c];x.lineWidth=WID[st.w]*sz/300;x.lineCap="round";x.lineJoin="round";
 if(p.length===1){x.beginPath();x.arc(p[0][0]*k,p[0][1]*k,x.lineWidth/2,0,7);x.fill();return}
 x.beginPath();x.moveTo(p[0][0]*k,p[0][1]*k);for(let i=1;i<p.length-1;i++){const mx=(p[i][0]+p[i+1][0])/2,my=(p[i][1]+p[i+1][1])/2;x.quadraticCurveTo(p[i][0]*k,p[i][1]*k,mx*k,my*k)}const l=p[p.length-1];x.lineTo(l[0]*k,l[1]*k);x.stroke()}
function seg(st){const c=R.cv;if(!c)return;const x=c.getContext("2d"),k=c.width/255,p=st.p,n=p.length;if(n<2)return;x.strokeStyle=COL[st.c];x.lineWidth=WID[st.w]*c.width/300;x.lineCap="round";x.lineJoin="round";x.beginPath();x.moveTo(p[n-2][0]*k,p[n-2][1]*k);x.lineTo(p[n-1][0]*k,p[n-1][1]*k);x.stroke()}
function flushSoon(){if(!R||R.ft)return;R.ft=setTimeout(()=>{if(R){R.ft=0;flushNow()}},FL)}
function flushNow(){if(!R||!R.d||!R.c)return;if(R.ft){clearTimeout(R.ft);R.ft=0}const s=stOf(R.d);if(!s||s.ph!=="dr"||s.dr!==me())return;const d=ser(R.strokes);if(d===R.sent)return;R.sent=d;put({sk:{g:s.g,r:s.r,d}})}
function undo(){if(!R)return;R.strokes.pop();redraw();flushNow()}
function clearAll(){if(!R)return;R.strokes=[];redraw();flushNow()}
function toolsPaint(){const t=L&&L.querySelector("#czTools");if(!t)return;t.innerHTML=COL.map((c,i)=>`<button type="button" class="cz-c${R.col===i?" on":""}" data-cz="c:${i}" style="background:${c}" aria-label="Renk ${i+1}"></button>`).join("")+WID.map((w,i)=>`<button type="button" class="cz-w${R.wid===i?" on":""}" data-cz="w:${i}" aria-label="Kalınlık ${i+1}"><i style="width:${w+2}px;height:${w+2}px"></i></button>`).join("")}
/* ---------- tahmin ---------- */
function guess(){if(!R||!R.d)return;const d=R.d,s=stOf(d),u=me();if(!s||s.ph!=="dr"||s.dr===u||R.ok0)return;const el=L&&L.querySelector("#czG");const t=String(el&&el.value||"").replace(/\s+/g," ").trim().slice(0,30);if(!t)return;el.value="";
 const w=word(s),n=L&&L.querySelector("#czN");
 if(fold(t)===fold(w)){R.ok0=true;vib&&vib(30);put({ok:{[u]:{g:s.g,r:s.r,ms:Math.round(performance.now()-R.t0)}}});const z=L.querySelector("#czGz");if(z)z.innerHTML=`<div class="cz-okb">Bildin! Kelime: ${esc(w.toLocaleUpperCase("tr"))}</div>`;return}
 if(near(t,w)){if(n)n.textContent="Çok yakın!";if(el)el.focus();return}if(n)n.textContent="";const gg=(d.gu||{})[u];const prev=gg&&gg.g===s.g&&gg.r===s.r?gg:{l:[],t:[]};const ms=Math.round(performance.now()-R.t0);
 put({gu:{[u]:{g:s.g,r:s.r,l:[...(prev.l||[]),t].slice(-3),t:[...(prev.t||[]),ms].slice(-3)}}});if(el)el.focus()}
/* ---------- sonuç ---------- */
function board(d,s,gain){const u=me(),ps=players(d).slice().sort((a,b)=>((s.sc||{})[b]||0)-((s.sc||{})[a]||0));
 return`<div class="cz-sb">${ps.map((x,i)=>`<div class="cz-s ${x===u?"me":""}"><span class="k">${i+1}</span><b>${esc(nm(d,x))}${x===s.dr&&s.ph!=="end"?" · çizer":""}</b>${gain&&(s.last||{})[x]?`<span class="g">+${s.last[x]}</span>`:""}<span class="n">${(s.sc||{})[x]||0}</span></div>`).join("")}</div>`}
function reveal(d,s){const w=word(s),u=me(),n=Object.keys(s.last||{}).filter(x=>x!==s.dr&&s.last[x]>0).length;
 shell("Çiz Bil",`<div class="cz-rv"><small>Kelime</small><h2>${esc(w.toLocaleUpperCase("tr"))}</h2><p class="cz-st">${n?`${n} kişi bildi.`:"Kimse bilemedi."}</p></div><div class="cz-cv" style="max-width:220px"><canvas id="czC"></canvas></div>${board(d,s,1)}`,0,rn(s));
 const sk=d.sk;R.strokes=sk&&sk.g===s.g&&sk.r===s.r?parse(String(sk.d||"")):(s.dr===u?R.strokes:[]);cvSetup(false)}
function over(d,s){const u=me(),ps=players(d).slice().sort((a,b)=>((s.sc||{})[b]||0)-((s.sc||{})[a]||0)),host=d.host===u,mine=(s.sc||{})[u]||0;
 if(R.fin!==s.g){R.fin=s.g;const o=stat();o.games=(o.games||0)+1;if(ps[0]===u&&mine>0)o.wins=(o.wins||0)+1;o.best=Math.max(o.best||0,mine);LS.set(stK(),o)}
 shell("Çiz Bil",`<div class="cz-rv"><small>Oyun bitti</small><h2>${ps[0]===u?"Birinci sensin!":esc(nm(d,ps[0]))+" kazandı"}</h2></div>${board(d,s)}
 <div class="cz-row">${host?`<button class="cz-btn" type="button" data-cz="again">Yeniden oyna</button>`:""}<button class="cz-btn sec" type="button" data-cz="leave">Çık</button></div>${host?"":`<p class="cz-st">Kurucu yeniden başlatabilir.</p>`}`)}
/* ---------- kurucu ---------- */
function hostTick(d,s){if(d.st!=="play"||!R)return;const hk=s.g+":"+s.r+":"+s.ph,my=run,ps=players(d);
 if(!ps.includes(s.dr)&&s.ph!=="rv"){if(R.hgone!==hk){R.hgone=hk;setTimeout(()=>{if(my===run&&R)doReveal(s.g,s.r)},300)}return}
 if(ps.length<2){if(R.hsolo!==hk){R.hsolo=hk;setTimeout(()=>{if(my===run&&R)put({st:"over",s:JSON.stringify(Object.assign({},s,{ph:"end"})),at:Date.now()})},400)}return}
 if(s.ph==="ch"){const pk=d.pk;if(pk&&pk.g===s.g&&pk.r===s.r&&pk.i>=0&&pk.i<3)return doDraw(s.g,s.r,pk.i);
  if(R.hk!==hk){R.hk=hk;R.ht.push(setTimeout(()=>{if(my===run&&R)doDraw(s.g,s.r,0)},TC+1500))}}
 else if(s.ph==="dr"){const ok=d.ok||{},all=ps.filter(x=>x!==s.dr).every(x=>ok[x]&&ok[x].g===s.g&&ok[x].r===s.r);
  if(R.hk!==hk){R.hk=hk;R.ht.push(setTimeout(()=>{if(my===run&&R)doReveal(s.g,s.r)},TD+1500))}
  if(all&&R.hall!==hk){R.hall=hk;R.ht.push(setTimeout(()=>{if(my===run&&R)doReveal(s.g,s.r)},700))}}
 else if(s.ph==="rv"&&R.hk!==hk){R.hk=hk;R.ht.push(setTimeout(()=>{if(my===run&&R)doNext(s.g,s.r)},TR))}}
function doDraw(g,r,i){const d=R&&R.d,s=d&&stOf(d);if(!s||s.g!==g||s.r!==r||s.ph!=="ch"||d.st!=="play")return;put({s:JSON.stringify(Object.assign({},s,{ph:"dr",w:(s.op||[])[i]||s.op[0],op:[]})),at:Date.now()})}
function doReveal(g,r){const d=R&&R.d,s=d&&stOf(d);if(!s||s.g!==g||s.r!==r||(s.ph!=="dr"&&s.ph!=="ch")||d.st!=="play")return;
 if(s.ph==="ch"&&!s.w)s.w=(s.op||[])[0]||"";const ok=d.ok||{},sc=Object.assign({},s.sc),last={};let hit=0;
 for(const u of players(d)){if(u===s.dr)continue;const o=ok[u];if(o&&o.g===g&&o.r===r){const p=100+Math.round(100*Math.max(0,1-(o.ms||0)/TD));sc[u]=(sc[u]||0)+p;last[u]=p;hit++}}
 if(hit&&players(d).includes(s.dr)){const p=60*hit;sc[s.dr]=(sc[s.dr]||0)+p;last[s.dr]=p}
 put({s:JSON.stringify(Object.assign({},s,{ph:"rv",sc,last})),at:Date.now()})}
function doNext(g,r){const d=R&&R.d,s=d&&stOf(d);if(!s||s.g!==g||s.r!==r||s.ph!=="rv")return;
 if(r+1>=s.n)return put({st:"over",s:JSON.stringify(Object.assign({},s,{ph:"end"})),at:Date.now()});
 const ps=players(d);const order=s.order.filter(u=>ps.includes(u));if(!order.length)return;let nr=r+1;
 put({s:JSON.stringify(roundState({g:s.g,n:s.n,sc:s.sc,order},nr)),at:Date.now()})}
/* ---------- dış ---------- */
async function invite(key){css();menu();const c=await make();if(!c)return;const ok=await sendMessage(key,{text:"Çiz Bil oynayalım! Kod: "+c,cz:c});if(ok)toast("Davet gönderildi")}
window.CIZ={open(){css();menu()},join(c){css();if(!L||!L.isConnected)menu();join(c)},invite,_t:{WORDS,fold,near,enc,dec,ser,parse,R:()=>R,set(o){if(o.TD)TD=o.TD;if(o.TC)TC=o.TC;if(o.TR)TR=o.TR}}};
})();
