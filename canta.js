/* Kadraj 7.3.0 Okul Çantası: ders programı, ödevler, sınav geri sayımları ve Clawd'la odak (ders çalışma) zamanlayıcısı.
   app.js bölge 7300 ilk kullanımda yükler (ctLoad/ctGo). Kadraj'ın genel adlarını kullanır (S, LS, P, esc, I, openLayer, closeLayer, dialog, toast,
   write, DB, humans, avatar, cwSvg, kbReduce, gunConfetti, vib, sysNote, OKUL_LGS).
   Veri yalnızca cihazda: kadraj_canta_<uid> = {prog:{1..5:[ders adı|""]}, bell:{s:"08:30",l:40,b:10,lu:4,lul:40,n:8},
     hw:[{id,d,t,due(YYYY-MM-DD),done}], ex:[{id,t,at(YYYY-MM-DD)}], foc:{n,log:{YYYY-MM-DD:dk}}, run:{end,len,d,t0}}.
   Tek Firebase yazması: odak başlayınca profiles.cal={u:bitiş,d:ders}, bitince/iptalde {u:0} (arkadaşlar "şu an ders çalışıyor" görür; yüklü
   profillerden okunur, ek dinleyici yok; kural değişikliği yok). Zamanlayıcı bitiş anını saklar, kapanıp açılınca sürer; saniye göstergesi yalnızca
   pencere açıkken 1 sn'de bir (sonsuz CSS animasyonu yok). Bitince ses, titreşim, uygulama arka plandaysa telefon bildirimi. Testler için window.CANTA._t. */
