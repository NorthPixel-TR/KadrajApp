/* Kadraj Clawd (7.0.28): sakin piksel yardımcı. Eski maskotun (6.4.5'te kaldırılan, 136 KB, her karede çalışan döngü) yerine baştan yazıldı.
   window.CLAWD = {start, stop, page, open, say, _s}. app.js bölge 7028 girişten 2,5 sn sonra yükler (settings.clawd !== false).
   Kurallar:
   - Espri yok, gürültü yok, ses yok. Clawd sakin durur, etrafına bakar, arada yürür, oturur, gece uyur. Konuşursa kısa ve işe yarar bir şey söyler.
   - Kare döngüsü (requestAnimationFrame) YOK. Tek zamanlayıcı 4-9 sn'de bir küçük bir hareket seçer; yürürken 170 ms'lik aralık en çok ~3 sn çalışır.
     Sekme gizliyken, Clawd görünmezken ve bir pencere açıkken hiçbir şey yapmaz. Sonsuz CSS animasyonu yok.
   - Alt menünün üst kenarında durur (#shell içinde, pencereler üstünü örter). Sohbet, Klaket, satranç oyunu, düzenleme ve klavye açıkken görünmez.
   - Sprite app.js'teki cwSvg (bölge 50PIKO; satranç rakibi Clawd ile aynı çizim).
   - Dokununca Clawd penceresi: hazır sorular + soru kutusu. Yanıt sırası: yerel niyetler → FAQ (Rota'nın hazır yanıtları) → köprü (kAI, çocuk modunda yok) → "bilmiyorum".
   - Sürükleyince yeri değişir (yatay; `kadraj_cw_x` 0-1). İpuçları sayfa başına günde bir kez (`kadraj_cw_tip_<uid>`). */
