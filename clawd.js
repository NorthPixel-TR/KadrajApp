/* Kadraj Clawd (7.1.19): piksel maskot, odasıyla geri geldi. 7.0.28'in hafif çekirdeği üstüne kuruldu (eski 136 KB'lık, her karede çalışan maskot geri gelmedi).
   window.CLAWD = {start, stop, page, open, say, _s, _act, _walk, _react, _answer, _mode, _play, _room}. app.js bölge 7028 girişten 2,5 sn sonra yükler.
   - ODA: Akış'ta hikâye şeridinde, Sohbet'te notlar şeridinde kendi kartının içindeki piksel oda (pencere, raf, lamba, yatak, halı, bitki).
     Bu iki sayfada Clawd odasında yaşar (alt menüdeki Clawd gizlenir). Pencere gündüz mavi + güneş, gece lacivert + ay ve yıldız; gece lamba söner, yatakta uyur.
     Oda sayfa çizildikten sonra page() ile şeride eklenir (şerit yatay kaydığı için Akış'ın yüksekliği değişmez, ışınlanma olmaz).
   - Diğer sayfalarda alt menünün üstünde durur (eskisinden büyük, W px). Sohbet, Klaket, satranç oyunu, düzenleme ve klavye açıkken görünmez.
   - Hareketler (play): dans, el sallama, alkış, zıplama, gitar (sabah daha sık), kitap, esneme, dönüp bakınma. Her biri sonlu kare dizisi (setInterval, en çok
     ~3 sn), sonra durur. Kare döngüsü (rAF) ve sonsuz CSS animasyonu yok; sekme gizliyken, pencere açıkken, Clawd görünmezken hiçbir şey yapmaz.
     Hareket azaltılmışsa yalnızca duruş değişir.
   - Konuşma: piksel çerçeveli balon (eş genişlikli yazı, harf harf yazılır). Arada kendi kendine konuşur (en sık 70 sn'de bir), beğenide sevinir,
     sayfa ipuçları günde bir kez (kadraj_cw_tip_<uid>). Eğlenceli ama kırıcı değil; çocuk modunda köprü yok.
   - Dokununca Clawd penceresi: hazır sorular + soru kutusu. Yanıt: yerel niyetler → FAQ → köprü (kAI) → "bilmiyorum".
   - Sprite: app.js'teki cwSvg (bölge 50PIKO). Sürükleyince alt menüdeki yeri değişir (kadraj_cw_x). */
