/* Kadraj İstiklal Marşı töreni (7.0.29). 31 Mart 2027'den sonra pazartesileri; zamanlamayı app.js bölge 7029 yapar (IM), bu dosya yalnızca ekranı çizer.
   window.MARSI.run(at, nowFn, {prev}): `at` anına kadar üstte "… sonra okunacak" şeridi (#imBar, saniyede bir, en çok 60 sn), sonra tam ekran tören
   (bayrak, ilk iki kıta satır satır, ~72 sn). Geç açılırsa kaldığı yerden katılır. Ses: `ses/istiklal.mp3` varsa çalar (depoda yok; sahibi eklerse),
   yoksa sessiz okunur. İstenirse kapatılır (Kapat); tören bitince kendiliğinden kapanır. Sonsuz animasyon yok; hareket azaltılmışsa bayrak dalgalanmaz. */
(function(){"use strict";
const LINES=["Korkma, sönmez bu şafaklarda yüzen al sancak;","Sönmeden yurdumun üstünde tüten en son ocak.","O benim milletimin yıldızıdır, parlayacak;","O benimdir, o benim milletimindir ancak.","Çatma, kurban olayım, çehreni ey nazlı hilâl!","Kahraman ırkıma bir gül! Ne bu şiddet, bu celâl?","Sana olmaz dökülen kanlarımız sonra helâl...","Hakkıdır, Hakk'a tapan, milletimin istiklâl!"];
const INTRO=4000,PER=8000,OUTRO=5000,TOTAL=INTRO+LINES.length*PER+OUTRO;
const FLAG=`<svg viewBox="0 0 1200 800" aria-label="Türk bayrağı" role="img"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#fff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon fill="#fff" points="583.334,400 764.235,458.779 652.431,304.894 652.431,495.106 764.235,341.221"/></svg>`;
const CSS=`#imBar{position:fixed;left:0;right:0;margin-inline:auto;width:max-content;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:90;display:flex;align-items:center;gap:10px;max-width:min(520px,calc(100vw - 20px));box-sizing:border-box;padding:9px 14px 9px 10px;border-radius:20px;line-height:1.25;background:#E30A17;color:#fff;font:700 .86rem var(--f-body);box-shadow:0 6px 22px rgba(0,0,0,.3);animation:imIn .35s ease 1}
#imBar .imf{width:34px;flex:none;border-radius:4px;overflow:hidden;box-shadow:0 0 0 1.5px rgba(255,255,255,.7)}#imBar svg{display:block;width:100%;height:auto}#imBar b{font:800 .9rem var(--f-mono);min-width:2.6em;text-align:right}
.imc{position:absolute;inset:0;background:#0B0B0D;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:calc(env(safe-area-inset-top,0px) + 20px) 22px calc(env(safe-area-inset-bottom,0px) + 20px);text-align:center;pointer-events:auto;animation:fade .5s ease 1}
.imc .imflag{width:min(300px,62vw);border-radius:6px;overflow:hidden;box-shadow:0 12px 40px rgba(227,10,23,.35);transform-origin:left center;animation:imWave 4s ease-in-out 19}.imc .imflag svg{display:block;width:100%;height:auto}
.imc h2{margin:0;font:800 1.15rem var(--f-display);letter-spacing:.02em}.imc .imsub{margin:-14px 0 0;color:#B9B9C0;font-size:.85rem}
.imc .imline{min-height:4.2em;display:grid;place-items:center;font:600 1.18rem/1.45 var(--f-body);max-width:26em}.imc .imline span{animation:imLine .6s ease 1}
.imc .improg{width:min(300px,62vw);height:3px;border-radius:2px;background:rgba(255,255,255,.16);overflow:hidden}.imc .improg i{display:block;height:100%;background:#fff;transform-origin:left;transform:scaleX(0)}
.imc .imx{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 12px);padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-weight:700;font-size:.82rem}
@keyframes imIn{from{opacity:0;transform:translateY(-14px)}}@keyframes imWave{0%,100%{transform:perspective(600px) rotateY(0) skewY(0)}50%{transform:perspective(600px) rotateY(-9deg) skewY(-1.2deg)}}@keyframes imLine{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion:reduce){#imBar,.imc,.imc .imflag,.imc .imline span{animation:none}}:root.reduce-motion #imBar,:root.reduce-motion .imc .imflag,:root.reduce-motion .imc .imline span{animation:none}`;
let cur=null;
function css(){if(document.getElementById("imCss"))return;const s=document.createElement("style");s.id="imCss";s.textContent=CSS;document.head.appendChild(s)}
function stop(){if(!cur)return;clearInterval(cur.iv);clearTimeout(cur.t);const b=document.getElementById("imBar");if(b)b.remove();try{if(cur.au){cur.au.pause();cur.au.src=""}}catch(e){}const c=cur;cur=null;try{if(document.querySelector('#overlay [data-layer="marsi"]'))closeLayer("marsi")}catch(e){}if(c.done)try{c.done()}catch(e){}}
function bar(at,now){let b=document.getElementById("imBar");if(!b){b=document.createElement("div");b.id="imBar";b.setAttribute("role","status");b.innerHTML=`<span class="imf">${FLAG}</span><span id="imBarT"></span><b id="imBarC"></b>`;document.body.appendChild(b)}
 const left=Math.max(0,Math.ceil((at-now())/1000));b.querySelector("#imBarT").textContent=left>=55?"İstiklal Marşı 1 dakika sonra okunacak":"İstiklal Marşı birazdan okunacak";b.querySelector("#imBarC").textContent="0:"+String(Math.min(59,left)).padStart(2,"0")}
function show(at,now){const b=document.getElementById("imBar");if(b)b.remove();
 const l=openLayer("marsi",`<div class="imc" role="dialog" aria-label="İstiklal Marşı"><button class="imx" type="button" id="imX">Kapat</button><div class="imflag">${FLAG}</div><h2>İstiklal Marşı</h2><p class="imsub" id="imSub">Saygı duruşu</p><div class="imline" id="imLine" aria-live="polite"></div><div class="improg"><i id="imP"></i></div></div>`,{noScrim:true,onClose:()=>{if(cur){cur.closed=true;stop()}}});
 l.querySelector("#imX").onclick=()=>stop();l._guard=()=>false;
 try{const a=new Audio("ses/istiklal.mp3");a.preload="auto";cur.au=a;a.addEventListener("canplay",()=>{if(!cur||cur.au!==a)return;const off=(now()-at-INTRO)/1000;if(off>0&&off<a.duration)try{a.currentTime=off}catch(e){}if(now()-at>=INTRO-300)a.play().catch(()=>{});else cur.t=setTimeout(()=>a.play().catch(()=>{}),Math.max(0,at+INTRO-now()))},{once:true});a.addEventListener("error",()=>{if(cur)cur.au=null},{once:true})}catch(e){}
 let shown=-2;const tick=()=>{if(!cur)return;const e=now()-at,line=l.querySelector("#imLine"),sub=l.querySelector("#imSub"),p=l.querySelector("#imP");if(!line||!line.isConnected)return stop();
  if(p)p.style.transform="scaleX("+Math.max(0,Math.min(1,e/TOTAL)).toFixed(4)+")";
  if(e>=TOTAL)return stop();const i=e<INTRO?-1:Math.min(LINES.length,Math.floor((e-INTRO)/PER));if(i===shown)return;shown=i;
  if(i<0){sub.textContent="Saygı duruşu";line.innerHTML=""}else if(i>=LINES.length){sub.textContent="Mehmet Âkif Ersoy";line.innerHTML=`<span>Ne mutlu Türk'üm diyene!</span>`}else{sub.textContent=(i<4?"1. kıta":"2. kıta");line.innerHTML=`<span>${esc(LINES[i])}</span>`}};
 tick();clearInterval(cur.iv);cur.iv=setInterval(tick,500)}
function run(at,now,o){o=o||{};now=now||(()=>Date.now());if(cur){if(cur.at===at)return;stop()}if(now()-at>=TOTAL)return;css();cur={at,done:o.done};
 if(now()<at){bar(at,now);cur.iv=setInterval(()=>{if(!cur)return;if(now()>=at){clearInterval(cur.iv);show(at,now)}else bar(at,now)},1000)}else show(at,now)}
window.MARSI={run,stop,TOTAL,LINES,_cur:()=>cur};
})();
