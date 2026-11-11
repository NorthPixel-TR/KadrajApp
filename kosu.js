/* Kadraj 7.2.4 Clawd Koşu: Clawd koşar, sen zıplatırsın (dokun / boşluk / yukarı ok; basılı tutunca daha yükseğe). Engeller kamera, kitap yığını,
   trafik konisi ve film makarası; havadaki turuncu pikseller +25 puan. Hız puanla artar, 700 puanda bir gündüz ↔ gece.
   app.js bölge 7124 ilk kullanımda yükler (kuLoad/kuGo). Sprite app.js'teki cwPaint (bölge 50PIKO) ile tuvale çizilir.
   Kare döngüsü (requestAnimationFrame) yalnızca oyun sürerken; duraklayınca, sekme gizlenince ya da pencere kapanınca durur.
   Rekor cihazda (kadraj_kosu_<uid> {best,games}) ve yeni rekorda profiles.kosu = puan (tek alan, oyun başına en çok bir yazma; kural değişikliği yok).
   Arkadaş tablosu zaten yüklü profillerden (S.profiles), ek okuma yok. Testler için window.KOSU._t. */
(()=>{"use strict";
if(window.KOSU)return;
const VW=240,VH=160,GY=134,CX=30;
let L=null,G=null,raf=0,AC=null;
const stK=()=>"kadraj_kosu_"+(S.uid||"x"),stat=()=>LS.get(stK(),{})||{};
const CSS=`.ku{position:absolute;inset:0;margin:0 auto;max-width:620px;background:#0F0D1F;color:#F4F3FF;pointer-events:auto;display:flex;flex-direction:column;font-family:var(--f-body);animation:kuIn .3s ease both}
.ku-h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 6px}
.ku-h button{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.ku-h h1{flex:1;margin:0;font:800 1.15rem/1.2 var(--f-body)}.ku-h .ku-hs{font:700 .85rem/1 var(--f-mono);color:#FF8A4C}
.ku-cv{position:relative;width:100%;aspect-ratio:${VW}/${VH};background:#000;touch-action:none;-webkit-user-select:none;user-select:none;cursor:pointer}
.ku-cv canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges}
.ku-ov{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:8px;text-align:center;background:rgba(10,8,30,.55);font:700 1rem/1.3 var(--f-body);padding:12px}
.ku-ov b{font:800 1.6rem/1.1 var(--f-body)}.ku-ov small{opacity:.8}
.ku-ov .ku-btn{margin-top:6px}
.ku-btn{min-height:44px;padding:0 20px;border:0;border-radius:14px;background:#FF8A4C;color:#1F1A14;font:800 1rem/1 var(--f-body);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.ku-b{flex:1;overflow:auto;padding:12px 14px calc(14px + env(safe-area-inset-bottom));display:grid;gap:10px;align-content:start}
.ku-tb h3{margin:0 0 6px;font:800 1rem/1.2 var(--f-body)}
.ku-r{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.06)}
.ku-r .k{width:22px;font:800 .85rem/1 var(--f-mono);opacity:.6}.ku-r b{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ku-r .n{font:800 .95rem/1 var(--f-mono);color:#FF8A4C}
.ku-r.me{outline:2px solid #FF8A4C}
.ku-tip{opacity:.7;font-size:.85rem;text-align:center}
@keyframes kuIn{from{opacity:0}}
@media (prefers-reduced-motion:reduce){.ku{animation:none}}`;
function css(){if(document.getElementById("kuCss"))return;const s=document.createElement("style");s.id="kuCss";s.textContent=CSS;document.head.appendChild(s)}
/* ---------- sprite ---------- */
const SPR={};
function spr(k,sp){if(SPR[k])return SPR[k];const c=document.createElement("canvas");c.width=CW_GW;c.height=CW_GH;const x=c.getContext("2d");let g=null;try{g=cwPaint(sp)}catch(e){}
 if(g)for(let y=0;y<CW_GH;y++)for(let i=0;i<CW_GW;i++){const v=g[y][i];if(v){x.fillStyle=CW_COL[v];x.fillRect(i,y,1,1)}}else{x.fillStyle="#D97757";x.fillRect(4,3,16,12)}
 return SPR[k]=c}
const OB=[ /* [ad, genişlik, yükseklik, çizim] */
 ["kamera",16,12,(x,X,Y)=>{x.fillStyle="#1F2937";x.fillRect(X,Y+3,16,9);x.fillRect(X+3,Y,6,3);x.fillStyle="#9CA3AF";x.fillRect(X+5,Y+5,6,5);x.fillStyle="#111827";x.fillRect(X+7,Y+6,2,3);x.fillStyle="#FF8A4C";x.fillRect(X+13,Y+4,2,2)}],
 ["kitap",12,19,(x,X,Y)=>{const c=["#2563EB","#E11D48","#16A34A","#F59E0B"];for(let i=0;i<4;i++){x.fillStyle=c[i];x.fillRect(X+(i%2),Y+i*5,11,4);x.fillStyle="#F8FAFC";x.fillRect(X+(i%2)+1,Y+i*5+1,1,2)}}],
 ["koni",11,16,(x,X,Y)=>{for(let j=0;j<14;j++){const w=Math.max(2,Math.round(j*0.75));x.fillStyle=(j>4&&j<8)?"#F8FAFC":"#F97316";x.fillRect(X+5-Math.floor(w/2),Y+j,w,1)}x.fillStyle="#C2410C";x.fillRect(X,Y+14,11,2)}],
 ["makara",15,15,(x,X,Y)=>{x.fillStyle="#334155";x.fillRect(X+2,Y,11,15);x.fillRect(X,Y+2,15,11);x.fillStyle="#0F172A";for(const[a,b]of[[4,3],[9,3],[4,9],[9,9]])x.fillRect(X+a,Y+b,3,3);x.fillStyle="#94A3B8";x.fillRect(X+6,Y+6,3,3)}],
 ["ikili",30,12,(x,X,Y)=>{OB[0][3](x,X,Y);OB[0][3](x,X+14,Y)}]];
/* ---------- ses ---------- */
function snd(f,d,type,v){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type||"square";o.frequency.setValueAtTime(f,t);if(Array.isArray(d)){o.frequency.linearRampToValueAtTime(d[1],t+d[0]);d=d[0]}g.gain.setValueAtTime(v||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const S_JUMP=()=>snd(420,[.12,760],"square",.04),S_COIN=()=>{snd(988,.07,"square",.04);setTimeout(()=>snd(1319,.1,"square",.04),70)},S_HIT=()=>snd(220,[.35,70],"sawtooth",.06),S_DAY=()=>snd(660,[.25,990],"triangle",.05);
/* ---------- oyun ---------- */
function newGame(){return{st:"ready",t:0,y:GY,vy:0,hold:0,ground:true,sp:3.2,dist:0,coins:0,score:0,obs:[],gems:[],next:200,nextG:120,night:false,bg:0,clouds:[[30,30],[120,18],[200,40]],stars:Array.from({length:30},()=>[Math.random()*VW,Math.random()*90]),hit:0,lastDay:0,fx:[]}}
function jumpStart(){if(!G)return;if(G.st==="ready"||G.st==="over"){if(G.st==="over"&&performance.now()-G.endAt<500)return;G=newGame();G.st="run";ovPaint();loop0();return}if(G.st==="paused"){G.st="run";ovPaint();loop0();return}
 if(G.st!=="run")return;if(G.ground){G.vy=-7.6;G.ground=false;G.hold=1;S_JUMP()}}
function jumpEnd(){if(G)G.hold=0}
function step(dt){const g=G;g.t+=dt;
 g.vy+=(g.hold&&g.vy<0&&g.t-g.jt<14?.32:.62)*dt;if(g.ground)g.jt=g.t;g.y+=g.vy*dt;if(g.y>=GY){g.y=GY;g.vy=0;g.ground=true}
 g.sp=Math.min(7.6,3.2+g.score/650);const mv=g.sp*dt;g.dist+=mv;g.score=Math.floor(g.dist/6)+g.coins*25;g.bg+=mv;
 const day=Math.floor(g.score/700);if(day!==g.lastDay){g.lastDay=day;g.night=day%2===1;S_DAY()}
 for(const o of g.obs)o.x-=mv;g.obs=g.obs.filter(o=>o.x>-40);for(const m of g.gems)m.x-=mv;g.gems=g.gems.filter(m=>m.x>-10&&!m.got);
 g.next-=mv;if(g.next<=0){const k=g.score<150?Math.floor(Math.random()*4):Math.floor(Math.random()*5);const o=OB[k];g.obs.push({k,x:VW+10,w:o[1],h:o[2]});g.next=150+Math.random()*130+g.sp*14+(k===4?40:0)}
 g.nextG-=mv;if(g.nextG<=0){const y=GY-40-Math.random()*28;for(let i=0;i<(Math.random()<.4?3:1);i++)g.gems.push({x:VW+10+i*14,y,got:false});g.nextG=180+Math.random()*220}
 for(const c of g.clouds){c[0]-=mv*.2;if(c[0]<-40){c[0]=VW+Math.random()*60;c[1]=10+Math.random()*40}}
 const px=CX+4,py=g.y-14,pw=14,ph=12;
 for(const m of g.gems)if(!m.got&&m.x<px+pw&&m.x+6>px&&m.y<py+ph&&m.y+6>py){m.got=true;g.coins++;S_COIN();g.fx.push({x:m.x,y:m.y,t:0})}
 for(const o of g.obs){const ox=o.x+2,oy=GY-o.h+2,ow=o.w-4,oh=o.h-2;if(px<ox+ow&&px+pw>ox&&py<oy+oh&&py+ph>oy){return over()}}
 g.fx=g.fx.filter(f=>(f.t+=dt)<30)}
function over(){const g=G;g.st="over";g.endAt=performance.now();S_HIT();vib&&vib(60);const o=stat();o.games=(o.games||0)+1;const rec=g.score>(o.best||0);if(rec)o.best=g.score;LS.set(stK(),o);g.rec=rec;
 if(rec&&S.uid&&!S.guest){const cur=+((P(S.uid)||{}).kosu||0);if(g.score>cur)write(()=>DB.update("profiles/"+S.uid,{kosu:g.score}),{quiet:true}).then(()=>tbPaint())}
 draw();ovPaint();tbPaint();hsPaint()}
function loop0(){if(raf)return;let last=performance.now();const f=now=>{raf=0;if(!G||G.st!=="run"||!L||!L.isConnected)return;if(document.hidden){G.st="paused";ovPaint();return}
  const dt=Math.min(3,(now-last)/16.67);last=now;step(dt);draw();if(G.st==="run")raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)}
/* ---------- çizim ---------- */
function draw(){const c=L&&L.querySelector("#kuC");if(!c||!G)return;const x=c.getContext("2d"),g=G;x.imageSmoothingEnabled=false;
 const sky=g.night?["#0B1238","#1D2E72"]:["#7CC8FF","#D7F0FF"];const gr=x.createLinearGradient(0,0,0,GY);gr.addColorStop(0,sky[0]);gr.addColorStop(1,sky[1]);x.fillStyle=gr;x.fillRect(0,0,VW,VH);
 if(g.night){x.fillStyle="#FFFFFF";for(const s of g.stars){const sx=((s[0]-g.bg*.05)%VW+VW)%VW;x.fillRect(Math.floor(sx),Math.floor(s[1]),1,1)}x.fillStyle="#FFF3C4";x.fillRect(VW-92,18,10,10);x.fillStyle=sky[0];x.fillRect(VW-88,16,8,8)}
 else{x.fillStyle="#FFE08A";x.fillRect(VW-94,16,12,12);x.fillStyle="#FFFFFF";for(const[cx,cy]of g.clouds){x.fillRect(Math.floor(cx),cy,26,5);x.fillRect(Math.floor(cx)+5,cy-3,14,3)}}
 /* uzak dağlar (Erciyes) */
 const off=(g.bg*.25)%VW;x.fillStyle=g.night?"#18204A":"#8FB3D9";for(let i=-1;i<3;i++){const bx=Math.floor(i*VW-off);for(let k=0;k<VW;k+=2){const h=34-Math.abs(((k+40)%160)-80)*.42;x.fillRect(bx+k,GY-h,2,h)}}
 x.fillStyle=g.night?"#F4F1FF":"#FFFFFF";for(let i=-1;i<3;i++){const bx=Math.floor(i*VW-off);for(let k=0;k<VW;k+=2){const h=34-Math.abs(((k+40)%160)-80)*.42;if(h>27)x.fillRect(bx+k,GY-h,2,h-27)}}
 /* yer */
 x.fillStyle=g.night?"#2A2350":"#6B4F3A";x.fillRect(0,GY,VW,VH-GY);x.fillStyle=g.night?"#3B3270":"#4DAA4F";x.fillRect(0,GY,VW,4);
 x.fillStyle=g.night?"#211B40":"#5A402E";const go=Math.floor(g.bg)%12;for(let i=-go;i<VW;i+=12)x.fillRect(i,GY+9,4,2);
 /* engeller ve pikseller */
 for(const o of g.obs){const d=OB[o.k];d[3](x,Math.floor(o.x),GY-d[2])}
 for(const m of g.gems){if(m.got)continue;const bob=Math.round(Math.sin((g.t+m.x)/9)*2);x.fillStyle="#C2410C";x.fillRect(Math.floor(m.x),m.y+bob+1,6,6);x.fillStyle="#FF8A4C";x.fillRect(Math.floor(m.x),m.y+bob,6,6);x.fillStyle="#FFD2B8";x.fillRect(Math.floor(m.x)+1,m.y+bob+1,2,2)}
 for(const f of g.fx){x.fillStyle="rgba(255,138,76,"+(1-f.t/30)+")";x.font="bold 8px monospace";x.fillText("+25",Math.floor(f.x),Math.floor(f.y-f.t*.6))}
 /* Clawd */
 const k=g.st==="over"?"x":!g.ground?"j":(Math.floor(g.t/5)%2?"a":"b");
 const im=k==="x"?spr("x",{eyes:"x",legs:"spread",arms:"down"}):k==="j"?spr("j",{eyes:"happy",arms:"up",legs:"tuck"}):k==="a"?spr("a",{legs:"w1"}):spr("b",{legs:"w2"});
 x.drawImage(im,CX,Math.floor(g.y)-CW_GH,CW_GW,CW_GH);
 /* puan */
 x.font="bold 10px monospace";x.textAlign="right";x.fillStyle=g.night?"#F4F3FF":"#1F1A14";x.fillText(String(g.score).padStart(5,"0"),VW-6,13);const b=stat().best||0;if(b){x.globalAlpha=.6;x.fillText("REKOR "+String(b).padStart(5,"0"),VW-6,24);x.globalAlpha=1}x.textAlign="left"}
function ovPaint(){const o=L&&L.querySelector("#kuOv");if(!o||!G)return;const g=G;
 if(g.st==="run"){o.hidden=true;return}o.hidden=false;
 o.innerHTML=g.st==="ready"?`<b>Clawd Koşu</b><small>Zıplamak için dokun. Basılı tutarsan daha yükseğe zıplar.</small><span class="ku-btn">Başla</span>`:
  g.st==="paused"?`<b>Durdu</b><span class="ku-btn">Devam et</span>`:
  `<b>${g.rec?"Yeni rekor!":"Oyun bitti"}</b><small>${g.score} puan · ${g.coins} piksel</small><span class="ku-btn">Yeniden oyna</span>`}
function hsPaint(){const h=L&&L.querySelector(".ku-hs");if(h)h.textContent="Rekor "+(stat().best||0)}
function tbPaint(){const t=L&&L.querySelector("#kuTb");if(!t)return;const me=S.uid,ids=new Set([...(typeof humans==="function"?humans():[]),me].filter(Boolean));
 const rows=[...ids].map(u=>[u,u===me?Math.max(+((P(u)||{}).kosu||0),stat().best||0):+((P(u)||{}).kosu||0)]).filter(r=>r[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10);
 t.innerHTML=`<h3>Arkadaşların</h3>`+(rows.length?rows.map(([u,n],i)=>`<div class="ku-r${u===me?" me":""}"><span class="k">${i+1}</span><b>${esc((P(u)||{}).name||"Oyuncu")}</b><span class="n">${n}</span></div>`).join(""):`<p class="ku-tip">Henüz rekor yok. İlk sen koş!</p>`)}
function open(){css();if(L&&L.isConnected)return;G=newGame();
 L=openLayer("kosu",`<div class="ku" role="dialog" aria-label="Clawd Koşu"><div class="ku-h"><button type="button" data-ku="x" aria-label="Geri">${I("back")}</button><h1>Clawd Koşu</h1><span class="ku-hs"></span></div>
 <div class="ku-cv" id="kuCv"><canvas id="kuC" width="${VW}" height="${VH}"></canvas><div class="ku-ov" id="kuOv"></div></div>
 <div class="ku-b"><p class="ku-tip">Dokun, boşluk ya da yukarı ok: zıpla. Turuncu pikselleri topla, engellere çarpma.</p><div class="ku-tb" id="kuTb"></div></div></div>`,{noScrim:true,onClose:()=>{if(raf)cancelAnimationFrame(raf);raf=0;G=null;L=null;document.removeEventListener("keydown",onKey);document.removeEventListener("keyup",onKeyUp);document.removeEventListener("visibilitychange",onVis)}});
 L._guard=()=>{if(G&&G.st==="run"){G.st="paused";ovPaint();return true}return false};
 L.addEventListener("click",e=>{if(e.target.closest('[data-ku="x"]'))closeLayer("kosu")});
 const cv=L.querySelector("#kuCv");cv.addEventListener("pointerdown",e=>{e.preventDefault();jumpStart()});cv.addEventListener("pointerup",jumpEnd);cv.addEventListener("pointercancel",jumpEnd);cv.addEventListener("contextmenu",e=>e.preventDefault());
 document.addEventListener("keydown",onKey);document.addEventListener("keyup",onKeyUp);document.addEventListener("visibilitychange",onVis);
 draw();ovPaint();tbPaint();hsPaint()}
function onKey(e){if(!L||!L.isConnected||e.repeat)return;if(e.key===" "||e.key==="ArrowUp"||e.key==="w"){const t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;e.preventDefault();jumpStart()}}
function onKeyUp(e){if(e.key===" "||e.key==="ArrowUp"||e.key==="w")jumpEnd()}
function onVis(){if(document.hidden&&G&&G.st==="run"){G.st="paused";ovPaint()}}
window.KOSU={open,_t:{G:()=>G,set:o=>Object.assign(G,o),step,over,OB}};
})();
