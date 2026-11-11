/* Kadraj Masa Oyunları (7.1): Okey (4 kişilik), Dörtrenk (renk ve sayı eşleme kart oyunu), Pişti, Amiral Battı.
   İlk kullanımda yüklenir (app.js bölge 71M: msLoad/msGo; cephe.js kalıbı). window.MASA.open(oyun?).
   Hepsi şimdilik botlara karşı ve yalnızca cihazda (Firebase'e hiçbir şey okunmaz/yazılmaz); kazanma sayıları LS `kadraj_masa_<uid>`.
   Kadraj'ın genel adlarını doğrudan kullanır (openLayer, closeLayer, esc, I, toast, LS, S, vib, dialog).
   Motorlar DOM'suz: MASA._t (okSolve, okBest, okDeal, drDeck, drCan, ptScore, abPlace...) testler için. */
(function(){"use strict";
const rnd=n=>Math.floor(Math.random()*n),shuf=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const BOTN=["Rota","Poyraz","Lodos"];
let L=null,G=null,run=0; /* L: katman, G: açık oyun, run: oyun kimliği (eski zamanlayıcılar iptal) */
const st=()=>LS.get("kadraj_masa_"+(S.uid||"x"),{})||{};
const win=k=>{const o=st();o[k]=(o[k]||0)+1;LS.set("kadraj_masa_"+(S.uid||"x"),o)};
const CSS=`.ms{position:absolute;inset:0;margin:0 auto;max-width:560px;background:#0E1F1A;color:#F2F5F3;pointer-events:auto;display:flex;flex-direction:column;padding-block:env(safe-area-inset-top,0px) env(safe-area-inset-bottom,0px);font-family:var(--f-body);animation:up .25s ease;user-select:none;-webkit-user-select:none}
.ms-h{display:flex;align-items:center;gap:8px;padding:10px 12px}.ms-h h1{margin:0;font:800 1.05rem var(--f-display);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms-h button{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;color:#fff;flex:none}.ms-h button svg{width:20px;height:20px}
.ms-b{flex:1;min-height:0;overflow-y:auto;padding:4px 12px 16px;display:flex;flex-direction:column;gap:10px}
.ms-menu{display:grid;gap:10px;margin-top:6px}.ms-m{display:grid;grid-template-columns:54px 1fr;gap:2px 12px;align-items:center;text-align:left;padding:14px;border-radius:18px;background:rgba(255,255,255,.07);color:#fff}.ms-m i{grid-row:span 2;width:54px;height:54px;border-radius:14px;display:grid;place-items:center;background:var(--c);font:900 1.3rem var(--f-display);font-style:normal}.ms-m b{font:800 1rem var(--f-display)}.ms-m small{color:#A9BDB5;font-size:.82rem}
.ms-st{font-size:.85rem;color:#A9BDB5;text-align:center;min-height:1.3em}.ms-st b{color:#fff}
.ms-btn{padding:11px 18px;border-radius:14px;background:#2BC48E;color:#06231A;font-weight:800;font-size:.95rem}.ms-btn.sec{background:rgba(255,255,255,.12);color:#fff}.ms-btn:disabled{opacity:.4}
.ms-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.ms-opp{display:flex;justify-content:space-around;gap:6px}.ms-o{flex:1;min-width:0;text-align:center;padding:6px 4px;border-radius:12px;background:rgba(255,255,255,.06);font-size:.78rem;color:#A9BDB5;transition:background .2s}.ms-o b{display:block;color:#fff;font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms-o.on{background:rgba(43,196,142,.28)}
.on-in{min-width:0;font:800 1.1rem var(--f-mono);letter-spacing:.2em;text-transform:uppercase;background:rgba(255,255,255,.1);color:#fff;border:0;border-radius:10px;padding:8px 10px}.on-code{display:grid;justify-items:center;gap:6px;padding:16px;border-radius:18px;background:rgba(255,255,255,.07)}.on-code small{color:#A9BDB5}.on-code b{font:900 2.2rem var(--f-mono);letter-spacing:.18em}.on-seats{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ms.ms-re{animation:none}.ms-end{position:absolute;inset:0;background:rgba(6,16,13,.86);display:grid;place-items:center;z-index:5;animation:fade .25s ease}.ms-end>div{text-align:center;padding:24px;display:grid;gap:12px;justify-items:center}.ms-end h2{margin:0;font:900 1.6rem var(--f-display)}.ms-end p{margin:0;color:#A9BDB5}
/* okey */
.ok-mid{display:flex;align-items:center;justify-content:center;gap:14px;padding:6px 0}.ok-pile{display:grid;justify-items:center;gap:4px;font-size:.72rem;color:#A9BDB5}
.ok-t{width:var(--tw,40px);height:calc(var(--tw,40px)*1.38);border-radius:7px;background:#FBF6E9;color:var(--k);display:grid;place-items:center;font:900 calc(var(--tw,40px)*.5) var(--f-display);box-shadow:0 2px 0 #C9BFA5,0 3px 6px rgba(0,0,0,.35);position:relative;flex:none;transition:transform .15s}
.ok-t.e{background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.14)}.ok-t.bk{background:#1B5E4A;box-shadow:0 2px 0 #0E3A2D,0 3px 6px rgba(0,0,0,.35)}.ok-t.sel{transform:translateY(-8px);box-shadow:0 2px 0 #C9BFA5,0 0 0 3px #F59E0B}
.ok-t.jk::after{content:"";position:absolute;right:4px;top:4px;width:7px;height:7px;border-radius:50%;background:#F59E0B}.ok-t small{position:absolute;bottom:2px;left:0;right:0;text-align:center;font:700 8px var(--f-body);color:#8A8068}
.ok-rack{display:grid;grid-template-columns:repeat(var(--n,8),var(--tw,40px));gap:8px 3px;justify-content:center;padding:10px 4px;border-radius:14px;background:#7A4E2B;box-shadow:inset 0 -6px 0 rgba(0,0,0,.18)}
.ok-dis{display:flex;justify-content:space-around;gap:6px}.ok-dis>div{display:grid;justify-items:center;gap:3px;font-size:.7rem;color:#A9BDB5}
/* kartlar */
.cd{width:var(--cw,52px);height:calc(var(--cw,52px)*1.42);border-radius:9px;background:var(--c,#fff);color:var(--k,#fff);display:grid;place-items:center;font:900 calc(var(--cw,52px)*.42) var(--f-display);box-shadow:0 2px 6px rgba(0,0,0,.4);flex:none;position:relative;transition:transform .15s,opacity .15s;border:2.5px solid #fff}
.cd.bk{background:#1B5E4A;border-color:#2C7A62}.cd.no{opacity:.45}.cd.ok{transform:translateY(-6px)}.cd small{position:absolute;top:3px;left:5px;font:800 10px var(--f-body)}
.cd-hand{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding:8px 0}.cd-mid{display:flex;align-items:center;justify-content:center;gap:16px;padding:14px 0;flex:1}
.dr-col{display:flex;gap:8px;justify-content:center}.dr-col button{width:54px;height:54px;border-radius:14px;border:3px solid #fff}
/* amiral */
.ab-g{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;max-width:340px;width:100%;margin:0 auto}.ab-c{aspect-ratio:1;border-radius:6px;background:#17405A;display:grid;place-items:center}.ab-c.s{background:#5B6B7A}.ab-c.h{background:#C2410C}.ab-c.m{background:#0F2A3B}.ab-c.m::after,.ab-c.h::after{content:"";width:34%;height:34%;border-radius:50%;background:rgba(255,255,255,.75)}.ab-c.k{background:#7F1D1D}
.ab-t{font:800 .8rem var(--f-display);text-align:center;color:#A9BDB5;margin-top:4px}
@media (prefers-reduced-motion:reduce){.ms,.ms-end,.ok-t,.cd{animation:none;transition:none}}`;
function css(){if(document.getElementById("msCss"))return;const s=document.createElement("style");s.id="msCss";s.textContent=CSS;document.head.appendChild(s)}
function shell(title,body,menu){const h=`<div class="ms" role="dialog" aria-label="${esc(title)}"><div class="ms-h"><button type="button" data-ms="${menu?"x":"menu"}" aria-label="Geri">${I("back")}</button><h1>${esc(title)}</h1>${menu?"":`<button type="button" data-ms="new" aria-label="Yeni oyun">${I("rotate")}</button>`}</div><div class="ms-b" id="msB">${body}</div></div>`;
 if(!L||!L.isConnected){L=openLayer("masa",h,{noScrim:true,onClose:()=>{onLeave();run++;G=null;L=null}});L._guard=()=>{if(G&&!G.over&&G.moved){dialog("Oyundan çıkılsın mı?","Bu el yarıda kalır.",[{label:"Vazgeç",cls:"sec"},{label:"Çık",cls:"danger",fn:()=>{G=null;menu_()}}]);return true}if(G){G=null;menu_();return true}return false};
  L.addEventListener("click",e=>{const b=e.target.closest("[data-ms]");if(!b)return;const a=b.dataset.ms;if(a==="x")return closeLayer("masa");if(a==="menu"){if(L._guard())return;return menu_()}if(a==="new"){if(G&&G.on)return onNew();return G&&start(G.k)}if(a==="on:renk")return onMenu("renk");if(a==="on:make")return onMake();if(a==="on:join")return onJoin();if(a==="on:go")return onStart();if(a==="on:copy")return onCopy();if(a.startsWith("g:"))return start(a.slice(2))})}
 else L.querySelector(".ms").outerHTML=h.replace('<div class="ms"','<div class="ms ms-re"');return L.querySelector("#msB")}
function menu_(){onLeave();run++;G=null;const o=st(),w=k=>o[k]?` · ${o[k]} galibiyet`:"";
 shell("Masa Oyunları",`<div class="ms-menu"><button class="ms-m" type="button" data-ms="g:okey" style="--c:#B45309"><i>13</i><b>Okey</b><small>4 kişilik, üç bota karşı${w("okey")}</small></button>
 <button class="ms-m" type="button" data-ms="g:renk" style="--c:#2563EB"><i>4R</i><b>Dörtrenk</b><small>Rengi ya da sayıyı tuttur, elini ilk bitiren kazanır${w("renk")}</small></button>
 <button class="ms-m" type="button" data-ms="on:renk" style="--c:#7C3AED"><i>4R</i><b>Dörtrenk · Arkadaşlarla</b><small>2-4 kişi çevrim içi, boş yerlerde bot oynar</small></button>
 <button class="ms-m" type="button" data-ms="g:pisti" style="--c:#BE123C"><i>J</i><b>Pişti</b><small>Yerdeki kartı tuttur, pişti yap${w("pisti")}</small></button>
 <button class="ms-m" type="button" data-ms="g:amiral" style="--c:#0E7490"><i>A</i><b>Amiral Battı</b><small>Gemileri bul ve batır${w("amiral")}</small></button></div><p class="ms-st">Dörtrenk arkadaşlarla da oynanır; diğerleri botlara karşı ve yalnızca bu cihazda.</p>`,true)}
function start(k){run++;({okey:okStart,renk:drStart,pisti:ptStart,amiral:abStart})[k]()}
function end(title,sub,k,won){if(!G)return;G.over=1;if(won)win(k);try{vib(won?[20,40,20]:15)}catch(e){}const d=document.createElement("div");d.className="ms-end";d.innerHTML=`<div><h2>${esc(title)}</h2><p>${esc(sub)}</p><div class="ms-row"><button class="ms-btn" type="button" data-ms="new">Yeni oyun</button><button class="ms-btn sec" type="button" data-ms="menu">Oyunlar</button></div></div>`;L.querySelector(".ms").appendChild(d)}

/* ================= OKEY ================= */
/* taş: {c:0-3 renk, n:1-13, f:1 sahte okey}. Okey taşı (gösterge+1) joker; sahte okey okey taşının yerine geçer. */
const OKC=["#C81E1E","#1D4ED8","#111827","#B45309"];
function okDeal(){const t=[];for(let k=0;k<2;k++){for(let c=0;c<4;c++)for(let n=1;n<=13;n++)t.push({c,n});t.push({f:1})}shuf(t);let gi=t.findIndex(x=>!x.f);const ind=t.splice(gi,1)[0];
 const ok={c:ind.c,n:ind.n===13?1:ind.n+1};const hands=[0,1,2,3].map(i=>t.splice(0,i===0?15:14));return{ind,ok,hands,stock:t,dis:[[],[],[],[]],turn:0,drew:true}}
const okJ=(t,ok)=>!t.f&&t.c===ok.c&&t.n===ok.n; /* joker mi */
const okV=(t,ok)=>t.f?{c:ok.c,n:ok.n}:t; /* sahte okey → okey taşının değeri */
/* el → sayım tablosu + joker sayısı */
function okCnt(tiles,ok){const a=[0,1,2,3].map(()=>new Array(15).fill(0));let j=0;for(const t of tiles){if(okJ(t,ok))j++;else{const v=okV(t,ok);a[v.c][v.n]++}}return{a,j}}
/* en çok kaç taş geçerli pere/seriye girer (kalan jokerler boşa sayılmaz). need=true: hepsi girmeli (bitme denetimi) */
function okBest(tiles,ok){const {a,j}=okCnt(tiles,ok);let total=0;for(const r of a)for(const x of r)total+=x;let best=0,nodes=0;
 const rec=(jk,cov,left)=>{if(cov+left+jk<=best||nodes>60000)return;nodes++;let c=-1,n=-1;outer:for(let nn=1;nn<=13;nn++)for(let cc=0;cc<4;cc++)if(a[cc][nn]){c=cc;n=nn;break outer}
  if(c<0){const v=cov+(cov>0||jk>=3?jk:0);if(v>best)best=v;return}
  /* seri: n'den yukarı (13'ten sonra 1), öncesine joker konabilir */
  for(let pre=0;pre<=Math.min(jk,2)&&n-pre>=1;pre++){let used=pre,taken=[],len=pre;for(let p=n;p<=14;p++){const q=p===14?1:p;if(p===14&&(n-pre)===1)break;if(a[c][q]>0&&!(p===14&&q===1&&taken.includes(1))){a[c][q]--;taken.push(q);len++}else if(used<jk){used++;len++}else break;
    if(len>=3&&taken.length)rec(jk-used,cov+len,left-taken.length)}for(const q of taken)a[c][q]++}
  /* 1, serinin sonu da olabilir (…12-13-1): 13'ten aşağı doğru */
  if(n===1){a[c][1]--;let used=0,len=1;const taken=[];for(let q=13;q>=3;q--){if(a[c][q]>0){a[c][q]--;taken.push(q);len++}else if(used<jk){used++;len++}else break;if(len>=3)rec(jk-used,cov+len,left-1-taken.length)}for(const q of taken)a[c][q]++;a[c][1]++}
  /* per: aynı sayı, farklı renkler */
  {const oth=[0,1,2,3].filter(x=>x!==c&&a[x][n]>0);a[c][n]--;const m=oth.length;for(let mask=0;mask<(1<<m);mask++){let cnt=1;for(let b=0;b<m;b++)if(mask>>b&1)cnt++;for(let jj=0;jj<=jk&&cnt+jj<=4;jj++){if(cnt+jj<3)continue;for(let b=0;b<m;b++)if(mask>>b&1)a[oth[b]][n]--;rec(jk-jj,cov+cnt+jj,left-cnt);for(let b=0;b<m;b++)if(mask>>b&1)a[oth[b]][n]++}}
   rec(jk,cov,left-1);a[c][n]++}};
 rec(j,0,total);return best}
/* 14 taş biter mi: hepsi pere girer ya da 7 çift */
function okSolve(tiles,ok){if(tiles.length!==14)return false;if(okBest(tiles,ok)>=14)return true;const {a,j}=okCnt(tiles,ok);let pairs=0,single=0;for(const r of a)for(const x of r){pairs+=x>>1;single+=x&1}return single<=j&&pairs+single+((j-single)>>1)>=7}
/* yarım değer: perde olmayan taşların ikili yakınlığı (aynı renk komşu/aralıklı, aynı sayı başka renk) */
function okNear(tiles,ok){const v=tiles.filter(t=>!okJ(t,ok)).map(t=>okV(t,ok));let s=0;for(let i=0;i<v.length;i++)for(let k=i+1;k<v.length;k++){const x=v[i],y=v[k];if(x.c===y.c&&Math.abs(x.n-y.n)===1)s+=1;else if(x.c===y.c&&Math.abs(x.n-y.n)===2)s+=.5;else if(x.n===y.n&&x.c!==y.c)s+=1}return s}
const okScore=(tiles,ok)=>okBest(tiles,ok)*10+okNear(tiles,ok);
/* 15 taştan hangisini atmalı: atınca en iyi kalan (bitiyorsa onu) */
function okPick(hand,ok){let bi=0,bs=-1;for(let i=0;i<hand.length;i++){if(okJ(hand[i],ok))continue;const rest=hand.filter((_,k)=>k!==i);if(okSolve(rest,ok))return{i,win:true};const s=okScore(rest,ok);if(s>bs){bs=s;bi=i}}return{i:bi,win:false}}
function okTile(t,ok,cls=""){if(!t)return`<span class="ok-t e ${cls}"></span>`;const v=okV(t,ok),jk=okJ(t,ok);return`<span class="ok-t ${jk?"jk":""} ${cls}" style="--k:${OKC[v.c]}">${t.f?"★":v.n}${t.f?"<small>sahte</small>":jk?"<small>okey</small>":""}</span>`}
function okStart(){G=Object.assign(okDeal(),{k:"okey",sel:-1,moved:0});G.rack=G.hands[0].concat(new Array(24-G.hands[0].length).fill(null));G.msg="Sen başlıyorsun: bir taş seç ve at.";okDraw()}
function okDraw(){if(!G||G.k!=="okey")return;const tw=Math.max(22,Math.min(44,Math.floor((Math.min(innerWidth,560)-24-8-11*3)/12)));
 const b=shell("Okey",`<div class="ms-opp">${[1,2,3].map(i=>`<div class="ms-o ${G.turn===i?"on":""}"><b>${BOTN[i-1]}</b>${G.hands[i].length} taş</div>`).join("")}</div>
 <div class="ok-dis" style="--tw:${tw-6}px">${[1,2,3].map(i=>`<div>${okTile(G.dis[i][G.dis[i].length-1],G.ok)}<span>${BOTN[i-1]} attı</span></div>`).join("")}</div>
 <div class="ok-mid" style="--tw:${tw}px"><div class="ok-pile"><button type="button" data-ok="take" aria-label="Soldakinin attığını al">${okTile(G.dis[3][G.dis[3].length-1],G.ok)}</button><span>Sana atılan</span></div>
 <div class="ok-pile"><button type="button" data-ok="draw" aria-label="Ortadan çek"><span class="ok-t bk">${G.stock.length}</span></button><span>Ortadan çek</span></div>
 <div class="ok-pile">${okTile(G.ind,G.ok)}<span>Gösterge</span></div><div class="ok-pile"><button type="button" data-ok="dis" aria-label="Seçili taşı at">${okTile(G.dis[0][G.dis[0].length-1],G.ok)}</button><span>Atılan</span></div></div>
 <p class="ms-st">${G.msg||""}</p>
 <div class="ok-rack" style="--tw:${tw}px;--n:12">${G.rack.map((t,i)=>`<button type="button" data-oki="${i}">${okTile(t,G.ok,G.sel===i?"sel":"")}</button>`).join("")}</div>
 <div class="ms-row"><button class="ms-btn sec" type="button" data-ok="sort">Diz</button><button class="ms-btn sec" type="button" data-ok="pairs">Çift diz</button><button class="ms-btn" type="button" data-ok="fin" ${G.turn===0&&G.drew?"":"disabled"}>Seçiliyi at</button></div>`);
 b.onclick=okClick}
const okMine=()=>G.rack.filter(Boolean);
function okSort(pairs){const ok=G.ok,t=okMine(),key=x=>{const v=okV(x,ok);return okJ(x,ok)?999:pairs?v.n*10+v.c:v.c*20+v.n};t.sort((a,b)=>key(a)-key(b));G.rack=t.concat(new Array(24-t.length).fill(null));G.sel=-1}
function okClick(e){if(!G||G.over)return;const a=e.target.closest("[data-ok]"),ti=e.target.closest("[data-oki]");
 if(ti){const i=+ti.dataset.oki;if(G.sel<0){if(G.rack[i])G.sel=i}else{[G.rack[G.sel],G.rack[i]]=[G.rack[i],G.rack[G.sel]];G.sel=-1}return okDraw()}
 if(!a)return;const k=a.dataset.ok;if(k==="sort"||k==="pairs"){okSort(k==="pairs");return okDraw()}
 if(G.turn!==0){G.msg="Sıra sende değil.";return okDraw()}
 if(k==="draw"||k==="take"){if(G.drew){G.msg="Zaten çektin; bir taş seçip at.";return okDraw()}let t;if(k==="take"){t=G.dis[3].pop();if(!t){G.msg="Sana atılan taş yok.";return okDraw()}}else{t=G.stock.pop();if(!t)return okTie()}
  const e2=G.rack.indexOf(null);G.rack[e2]=t;G.sel=e2;G.drew=true;G.moved=1;G.msg="Bir taş seç ve at. Elin bitiyorsa atınca kazanırsın.";return okDraw()}
 if(k==="dis"||k==="fin"){if(!G.drew){G.msg="Önce taş çek.";return okDraw()}if(G.sel<0||!G.rack[G.sel]){G.msg="Atacağın taşı seç.";return okDraw()}
  const t=G.rack[G.sel];G.rack[G.sel]=null;G.sel=-1;G.moved=1;const rest=okMine();if(okSolve(rest,G.ok)){G.dis[0].push(t);okDraw();return end("Okey! Kazandın","Elini bitirdin.","okey",true)}
  G.dis[0].push(t);G.drew=false;G.turn=1;G.msg="";okDraw();okBots()}}
function okTie(){G.msg="Ortada taş kalmadı.";okDraw();end("Berabere","Ortadaki taşlar bitti.","okey",false)}
async function okBots(){const my=run;while(G&&G.k==="okey"&&!G.over&&G.turn!==0){await wait(650);if(my!==run||!G)return;const i=G.turn,h=G.hands[i],ok=G.ok,prev=G.dis[(i+3)%4],top=prev[prev.length-1];
  let took=false;if(top){const cur=okScore(h,ok);const pk=okPick(h.concat([top]),ok);const after=okScore(h.concat([top]).filter((_,k)=>k!==pk.i),ok);if(pk.win||after>cur+6){h.push(prev.pop());took=true}}
  if(!took){const t=G.stock.pop();if(!t)return okTie();h.push(t)}
  const pk=okPick(h,ok),t=h.splice(pk.i,1)[0];G.dis[i].push(t);if(pk.win){okDraw();return end(BOTN[i-1]+" bitirdi","Bu eli "+BOTN[i-1]+" kazandı.","okey",false)}
  G.turn=(i+1)%4;if(G.turn===0){G.drew=false;G.msg="Sıra sende: ortadan çek ya da sana atılanı al."}okDraw()}}

/* ================= DÖRTRENK ================= */
/* kart: {c:0-3|4 (joker), v:"0".."9"|"A" atla|"Y" yön|"+2"|"R" renk seç|"+4"} */
const DRC=["#DC2626","#2563EB","#16A34A","#D97706","#111827"],DRN=["Kırmızı","Mavi","Yeşil","Sarı"];
function drDeck(){const d=[];for(let c=0;c<4;c++){d.push({c,v:"0"});for(let k=0;k<2;k++){for(let n=1;n<=9;n++)d.push({c,v:String(n)});for(const v of["A","Y","+2"])d.push({c,v})}}for(let k=0;k<4;k++){d.push({c:4,v:"R"});d.push({c:4,v:"+4"})}return shuf(d)}
const drCan=(k,top,col)=>k.c===4||k.c===col||k.v===top.v;
function drCard(k,cls="",i){return`<${i!=null?`button type="button" data-dr="${i}"`:"span"} class="cd ${cls}" style="--c:${DRC[k.c]};--cw:50px">${k.v==="A"?"⊘":k.v==="Y"?"⇄":k.v==="R"?"★":k.v}</${i!=null?"button":"span"}>`}
function drStart(o){o=o||{};const d=drDeck();G={k:"renk",deck:d,hands:[0,1,2,3].map(()=>d.splice(0,7)),pile:[],turn:0,dir:1,moved:0,msg:"",me:o.me||0,names:o.names||["Sen",...BOTN],human:o.human||[1,0,0,0],on:o.on||null,host:!!o.host,seq:0};G.msg=G.turn===G.me?"Sıra sende.":"";let f;do{f=d.pop();if(f.c===4||isNaN(+f.v)){d.unshift(f);f=null}}while(!f);G.pile.push(f);G.col=f.c;drDraw()}
function drTake(i,n){for(let k=0;k<n;k++){if(!G.deck.length){const top=G.pile.pop();G.deck=shuf(G.pile);G.pile=[top];if(!G.deck.length)return}G.hands[i].push(G.deck.pop())}}
function drDraw(){if(!G||G.k!=="renk")return;const top=G.pile[G.pile.length-1],ME=G.me||0,me=G.hands[ME];
 const b=shell(G.on?"Dörtrenk · "+G.on:"Dörtrenk",`<div class="ms-opp">${[1,2,3].map(d=>(ME+d)%4).map(i=>`<div class="ms-o ${G.turn===i?"on":""}"><b>${esc(G.names[i])}</b>${G.hands[i].length} kart${G.on&&!G.human[i]?" · bot":""}</div>`).join("")}</div>
 <div class="cd-mid"><button type="button" data-drd="1" aria-label="Kart çek"><span class="cd bk" style="--cw:58px">${G.deck.length}</span></button><span class="cd" style="--c:${DRC[top.c===4?G.col:top.c]};--cw:66px">${top.v==="A"?"⊘":top.v==="Y"?"⇄":top.v==="R"?"★":top.v}</span></div>
 <p class="ms-st">${G.pick!=null?"Bir renk seç":G.on&&G.turn!==ME&&!G.over?`Sıra: <b>${esc(G.names[G.turn])}</b> · Renk: <b style="color:${DRC[G.col]}">${DRN[G.col]}</b>`:`Renk: <b style="color:${DRC[G.col]}">${DRN[G.col]}</b> · ${G.msg||""}`}</p>
 ${G.pick!=null?`<div class="dr-col">${[0,1,2,3].map(c=>`<button type="button" data-drc="${c}" style="background:${DRC[c]}" aria-label="${DRN[c]}"></button>`).join("")}</div>`:""}
 <div class="cd-hand">${me.map((k,i)=>drCard(k,G.turn===ME&&G.pick==null&&drCan(k,top,G.col)?"ok":"no",i)).join("")}</div>`);
 b.onclick=drClick}
function drPlay(i,idx,col){const h=G.hands[i],k=h.splice(idx,1)[0];G.pile.push(k);G.col=k.c===4?col:k.c;let skip=0;const nx=()=>(G.turn+G.dir+4)%4;
 if(!h.length){G.win=i;drDraw();return end(i===G.me?"Kazandın":G.names[i]+" kazandı",i===G.me?"Elini ilk sen bitirdin.":"Elini ilk o bitirdi.","renk",i===G.me),true}
 if(k.v==="Y")G.dir*=-1;if(k.v==="A")skip=1;if(k.v==="+2"){drTake(nx(),2);skip=1}if(k.v==="+4"){drTake(nx(),4);skip=1}
 G.turn=nx();if(skip)G.turn=nx();G.msg=G.turn===G.me?"Sıra sende.":"";return false}
function drClick(e){if(!G||G.over)return;const c=e.target.closest("[data-drc]"),k=e.target.closest("[data-dr]"),d=e.target.closest("[data-drd]");
 const ME=G.me||0;
 if(c&&G.pick!=null){const idx=G.pick;G.pick=null;if(drPlay(ME,idx,+c.dataset.drc))return onPush();drDraw();return drAfter()}
 if(G.turn!==ME||G.pick!=null)return;const top=G.pile[G.pile.length-1];
 if(k){const i=+k.dataset.dr,cd=G.hands[ME][i];if(!drCan(cd,top,G.col)){G.msg="Bu kart oynanmaz.";return drDraw()}G.moved=1;if(cd.c===4){G.pick=i;return drDraw()}if(drPlay(ME,i))return onPush();drDraw();return drAfter()}
 if(d){G.moved=1;drTake(ME,1);const n=G.hands[ME][G.hands[ME].length-1];if(n&&drCan(n,top,G.col)){G.msg="Çektiğin kart oynanabilir.";if(G.on)onPush();return drDraw()}G.turn=(G.turn+G.dir+4)%4;G.msg="";drDraw();return drAfter()}}
function drAfter(){if(G&&G.on){onPush();if(G.host)drBots();return}drBots()}
async function drBots(){if(G&&G.on&&!G.host)return;if(G&&G._bt)return;const my=run;if(G)G._bt=1;try{while(G&&G.k==="renk"&&!G.over&&!G.human[G.turn]){await wait(700);if(my!==run||!G||G.over||G.human[G.turn])return;const i=G.turn,h=G.hands[i],top=G.pile[G.pile.length-1];
  let idx=h.findIndex(k=>k.c!==4&&drCan(k,top,G.col)&&isNaN(+k.v));if(idx<0)idx=h.findIndex(k=>k.c!==4&&drCan(k,top,G.col));if(idx<0)idx=h.findIndex(k=>k.c===4);
  if(idx<0){drTake(i,1);const n=h[h.length-1];if(n&&drCan(n,top,G.col))idx=h.length-1}
  if(idx<0){G.turn=(G.turn+G.dir+4)%4;if(G.turn===G.me)G.msg="Sıra sende."}else{const cnt=[0,0,0,0];for(const k of h)if(k.c<4)cnt[k.c]++;if(drPlay(i,idx,cnt.indexOf(Math.max(...cnt)))){if(G.on)onPush();return}}if(G.on)onPush();drDraw()}}finally{if(G)G._bt=0}}

/* ================= PİŞTİ ================= */
const PTS=["♠︎","♥︎","♦︎","♣︎"],PTR=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const ptDeck=()=>{const d=[];for(let s=0;s<4;s++)for(let r=0;r<13;r++)d.push({s,r});return shuf(d)};
const ptVal=k=>k.r===0||k.r===10?1:k.s===3&&k.r===1?2:k.s===2&&k.r===9?3:0;
function ptScore(p){let s=p.pisti;for(const k of p.won)s+=ptVal(k);return s}
function ptCard(k,i){const red=k.s===1||k.s===2;return`<${i!=null?`button type="button" data-pt="${i}"`:"span"} class="cd" style="--c:#FBF6E9;--k:${red?"#C81E1E":"#111827"};--cw:56px"><small>${PTS[k.s]}</small>${PTR[k.r]}</${i!=null?"button":"span"}>`}
function ptStart(){let d;do{d=ptDeck()}while(d[d.length-1].r===10);G={k:"pisti",deck:d,pile:d.splice(-4),p:[{h:[],won:[],pisti:0},{h:[],won:[],pisti:0}],turn:0,last:-1,moved:0,msg:"Sıra sende."};ptDeal();ptDraw()}
function ptDeal(){for(const p of G.p)p.h=G.deck.splice(0,4)}
function ptDraw(){if(!G||G.k!=="pisti")return;const top=G.pile[G.pile.length-1];
 const b=shell("Pişti",`<div class="ms-opp"><div class="ms-o ${G.turn===1?"on":""}"><b>Rota</b>${ptScore(G.p[1])} puan · ${G.p[1].won.length} kart</div><div class="ms-o ${G.turn===0?"on":""}"><b>Sen</b>${ptScore(G.p[0])} puan · ${G.p[0].won.length} kart</div></div>
 <div class="cd-hand">${G.p[1].h.map(()=>`<span class="cd bk" style="--cw:44px"></span>`).join("")}</div>
 <div class="cd-mid"><span class="cd bk" style="--cw:54px">${G.deck.length}</span>${top?ptCard(top):`<span class="cd" style="--c:transparent;--cw:56px;border-style:dashed;box-shadow:none"></span>`}<span class="ms-st">Yerde<br><b>${G.pile.length}</b> kart</span></div>
 <p class="ms-st">${G.msg||""}</p><div class="cd-hand">${G.p[0].h.map((k,i)=>ptCard(k,i)).join("")}</div>`);
 b.onclick=e=>{const k=e.target.closest("[data-pt]");if(!k||!G||G.over||G.turn!==0)return;G.moved=1;ptPlay(0,+k.dataset.pt);ptNext()}}
function ptPlay(i,idx){const p=G.p[i],k=p.h.splice(idx,1)[0],top=G.pile[G.pile.length-1];G.pile.push(k);const who=i===0?"Sen":"Rota";
 if(top&&(k.r===top.r||k.r===10)){if(G.pile.length===2&&k.r===top.r){p.pisti+=k.r===10?20:10;G.msg=who+" pişti yaptı"+(i===0?"n":"")+"!";try{vib(25)}catch(e){}}else G.msg=who+" yerdekileri aldı"+(i===0?"n":"")+".";p.won.push(...G.pile);G.pile=[];G.last=i}else G.msg=""}
async function ptNext(){const my=run;G.turn=1;ptDraw();await wait(750);if(my!==run||!G)return;const p=G.p[1],top=G.pile[G.pile.length-1];
 let idx=top?p.h.findIndex(k=>k.r===top.r):-1;if(idx<0&&top&&G.pile.length>1)idx=p.h.findIndex(k=>k.r===10);if(idx<0){idx=p.h.findIndex(k=>k.r!==10&&!ptVal(k));if(idx<0)idx=0}
 ptPlay(1,idx);if(!G.p[0].h.length&&!p.h.length){if(G.deck.length)ptDeal();else{if(G.pile.length&&G.last>=0){G.p[G.last].won.push(...G.pile);G.pile=[]}const a=G.p[0],b2=G.p[1];let s0=ptScore(a),s1=ptScore(b2);if(a.won.length>b2.won.length)s0+=3;else if(b2.won.length>a.won.length)s1+=3;
   G.turn=-1;ptDraw();return end(s0>s1?"Kazandın":s0<s1?"Rota kazandı":"Berabere",`Sen ${s0} · Rota ${s1}`,"pisti",s0>s1)}}
 G.turn=0;if(!G.msg)G.msg="Sıra sende.";ptDraw()}

/* ================= AMİRAL BATTI ================= */
const ABN=8,ABS=[4,3,3,2,2];
function abPlace(){const g=new Array(ABN*ABN).fill(0),ships=[];for(const len of ABS){for(let tr=0;tr<400;tr++){const hz=rnd(2),x=rnd(ABN-(hz?len-1:0)),y=rnd(ABN-(hz?0:len-1)),cells=[];let okk=true;
   for(let k=0;k<len;k++){const cx=x+(hz?k:0),cy=y+(hz?0:k);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=cx+dx,ny=cy+dy;if(nx>=0&&ny>=0&&nx<ABN&&ny<ABN&&g[ny*ABN+nx])okk=false}cells.push(cy*ABN+cx)}
   if(okk){for(const c of cells)g[c]=ships.length+1;ships.push({cells,hit:0});break}}}return{g,ships,shot:new Array(ABN*ABN).fill(0)}}
function abStart(){G={k:"amiral",me:abPlace(),bot:abPlace(),turn:0,moved:0,q:[],msg:"Rakip denize dokunarak ateş et."};abDraw()}
const abLeft=b=>b.ships.filter(s=>s.hit<s.cells.length).length;
function abGrid(b,mine){return`<div class="ab-g">${b.g.map((v,i)=>{const sh=b.shot[i],sunk=v&&b.ships[v-1].hit===b.ships[v-1].cells.length;return`<${mine?"span":`button type="button" data-ab="${i}"`} class="ab-c ${sh?(v?(sunk?"k":"h"):"m"):mine&&v?"s":""}"></${mine?"span":"button"}>`}).join("")}</div>`}
function abDraw(){if(!G||G.k!=="amiral")return;const b=shell("Amiral Battı",`<div class="ab-t">Rakip deniz · ${abLeft(G.bot)} gemi kaldı</div>${abGrid(G.bot,false)}<p class="ms-st">${G.msg||""}</p><div class="ab-t">Senin denizin · ${abLeft(G.me)} gemi kaldı</div>${abGrid(G.me,true)}`);
 b.onclick=e=>{const c=e.target.closest("[data-ab]");if(!c||!G||G.over||G.turn!==0)return;const i=+c.dataset.ab;if(G.bot.shot[i])return;G.moved=1;const r=abShoot(G.bot,i);G.msg=r===2?"Batırdın!":r===1?"Vurdun! Bir daha ateş et.":"Iska.";if(!abLeft(G.bot)){abDraw();return end("Kazandın","Bütün gemileri batırdın.","amiral",true)}if(r){abDraw();return}G.turn=1;abDraw();abBot()}}
function abShoot(b,i){b.shot[i]=1;const v=b.g[i];if(!v)return 0;const s=b.ships[v-1];s.hit++;return s.hit===s.cells.length?2:1}
async function abBot(){const my=run;while(G&&G.k==="amiral"&&!G.over&&G.turn===1){await wait(650);if(my!==run||!G)return;const b=G.me;let i=-1;while(G.q.length&&i<0){const c=G.q.pop();if(!b.shot[c])i=c}
  if(i<0){const fr=[];for(let c=0;c<ABN*ABN;c++)if(!b.shot[c]&&((c%ABN)+((c/ABN)|0))%2===0)fr.push(c);const all=fr.length?fr:b.shot.map((s,c)=>s?-1:c).filter(c=>c>=0);i=all[rnd(all.length)]}
  const r=abShoot(b,i);if(r===1){const x=i%ABN,y=(i/ABN)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<ABN&&ny<ABN&&!b.shot[ny*ABN+nx])G.q.push(ny*ABN+nx)}}if(r===2)G.q=[];
  if(!abLeft(b)){abDraw();return end("Rota kazandı","Bütün gemilerin battı.","amiral",false)}if(!r){G.turn=0;G.msg="Sıra sende."}else G.msg=r===2?"Rota bir gemini batırdı.":"Rota vurdu.";abDraw()}}