(function(){"use strict";
const W=46,HIDE={chat:1,reels:1,chessgame:1,edit:1,bakim:1};
const C={el:null,sp:null,bub:null,on:false,vis:false,x:null,mode:"up",t:0,wk:0,rv:0,bt:0,lastTouch:Date.now(),wakeUntil:0,drag:null,lastPage:"",busy:false};
const rnd=n=>Math.floor(Math.random()*n),R=()=>typeof kbReduce==="function"&&kbReduce();
const CSS=`.cwd{position:fixed;z-index:6;width:${W}px;left:0;bottom:0;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;opacity:0;transition:opacity .25s ease;pointer-events:none}
.cwd.on{opacity:1;pointer-events:auto}.cwd.wk{transition:opacity .25s ease,left var(--cwt,2s) linear}
.cwd-sp{display:block;width:${W}px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))}.cwd-sp svg{display:block;width:100%;height:auto}
.cwd.hop .cwd-sp{animation:cwdHop .45s ease 1}.cwd.zz::after{content:"z";position:absolute;right:-2px;top:-8px;font:700 11px var(--f-mono);color:var(--muted);animation:cwdZ 2.4s ease 1 forwards}
.cwd-bub{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(var(--bx,-50%));width:max-content;max-width:min(220px,62vw);padding:8px 11px;border-radius:14px;background:var(--surface);color:var(--fg);font:500 .8rem/1.3 var(--f-body);box-shadow:0 4px 16px rgba(0,0,0,.2),0 0 0 1px var(--line);animation:cwdBub .25s ease 1}
.cwd-bub[hidden]{display:none}
@keyframes cwdHop{0%,100%{transform:translateY(0)}45%{transform:translateY(-9px)}}@keyframes cwdZ{0%{opacity:0;transform:translate(0,4px)}25%{opacity:1}100%{opacity:0;transform:translate(6px,-12px)}}@keyframes cwdBub{from{opacity:0;transform:translateX(var(--bx,-50%)) translateY(6px)}}
.cwd-hd{display:flex;align-items:center;gap:12px;padding:2px 16px 10px}.cwd-hd .cwd-big{width:64px;flex:none}.cwd-hd .cwd-big svg{display:block;width:100%;height:auto}.cwd-hd b{display:block;font:800 1.05rem var(--f-display)}.cwd-hd small{color:var(--muted)}
.cwd-log{display:flex;flex-direction:column;gap:8px;padding:0 16px 8px}.cwd-m{max-width:88%;padding:9px 12px;border-radius:16px;background:var(--surface-2);font-size:.92rem;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere;align-self:flex-start}.cwd-m.me{align-self:flex-end;background:var(--accent);color:var(--accent-ink)}.cwd-m.wait{color:var(--muted)}
.cwd-ch{display:flex;flex-wrap:wrap;gap:6px;padding:4px 16px 10px}.cwd-ch button{padding:7px 12px;border-radius:999px;background:var(--surface-2);font-size:.82rem;font-weight:600;color:var(--fg)}
.cwd-f{display:flex;gap:8px;padding:0 16px 14px;align-items:center}.cwd-f .in{flex:1;min-width:0}
@media (prefers-reduced-motion:reduce){.cwd,.cwd.wk{transition:none}.cwd.hop .cwd-sp,.cwd-bub,.cwd.zz::after{animation:none}}
:root.reduce-motion .cwd,:root.reduce-motion .cwd.wk{transition:none}:root.reduce-motion .cwd.hop .cwd-sp,:root.reduce-motion .cwd-bub{animation:none}`;
/* duruşlar: kalıcı kip + geçici poz */
const REST={up:{},sit:{legs:"tuck"},read:{legs:"tuck",prop:"book",eyes:"down"},sleep:{legs:"tuck",eyes:"closed"}};
function draw(p){if(!C.sp)return;const sp=Object.assign({arms:"down",legs:"stand",lx:0},REST[C.mode]||{},p||{});const h=cwSvg(sp);if(C._h!==h){C._h=h;C.sp.innerHTML=h}}
function pose(p,ms){clearTimeout(C.rv);draw(p);if(ms)C.rv=setTimeout(()=>draw(),ms)}
const night=()=>{const h=new Date().getHours();return h<7};
const asleep=()=>night()&&Date.now()>C.wakeUntil;
function setMode(m){if(C.mode===m)return;C.mode=m;C.el&&C.el.classList.toggle("zz",false);draw()}
/* yer */
function geo(){const d=document.getElementById("dock"),sh=document.getElementById("shell");const nav=d&&!d.hidden&&d.querySelector("nav");if(!nav||!sh)return null;const r=nav.getBoundingClientRect(),s=sh.getBoundingClientRect();if(!r.height)return null;
 const vh=(window.visualViewport&&visualViewport.height)||innerHeight;if(vh<innerHeight-120)return null;return{l:Math.max(s.left,r.left)+10,r:Math.min(s.right,r.right)-10-W,b:Math.round(innerHeight-r.top-3)}}
function want(){try{if(!C.on||settings.clawd===false||!S.authed||S.guest)return false;if(HIDE[S.route&&S.route.name])return false;if(document.querySelector("#main.chatmode,#main.chessmode"))return false;return true}catch(e){return false}}
function place(anim){if(!C.el)return;const g=want()&&geo();if(!g){show(false);return}if(C.x==null)C.x=+(LS.get("kadraj_cw_x",.1))||.1;C.x=Math.max(0,Math.min(1,C.x));
 if(!anim)C.el.classList.remove("wk");C.el.style.left=Math.round(g.l+(g.r-g.l)*C.x)+"px";C.el.style.bottom=g.b+"px";show(true)}
function show(v){if(C.vis===v)return;C.vis=v;C.el.classList.toggle("on",v);if(!v){stopWalk();hush()}}
/* konuşma balonu */
function say(t,ms){if(!C.vis||!C.bub||!t)return;clearTimeout(C.bt);C.bub.textContent=t;C.bub.hidden=false;const r=C.el.getBoundingClientRect(),bw=C.bub.offsetWidth,c=r.left+W/2;let dx=-bw/2;if(c+dx<8)dx=8-c;if(c+dx+bw>innerWidth-8)dx=innerWidth-8-bw-c;C.bub.style.setProperty("--bx",Math.round(dx)+"px");C.bub.style.left="50%";C.bt=setTimeout(hush,ms||4500)}
function hush(){clearTimeout(C.bt);if(C.bub)C.bub.hidden=true}
/* yürüyüş */
function stopWalk(){if(C.wk){clearInterval(C.wk);C.wk=0}clearTimeout(C.wt);if(C.el)C.el.classList.remove("wk")}
function walkTo(x){const g=geo();if(!g||R()||C.drag)return;const from=C.x,dist=Math.abs(x-from)*(g.r-g.l);if(dist<24)return;const dur=Math.min(3200,Math.max(700,dist*22));stopWalk();setMode("up");const dir=x>from?1:-1;let k=0;
 C.el.style.setProperty("--cwt",dur+"ms");C.el.classList.add("wk");C.x=x;C.el.style.left=Math.round(g.l+(g.r-g.l)*x)+"px";clearTimeout(C.rv);
 C.wk=setInterval(()=>draw({legs:(k++%2)?"w1":"w2",lx:dir}),170);C.wt=setTimeout(()=>{stopWalk();draw();LS.set("kadraj_cw_x",C.x)},dur+30)}
/* boşta küçük hareketler */
function plan(){clearTimeout(C.t);if(!C.on)return;C.t=setTimeout(act,4000+rnd(5000))}
function act(){plan();if(!C.vis||document.hidden||C.wk||C.drag||C.busy)return;try{if(document.querySelector("#overlay [data-layer]"))return}catch(e){}
 if(asleep()){if(C.mode!=="sleep"){setMode("sleep")}else if(!R()&&rnd(3)===0){C.el.classList.remove("zz");void C.el.offsetWidth;C.el.classList.add("zz")}return}
 if(C.mode==="sleep")setMode("up");const idle=Date.now()-C.lastTouch,r=rnd(100);
 if(idle>50000){if(C.mode==="up")return setMode(rnd(2)?"read":"sit");if(C.mode==="read"&&r<30)return pose({prop:"book2"},900);if(r<50)return pose({eyes:"blink"},140);return}
 if(C.mode!=="up"){if(r<35)return setMode("up");return pose({eyes:"blink"},140)}
 if(r<38)return pose({eyes:"blink"},140);if(r<58)return pose({lx:rnd(2)?1:-1},1300);if(r<66)return pose({eyes:"up"},1100);if(r<74)return pose({arms:"up",eyes:"closed"},800);if(r<82)return setMode("sit");
 if(r<96)return walkTo(Math.random())}
/* tepkiler */
function react(k){if(!C.vis||C.wk||C.drag)return;if(C.mode==="sleep")return;if(k==="like"){pose({eyes:"happy",arms:"up"},900);if(!R()){C.el.classList.remove("hop");void C.el.offsetWidth;C.el.classList.add("hop")}}else if(k==="toast")pose({eyes:"up"},1300);else if(k==="down")pose({eyes:"down"},600);else if(k==="up")pose({eyes:"up"},600);else if(k==="hi")pose({arms:"hi",eyes:"happy"},1400)}
/* ipuçları */
function greet(){const h=new Date().getHours();let n="";try{n=String(P(S.uid).name||"").split(" ")[0]}catch(e){}const g=h<6?"İyi geceler":h<12?"Günaydın":h<18?"İyi günler":h<23?"İyi akşamlar":"İyi geceler";return n?g+", "+n+".":g+"."}
const TIPS={feed:()=>greet(),explore:()=>"Aramaya kişi adı ya da #etiket yazabilirsin.",chats:()=>"Oyunlar üstteki oyun kolunda. Okey de orada.",activity:()=>"Rahatsız edilmek istemezsen Ayarlar'da Sessiz mod var.",settings:()=>"Beni buradan açıp kapatabilirsin: Kadraj'a özel › Clawd.",profile:()=>{try{if(S.route.params&&S.route.params.uid&&S.route.params.uid!==S.uid)return""}catch(e){}return"Profili düzenle'den en çok 5 fotoğraf ekleyebilirsin."}};
function tip(page){const f=TIPS[page];if(!f||asleep())return;const key="kadraj_cw_tip_"+S.uid,day=new Date().toDateString(),st=LS.get(key,{})||{};if(st[page]===day)return;const t=f();if(!t)return;st[page]=day;LS.set(key,st);setTimeout(()=>{if(C.vis&&S.route.name===page&&!document.querySelector("#overlay [data-layer]")){if(page==="feed")react("hi");say(t)}},900)}
/* pencere */
const SYS="Sen Clawd'sın: Kadraj uygulamasının içinde yaşayan küçük, sakin piksel yardımcısın. Türkçe konuş. Kısa, açık ve yardımsever ol (en çok 4 cümle). Espri, şaka, emoji ve abartı yok. Bilmediğini uydurma; emin değilsen 'Bunu bilmiyorum' de ve Rota'ya sormayı öner. Kadraj hakkında bildiklerin:\n";
function local(q){const f=typeof cwFoldQ==="function"?cwFoldQ(q):q.toLocaleLowerCase("tr");
 if(/^(selam|merhaba|sa|hey|günaydın|iyi (akşamlar|geceler|günler))\b/.test(f))return greet()+" Bir şey sormak istersen buradayım.";
 if(/kimsin|nesin|adın ne|clawd (kim|ne)/.test(f))return"Ben Clawd. Kadraj'da yolunu bulmana yardım ederim. Alt menünün üstünde dururum; beni sürükleyip yerimi değiştirebilirsin.";
 if(/gizle|kapat|git(sene)?$|görünme/.test(f)&&/seni|beni|clawd|kendini|git/.test(f))return{t:"Peki. Ayarlar › Kadraj'a özel › Clawd'dan beni yeniden açabilirsin.",fn:()=>{settings.clawd=false;saveSettings();closeLayer("clawd");stop()}};
 if(/yenilik|neler yeni|ne değişti|güncelleme/.test(f)){try{const it=WN_ITEMS.slice(0,6).map(x=>"• "+(x.t||x.title||"")).filter(x=>x.length>2).join("\n");return"Bu sürümde ("+APP_FULL+"):\n"+it}catch(e){}}
 if(/saat kaç|bugün (günlerden|ayın)|tarih/.test(f)){const d=new Date();return"Saat "+d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})+", "+d.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})+"."}
 if(/uyu|uykun/.test(f))return"Gece yarısından sabah yediye kadar uyurum. Dokunursan uyanırım.";
 return null}