(()=>{"use strict";
if(window.CANTA)return;
const DERS=["Türkçe","Matematik","Fen Bilimleri","Sosyal Bilgiler","T.C. İnkılap Tarihi","İngilizce","Din Kültürü","Beden Eğitimi","Müzik","Görsel Sanatlar","Bilişim","Teknoloji ve Tasarım","Seçmeli","Rehberlik"];
const GUN=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma"],TAB=[["bugun","Bugün"],["prog","Program"],["hw","Ödevler"],["ex","Sınavlar"],["odak","Odak"]];
const K=()=>"kadraj_canta_"+(S.uid||"x");
let L=null,tab="bugun",iv=0,TT={now:()=>Date.now()};
const now=()=>TT.now();
function st(){const o=LS.get(K(),null)||{};o.prog=o.prog||{1:[],2:[],3:[],4:[],5:[]};o.bell=Object.assign({s:"08:30",l:40,b:10,lu:4,lul:40,n:8},o.bell||{});o.hw=o.hw||[];o.ex=o.ex||[];o.foc=o.foc||{n:0,log:{}};return o}
function save(o){LS.set(K(),o)}
const ymd=t=>{const d=new Date(t);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const dayOf=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Date(y,m-1,d).getTime()};
const daysTo=s=>Math.round((dayOf(s)-dayOf(ymd(now())))/864e5);
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const dc=s=>`hsl(${hue(s)} 70% 45%)`;
const hm=m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
function slots(b){const [h,mi]=String(b.s).split(":").map(Number);const s0=h*60+mi,out=[];let t=s0;for(let i=0;i<b.n;i++){out.push([t,t+b.l]);t+=b.l+(i+1===b.lu?b.lul:b.b)}return out}
function today(o){const d=new Date(now()),wd=d.getDay();if(wd<1||wd>5)return null;const sl=slots(o.bell),pr=o.prog[wd]||[],m=d.getHours()*60+d.getMinutes();
 const L2=sl.map((x,i)=>({i,ad:pr[i]||"",a:x[0],b:x[1]})).filter(x=>x.ad);const cur=L2.find(x=>m>=x.a&&m<x.b),next=L2.find(x=>x.a>m);return{wd,list:L2,cur,next,m}}
const CSS=`.ct{position:absolute;inset:0;margin:0 auto;max-width:620px;background:var(--bg);color:var(--fg);pointer-events:auto;display:flex;flex-direction:column;animation:ctIn .3s ease both}
.ct-h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 4px}
.ct-h button{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}.ct-h h1{flex:1;margin:0;font:800 1.15rem/1.2 var(--f-body)}
.ct-tabs{display:flex;gap:6px;padding:4px 12px 10px;overflow-x:auto;scrollbar-width:none}.ct-tabs::-webkit-scrollbar{display:none}
.ct-tabs button{flex:none;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:700 .88rem/1 var(--f-body);cursor:pointer}.ct-tabs button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.ct-b{flex:1;overflow:auto;padding:0 14px calc(18px + env(safe-area-inset-bottom));display:grid;gap:12px;align-content:start}
.ct-card{padding:14px;border-radius:18px;background:var(--surface);border:1px solid var(--line);display:grid;gap:8px}
.ct-card h3{margin:0;font:800 1rem/1.2 var(--f-body);display:flex;align-items:center;gap:8px}.ct-card h3 .sp{flex:1}
.ct-now{background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;border:0}.ct-now small{opacity:.85;font-weight:700}.ct-now b{font:800 1.5rem/1.15 var(--f-body)}.ct-now span{opacity:.9}
.ct-l{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--surface-2)}
.ct-l i{flex:none;width:8px;height:30px;border-radius:4px;background:var(--c)}.ct-l b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct-l small{color:var(--muted);font:700 .8rem/1 var(--f-mono)}
.ct-l.on{outline:2px solid #FF8A4C}.ct-l.past{opacity:.5}
.ct-grid{display:grid;grid-template-columns:44px repeat(5,minmax(0,1fr));gap:4px;font-size:.72rem}
.ct-grid .hd{font:800 .72rem/1.2 var(--f-body);text-align:center;color:var(--muted);padding:4px 0}.ct-grid .tm{font:700 .66rem/1.2 var(--f-mono);color:var(--muted);display:grid;place-items:center}
.ct-grid button{min-height:40px;border-radius:8px;border:1px dashed var(--line);background:var(--surface);color:var(--fg);font:700 .68rem/1.15 var(--f-body);padding:2px;cursor:pointer;overflow:hidden;overflow-wrap:anywhere}
.ct-grid button.f{border:0;background:var(--c);color:#fff}.ct-grid .td{color:var(--accent)}
.ct-chips{display:flex;flex-wrap:wrap;gap:6px}.ct-chips button{padding:8px 12px;border-radius:10px;border:0;background:var(--c,var(--surface-2));color:#fff;font:700 .85rem/1 var(--f-body);cursor:pointer}
.ct-chips button.x{background:var(--surface-2);color:var(--fg)}
.ct-form{display:grid;gap:8px}.ct-form .row{display:flex;gap:8px}.ct-form .row>*{flex:1;min-width:0}
.ct-hw{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:var(--surface-2)}.ct-hw.done{opacity:.55}.ct-hw.done .t{text-decoration:line-through}
.ct-hw .ck{flex:none;width:26px;height:26px;border-radius:8px;border:2px solid var(--muted);background:transparent;display:grid;place-items:center;cursor:pointer;color:#fff;padding:0}.ct-hw.done .ck{background:#16A34A;border-color:#16A34A}.ct-hw .ck svg{width:16px;height:16px}
.ct-hw .tx{flex:1;min-width:0;display:grid;gap:2px}.ct-hw .t{font-weight:700;overflow-wrap:anywhere}.ct-hw small{color:var(--muted)}.ct-hw small.late{color:#E11D48;font-weight:700}.ct-hw .dl{border:0;background:none;color:var(--muted);cursor:pointer;padding:6px}
.ct-ex{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;background:var(--surface-2)}.ct-ex .n{flex:none;min-width:58px;text-align:center;font:800 1.5rem/1 var(--f-body);color:var(--c,var(--accent))}.ct-ex .n small{display:block;font:700 .7rem/1.2 var(--f-body);color:var(--muted)}.ct-ex .tx{flex:1;min-width:0}.ct-ex b{display:block;overflow-wrap:anywhere}.ct-ex .tx small{color:var(--muted)}
.ct-odak{display:grid;justify-items:center;gap:10px;text-align:center}
.ct-ring{position:relative;width:220px;height:220px}.ct-ring svg.ct-rs{width:100%;height:100%;transform:rotate(-90deg)}.ct-ring circle{fill:none;stroke-width:12}.ct-ring .bg{stroke:var(--surface-2)}.ct-ring .fg{stroke:#FF8A4C;stroke-linecap:round;transition:stroke-dashoffset .9s linear}
.ct-ring .ct-in{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:2px}.ct-ring .ct-in b{font:800 2.4rem/1 var(--f-mono)}.ct-ring .ct-in small{color:var(--muted);font-weight:700}
.ct-cw{width:84px}.ct-cw svg{width:100%;height:auto;display:block}
.ct-len{display:flex;gap:6px}.ct-len button{padding:9px 14px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:800 .9rem/1 var(--f-body);cursor:pointer}.ct-len button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.ct-fr{display:flex;align-items:center;gap:10px}.ct-fr b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct-fr small{color:var(--muted)}
.ct-wk{display:flex;align-items:flex-end;gap:6px;height:70px}.ct-wk div{flex:1;display:grid;justify-items:center;gap:3px;font-size:.66rem;color:var(--muted)}.ct-wk i{display:block;width:100%;border-radius:4px 4px 0 0;background:#FF8A4C;min-height:2px}
.ct-e{color:var(--muted);text-align:center;padding:14px 0}
@keyframes ctIn{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){.ct{animation:none}.ct-ring .fg{transition:none}}`;
function css(){if(document.getElementById("ctCss"))return;const s=document.createElement("style");s.id="ctCss";s.textContent=CSS;document.head.appendChild(s)}
/* ---------- görünümler ---------- */
function vBugun(o){const t=today(o),h=[];
 if(t){if(t.cur)h.push(`<div class="ct-card ct-now"><small>Şu an</small><b>${esc(t.cur.ad)}</b><span>${hm(t.cur.b)}'de bitiyor, ${t.cur.b-t.m} dk kaldı${t.next?" · sonra "+esc(t.next.ad):""}</span></div>`);
  else if(t.next)h.push(`<div class="ct-card ct-now"><small>Sıradaki ders</small><b>${esc(t.next.ad)}</b><span>${hm(t.next.a)} · ${t.next.a-t.m} dk sonra</span></div>`);
  h.push(`<div class="ct-card"><h3>${I("clock")}${GUN[t.wd-1]} dersleri</h3>${t.list.length?t.list.map(x=>`<div class="ct-l${t.cur===x?" on":x.b<=t.m?" past":""}" style="--c:${dc(x.ad)}"><i></i><b>${esc(x.ad)}</b><small>${hm(x.a)}-${hm(x.b)}</small></div>`).join(""):`<p class="ct-e">Bugünün programı boş. Program sekmesinden ekle.</p>`}</div>`)}
 else h.push(`<div class="ct-card ct-now"><small>Hafta sonu</small><b>Bugün okul yok</b><span>Pazartesi için ödevlerine bir bak.</span></div>`);
 const hw=o.hw.filter(x=>!x.done).sort((a,b)=>a.due<b.due?-1:1).slice(0,4);h.push(`<div class="ct-card"><h3>${I("edit")}Ödevler<span class="sp"></span><button type="button" class="lnk" data-ct-tab="hw">Tümü</button></h3>${hw.length?hw.map(hwRow).join(""):`<p class="ct-e">Bekleyen ödev yok.</p>`}</div>`);
 const ex=exList(o)[0];if(ex)h.push(`<div class="ct-card"><h3>${I("flag")}En yakın sınav</h3>${exRow(ex)}</div>`);
 h.push(friendsCard());return h.join("")}
function vProg(o){const sl=slots(o.bell),wd=new Date(now()).getDay();let h=`<div class="ct-card"><h3>${I("grid")}Haftalık program</h3><p class="muted" style="margin:0;font-size:.84rem">Boş kareye dokun, dersi seç.</p><div class="ct-grid"><span></span>${["Pzt","Sal","Çar","Per","Cum"].map((g,i)=>`<span class="hd${i+1===wd?" td":""}">${g}</span>`).join("")}`;
 sl.forEach((x,i)=>{h+=`<span class="tm">${hm(x[0])}</span>`;for(let d=1;d<=5;d++){const ad=(o.prog[d]||[])[i]||"";h+=`<button type="button" class="${ad?"f":""}" style="--c:${dc(ad)}" data-ct-cell="${d}_${i}">${esc(ad)}</button>`}});
 h+=`</div></div><div class="ct-card"><h3>${I("gear")}Ders saatleri</h3><div class="ct-form"><div class="row"><label>İlk ders<input class="in" type="time" id="ctS" value="${esc(o.bell.s)}"></label><label>Ders (dk)<input class="in" type="number" id="ctL" min="20" max="90" value="${o.bell.l}"></label></div>
 <div class="row"><label>Teneffüs (dk)<input class="in" type="number" id="ctB" min="0" max="40" value="${o.bell.b}"></label><label>Ders sayısı<input class="in" type="number" id="ctN" min="1" max="10" value="${o.bell.n}"></label></div>
 <div class="row"><label>Öğle arası şu dersten sonra<input class="in" type="number" id="ctLU" min="1" max="10" value="${o.bell.lu}"></label><label>Öğle arası (dk)<input class="in" type="number" id="ctLL" min="0" max="90" value="${o.bell.lul}"></label></div>
 <button type="button" class="btn" data-ct="bell">Saatleri kaydet</button></div></div>`;return h}
const hwRow=x=>{const d=daysTo(x.due);return`<div class="ct-hw${x.done?" done":""}" data-ct-hw="${esc(x.id)}"><button type="button" class="ck" data-ct-done="${esc(x.id)}" aria-label="Bitti">${x.done?I("check"):""}</button><span class="tx"><span class="t">${esc(x.t)}</span><small class="${!x.done&&d<0?"late":""}">${esc(x.d)} · ${d<0?Math.abs(d)+" gün gecikti":d===0?"bugün teslim":d===1?"yarın teslim":d+" gün sonra"}</small></span><button type="button" class="dl" data-ct-del="hw:${esc(x.id)}" aria-label="Sil">${I("trash")}</button></div>`};
function vHw(o){const L2=o.hw.slice().sort((a,b)=>(a.done-b.done)||(a.due<b.due?-1:1));
 return`<div class="ct-card"><h3>${I("add")}Ödev ekle</h3><div class="ct-form"><div class="ct-chips" id="ctHwD">${dersler(o).map(d=>`<button type="button" style="--c:${dc(d)}" data-ct-hwd="${esc(d)}">${esc(d)}</button>`).join("")}</div>
 <textarea class="in" id="ctHwT" rows="2" maxlength="140" placeholder="Ödev ne? Örn. 45. sayfadaki sorular"></textarea><div class="row"><input class="in" type="date" id="ctHwDue" value="${ymd(now()+864e5)}"><button type="button" class="btn" data-ct="hwadd">Ekle</button></div></div></div>
 <div class="ct-card"><h3>${I("edit")}Ödevlerin</h3>${L2.length?L2.map(hwRow).join(""):`<p class="ct-e">Henüz ödev yok.</p>`}</div>`}
function exList(o){const L2=o.ex.filter(x=>daysTo(x.at)>=0).map(x=>({...x}));try{if(typeof OKUL_LGS!=="undefined"&&OKUL_LGS>now())L2.push({id:"lgs",t:"LGS (tahmini)",at:ymd(+OKUL_LGS),fix:1})}catch(e){}return L2.sort((a,b)=>a.at<b.at?-1:1)}
const exRow=x=>{const d=daysTo(x.at);return`<div class="ct-ex" style="--c:${dc(x.t)}"><span class="n">${d===0?"Bugün":d}${d?`<small>gün</small>`:""}</span><span class="tx"><b>${esc(x.t)}</b><small>${new Date(dayOf(x.at)).toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</small></span>${x.fix?"":`<button type="button" class="dl" data-ct-del="ex:${esc(x.id)}" aria-label="Sil" style="border:0;background:none;color:var(--muted);cursor:pointer">${I("trash")}</button>`}</div>`};
function vEx(o){const L2=exList(o);return`<div class="ct-card"><h3>${I("add")}Sınav ekle</h3><div class="ct-form"><input class="in" id="ctExT" maxlength="40" placeholder="Örn. Matematik 1. yazılı"><div class="row"><input class="in" type="date" id="ctExAt" value="${ymd(now()+7*864e5)}"><button type="button" class="btn" data-ct="exadd">Ekle</button></div></div></div>
 <div class="ct-card"><h3>${I("flag")}Geri sayımlar</h3>${L2.length?L2.map(exRow).join(""):`<p class="ct-e">Yaklaşan sınav yok.</p>`}</div>`}
function friendsCard(){const L2=(typeof humans==="function"?humans():[]).filter(u=>u!==S.uid).map(u=>[u,(P(u)||{}).cal]).filter(([,c])=>c&&+c.u>Date.now());
 return`<div class="ct-card"><h3>${I("users")}Şu an ders çalışanlar</h3>${L2.length?L2.map(([u,c])=>`<div class="ct-fr">${avatar(u,30,{click:false,ring:false})}<b>${esc(P(u).name||P(u).username||"")}</b><small>${c.d?esc(c.d)+" · ":""}${Math.ceil((c.u-Date.now())/6e4)} dk</small></div>`).join(""):`<p class="ct-e" style="padding:6px 0">Şu an kimse çalışmıyor. Odak'tan başlat, arkadaşların görsün.</p>`}</div>`}
const dersler=o=>{const s=new Set();for(let d=1;d<=5;d++)for(const x of o.prog[d]||[])if(x)s.add(x);return[...s,...DERS.filter(x=>!s.has(x))].slice(0,14)};
function vOdak(o){const r=o.run&&o.run.end>now()?o.run:null,len=r?r.len:(o.lastLen||25);const C=2*Math.PI*96;
 const wk=[];for(let i=6;i>=0;i--){const k=ymd(now()-i*864e5);wk.push([new Date(dayOf(k)).toLocaleDateString("tr-TR",{weekday:"short"}),o.foc.log[k]||0])}const mx=Math.max(25,...wk.map(x=>x[1]));const tot=wk.reduce((a,x)=>a+x[1],0);
 return`<div class="ct-card ct-odak"><div class="ct-cw">${typeof cwSvg==="function"?cwSvg(r?{prop:"book",eyes:"down"}:{eyes:"happy",arms:"up"}):""}</div>
 <div class="ct-ring"><svg class="ct-rs" viewBox="0 0 220 220"><circle class="bg" cx="110" cy="110" r="96"/><circle class="fg" id="ctRing" cx="110" cy="110" r="96" stroke-dasharray="${C}" stroke-dashoffset="${r?C*(1-(r.end-now())/(r.len*6e4)):0}"/></svg><div class="ct-in"><b id="ctTm">${r?tfmt(r.end-now()):hm(len).replace(/^00:/,"")+":00"}</b><small>${r?esc(r.d||"Odak"):"hazır"}</small></div></div>
 ${r?`<button type="button" class="btn sec" data-ct="stop">Bitir</button>`:`<div class="ct-len">${[15,25,45].map(n=>`<button type="button" class="${n===len?"on":""}" data-ct-len="${n}">${n} dk</button>`).join("")}</div><div class="ct-chips">${dersler(o).slice(0,8).map(d=>`<button type="button" class="${o.lastD===d?"":"x"}" style="--c:${dc(d)}" data-ct-od="${esc(d)}">${esc(d)}</button>`).join("")}</div><button type="button" class="btn" data-ct="go">${I("play")}Başlat</button>`}
 <p class="muted" style="margin:0;font-size:.84rem">Clawd seninle çalışır. Başlatınca arkadaşların "şu an ders çalışıyor" diye görür.</p></div>
 <div class="ct-card"><h3>${I("trophy")}Bu hafta ${Math.floor(tot/60)?Math.floor(tot/60)+" sa ":""}${tot%60} dk<span class="sp"></span><small class="muted">${o.foc.n} oturum</small></h3><div class="ct-wk">${wk.map(([g,m])=>`<div><i style="height:${Math.max(2,m/mx*52)}px"></i>${esc(g)}</div>`).join("")}</div></div>${friendsCard()}`}
const tfmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
function paint(){if(!L)return;const o=st();const b=L.querySelector("#ctB2");if(!b)return;b.innerHTML=tab==="prog"?vProg(o):tab==="hw"?vHw(o):tab==="ex"?vEx(o):tab==="odak"?vOdak(o):vBugun(o);
 for(const x of L.querySelectorAll("[data-ct-tab]"))if(x.closest(".ct-tabs"))x.classList.toggle("on",x.dataset.ctTab===tab)}
function tick(){const o=st();const r=o.run;if(r&&r.end<=now()&&!r.fin){finish(o,true);return}if(!L)return;if(tab==="odak"&&r&&r.end>now()){const t=L.querySelector("#ctTm"),g=L.querySelector("#ctRing");if(t)t.textContent=tfmt(r.end-now());if(g)g.style.strokeDashoffset=2*Math.PI*96*(1-(r.end-now())/(r.len*6e4))}
 if(tab==="bugun"&&Date.now()%60000<1000)paint()}
function calSet(v){if(!S.uid||S.guest)return;write(()=>DB.update("profiles/"+S.uid,{cal:v}),{quiet:true})}
function start(){const o=st();const len=o.lastLen||25,d=o.lastD||"";o.run={end:now()+len*6e4,len,d,t0:now()};save(o);calSet({u:o.run.end,d});vib(10);paint()}
function finish(o,done){const r=o.run;if(!r)return;const mins=done?r.len:Math.floor((now()-r.t0)/6e4);if(mins>0){const k=ymd(now());o.foc.log[k]=(o.foc.log[k]||0)+mins;const keys=Object.keys(o.foc.log).sort();while(keys.length>40)delete o.foc.log[keys.shift()]}
 if(done)o.foc.n++;o.run=null;save(o);calSet({u:0,d:""});
 if(done){try{const ac=new (window.AudioContext||window.webkitAudioContext)();[660,880,990].forEach((f,i)=>{const os=ac.createOscillator(),g=ac.createGain();os.frequency.value=f;g.gain.setValueAtTime(.06,ac.currentTime+i*.18);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+i*.18+.3);os.connect(g).connect(ac.destination);os.start(ac.currentTime+i*.18);os.stop(ac.currentTime+i*.18+.32)})}catch(e){}
  vib&&vib([80,60,80]);if(document.hidden&&typeof sysNote==="function")try{sysNote("Odak bitti","Harika! "+r.len+" dakika çalıştın. Biraz mola ver.","ct-odak")}catch(e){}
  toast("Odak bitti! "+r.len+" dk çalıştın, mola zamanı.");if(!kbReduce()&&typeof gunConfetti==="function"&&L)gunConfetti(false);try{achCheck(true)}catch(e){}}paint()}
function open(t){css();tab=t||"bugun";if(L&&L.isConnected){paint();return}
 L=openLayer("canta",`<div class="ct" role="dialog" aria-label="Okul Çantası"><div class="ct-h"><button type="button" data-ct="x" aria-label="Geri">${I("back")}</button><h1>Okul Çantası</h1></div><div class="ct-tabs">${TAB.map(([k,n])=>`<button type="button" data-ct-tab="${k}">${n}</button>`).join("")}</div><div class="ct-b" id="ctB2"></div></div>`,{noScrim:true,onClose:()=>{L=null}});
 L.addEventListener("click",onClick);paint()}
function cellSheet(d,i){const o=st();const cur=(o.prog[d]||[])[i]||"";
 const l=sheet("ctcell",GUN[d-1]+" · "+(i+1)+". ders",`<div class="ct-form" style="padding:4px 16px 18px"><div class="ct-chips">${DERS.map(x=>`<button type="button" style="--c:${dc(x)}" data-ct-pick="${esc(x)}">${esc(x)}</button>`).join("")}</div>
 <div class="row" style="display:flex;gap:8px"><input class="in" id="ctOwn" maxlength="24" placeholder="Başka bir ders adı" value="${esc(DERS.includes(cur)?"":cur)}" style="flex:1"><button type="button" class="btn" data-ct-pick="__own">Koy</button></div>${cur?`<button type="button" class="btn sec" data-ct-pick="">Boşalt</button>`:""}</div>`);
 l.addEventListener("click",e=>{const b=e.target.closest("[data-ct-pick]");if(!b)return;let v=b.dataset.ctPick;if(v==="__own")v=String(l.querySelector("#ctOwn").value||"").trim().slice(0,24);if(b.dataset.ctPick==="__own"&&!v)return;
  v=typeof cleanText==="function"?cleanText(v):v;const o2=st();const a=o2.prog[d]=(o2.prog[d]||[]).slice();while(a.length<=i)a.push("");a[i]=v;save(o2);closeLayer("ctcell");paint()})}
function onClick(e){const t=e.target;if(t.closest('[data-ct="x"]'))return closeLayer("canta");
 const tb=t.closest("[data-ct-tab]");if(tb){tab=tb.dataset.ctTab;return paint()}
 const c=t.closest("[data-ct-cell]");if(c){const [d,i]=c.dataset.ctCell.split("_").map(Number);return cellSheet(d,i)}
 const a=t.closest("[data-ct]");const o=st();
 if(a&&a.dataset.ct==="bell"){const v=id=>L.querySelector(id).value;const n=(x,lo,hi,df)=>{x=parseInt(x,10);return isFinite(x)?Math.max(lo,Math.min(hi,x)):df};
  o.bell={s:/^\d\d:\d\d$/.test(v("#ctS"))?v("#ctS"):"08:30",l:n(v("#ctL"),20,90,40),b:n(v("#ctB"),0,40,10),n:n(v("#ctN"),1,10,8),lu:n(v("#ctLU"),1,10,4),lul:n(v("#ctLL"),0,90,40)};save(o);toast("Ders saatleri kaydedildi");return paint()}
 const hd=t.closest("[data-ct-hwd]");if(hd){for(const b of L.querySelectorAll("[data-ct-hwd]"))b.classList.toggle("x",b!==hd);L._hwd=hd.dataset.ctHwd;return}
 if(a&&a.dataset.ct==="hwadd"){const tx=String(L.querySelector("#ctHwT").value||"").trim().slice(0,140),due=L.querySelector("#ctHwDue").value;if(!tx)return toast("Ödevi yaz.");if(!/^\d{4}-\d\d-\d\d$/.test(due))return toast("Teslim tarihini seç.");
  o.hw.push({id:Math.random().toString(36).slice(2,9),d:L._hwd||"Ödev",t:typeof cleanText==="function"?cleanText(tx):tx,due,done:0});if(o.hw.length>80)o.hw=o.hw.filter(x=>!x.done).slice(-80);save(o);L._hwd="";toast("Ödev eklendi");return paint()}
 const dn=t.closest("[data-ct-done]");if(dn){const x=o.hw.find(y=>y.id===dn.dataset.ctDone);if(x){x.done=x.done?0:1;save(o);if(x.done){vib(15);if(o.hw.every(y=>y.done)&&!kbReduce()&&typeof gunConfetti==="function")gunConfetti(false)}}return paint()}
 const dl=t.closest("[data-ct-del]");if(dl){const [k,id]=dl.dataset.ctDel.split(":");o[k]=o[k].filter(y=>y.id!==id);save(o);return paint()}
 if(a&&a.dataset.ct==="exadd"){const tx=String(L.querySelector("#ctExT").value||"").trim().slice(0,40),at=L.querySelector("#ctExAt").value;if(!tx)return toast("Sınavın adını yaz.");if(!/^\d{4}-\d\d-\d\d$/.test(at)||daysTo(at)<0)return toast("İleri bir tarih seç.");
  o.ex.push({id:Math.random().toString(36).slice(2,9),t:typeof cleanText==="function"?cleanText(tx):tx,at});o.ex=o.ex.filter(x=>daysTo(x.at)>=-1).slice(-40);save(o);toast("Sınav eklendi");return paint()}
 const ln=t.closest("[data-ct-len]");if(ln){o.lastLen=+ln.dataset.ctLen;save(o);return paint()}
 const od=t.closest("[data-ct-od]");if(od){o.lastD=o.lastD===od.dataset.ctOd?"":od.dataset.ctOd;save(o);return paint()}
 if(a&&a.dataset.ct==="go")return start();
 if(a&&a.dataset.ct==="stop")return dialog("Odak bitirilsin mi?","Şimdiye kadar çalıştığın süre kaydedilir.",[{label:"Devam et",cls:"sec"},{label:"Bitir",cls:"danger",fn:()=>finish(st(),false)}])}
iv=setInterval(tick,1000);
window.CANTA={open,state:st,today:()=>today(st()),_t:{TT,slots,daysTo,ymd,finish:()=>finish(st(),true),set:o=>Object.assign(TT,o)}};
})();