(function(){"use strict";
const W=60,HIDE={chat:1,reels:1,chessgame:1,edit:1,bakim:1},HOME={feed:[".stories",".story"],chats:[".notes",".nt"]};
const C={el:null,sp:null,on:false,vis:false,x:null,mode:"up",t:0,wk:0,rv:0,an:0,lastTouch:Date.now(),wakeUntil:0,drag:null,lastPage:"",busy:false,room:null,rsp:null,talkAt:0,bub:null,bt:0,bi:0};
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)],RM=()=>typeof kbReduce==="function"&&kbReduce();
const hr=()=>new Date().getHours(),night=()=>hr()<7,morning=()=>{const h=hr();return h>=7&&h<11};
const asleep=()=>night()&&Date.now()>C.wakeUntil;
const CSS=`.cwd{position:fixed;z-index:6;width:${W}px;left:0;bottom:0;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;opacity:0;transition:opacity .25s ease;pointer-events:none}
.cwd.on{opacity:1;pointer-events:auto}.cwd.wk{transition:opacity .25s ease,left var(--cwt,2s) linear}
.cwd-sp,.cwr-cl{display:block;filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))}.cwd-sp{width:${W}px}.cwd-sp svg,.cwr-cl svg,.cwr-sc svg{display:block;width:100%;height:auto}
.cwd.hop .cwd-sp,.cwr.hop .cwr-cl{animation:cwdHop .45s ease 1}
.cwr-w{flex:none;display:grid;justify-items:center;gap:4px;width:96px;font-size:.72rem;color:var(--muted)}
.cwr{position:relative;width:96px;height:72px;border-radius:14px;overflow:hidden;padding:0;display:block;box-shadow:0 0 0 1px var(--line);background:#2B2540;cursor:pointer;-webkit-tap-highlight-color:transparent}
.cwr:active{transform:scale(.97)}.notes .cwr-w{align-self:flex-end}
.cwr-sc{position:absolute;inset:0}.cwr-sc svg{width:100%;height:100%}
.cwr-cl{position:absolute;width:42px;left:20px;bottom:5px;transition:left .5s steps(5),bottom .5s steps(5),width .5s steps(5)}
.cwr.bed .cwr-cl{left:52px;bottom:17px;width:36px}
.cwr-dk{position:absolute;inset:0;background:rgba(10,8,30,.42);opacity:0;transition:opacity .4s steps(4);pointer-events:none}.cwr.dark .cwr-dk{opacity:1}
.cwfx{position:absolute;pointer-events:none;width:10px;height:10px;animation:cwdFloat 1.6s steps(8) 1 forwards}.cwfx svg{display:block;width:100%;height:100%}
.cwb{position:fixed;z-index:8;max-width:min(240px,70vw);padding:8px 10px;background:#FFFDF7;color:#171310;font:600 12px/1.45 var(--f-mono);white-space:pre-wrap;overflow-wrap:anywhere;pointer-events:none;
 box-shadow:0 -3px 0 #171310,0 3px 0 #171310,-3px 0 0 #171310,3px 0 0 #171310,0 7px 0 rgba(0,0,0,.18);animation:cwdBub .2s steps(3) 1}
.cwb::after{content:"";position:absolute;left:var(--tx,50%);bottom:-9px;width:6px;height:6px;background:#FFFDF7;box-shadow:0 3px 0 #171310,-3px 0 0 #171310,3px 0 0 #171310,3px 3px 0 #171310;transform:translateX(-50%)}
.cwb[hidden]{display:none}
@keyframes cwdHop{0%,100%{transform:translateY(0)}45%{transform:translateY(-10px)}}
@keyframes cwdFloat{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--fx,6px),-26px)}}
@keyframes cwdBub{from{opacity:0;transform:translateY(4px)}}
.cwd-hd{display:flex;align-items:center;gap:12px;padding:2px 16px 10px}.cwd-hd .cwd-big{width:84px;flex:none}.cwd-hd .cwd-big svg{display:block;width:100%;height:auto}.cwd-hd b{display:block;font:800 1.1rem var(--f-display)}.cwd-hd small{color:var(--muted)}
.cwd-log{display:flex;flex-direction:column;gap:8px;padding:0 16px 8px}.cwd-m{max-width:88%;padding:9px 12px;border-radius:4px;background:var(--surface-2);font:500 .9rem/1.45 var(--f-mono);white-space:pre-wrap;overflow-wrap:anywhere;align-self:flex-start;box-shadow:0 0 0 2px var(--line)}.cwd-m.me{align-self:flex-end;background:var(--accent);color:var(--accent-ink);box-shadow:none;font-family:var(--f-body)}.cwd-m.wait{color:var(--muted)}
.cwd-ch{display:flex;flex-wrap:wrap;gap:6px;padding:4px 16px 10px}.cwd-ch button{padding:7px 12px;border-radius:999px;background:var(--surface-2);font-size:.82rem;font-weight:600;color:var(--fg)}
.cwd-f{display:flex;gap:8px;padding:0 16px 14px;align-items:center}.cwd-f .in{flex:1;min-width:0}
@media (prefers-reduced-motion:reduce){.cwd,.cwd.wk,.cwr-cl,.cwr-dk{transition:none}.cwd.hop .cwd-sp,.cwr.hop .cwr-cl,.cwb,.cwfx{animation:none}.cwfx{display:none}}
:root.reduce-motion .cwd,:root.reduce-motion .cwd.wk,:root.reduce-motion .cwr-cl{transition:none}:root.reduce-motion .cwb,:root.reduce-motion .cwfx{animation:none}:root.reduce-motion .cwfx{display:none}`;
/* ---- piksel çizim yardımcıları ---- */
const rects=(L,vb)=>`<svg viewBox="0 0 ${vb}" shape-rendering="crispEdges" aria-hidden="true">${L.map(([x,y,w,h,c])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`).join("")}</svg>`;
const FX={note:rects([[3,0,3,1,"#171310"],[5,1,1,4,"#171310"],[2,4,3,2,"#171310"],[3,0,1,4,"#FF8A4C"]],"7 7"),
 z:rects([[0,0,5,1,"#9AA3FF"],[3,1,1,1,"#9AA3FF"],[2,2,1,1,"#9AA3FF"],[1,3,1,1,"#9AA3FF"],[0,4,5,1,"#9AA3FF"]],"5 5"),
 heart:rects([[1,0,2,1,"#E5484D"],[4,0,2,1,"#E5484D"],[0,1,7,2,"#E5484D"],[1,3,5,1,"#E5484D"],[2,4,3,1,"#E5484D"],[3,5,1,1,"#E5484D"],[1,1,1,1,"#FFB3B5"]],"7 6"),
 star:rects([[2,0,1,5,"#FFD34D"],[0,2,5,1,"#FFD34D"],[1,1,3,3,"#FFD34D"]],"5 5")};
/* oda: 48x36 ızgara. gece pencere lacivert, lamba sönük */
function roomSvg(n){const sky=n?"#1B2350":"#8FD3FF",wall=n?"#3A3358":"#F3E3C8",trim=n?"#2B2540":"#E2CBA6";const L=[[0,0,48,27,wall],[0,26,48,1,trim],[0,27,48,9,"#B07A4E"],[0,30,48,1,"#9A6A42"],[0,33,48,1,"#9A6A42"],
 [4,4,14,11,"#7A4A2C"],[5,5,12,9,sky],[10,5,1,9,"#7A4A2C"],[5,9,12,1,"#7A4A2C"]];
 if(n)L.push([14,6,2,2,"#F4F1D0"],[15,6,1,1,sky],[7,7,1,1,"#fff"],[12,12,1,1,"#fff"],[8,11,1,1,"#cfd6ff"]);else L.push([13,6,3,3,"#FFD34D"],[6,11,4,1,"#fff"],[7,10,2,1,"#fff"]);
 L.push([22,6,13,1,"#7A4A2C"],[23,3,2,3,"#4F46E5"],[25,2,2,4,"#FF8A4C"],[27,4,2,2,"#16A34A"],[30,3,3,3,"#E5484D"],[22,13,13,1,"#7A4A2C"],[24,10,4,3,"#C9955F"],[29,11,2,2,"#4F46E5"]);
 L.push([39,4,5,3,n?"#5A4E46":"#FFE7A3"],[41,7,1,10,"#5A4E46"],[39,17,5,1,"#5A4E46"]);
 L.push([30,20,17,2,"#7A4A2C"],[31,18,15,2,"#4F46E5"],[42,17,4,2,"#F6F0E6"],[30,22,2,5,"#7A4A2C"],[45,22,2,5,"#7A4A2C"]);
 L.push([2,20,4,1,"#16A34A"],[1,18,2,2,"#16A34A"],[5,17,2,3,"#16A34A"],[3,16,2,4,"#22C55E"],[2,21,4,5,"#C2410C"]);
 L.push([8,31,20,3,"#FF8A4C"],[9,32,18,1,"#F4A48E"]);
 return rects(L,"48 36")}
/* ---- hedef: odası varsa oda, yoksa alt menüdeki Clawd ---- */
const inRoom=()=>!!(C.room&&C.room.isConnected&&HOME[S.route&&S.route.name]);
const tgt=()=>inRoom()?{sp:C.rsp,box:C.room}:{sp:C.sp,box:C.el};
const REST={up:{},sit:{legs:"tuck"},read:{legs:"tuck",prop:"book",eyes:"down"},sleep:{legs:"tuck",eyes:"closed"}};
function draw(p){const t=tgt();if(!t.sp)return;const sp=Object.assign({arms:"down",legs:"stand",lx:0},REST[C.mode]||{},p||{});const h=cwSvg(sp);if(t.sp._h!==h){t.sp._h=h;t.sp.innerHTML=h}}
function pose(p,ms){clearTimeout(C.rv);draw(p);if(ms)C.rv=setTimeout(()=>draw(),ms)}
function setMode(m){if(C.mode===m)return;if(m==="sleep")stopAnim();C.mode=m;if(C.room){C.room.classList.toggle("bed",m==="sleep");C.room.classList.toggle("dark",m==="sleep")}draw()}
function fx(kind,n){const t=tgt();if(!t.box||RM())return;for(let i=0;i<(n||1);i++){const e=document.createElement("span");e.className="cwfx";e.innerHTML=FX[kind];const r=t.box===C.room;
 e.style.left=(r?(C.mode==="sleep"?70:44):W*.6)+rnd(10)+"%";e.style.top=r?"18%":"-6px";if(!r)e.style.left=(W*.55+rnd(14))+"px";e.style.animationDelay=(i*.35)+"s";e.style.setProperty("--fx",(rnd(14)-4)+"px");t.box.appendChild(e);setTimeout(()=>e.remove(),1800+i*350)}}
/* ---- hareketler: sonlu kare dizileri ---- */
const SEQ={dance:[{arms:"up",legs:"w1",eyes:"happy"},{arms:"w2",legs:"w2",lx:1,eyes:"happy"},{arms:"up",legs:"w1",lx:-1,eyes:"happy"},{arms:"w1",legs:"w2",eyes:"happy",mouth:"o"}],
 wave:[{arms:"hi",eyes:"happy"},{arms:"up",eyes:"happy"}],clap:[{arms:"c1",eyes:"happy"},{arms:"c2",eyes:"happy",mouth:"o"}],
 guitar:[{prop:"guitar",arms:"g1",legs:"spread",eyes:"closed",mouth:"smile"},{prop:"guitar",arms:"g2",legs:"spread",eyes:"closed",mouth:"smile"}],
 look:[{lx:-1},{lx:-1,eyes:"up"},{lx:1},{lx:1,eyes:"down"},{}],stretch:[{arms:"up",eyes:"closed",mouth:"yawn"},{arms:"up",eyes:"closed",mouth:"yawn"},{arms:"sh",eyes:"blink"}],
 read:[{legs:"tuck",prop:"book",eyes:"down"},{legs:"tuck",prop:"book2",eyes:"down"}],spin:[{lx:-1},{lx:0,eyes:"wide"},{lx:1},{lx:0,mouth:"o"}]};
const LEN={dance:12,wave:6,clap:8,guitar:14,look:5,stretch:3,read:6,spin:8};
function play(name,done){const fr=SEQ[name];if(!fr)return;stopAnim();if(RM()){pose(fr[0],1200);done&&setTimeout(done,1200);return}
 let i=0;const n=LEN[name]||fr.length,ms=name==="read"||name==="stretch"||name==="look"?520:200;
 if(name==="guitar")fx("note",3);if(name==="dance")fx("note",2);if(name==="clap")fx("star",2);
 draw(fr[0]);C.an=setInterval(()=>{i++;if(i>=n){stopAnim();draw();done&&done();return}draw(fr[i%fr.length])},ms)}
function stopAnim(){if(C.an){clearInterval(C.an);C.an=0}}
function hop(){const t=tgt();if(!t.box||RM())return;t.box.classList.remove("hop");void t.box.offsetWidth;t.box.classList.add("hop")}
/* ---- konuşma balonu (piksel, harf harf) ---- */
function say(t,ms){const g=tgt();if(!t||!g.box||!g.box.isConnected)return;if(g.box===C.el&&!C.vis)return;const r=g.box.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;
 if(!C.bub){C.bub=document.createElement("div");C.bub.className="cwb";C.bub.hidden=true;C.bub.setAttribute("aria-live","polite");(document.getElementById("shell")||document.body).appendChild(C.bub)}
 clearTimeout(C.bt);clearInterval(C.bi);const b=C.bub;b.textContent=t;b.hidden=false;const bw=b.offsetWidth,bh=b.offsetHeight,cx=r.left+r.width/2;let L=Math.round(cx-bw/2);L=Math.max(8,Math.min(innerWidth-8-bw,L));
 b.style.left=L+"px";b.style.top=Math.max(8,Math.round(r.top-bh-12))+"px";b.style.setProperty("--tx",Math.round(Math.max(10,Math.min(bw-10,cx-L)))+"px");
 if(!RM()&&t.length<160){let k=0;b.textContent="";C.bi=setInterval(()=>{k+=2;b.textContent=t.slice(0,k);if(k>=t.length)clearInterval(C.bi)},28)}
 C.talkAt=Date.now();C.bt=setTimeout(hush,ms||Math.min(9000,2600+t.length*55))}
function hush(){clearTimeout(C.bt);clearInterval(C.bi);if(C.bub)C.bub.hidden=true}
/* ---- eğlenceli laflar ---- */
const name1=()=>{try{return String(P(S.uid).name||"").split(" ")[0]}catch(e){return""}};
function greet(){const h=hr(),n=name1();const g=h<6?"İyi geceler":h<12?"Günaydın":h<18?"İyi günler":h<23?"İyi akşamlar":"İyi geceler";return n?g+", "+n+"!":g+"!"}
const CHAT=["Odamı yeni topladım. Yarın yine dağılır.","Piksel piksel düşünüyorum...","Rafımdaki kitabın sonunu çok merak ediyorum.","Biraz dans edeyim mi? Ediyorum!","Gitarım akortlu, istek parça var mı?","Pencereden bakınca dünya kare kare görünüyor.","Bugün kaç kalp topladın bakalım?","Halım turuncu, çünkü turuncu en güzel renk.","Hikâye şeridindeki en havalı ev benimki.","Bana dokunursan sohbet ederiz.","Bitkimi suladım, büyüyecek mi acaba?","Yatağım yumuşacık. Gece görüşürüz.","Kadraj'da gezmek çok keyifli.","Biri Okey mi dedi?","Bugün bir Klaket çeksene!"];
const MORN=["Günaydın! Sabah gitarı başlasın.","Sabahları en sevdiğim şey: gitar ve güneş.","Yeni bir gün, yeni pikseller!"];
const LIKE=["Bayıldım!","Bir kalp daha!","Harika seçim!","Bu çok güzeldi!"];
const WAKE=["Hıı? Uyanıktım zaten...","Beş dakika daha...","Tamam tamam, kalktım!"];
const TIPS={feed:()=>greet(),explore:()=>"Aramaya kişi adı ya da #etiket yazabilirsin.",chats:()=>"Oyunlar üstteki oyun kolunda. Bilgi Yarışması'nda seni yenerim!",activity:()=>"Sessiz mod Ayarlar'da. Ben de bazen sessiz olurum.",settings:()=>"Beni buradan açıp kapatabilirsin: Kadraj'a özel › Clawd.",profile:()=>{try{if(S.route.params&&S.route.params.uid&&S.route.params.uid!==S.uid)return""}catch(e){}return"Profili düzenle'den en çok 5 fotoğraf ekleyebilirsin."}};
function tip(page){const f=TIPS[page];if(!f||asleep())return;const key="kadraj_cw_tip_"+S.uid,day=new Date().toDateString(),st=LS.get(key,{})||{};if(st[page]===day)return;const t=f();if(!t)return;st[page]=day;LS.set(key,st);
 setTimeout(()=>{if((C.vis||inRoom())&&S.route.name===page&&!document.querySelector("#overlay [data-layer]")){if(page==="feed")play("wave");say(t)}},900)}
/* ---- alt menüdeki yer ---- */
function geo(){const d=document.getElementById("dock"),sh=document.getElementById("shell");const nav=d&&!d.hidden&&d.querySelector("nav");if(!nav||!sh)return null;const r=nav.getBoundingClientRect(),s=sh.getBoundingClientRect();if(!r.height)return null;
 const vh=(window.visualViewport&&visualViewport.height)||innerHeight;if(vh<innerHeight-120)return null;return{l:Math.max(s.left,r.left)+10,r:Math.min(s.right,r.right)-10-W,b:Math.round(innerHeight-r.top-3)}}
function want(){try{if(!C.on||settings.clawd===false||!S.authed||S.guest)return false;const p=S.route&&S.route.name;if(HIDE[p]||HOME[p])return false;if(document.querySelector("#main.chatmode,#main.chessmode"))return false;return true}catch(e){return false}}
function place(anim){if(!C.el)return;const g=want()&&geo();if(!g){show(false);return}if(C.x==null)C.x=+(LS.get("kadraj_cw_x",.1))||.1;C.x=Math.max(0,Math.min(1,C.x));
 if(!anim)C.el.classList.remove("wk");C.el.style.left=Math.round(g.l+(g.r-g.l)*C.x)+"px";C.el.style.bottom=g.b+"px";show(true)}
function show(v){if(C.vis===v)return;C.vis=v;C.el.classList.toggle("on",v);if(!v){stopWalk();if(!inRoom())hush()}}
function stopWalk(){if(C.wk){clearInterval(C.wk);C.wk=0}clearTimeout(C.wt);if(C.el)C.el.classList.remove("wk")}
function walkTo(x){const g=geo();if(!g||RM()||C.drag||inRoom())return;const from=C.x,dist=Math.abs(x-from)*(g.r-g.l);if(dist<24)return;const dur=Math.min(3200,Math.max(700,dist*22));stopWalk();stopAnim();setMode("up");const dir=x>from?1:-1;let k=0;
 C.el.style.setProperty("--cwt",dur+"ms");C.el.classList.add("wk");C.x=x;C.el.style.left=Math.round(g.l+(g.r-g.l)*x)+"px";clearTimeout(C.rv);
 C.wk=setInterval(()=>draw({legs:(k++%2)?"w1":"w2",lx:dir}),170);C.wt=setTimeout(()=>{stopWalk();draw();LS.set("kadraj_cw_x",C.x)},dur+30)}
/* ---- oda ---- */
function roomPut(){const p=S.route&&S.route.name,h=HOME[p];if(!h||!C.on)return;const strip=document.querySelector("#main "+h[0]);if(!strip)return;
 if(C.room&&C.room.isConnected&&strip.contains(C.room))return roomPaint();
 const w=C.roomW||document.createElement("div");if(!C.roomW){w.className="cwr-w";w.innerHTML=`<button class="cwr" type="button" aria-label="Clawd'ın odası, dokununca Clawd'la konuş"><span class="cwr-sc"></span><span class="cwr-dk"></span><span class="cwr-cl"></span></button><span>Clawd</span>`;
  C.roomW=w;C.room=w.querySelector(".cwr");C.rsp=w.querySelector(".cwr-cl");C.room.addEventListener("click",e=>{e.stopPropagation();if(asleep()||C.mode==="sleep"){C.wakeUntil=Date.now()+120000;setMode("up");pose({eyes:"wide"},700);say(pick(WAKE));return}open()})}
 const first=strip.querySelector(h[1]);if(first&&first.nextSibling)strip.insertBefore(w,first.nextSibling);else strip.appendChild(w);C.rsp._h="";roomPaint()}
function roomPaint(){if(!C.room)return;const n=asleep();if(C.room._n!==n){C.room._n=n;C.room.querySelector(".cwr-sc").innerHTML=roomSvg(n)}if(n&&C.mode!=="sleep")setMode("sleep");if(!n&&C.mode==="sleep")setMode("up");
 C.room.classList.toggle("bed",C.mode==="sleep");C.room.classList.toggle("dark",C.mode==="sleep");draw()}
/* ---- boşta ---- */
function plan(){clearTimeout(C.t);if(!C.on)return;C.t=setTimeout(act,4000+rnd(5000))}
function act(){plan();const room=inRoom();if((!C.vis&&!room)||document.hidden||C.wk||C.an||C.drag||C.busy)return;try{if(document.querySelector("#overlay [data-layer]"))return}catch(e){}
 if(room){const r=C.room.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return}
 if(asleep()){if(C.mode!=="sleep"){setMode("sleep");if(room)roomPaint()}else if(rnd(2)===0)fx("z",2);return}
 if(C.mode==="sleep"){setMode("up");if(room)roomPaint()}
 const idle=Date.now()-C.lastTouch,r=rnd(100),quiet=Date.now()-C.talkAt>70000;
 if(quiet&&r<14)return say(morning()&&rnd(2)?pick(MORN):pick(CHAT));
 if(idle>50000){if(C.mode==="up")return setMode(rnd(2)?"read":"sit");if(r<40)return pose({eyes:"blink"},160);if(C.mode==="read"&&r<70)return play("read");return}
 if(C.mode!=="up"){if(r<40)return setMode("up");return pose({eyes:"blink"},160)}
 if(morning()&&r<22)return play("guitar");
 if(r<24)return pose({eyes:"blink"},150);if(r<34)return play("look");if(r<42)return play("dance");if(r<48)return play("wave");if(r<53)return play("stretch");if(r<58)return play("spin");
 if(r<64){hop();return pose({eyes:"happy"},600)}if(r<72)return play("guitar");if(r<78)return setMode("sit");if(r<84)return setMode("read");if(!room&&r<97)return walkTo(Math.random())}
/* ---- tepkiler ---- */
function react(k){const room=inRoom();if((!C.vis&&!room)||C.wk||C.drag||C.mode==="sleep")return;
 if(k==="like"){stopAnim();hop();pose({eyes:"happy",arms:"up"},900);fx("heart",2);if(Date.now()-C.talkAt>20000&&rnd(3)===0)say(pick(LIKE),2400)}
 else if(k==="toast")pose({eyes:"up"},1300);else if(k==="down")pose({eyes:"down"},600);else if(k==="up")pose({eyes:"up"},600);else if(k==="hi")play("wave")}
/* ---- pencere ---- */
const SYS="Sen Clawd'sın: Kadraj uygulamasında, kendi küçük piksel odasında yaşayan turuncu piksel maskot. Türkçe konuş. Kısa (en çok 4 cümle), sıcak ve eğlenceli ol; hafif şakalar yapabilirsin ama kimseyle dalga geçme, kırıcı, korkutucu ya da uygunsuz şey söyleme, emoji kullanma. Bilmediğini uydurma; emin değilsen 'Bunu bilmiyorum' de ve Rota'ya sormayı öner. Kadraj hakkında bildiklerin:\n";
function local(q){const f=typeof cwFoldQ==="function"?cwFoldQ(q):q.toLocaleLowerCase("tr");
 if(/^(selam|merhaba|sa|hey|günaydın|iyi (akşamlar|geceler|günler))\b/.test(f))return greet()+" Odama hoş geldin. Ne yapalım?";
 if(/kimsin|nesin|adın ne|clawd (kim|ne)/.test(f))return"Ben Clawd! Hikâye şeridindeki küçük piksel odada yaşıyorum. Gündüz gitar çalar, kitap okur, dans ederim; gece yatağımda uyurum. Kadraj'la ilgili sorularına da yardım ederim.";
 if(/dans|oyna(r misin)?$|eğlen/.test(f))return{t:"Müzik başlasın!",fn:()=>{closeLayer("clawd");setTimeout(()=>play("dance"),400)}};
 if(/gitar|şarkı çal|müzik/.test(f))return{t:"Hemen akort ediyorum...",fn:()=>{closeLayer("clawd");setTimeout(()=>play("guitar"),400)}};
 if(/oda(n|sı)|evin|nerede yaşı/.test(f))return"Odam Akış'taki hikâye şeridinde ve Sohbet'teki notlar şeridinde. Pencerem, rafım, lambam, bitkim ve turuncu halım var. Gece lambayı söndürüp uyurum.";
 if(/gizle|kapat|git(sene)?$|görünme/.test(f)&&/seni|beni|clawd|kendini|git/.test(f))return{t:"Peki, odama çekiliyorum. Ayarlar › Kadraj'a özel › Clawd'dan beni yeniden açabilirsin.",fn:()=>{settings.clawd=false;saveSettings();closeLayer("clawd");stop()}};
 if(/yenilik|neler yeni|ne değişti|güncelleme/.test(f)){try{const it=WN_ITEMS.slice(0,6).map(x=>"• "+(x.t||x.title||"")).filter(x=>x.length>2).join("\n");return"Bu sürümde ("+APP_FULL+"):\n"+it}catch(e){}}
 if(/saat kaç|bugün (günlerden|ayın)|tarih/.test(f)){const d=new Date();return"Saat "+d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})+", "+d.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})+"."}
 if(/uyu|uykun/.test(f))return"Gece yarısından sabah yediye kadar yatağımda uyurum. Odama dokunursan uyanırım ama biraz mızmızlanırım.";
 return null}
function md(t){return esc(String(t)).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")}
async function answer(q){const l=local(q);if(l)return l;try{for(const[re,a]of FAQ)if(re.test(q))return{h:md(a)}}catch(e){}
 let kid=false;try{kid=isChild(S.uid)}catch(e){}
 try{if(!kid&&typeof kAI!=="undefined"&&kAI.ready()){const r=await kAI.ask({system:SYS+APP_GUIDE,messages:[{role:"user",content:q.slice(0,600)}],timeout:40000});const t=(r&&r.text||"").trim();if(t)return{h:md(typeof cleanText==="function"&&settings.hwBad!==false?cleanText(t):t)}}}catch(e){}
 return"Bunu bilmiyorum. Rota'ya sorabilirsin; o benden çok kitap okumuş."}
function open(){if(!S.authed)return;hush();C.lastTouch=Date.now();if(night())C.wakeUntil=Date.now()+120000;if(C.mode!=="up"){setMode("up");if(inRoom())roomPaint()}
 const l=sheet("clawd","",`<div class="cwd-hd"><span class="cwd-big" id="cwdBig">${cwSvg({eyes:"happy",arms:"hi"})}</span><span><b>Clawd</b><small>Hikâye şeridindeki piksel odada yaşar</small></span></div>
 <div class="cwd-log" id="cwdLog" aria-live="polite"><div class="cwd-m">${esc(greet())} Ne yapalım? Soru sorabilir ya da beni dans ettirebilirsin.</div></div>
 <div class="cwd-ch">${[["Dans et","Dans et"],["Gitar çal","Gitar çal"],["Yenilikler","Neler yeni?"],["Oyunlar","Okey nasıl oynanır?"],["Beni gizle","Clawd kendini gizle"]].map(([a,b])=>`<button type="button" data-cwq="${esc(b)}">${esc(a)}</button>`).join("")}</div>
 <form class="cwd-f" id="cwdF"><textarea class="in k1l" rows="1" id="cwdIn" maxlength="300" placeholder="Clawd'a sor" aria-label="Clawd'a sor"></textarea><button class="btn sm" type="submit">Sor</button></form>`,{tall:true,onClose:()=>{C.busy=false}});
 const log=l.querySelector("#cwdLog"),inp=l.querySelector("#cwdIn"),big=l.querySelector("#cwdBig"),body=l.querySelector(".body");
 const add=(h,cls)=>{const d=document.createElement("div");d.className="cwd-m "+(cls||"");d.innerHTML=h;log.appendChild(d);if(body)body.scrollTop=body.scrollHeight;return d};
 const ask=async q=>{q=String(q||"").trim();if(!q||C.busy)return;C.busy=true;add(esc(q),"me");const w=add("Düşünüyor...","wait");big.innerHTML=cwSvg({eyes:"up",arms:"t1"});let a;try{a=await answer(q)}catch(e){a="Bir sorun oldu. Biraz sonra yeniden dener misin?"}
  C.busy=false;if(!w.isConnected)return;w.classList.remove("wait");if(typeof a==="string")w.textContent=a;else if(a.h)w.innerHTML=a.h;else w.textContent=a.t;big.innerHTML=cwSvg({eyes:"happy"});if(body)body.scrollTop=body.scrollHeight;if(a&&a.fn)setTimeout(a.fn,1200)};
 l.querySelector("#cwdF").onsubmit=e=>{e.preventDefault();const q=inp.value;inp.value="";ask(q)};
 l.addEventListener("click",e=>{const b=e.target.closest("[data-cwq]");if(b)ask(b.dataset.cwq)})}
/* ---- olaylar ---- */
function wire(){const el=C.el;
 el.addEventListener("pointerdown",e=>{if(e.button)return;C.drag={x:e.clientX,l:parseFloat(el.style.left)||0,mv:false,id:e.pointerId};try{el.setPointerCapture(e.pointerId)}catch(_){}stopWalk();stopAnim()});
 el.addEventListener("pointermove",e=>{const d=C.drag;if(!d)return;const dx=e.clientX-d.x;if(!d.mv&&Math.abs(dx)<8)return;d.mv=true;const g=geo();if(!g)return;const L=Math.max(g.l,Math.min(g.r,d.l+dx));el.style.left=L+"px";C.x=(L-g.l)/Math.max(1,g.r-g.l);hush();draw({legs:"dang1",eyes:"wide"})});
 const up=e=>{const d=C.drag;if(!d)return;C.drag=null;if(d.mv){LS.set("kadraj_cw_x",C.x);pose({eyes:"blink"},200)}else if(e.type==="pointerup"){if(asleep()||C.mode==="sleep"){C.wakeUntil=Date.now()+120000;setMode("up");pose({eyes:"wide"},700)}open()}};
 el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
 el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
 document.addEventListener("click",e=>{C.lastTouch=Date.now();try{if(e.target.closest&&e.target.closest("[data-like],[data-dbl]"))react("like")}catch(_){}},true);
 let lt=0;document.addEventListener("pointerdown",e=>{C.lastTouch=Date.now();if(!C.vis||C.wk||C.drag||C.an||C.mode==="sleep"||e.target.closest(".cwd,.cwr"))return;if(C.mode!=="up")setMode("up");const n=Date.now();if(n-lt<2500)return;lt=n;const r=el.getBoundingClientRect();pose({lx:e.clientX<r.left+W/2?-1:1,eyes:e.clientY<r.top-200?"up":""},900)},{capture:true,passive:true});
 let ls=0,ly=0;document.addEventListener("scroll",e=>{const t=e.target;if(!t||t.id!=="main")return;hush();const n=Date.now(),y=t.scrollTop;if(n-ls>1600){ls=n;react(y>ly?"down":"up")}ly=y;C.lastTouch=n},{capture:true,passive:true});
 try{const ts=document.getElementById("toasts");if(ts)new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))react("toast")}).observe(ts,{childList:true})}catch(e){}
 addEventListener("resize",()=>{hush();place()});if(window.visualViewport)visualViewport.addEventListener("resize",()=>place());
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&C.on){page();plan()}else hush()})}
function start(){if(C.on)return;if(!document.getElementById("cwdCss")){const s=document.createElement("style");s.id="cwdCss";s.textContent=CSS;document.head.appendChild(s)}
 if(!C.el){const el=document.createElement("div");el.className="cwd";el.id="cwd";el.setAttribute("role","button");el.tabIndex=0;el.setAttribute("aria-label","Clawd, Kadraj'ın piksel maskotu");el.innerHTML=`<span class="cwd-sp"></span>`;(document.getElementById("shell")||document.body).appendChild(el);C.el=el;C.sp=el.querySelector(".cwd-sp");wire()}
 C.on=true;C.mode=asleep()?"sleep":"up";C.sp._h="";draw();page();plan()}
function stop(){C.on=false;clearTimeout(C.t);clearTimeout(C.rv);stopAnim();stopWalk();hush();if(C.roomW)C.roomW.remove();if(C.el){C.vis=true;show(false)}}
function page(){if(!C.on||!C.el)return;if(!C.el.isConnected)(document.getElementById("shell")||document.body).appendChild(C.el);if(C.bub&&!C.bub.isConnected)C.bub=null;
 const p=S.route&&S.route.name;if(HOME[p])roomPut();place();if(p!==C.lastPage){hush();stopAnim();if(C.vis||inRoom()){C.lastPage=p;draw();tip(p)}else C.lastPage=""}}
window.CLAWD={start,stop,page,open,say,_s:C,_act:act,_walk:walkTo,_react:react,_answer:answer,_mode:setMode,_play:play,_room:()=>C.room};
})();