/* ================= ÇEVRİM İÇİ (7.1.8, şimdilik Dörtrenk) =================
   Oda games/ms-<KOD> = {ms:1,k,host,seats:[uid…≤4],names:{uid:ad},st:lobby|play|over,s:JSON durum,seq,gone:{uid:1},at}. Kural değişikliği yok (games).
   Sırası gelen insan kendi hamlesinden sonra durumu yazar (onPush, seq+1); boş koltuklar ve oyundan çıkanlar bot, botları kurucu oynatır ve yazar.
   Tek canlı dinleyici yalnızca odadayken (watchDoc), çıkınca kapanır. Eller aynı belgede durur (arkadaş oyunu; gizlilik istemci tarafında). */
const ON={c:null,un:null,doc:null};const rp=c=>"games/ms-"+c;
const myNm=()=>{const p=(S.profiles||{})[S.uid]||{};return String(p.name||p.username||"Oyuncu").slice(0,20)};
function onCode(){const A="ABCDEFGHJKLMNPRSTUVYZ23456789";let c="";for(let i=0;i<5;i++)c+=A[rnd(A.length)];return c}
function onMenu(k){onLeave();run++;G=null;if(!S.uid||S.guest)return toast("Arkadaşlarla oynamak için giriş yap.");
 shell("Dörtrenk · Arkadaşlarla",`<div class="ms-menu"><button class="ms-m" type="button" data-ms="on:make" style="--c:#7C3AED"><i>+</i><b>Oda kur</b><small>Kodu arkadaşlarına gönder, 2-4 kişi</small></button>
 <div class="ms-m" style="--c:#2563EB;grid-template-columns:54px 1fr auto"><i>#</i><b>Kodla katıl</b><button class="ms-btn" type="button" data-ms="on:join" style="grid-row:span 2">Katıl</button><textarea class="in k1l on-in" id="onCode" rows="1" maxlength="5" placeholder="KOD" autocomplete="off" spellcheck="false"></textarea></div></div>
 <p class="ms-st">Boş kalan yerlerde bot oynar. Botları odayı kuran kişinin telefonu oynatır.</p>`)}
