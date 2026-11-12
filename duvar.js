/* Kadraj 7.2.10 Piksel Duvarı: herkesin aynı 40x40 tuvale piksel koyduğu ortak çizim (her pazartesi 00:00 TR yeni duvar, haftalık meydan okumayla
   aynı hafta numarası: hmNow().w). app.js bölge 7130 ilk kullanımda yükler (pdLoad/pdGo). Kadraj'ın genel adlarını kullanır.
   Veri games/pd-<hafta> = {pd:1, w, p:{"x_y":"<renk>|<uid>"}} (games kuralı girişli herkese açık; kural değişikliği yok).
   Tek piksel tek alan güncellemesi (FirebaseDB.update iç içe nesneyi alan yoluna çevirir, çakışma yok). Belge yoksa açılışta boş kurulur.
   Canlı dinleyici yalnızca duvar açıkken (DB.watchDoc), kapanınca kapanır. Bekleme: piksel başına 12 sn (cihazda, kadraj_pd_t).
   Dokun = imleç, "Koy" = seçili rengi koy (yanlış dokunuşla boyama olmasın); basılı tut = o pikseli kim koydu. 2x yakınlaştırma.
   Geçen haftanın duvarı bir kez okunur (DB.get), resim olarak kaydedilir. Başarım sayacı kadraj_pdn_<uid>. Testler için window.DUVAR._t. */
