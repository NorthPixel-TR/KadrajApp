/* 7.0.28 Clawd: yükleme, yer, sayfalar, tepkiler, pencere, sürükleme, ayar, yük. node t.js <genişlik> [koyu] */
const {open}=require('../m70/lib.js');const W=+process.argv[2]||390;const dark=process.argv.includes("koyu");let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const OUT='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/clawd/';require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errors}=await open(W,820,{dark});
 await p.evaluate(()=>{go("feed")});
 let s=await p.evaluate(()=>!!window.CLAWD);ok(!s,"açılışta yüklenmez (gecikmeli)");
 await p.evaluate(()=>cw2Go());await p.waitForFunction(()=>window.CLAWD&&CLAWD._s.vis,null,{timeout:8000});await p.waitForTimeout(400);
 const geo=()=>p.evaluate(()=>{const e=document.getElementById("cwd"),r=e.getBoundingClientRect(),n=document.querySelector("#dock nav").getBoundingClientRect(),sh=document.getElementById("shell").getBoundingClientRect();return{on:e.classList.contains("on"),l:Math.round(r.left),r:Math.round(r.right),b:Math.round(r.bottom),navTop:Math.round(n.top),shL:Math.round(sh.left),shR:Math.round(sh.right),svg:!!e.querySelector("svg"),par:e.parentElement.id,vis:CLAWD._s.vis,mode:CLAWD._s.mode}});
 s=await geo();ok(s.on&&s.svg&&s.par==="shell","Clawd görünür, #shell içinde");ok(Math.abs(s.b-s.navTop)<=8&&s.l>=s.shL&&s.r<=s.shR,`alt menünün üstünde duruyor (alt ${s.b}, menü ${s.navTop}; sol ${s.l})`);
 await p.waitForTimeout(1300);const tip=await p.evaluate(()=>{const b=document.querySelector(".cwd-bub");return b.hidden?"":b.textContent});ok(/Günaydın|İyi (günler|akşamlar|geceler)/.test(tip)||s.mode==="sleep","Akış'ta selam: "+(tip||"(uyuyor)"));
 await p.screenshot({path:OUT+"feed-"+W+(dark?"-k":"")+".png"});
 /* uyanık kipe al (test saatinden bağımsız) */
 await p.evaluate(()=>{CLAWD._s.wakeUntil=Date.now()+6e5;CLAWD._mode("up")});
 /* sayfalar */
 const vis=async r=>{await p.evaluate(r=>{if(r==="chat")openChat("u:u2");else go(r)},r);await p.waitForTimeout(700);return p.evaluate(()=>CLAWD._s.vis)};
 ok(await vis("explore")&&await vis("chats")&&await vis("profile")&&await vis("settings"),"Keşfet, Sohbetler, Profil ve Ayarlar'da görünür");
 ok(!(await vis("chat")),"sohbette görünmez");await p.evaluate(()=>back());await p.waitForTimeout(600);ok(!(await vis("reels")),"Klakette görünmez");
 ok(await vis("feed"),"Akış'a dönünce yeniden görünür");await p.waitForTimeout(2600);const tip2=await p.evaluate(()=>{const b=document.querySelector(".cwd-bub");return b.hidden?"":b.textContent});ok(/Günaydın|İyi (günler|akşamlar|geceler)/.test(tip2)||/Günaydın|İyi (günler|akşamlar|geceler)/.test(tip),"uyanıkken Akış'ta selam (günde bir kez): "+(tip2||tip));await p.screenshot({path:OUT+"hi-"+W+(dark?"-k":"")+".png"});await p.evaluate(()=>{CLAWD._s.t&&clearTimeout(CLAWD._s.t)});await p.waitForTimeout(1500);
 /* tepkiler: poz değişir ve geri döner */
 const svg=()=>p.evaluate(()=>document.querySelector("#cwd .cwd-sp").innerHTML);
 const rest=await svg();await p.evaluate(()=>CLAWD._react("like"));const liked=await svg();await p.waitForTimeout(1200);const back2=await svg();ok(liked!==rest&&back2===rest,"beğenide sevinir, sonra eski duruşuna döner");
 /* yürüme */
 const x0=(await geo()).l;await p.evaluate(()=>CLAWD._walk(CLAWD._s.x>.5?.05:.95));await p.waitForTimeout(400);const mid=await p.evaluate(()=>!!CLAWD._s.wk);await p.waitForTimeout(3600);const g2=await geo();const still=await p.evaluate(()=>!!CLAWD._s.wk);
 ok(mid&&!still&&Math.abs(g2.l-x0)>60&&g2.l>=g2.shL&&g2.r<=g2.shR,`yürüdü ve durdu (${x0} → ${g2.l})`);
 /* boşta hareketler: 40 kez, hata yok, sınır dışına çıkmıyor */
 const acts=await p.evaluate(async()=>{let bad=0;for(let i=0;i<40;i++){CLAWD._act();await new Promise(r=>setTimeout(r,30));const e=document.getElementById("cwd").getBoundingClientRect(),sh=document.getElementById("shell").getBoundingClientRect();if(e.left<sh.left-1||e.right>sh.right+1)bad++}return bad});await p.waitForTimeout(3500);ok(acts===0,"40 boşta hareket: sınır içinde");
 /* rAF kullanmıyor, boşta yük */
 const load=await p.evaluate(async()=>{let n=0;const o=window.requestAnimationFrame;window.requestAnimationFrame=function(f){n++;return o.call(window,f)};await new Promise(r=>setTimeout(r,3000));window.requestAnimationFrame=o;return n});ok(load<20,"3 sn boşta requestAnimationFrame çağrısı: "+load);
 /* pencere */
 await p.evaluate(()=>{CLAWD._s.wakeUntil=Date.now()+6e5;CLAWD._mode("up");CLAWD.open()});await p.waitForTimeout(500);
 s=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="clawd"]');return{l:!!l,chips:l?l.querySelectorAll("[data-cwq]").length:0,ov:l?l.querySelector(".sheet").scrollWidth-l.querySelector(".sheet").clientWidth:9}});ok(s.l&&s.chips===5&&s.ov<=0,"Clawd penceresi açıldı, 5 hazır soru, taşma yok");
 const ask=async q=>{await p.evaluate(q=>{const l=document.querySelector('#overlay [data-layer="clawd"]');l.querySelector("#cwdIn").value=q;l.querySelector("#cwdF").requestSubmit()},q);await p.waitForFunction(()=>!document.querySelector(".cwd-m.wait"),null,{timeout:8000});return p.evaluate(()=>[...document.querySelectorAll(".cwd-log .cwd-m")].pop().textContent)};
 let a=await ask("kimsin");ok(/Ben Clawd/.test(a),"kimsin → "+a.slice(0,50));
 a=await ask("okey nasıl oynanır");ok(/Okey/.test(a)&&/oyun kolu/.test(a),"okey → FAQ: "+a.slice(0,60));
 a=await ask("neler yeni");ok(/Bu sürümde/.test(a),"neler yeni → "+a.replace(/\n/g," ").slice(0,60));
 a=await ask("kuantum fiziği nedir acaba");ok(/bilmiyorum|Rota/.test(a),"bilinmeyen soru (köprü yok) → "+a.slice(0,50));
 a=await ask("<img src=x onerror=window.__x=1>");const xss=await p.evaluate(()=>!!window.__x||!!document.querySelector(".cwd-log img"));ok(!xss,"soru metni HTML olarak işlenmiyor");
 await p.screenshot({path:OUT+"sheet-"+W+(dark?"-k":"")+".png"});
 await p.evaluate(()=>closeAll());await p.waitForTimeout(400);
 /* sürükleme */
 const g3=await geo();const cx=g3.l+23,cy=g3.b-20,tx=g3.l>(g3.shL+g3.shR)/2?g3.shL+60:g3.shR-60;
 await p.mouse.move(cx,cy);await p.mouse.down();await p.mouse.move((cx+tx)/2,cy,{steps:4});await p.mouse.move(tx,cy,{steps:4});await p.mouse.up();await p.waitForTimeout(300);
 const g4=await geo();const sx=await p.evaluate(()=>LS.get("kadraj_cw_x"));const op=await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="clawd"]'));ok(Math.abs(g4.l-g3.l)>100&&g4.l>=g4.shL&&g4.r<=g4.shR&&typeof sx==="number"&&!op,`sürüklendi (${g3.l} → ${g4.l}), yer kaydedildi, pencere açılmadı`);
 /* dokunma → pencere */
 await p.mouse.click(g4.l+23,g4.b-20);await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="clawd"]')),"dokununca pencere açılır");await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 /* gece: uyur, dokununca uyanır */
 await p.evaluate(()=>{const D=Date;window.__D=D;const fake=new D();fake.setHours(3);const off=fake.getTime()-D.now();window.Date=class extends D{constructor(...a){if(a.length)super(...a);else super(D.now()+off)}static now(){return D.now()+off}};CLAWD._s.wakeUntil=0;CLAWD._act()});await p.waitForTimeout(200);
 s=await p.evaluate(()=>CLAWD._s.mode);ok(s==="sleep","gece 03:00'te uyur");await p.screenshot({path:OUT+"sleep-"+W+".png"});
 await p.evaluate(()=>{window.Date=window.__D;CLAWD._s.wakeUntil=Date.now()+6e5;CLAWD._mode("up")});
 /* ayar */
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(700);
 s=await p.evaluate(()=>{const i=document.querySelector("[data-cw2]");if(!i)return{i:false};const g=i.closest(".sg-g,section");i.checked=false;i.dispatchEvent(new Event("change",{bubbles:true}));return{i:true,set:settings.clawd,vis:CLAWD._s.vis,on:document.getElementById("cwd").classList.contains("on")}});ok(s.i&&s.set===false&&!s.vis&&!s.on,"Ayarlar'da Clawd anahtarı kapatınca kaybolur");
 await p.evaluate(()=>{go("feed")});await p.waitForTimeout(600);ok(!(await p.evaluate(()=>CLAWD._s.vis)),"kapalıyken sayfa değişince geri gelmez");
 await p.evaluate(()=>{settings.clawd=true;saveSettings();cw2Go()});await p.waitForTimeout(600);ok(await p.evaluate(()=>CLAWD._s.vis),"yeniden açınca gelir");
 /* çıkış */
 await p.evaluate(()=>{try{endSession()}catch(e){}});await p.waitForTimeout(500);ok(!(await p.evaluate(()=>CLAWD._s.vis)),"çıkışta kaybolur");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