async function onMake(){const c=onCode(),d={ms:1,k:"renk",host:S.uid,seats:[S.uid],names:{[S.uid]:myNm()},st:"lobby",seq:0,s:"",gone:{},at:Date.now()};
 if(!await write(()=>DB.set(rp(c),d)))return;onWatch(c)}
async function onJoin(){const el=L&&L.querySelector("#onCode"),c=String(el&&el.value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length!==5)return toast("Kod 5 harf olmalı.");
 for(let t=0;t<3;t++){let d=null;try{d=await DB.get(rp(c))}catch(e){}if(!d||!d.ms)return toast("Bu kodla oda yok.");
  if((d.seats||[]).includes(S.uid))return onWatch(c);if(d.st!=="lobby")return toast("Bu odada oyun başlamış.");if((d.seats||[]).length>=4)return toast("Oda dolu.");
  if(!await write(()=>DB.update(rp(c),{seats:[...d.seats,S.uid],names:{[S.uid]:myNm()}})))return;
  try{const e=await DB.get(rp(c));if(e&&(e.seats||[]).includes(S.uid))return onWatch(c)}catch(e){}}
 toast("Odaya girilemedi, yeniden dene.")}
function onWatch(c){if(ON.un)try{ON.un()}catch(e){}ON.c=c;ON.doc=null;ON.un=DB.watchDoc(rp(c),d=>onDoc(c,d))}
function onLobby(d){const me=S.uid,host=d.host===me,seats=d.seats||[];
 shell("Dörtrenk · Oda",`<div class="on-code"><small>Oda kodu</small><b>${esc(ON.c)}</b><button class="ms-btn sec" type="button" data-ms="on:copy">Kodu paylaş</button></div>
 <div class="on-seats">${[0,1,2,3].map(i=>{const u=seats[i];return`<div class="ms-o ${u?"on":""}"><b>${u?esc((d.names||{})[u]||"Oyuncu"):"Boş"}</b>${u?(u===d.host?"kurucu":u===me?"sen":"oyuncu"):"bot oynar"}</div>`}).join("")}</div>
 ${host?`<div class="ms-row"><button class="ms-btn" type="button" data-ms="on:go" ${seats.length<2?"disabled":""}>Başlat</button></div><p class="ms-st">${seats.length<2?"En az bir arkadaşın katılınca başlatabilirsin.":"Herkes hazırsa başlat."}</p>`:`<p class="ms-st">Kurucunun başlatması bekleniyor…</p>`}`)}
