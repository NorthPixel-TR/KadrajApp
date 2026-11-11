// 7.2.5 Kadraj yolculuğun: veri, kartlar, sayma, en büyük hayran, ilerleme/duraklatma, paylaş, Akış kartı dönemleri, girişler. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(async()=>{settings.clawd=false;const T=Date.now(),D=864e5;await DB.update("profiles/u1",{createdAt:T-40*D,chess:{g:5,r:1320,w:3,l:2,d:0},kosu:420});
  await DB.set("posts/y1",{uid:"u1",at:T-3*D,kind:"photo",src:"img/kahve.jpg",caption:"#kahve sabahı",ar:"1/1"});await DB.set("posts/y2",{uid:"u1",at:T-2*D,kind:"photo",src:"img/kahve.jpg",caption:"yine #kahve",ar:"1/1"});
  await DB.set("posts/y3",{uid:"u1",at:T-D,kind:"note",text:"merhaba",bg:1});
  await DB.set("meta/y1",{likes:{u2:T,u3:T,u4:T},comments:{c1:{uid:"u2",text:"süper",at:T},c2:{uid:"u2",text:"çok iyi",at:T}}});await DB.set("meta/y2",{likes:{u2:T}});
  LS.set("kadraj_qz_u1",{wins:2,best:5000,games:3});closeAll();tab("feed")});
 await p.waitForTimeout(900);
 let d=await p.evaluate(()=>{const d=yolData();return{days:d.days,posts:d.posts,likes:d.likes,best:d.best&&d.best.id,fan:d.fanU,tag:d.tag,ku:d.ku,ch:d.ch.g,qz:d.qz.wins,n:yolCards(d).length}});
 ok(d.days===41&&d.posts===3&&d.likes===4&&d.best==="y1","veri: gün, paylaşım, beğeni, en çok beğenilen "+JSON.stringify(d));ok(d.fan&&d.fan[0]==="u2"&&d.fan[1]===4&&d.tag&&d.tag[0]==="#kahve","en büyük hayran Ayşe (4), etiket #kahve");
 ok(d.n===8,"8 kart ("+d.n+")");
 await p.evaluate(()=>{const e=document.getElementById("achPop");e&&e.remove();ACT.yolOpen()});await p.waitForTimeout(1300);
 let r=await p.evaluate(()=>({bars:document.querySelectorAll(".yl-bars i").length,num:document.querySelector("#ylS .yl-num").textContent,t:document.querySelector("#ylS").textContent}));ok(r.bars===8&&r.num==="41"&&/gündür Kadraj/.test(r.t),"giriş kartı sayarak 41: "+r.num);
 await p.screenshot({path:O+"yol-1-"+W+".png"});
 await p.click(".yl-n");await p.waitForTimeout(1200);r=await p.evaluate(()=>({i:YL.i,t:document.querySelector("#ylS").textContent}));ok(r.i===1&&/3paylaşım/.test(r.t.replace(/\s/g,""))&&/2 fotoğraf, 1 not/.test(r.t),"sağa dokun: paylaşımlar kartı");
 await p.click(".yl-n");await p.waitForTimeout(1200);await p.screenshot({path:O+"yol-3-"+W+".png"});ok(await p.evaluate(()=>!!document.querySelector("#ylS .yl-ph img")),"en çok beğenilen fotoğraf kartı");
 await p.click(".yl-n");await p.waitForTimeout(1000);r=await p.evaluate(()=>document.querySelector("#ylS").textContent);ok(/En büyük hayranın/.test(r)&&/Ayşe/.test(r)&&/4 kez/.test(r),"en büyük hayran kartı");await p.screenshot({path:O+"yol-4-"+W+".png"});
 await p.click(".yl-p");await p.waitForTimeout(500);ok(await p.evaluate(()=>YL.i===2),"sola dokun: geri");
 // basılı tut: durur
 const box=await (await p.$(".yl-n")).boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.waitForTimeout(400);const i0=await p.evaluate(()=>YL.i);await p.waitForTimeout(6500);const i1=await p.evaluate(()=>YL.i);await p.mouse.up();await p.waitForTimeout(200);
 ok(i0===2&&i1===2&&await p.evaluate(()=>YL.i===2),"basılı tutunca durur, bırakınca geçmez");
 await p.waitForTimeout(6300);ok(await p.evaluate(()=>YL.i===3),"bırakınca kalan sürede kendiliğinden ilerler");
 for(let k=0;k<4;k++){await p.click(".yl-n");await p.waitForTimeout(300)}
 r=await p.evaluate(()=>({i:YL.i,end:!!document.querySelector('[data-yl="share"]'),t:document.querySelector("#ylS").textContent}));ok(r.i===7&&r.end&&/Zirve/.test(r.t),"son kart: Zirve ve paylaş");
 await p.waitForTimeout(800);await p.screenshot({path:O+"yol-end-"+W+".png"});
 await p.waitForTimeout(6500);ok(await p.evaluate(()=>!!YL&&YL.i===7),"son kartta kendiliğinden kapanmaz");
 await p.click('[data-yl="share"]');await p.waitForTimeout(1500);r=await p.evaluate(()=>({k:S.cmp&&S.cmp.kind,w:S.cmp&&S.cmp.img&&S.cmp.img.width,yol:!!document.querySelector('[data-layer="yol"]')}));ok(r.k==="story"&&r.w===720&&!r.yol,"Hikâyende paylaş: 720x1280 hikâye oluştur");
 await p.evaluate(()=>closeAll());
 // Akış kartı dönemleri
 r=await p.evaluate(()=>{const f=t=>{YOL.now=()=>t;return yolPeriod()};const o=[f(Date.UTC(2026,11,29,10)),f(Date.UTC(2027,0,3,10)),f(Date.UTC(2027,0,9,10)),f(Date.UTC(2027,2,31,10)),f(Date.UTC(2027,3,7,10)),f(Date.UTC(2026,10,11,10))];YOL.now=()=>Date.now();return o});
 ok(JSON.stringify(r)==='["yb2027","yb2027","","zr2027","",""]',"dönemler "+JSON.stringify(r));
 await p.evaluate(()=>{YOL.now=()=>Date.UTC(2026,11,30,10);closeAll();tab("explore");tab("feed")});await p.waitForTimeout(700);
 r=await p.evaluate(()=>{const c=document.querySelector("#main .yolc");return c&&c.textContent});ok(r&&/2027 yolculuğun hazır/.test(r),"yılbaşında Akış kartı: "+r);
 await p.click("#main [data-yolx]");await p.evaluate(()=>{tab("explore");tab("feed")});await p.waitForTimeout(600);ok(await p.evaluate(()=>!document.querySelector("#main .yolc")),"kapatınca o dönem çıkmaz");
 await p.evaluate(()=>{YOL.now=()=>Date.now();tab("explore");tab("feed")});await p.waitForTimeout(500);ok(await p.evaluate(()=>!document.querySelector("#main .yolc")),"dönem dışında kart yok");
 // girişler
 await p.evaluate(()=>{closeAll();go("settings")});await p.waitForTimeout(700);ok(await p.evaluate(()=>!!document.querySelector('#main [data-act="yolOpen"]')),"Ayarlar'da Kadraj yolculuğun");
 await p.evaluate(()=>{closeAll();achSheet(S.uid)});await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="ach"] .yl-ent')),"başarımlar penceresinde giriş");
 await p.evaluate(()=>{closeAll();achSheet("u2")});await p.waitForTimeout(300);ok(await p.evaluate(()=>!document.querySelector('#overlay [data-layer="ach"] .yl-ent')),"başkasının başarımlarında yok");
 // yeni kullanıcı: veri yok → kısa yolculuk
 r=await p.evaluate(async()=>{closeAll();await DB.set("profiles/u9",{uid:"u9",username:"yeni",name:"Yeni",createdAt:Date.now(),following:{}});const o=S.uid;S.uid="u9";const n=yolCards(yolData()).length;S.uid=o;return n});ok(r>=2&&r<=3,"verisi olmayan kişide az kart ("+r+")");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
