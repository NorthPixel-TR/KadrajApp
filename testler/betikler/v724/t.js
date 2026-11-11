// 7.2.4 Clawd Koşu: açılır, dokununca başlar, zıplar, piksel toplar, engele çarpınca biter, rekor profiles.kosu, arkadaş tablosu, duraklatma, başarım. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(async()=>{settings.clawd=false;await DB.update("profiles/u2",{kosu:340});await DB.update("profiles/u3",{kosu:1200});LS.del("kadraj_kosu_u1");closeAll();gmHub()});await p.waitForTimeout(400);
 ok(await p.$('[data-gm="ku"]'),"Oyunlar penceresinde Clawd Koşu");await p.click('[data-gm="ku"]');await p.waitForTimeout(900);
 let r=await p.evaluate(()=>({ov:document.querySelector("#kuOv").textContent,tb:[...document.querySelectorAll(".ku-r")].map(x=>x.textContent),cv:document.querySelector("#kuCv").getBoundingClientRect().width}));
 ok(/Başla/.test(r.ov)&&r.cv>=W-2,"hazır ekranı, tuval tam genişlik");ok(r.tb.length===2&&/1200/.test(r.tb[0])&&/340/.test(r.tb[1]),"arkadaş tablosu: "+r.tb.join(" | "));
 await p.screenshot({path:O+"ku-ready-"+W+".png"});
 // sprite gerçekten çizildi mi (Clawd turuncusu)
 ok(await p.evaluate(()=>{const c=document.querySelector("#kuC").getContext("2d").getImageData(30,112,23,22).data;for(let i=0;i<c.length;i+=4)if(c[i]===0xD9&&c[i+1]===0x77&&c[i+2]===0x57)return true;return false}),"Clawd tuvalde");
 await p.click("#kuCv");await p.waitForTimeout(300);r=await p.evaluate(()=>KOSU._t.G().st);ok(r==="run","dokununca başladı");
 // engelleri kaldır, zıpla
 await p.evaluate(()=>KOSU._t.set({obs:[],next:99999,gems:[],nextG:99999}));
 await p.dispatchEvent("#kuCv","pointerdown");await p.waitForTimeout(150);r=await p.evaluate(()=>{const g=KOSU._t.G();return{y:g.y,ground:g.ground}});await p.dispatchEvent("#kuCv","pointerup");ok(!r.ground&&r.y<134,"zıpladı (y "+Math.round(r.y)+")");
 await p.waitForTimeout(1500);ok(await p.evaluate(()=>KOSU._t.G().ground),"yere indi");
 // piksel topla: Clawd'ın önüne koy
 await p.evaluate(()=>KOSU._t.G().gems.push({x:44,y:124,got:false}));await p.waitForTimeout(250);r=await p.evaluate(()=>KOSU._t.G().coins);ok(r===1,"turuncu piksel toplandı");
 await p.screenshot({path:O+"ku-run-"+W+".png"});
 // gece: puanı 700'e taşı
 await p.evaluate(()=>{const g=KOSU._t.G();g.dist=700*6});await p.waitForTimeout(200);ok(await p.evaluate(()=>KOSU._t.G().night),"700 puanda gece");await p.screenshot({path:O+"ku-night-"+W+".png"});
 // duraklat (geri tuşu korumalı)
 await p.evaluate(()=>closeTop());await p.waitForTimeout(150);ok(await p.evaluate(()=>KOSU._t.G().st==="paused"&&!!document.querySelector('[data-layer="kosu"]')),"geri tuşu önce duraklatır");
 await p.click("#kuCv");await p.waitForTimeout(150);ok(await p.evaluate(()=>KOSU._t.G().st==="run"),"dokununca devam");
 // engele çarp
 await p.evaluate(()=>{const g=KOSU._t.G();g.obs.push({k:0,x:38,w:16,h:12});g.y=134;g.vy=0;g.ground=true});await p.waitForTimeout(300);
 r=await p.evaluate(()=>{const g=KOSU._t.G();return{st:g.st,sc:g.score,rec:g.rec,ov:document.querySelector("#kuOv").textContent,best:LS.get("kadraj_kosu_u1",{}).best,db:P("u1").kosu}});
 ok(r.st==="over"&&/Yeni rekor/.test(r.ov),"çarpınca bitti: "+r.ov);ok(r.best===r.sc&&r.db===r.sc&&r.sc>=700,"rekor cihaza ve profiles.kosu'ya ("+r.sc+")");
 await p.screenshot({path:O+"ku-over-"+W+".png"});
 r=await p.evaluate(()=>[...document.querySelectorAll(".ku-r")].map(x=>x.textContent));ok(r.length===3&&r.some(t=>/Bilal/.test(t)),"tabloda ben de varım: "+r.join(" | "));
 // başarım
 r=await p.evaluate(async()=>{achCheck(true);await new Promise(r=>setTimeout(r,400));return{e:!!achSt().e.kosucu,last:ACH[ACH.length-1][0]}});ok(r.e&&r.last==="zirve","Koşucu başarımı");
 // daha düşük puanda profil yazılmaz
 await p.waitForTimeout(600);await p.click("#kuCv");await p.waitForTimeout(200);const w0=await p.evaluate(()=>{window.__w=0;const u=DB.update;DB.update=function(...a){if(/^profiles\//.test(a[0])&&a[1]&&"kosu"in a[1])window.__w++;return u.apply(this,a)};const g=KOSU._t.G();g.obs.push({k:1,x:38,w:12,h:19});return 1});
 await p.waitForTimeout(400);ok(await p.evaluate(()=>KOSU._t.G().st==="over"&&window.__w===0),"rekor değilse yazma yok");
 await p.evaluate(()=>closeLayer("kosu"));await p.waitForTimeout(300);await p.waitForTimeout(300);ok(await p.evaluate(()=>!document.querySelector('[data-layer="kosu"]')),"kapandı");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