function onDoc(c,d){if(c!==ON.c)return;ON.doc=d;if(!d||d.st==="over"&&!d.s){toast("Oda kapandı.");return menu_()}
 const me=S.uid,seats=d.seats||[],mi=seats.indexOf(me);if(mi<0){toast("Bu odada yerin yok.");return menu_()}
 if(d.st==="lobby"){G=null;return onLobby(d)}
 let st=null;try{st=JSON.parse(d.s||"null")}catch(e){}if(!st)return;
 if(!G||G.on!==c||(st.seq||0)>(G.seq||0)){const keep=G&&G.on===c?{pick:G.pick}:{};G=Object.assign({k:"renk",moved:1},st,{me:mi,on:c,host:d.host===me,over:0},st.seq>((G&&G.seq)||0)?{}:keep);G.msg=G.turn===mi?"Sıra sende.":"";
  if(st.over!=null){G.win=st.over;drDraw();const w=st.over;return end(w===mi?"Kazandın":G.names[w]+" kazandı",w===mi?"Elini ilk sen bitirdin.":"Elini ilk o bitirdi.","renk",w===mi)}drDraw()}
 if(G.host){const gone=d.gone||{};let ch=0;seats.forEach((u,i)=>{if(gone[u]&&G.human[i]){G.human[i]=0;G.names[i]+=" (çıktı)";ch=1}});if(ch){onPush();drDraw()}if(!G.over&&!G.human[G.turn])drBots()}}