(()=>{"use strict";
if(window.DUVAR)return;
const N=40,CD=12000,PAL=["#FFFFFF","#C9CED6","#6B7280","#111827","#E11D48","#FF8A4C","#FACC15","#16A34A","#84CC16","#14B8A6","#0EA5E9","#4F46E5","#9333EA","#EC4899","#92400E","#FCD9B8"];
let L=null,D=null,un=null,cur={x:20,y:20},col=4,zoom=1,tick=0,CDT=CD;
const wk=()=>{try{return hmNow().w}catch(e){return Math.floor((Date.now()-(Date.UTC(2026,0,5)-108e5))/6048e5)}};
const path=w=>"games/pd-"+w,lastK=()=>"kadraj_pd_t_"+(S.uid||"x"),cntK=()=>"kadraj_pdn_"+(S.uid||"x");
const cell=(d,x,y)=>{const v=d&&d.p&&d.p[x+"_"+y];if(typeof v!=="string")return null;const i=v.indexOf("|"),c=+v.slice(0,i);return c>=0&&c<PAL.length?{c,u:v.slice(i+1)}:null};
const CSS=`.pd{position:absolute;inset:0;margin:0 auto;max-width:600px;background:var(--bg);color:var(--fg);pointer-events:auto;display:flex;flex-direction:column;animation:pdIn .3s ease both}
.pd-h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 6px}
.pd-h button{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.pd-h h1{flex:1;margin:0;font:800 1.15rem/1.2 var(--f-body)}.pd-h small{color:var(--muted);font:600 .8rem/1 var(--f-body)}
.pd-b{flex:1;overflow:auto;padding:0 14px calc(14px + env(safe-area-inset-bottom));display:grid;gap:12px;align-content:start}
.pd-wrap{position:relative;width:100%;aspect-ratio:1;overflow:auto;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line);touch-action:pan-x pan-y}
.pd-in{position:relative;width:100%;aspect-ratio:1;background:#fff;background-image:linear-gradient(to right,rgba(17,24,39,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(17,24,39,.07) 1px,transparent 1px);background-size:calc(100% / 40) calc(100% / 40)}.pd.z2 .pd-in{width:200%}
.pd-in canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;cursor:crosshair}
.pd-cur{position:absolute;box-shadow:0 0 0 2px #111827,0 0 0 4px #fff;pointer-events:none;transition:left .08s,top .08s}
.pd-pal{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.pd-pal button{aspect-ratio:1;border-radius:10px;border:1px solid var(--line);cursor:pointer;padding:0}
.pd-pal button.on{outline:3px solid var(--accent);outline-offset:2px}
.pd-row{display:flex;gap:8px;align-items:center}
.pd-go{flex:1;position:relative;overflow:hidden;min-height:50px;border:0;border-radius:14px;background:var(--accent);color:#fff;font:800 1rem/1 var(--f-body);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
.pd-go i{width:22px;height:22px;border-radius:6px;border:2px solid rgba(255,255,255,.8);flex:none}
.pd-go[disabled]{opacity:.85;cursor:default}.pd-go .pd-cd{position:absolute;left:0;top:0;bottom:0;background:rgba(255,255,255,.18);transform-origin:left;pointer-events:none}
.pd-sb{width:50px;height:50px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--fg);display:grid;place-items:center;cursor:pointer;font:800 .9rem/1 var(--f-body)}
.pd-st{display:flex;gap:10px;flex-wrap:wrap;color:var(--muted);font-size:.86rem}.pd-st b{color:var(--fg)}
.pd-top{display:grid;gap:6px}.pd-top h3{margin:0;font:800 .95rem/1.2 var(--f-body)}
.pd-t{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--surface-2)}.pd-t b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pd-t span{font:800 .9rem/1 var(--f-mono);color:var(--accent)}
.pd-who{min-height:20px;font-size:.85rem;color:var(--muted);text-align:center}
.pd-old{display:grid;gap:10px;justify-items:center;padding:4px 16px 18px}.pd-old canvas{width:min(320px,100%);aspect-ratio:1;image-rendering:pixelated;border-radius:12px;box-shadow:0 0 0 1px var(--line)}
@keyframes pdIn{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){.pd{animation:none}.pd-cur{transition:none}}`;
function css(){if(document.getElementById("pdCss"))return;const s=document.createElement("style");s.id="pdCss";s.textContent=CSS;document.head.appendChild(s)}
function paint(cv,d,scale){const x=cv.getContext("2d");const k=scale||1;if(scale){x.fillStyle="#FFFFFF";x.fillRect(0,0,N*k,N*k)}else x.clearRect(0,0,N,N);if(!d||!d.p)return;
 for(const key in d.p){const m=/^(\d+)_(\d+)$/.exec(key);if(!m)continue;const X=+m[1],Y=+m[2];if(X>=N||Y>=N)continue;const c=cell(d,X,Y);if(!c)continue;x.fillStyle=PAL[c.c];x.fillRect(X*k,Y*k,k,k)}}
function stats(d){const by={};let n=0;if(d&&d.p)for(const k in d.p){const v=d.p[k];if(typeof v!=="string")continue;const u=v.slice(v.indexOf("|")+1);by[u]=(by[u]||0)+1;n++}return{n,by}}
function curPaint(){const c=L&&L.querySelector(".pd-cur");if(!c)return;c.style.left=(cur.x/N*100)+"%";c.style.top=(cur.y/N*100)+"%";c.style.width=c.style.height=(100/N)+"%"}
function info(){if(!L)return;const s=stats(D),me=S.uid,mine=s.by[me]||0;const st=L.querySelector("#pdSt");if(st)st.innerHTML=`<span><b>${s.n}</b> / ${N*N} piksel dolu</span><span>Bu hafta sen <b>${mine}</b></span><span>Pazartesi yeni duvar</span>`;
 const top=Object.entries(s.by).filter(([u])=>P(u)).sort((a,b)=>b[1]-a[1]).slice(0,5);const t=L.querySelector("#pdTop");if(t)t.innerHTML=top.length?`<h3>Bu haftanın ressamları</h3>${top.map(([u,n])=>`<div class="pd-t">${avatar(u,28,{click:false,ring:false})}<b>${esc(P(u).name||P(u).username||"")}</b><span>${n}</span></div>`).join("")}`:`<p class="pd-who">Duvar boş. İlk pikseli sen koy!</p>`}
function goBtn(){const b=L&&L.querySelector("#pdGo");if(!b)return;const left=CDT-(Date.now()-(+LS.get(lastK(),0)||0));b.querySelector("i").style.background=PAL[col];
 const f=b.querySelector(".pd-cd");if(left>0){b.disabled=true;b.querySelector("span:last-child").textContent=Math.ceil(left/1000)+" sn";f.style.transform=`scaleX(${left/CDT})`}else{b.disabled=false;b.querySelector("span:last-child").textContent="Koy";f.style.transform="scaleX(0)"}}
function draw(){const cv=L&&L.querySelector("#pdC");if(cv)paint(cv,D);info()}
function open(){css();if(L&&L.isConnected)return;const w=wk();cur={x:20,y:20};
 L=openLayer("duvar",`<div class="pd" role="dialog" aria-label="Piksel Duvarı"><div class="pd-h"><button type="button" data-pd="x" aria-label="Geri">${I("back")}</button><h1>Piksel Duvarı</h1><small>Hafta ${w}</small></div>
 <div class="pd-b"><div class="pd-wrap" id="pdW"><div class="pd-in"><canvas id="pdC" width="${N}" height="${N}"></canvas><div class="pd-cur"></div></div></div>
 <div class="pd-who" id="pdWho">Bir kareye dokun, rengini seç, Koy'a bas.</div>
 <div class="pd-pal" id="pdPal">${PAL.map((c,i)=>`<button type="button" data-pdc="${i}" style="background:${c}" aria-label="Renk ${i+1}"${i===col?' class="on"':""}></button>`).join("")}</div>
 <div class="pd-row"><button type="button" class="pd-go" id="pdGo"><span class="pd-cd"></span><i></i><span>Koy</span></button><button type="button" class="pd-sb" data-pd="z" aria-label="Yakınlaştır">2x</button><button type="button" class="pd-sb" data-pd="old" aria-label="Geçen hafta">${I("clock")||I("prev")}</button></div>
 <div class="pd-st" id="pdSt"></div><div class="pd-top" id="pdTop"></div></div></div>`,{noScrim:true,onClose:()=>{try{un&&un()}catch(e){}un=null;clearInterval(tick);L=null;D=null}});
 L.addEventListener("click",onClick);const cv=L.querySelector("#pdC");let lp=0;
 const at=e=>{const r=cv.getBoundingClientRect();return{x:Math.max(0,Math.min(N-1,Math.floor((e.clientX-r.left)/r.width*N))),y:Math.max(0,Math.min(N-1,Math.floor((e.clientY-r.top)/r.height*N)))}};
 cv.addEventListener("pointerdown",e=>{const p=at(e);clearTimeout(lp);lp=setTimeout(()=>{const c=cell(D,p.x,p.y);const who=L&&L.querySelector("#pdWho");if(who)who.textContent=c?((P(c.u)||{}).name||"Biri")+" koydu":"Bu kare boş"},450)});
 cv.addEventListener("pointerup",e=>{clearTimeout(lp);cur=at(e);curPaint()});cv.addEventListener("pointercancel",()=>clearTimeout(lp));
 curPaint();goBtn();tick=setInterval(goBtn,500);draw();
 un=DB.watchDoc(path(w),d=>{if(!L)return;if(!d){D={pd:1,w,p:{}};draw();write(()=>DB.set(path(w),{pd:1,w,p:{}}),{quiet:true});return}D=d;draw()})}
function onClick(e){const t=e.target;if(t.closest('[data-pd="x"]'))return closeLayer("duvar");
 const c=t.closest("[data-pdc]");if(c){col=+c.dataset.pdc;for(const b of L.querySelectorAll("[data-pdc]"))b.classList.toggle("on",b===c);goBtn();return}
 if(t.closest('[data-pd="z"]')){zoom=zoom===1?2:1;L.querySelector(".pd").classList.toggle("z2",zoom===2);t.closest("button").textContent=zoom===2?"1x":"2x";
  if(zoom===2){const w=L.querySelector("#pdW");requestAnimationFrame(()=>{w.scrollLeft=cur.x/N*w.scrollWidth-w.clientWidth/2;w.scrollTop=cur.y/N*w.scrollHeight-w.clientHeight/2})}return}
 if(t.closest('[data-pd="old"]'))return old();if(t.closest("#pdGo"))return place()}
async function place(){if(!L||!D||!guard())return;const last=+LS.get(lastK(),0)||0;if(Date.now()-last<CDT)return;const k=cur.x+"_"+cur.y,v=col+"|"+S.uid,w=wk();
 const prev=D.p&&D.p[k];if(prev===v)return toast("Bu kare zaten bu renk.");
 LS.set(lastK(),Date.now());D.p=Object.assign({},D.p,{[k]:v});draw();goBtn();vib(8);
 let ok=await write(()=>DB.update(path(w),{p:{[k]:v}}),{quiet:true});if(!ok)ok=await write(()=>DB.set(path(w),{pd:1,w,p:Object.assign({},D.p)}));
 if(ok){LS.set(cntK(),(+LS.get(cntK(),0)||0)+1);try{achCheck()}catch(e){}}else{LS.set(lastK(),0);goBtn()}}
async function old(){const w=wk()-1;let d=null;try{d=await DB.get(path(w))}catch(e){}
 const l=sheet("duvareski","Geçen haftanın duvarı",`<div class="pd-old">${d&&d.p&&Object.keys(d.p).length?`<canvas id="pdO" width="${N*8}" height="${N*8}"></canvas><p class="muted">${stats(d).n} piksel, ${Object.keys(stats(d).by).length} ressam</p><button type="button" class="btn" id="pdSave">${I("dl708")||I("image")}Resmi kaydet</button>`:`<p class="muted" style="padding:24px 0">Geçen hafta duvar boş kaldı.</p>`}</div>`);
 const cv=l.querySelector("#pdO");if(!cv)return;const x=cv.getContext("2d");x.imageSmoothingEnabled=false;paint(cv,d,8);
 l.querySelector("#pdSave").onclick=()=>{cv.toBlob(b=>{if(!b)return;const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="kadraj-piksel-duvari-"+w+".png";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)},"image/png")}}
window.DUVAR={open,_t:{N,PAL,cell,stats,D:()=>D,cur:(x,y)=>{cur={x,y};curPaint()},set:o=>{if(o.CD!=null)CDT=o.CD}}};
})();