function md(t){return esc(String(t)).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")}
async function answer(q){const l=local(q);if(l)return l;try{for(const[re,a]of FAQ)if(re.test(q))return{h:md(a)}}catch(e){}
 let kid=false;try{kid=isChild(S.uid)}catch(e){}
 try{if(!kid&&typeof kAI!=="undefined"&&kAI.ready()){const r=await kAI.ask({system:SYS+APP_GUIDE,messages:[{role:"user",content:q.slice(0,600)}],timeout:40000});const t=(r&&r.text||"").trim();if(t)return{h:md(typeof cleanText==="function"&&settings.hwBad!==false?cleanText(t):t)}}}catch(e){}
 return"Bunu bilmiyorum. Rota'ya sorabilirsin; o daha uzun anlatır."}
function open(){if(!S.authed)return;hush();C.lastTouch=Date.now();if(night())C.wakeUntil=Date.now()+120000;if(C.mode!=="up")setMode("up");
 const l=sheet("clawd","",`<div class="cwd-hd"><span class="cwd-big" id="cwdBig">${cwSvg({eyes:"happy",arms:"hi"})}</span><span><b>Clawd</b><small>Kadraj'ın küçük yardımcısı</small></span></div>
 <div class="cwd-log" id="cwdLog" aria-live="polite"><div class="cwd-m">${esc(greet())} Ne öğrenmek istersin?</div></div>
 <div class="cwd-ch">${[["Yenilikler","Neler yeni?"],["Oyunlar","Okey nasıl oynanır?"],["Paylaşım","Nasıl paylaşım yaparım?"],["Hikâye","Hikâye nasıl atılır?"],["Beni gizle","Clawd kendini gizle"]].map(([a,b])=>`<button type="button" data-cwq="${esc(b)}">${esc(a)}</button>`).join("")}</div>
 <form class="cwd-f" id="cwdF"><textarea class="in k1l" rows="1" id="cwdIn" maxlength="300" placeholder="Clawd'a sor" aria-label="Clawd'a sor"></textarea><button class="btn sm" type="submit">Sor</button></form>`,{tall:true,onClose:()=>{C.busy=false}});
 const log=l.querySelector("#cwdLog"),inp=l.querySelector("#cwdIn"),big=l.querySelector("#cwdBig"),body=l.querySelector(".body");
 const add=(h,cls)=>{const d=document.createElement("div");d.className="cwd-m "+(cls||"");d.innerHTML=h;log.appendChild(d);if(body)body.scrollTop=body.scrollHeight;return d};
 const ask=async q=>{q=String(q||"").trim();if(!q||C.busy)return;C.busy=true;add(esc(q),"me");const w=add("Düşünüyor…","wait");big.innerHTML=cwSvg({eyes:"up",arms:"t1"});let a;try{a=await answer(q)}catch(e){a="Bir sorun oldu. Biraz sonra yeniden dener misin?"}
  C.busy=false;if(!w.isConnected)return;w.classList.remove("wait");if(typeof a==="string")w.textContent=a;else if(a.h)w.innerHTML=a.h;else w.textContent=a.t;big.innerHTML=cwSvg({eyes:"happy"});if(body)body.scrollTop=body.scrollHeight;if(a&&a.fn)setTimeout(a.fn,1400)};
 l.querySelector("#cwdF").onsubmit=e=>{e.preventDefault();const q=inp.value;inp.value="";ask(q)};
 l.addEventListener("click",e=>{const b=e.target.closest("[data-cwq]");if(b)ask(b.dataset.cwq)})}
/* olaylar */
function wire(){const el=C.el;
 el.addEventListener("pointerdown",e=>{if(e.button)return;C.drag={x:e.clientX,l:parseFloat(el.style.left)||0,mv:false,id:e.pointerId};try{el.setPointerCapture(e.pointerId)}catch(_){}stopWalk()});
 el.addEventListener("pointermove",e=>{const d=C.drag;if(!d)return;const dx=e.clientX-d.x;if(!d.mv&&Math.abs(dx)<8)return;d.mv=true;const g=geo();if(!g)return;const L=Math.max(g.l,Math.min(g.r,d.l+dx));el.style.left=L+"px";C.x=(L-g.l)/Math.max(1,g.r-g.l);hush();draw({legs:"dang1",eyes:"wide"})});
 const up=e=>{const d=C.drag;if(!d)return;C.drag=null;if(d.mv){LS.set("kadraj_cw_x",C.x);pose({eyes:"blink"},200);C._sk=Date.now()}else if(e.type==="pointerup"){if(asleep()||C.mode==="sleep"){C.wakeUntil=Date.now()+120000;setMode("up");pose({eyes:"wide"},700)}open()}};
 el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
 el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
 document.addEventListener("click",e=>{C.lastTouch=Date.now();try{if(e.target.closest&&e.target.closest("[data-like],[data-dbl]"))react("like")}catch(_){}},true);
 let lt=0;document.addEventListener("pointerdown",e=>{C.lastTouch=Date.now();if(!C.vis||C.wk||C.drag||C.mode==="sleep"||e.target.closest(".cwd"))return;if(C.mode!=="up")setMode("up");const n=Date.now();if(n-lt<2500)return;lt=n;const r=el.getBoundingClientRect();pose({lx:e.clientX<r.left+W/2?-1:1,eyes:e.clientY<r.top-200?"up":""},900)},{capture:true,passive:true});
 let ls=0,ly=0;document.addEventListener("scroll",e=>{const t=e.target;if(!t||t.id!=="main")return;const n=Date.now(),y=t.scrollTop;if(n-ls>1600){ls=n;react(y>ly?"down":"up")}ly=y;C.lastTouch=n},{capture:true,passive:true});
 try{const ts=document.getElementById("toasts");if(ts)new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))react("toast")}).observe(ts,{childList:true})}catch(e){}
 addEventListener("resize",()=>place());if(window.visualViewport)visualViewport.addEventListener("resize",()=>place());
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&C.on){place();plan()}})}
function start(){if(C.on)return;if(!document.getElementById("cwdCss")){const s=document.createElement("style");s.id="cwdCss";s.textContent=CSS;document.head.appendChild(s)}
 if(!C.el){const el=document.createElement("div");el.className="cwd";el.id="cwd";el.setAttribute("role","button");el.tabIndex=0;el.setAttribute("aria-label","Clawd, Kadraj'ın yardımcısı");el.innerHTML=`<div class="cwd-bub" hidden></div><span class="cwd-sp"></span>`;(document.getElementById("shell")||document.body).appendChild(el);C.el=el;C.sp=el.querySelector(".cwd-sp");C.bub=el.querySelector(".cwd-bub");wire()}
 C.on=true;C.mode=asleep()?"sleep":"up";C._h="";draw();page();plan()}
function stop(){C.on=false;clearTimeout(C.t);clearTimeout(C.rv);stopWalk();if(C.el){C.vis=true;show(false)}}
function page(){if(!C.on||!C.el)return;if(!C.el.isConnected)(document.getElementById("shell")||document.body).appendChild(C.el);place();const p=S.route&&S.route.name;if(C.vis&&p!==C.lastPage){C.lastPage=p;tip(p)}else if(!C.vis)C.lastPage=""}
window.CLAWD={start,stop,page,open,say,_s:C,_act:act,_walk:walkTo,_react:react,_answer:answer,_mode:setMode};
})();