function onPush(){if(!G||!G.on)return;G.seq=(G.seq||0)+1;const st={deck:G.deck,hands:G.hands,pile:G.pile,turn:G.turn,dir:G.dir,col:G.col,names:G.names,human:G.human,seq:G.seq,over:G.over?G.win:null};
 write(()=>DB.update(rp(G.on),{s:JSON.stringify(st),seq:G.seq,st:G.over?"over":"play",at:Date.now()}),{quiet:true})}
function onStart(){const d=ON.doc;if(!d||d.host!==S.uid)return;const seats=d.seats||[];if(seats.length<2)return toast("En az iki kişi gerekli.");
 run++;const names=[0,1,2,3].map(i=>seats[i]?((d.names||{})[seats[i]]||"Oyuncu"):BOTN[i-seats.length]||"Bot"),human=[0,1,2,3].map(i=>seats[i]?1:0);
 drStart({me:0,names,human,on:ON.c,host:true});G.seq=+d.seq||0;G.turn=0;G.msg="Sıra sende.";onPush();drDraw()}
function onNew(){if(!G||!G.on)return;if(!G.host)return toast("Yeni eli odayı kuran başlatır.");onStart()}
function onCopy(){const t="Kadraj'da Dörtrenk oynayalım! Masa Oyunları › Dörtrenk · Arkadaşlarla › Kodla katıl: "+ON.c;try{if(navigator.share)return navigator.share({text:t}).catch(()=>{})}catch(e){}copyText(t,"Kod kopyalandı")}
function onLeave(){if(!ON.c)return;const c=ON.c,d=ON.doc;ON.c=null;ON.doc=null;if(ON.un)try{ON.un()}catch(e){}ON.un=null;
 try{if(d&&d.host===S.uid)write(()=>DB.update(rp(c),{st:"over",s:"",at:Date.now()}),{quiet:true});else if(d)write(()=>DB.update(rp(c),{gone:{[S.uid]:1},...(d.st==="lobby"?{seats:(d.seats||[]).filter(u=>u!==S.uid)}:{})}),{quiet:true})}catch(e){}}
window.MASA={open(k){css();if(k)start(k);else menu_()},join(c){css();onMenu("renk");const x=L&&L.querySelector("#onCode");if(x){x.value=c;onJoin()}},_on:ON,_t:{okDeal,okBest,okSolve,okPick,okScore,okJ,drDeck,drCan,ptDeck,ptScore,ptVal,abPlace,abShoot,G:()=>G}};
})();
