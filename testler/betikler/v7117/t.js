// 7.1.17 Ortak albüm: grupta + menüsü ve ayrıntılarda giriş, yeni albüm, fotoğraf ekle, sohbette albüm çipi, eski fotoğraflar sorguyla gelir, DM'de yok
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const over=p=>p.evaluate(()=>{const iw=innerWidth,o=[];for(const e of document.querySelectorAll('#overlay [data-layer="album"] *')){const r=e.getBoundingClientRect();if(r.width&&(r.right>iw+1||r.left<-1))o.push(e.className+" "+Math.round(r.right))}return o.slice(0,3)});
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(()=>{window.__img=(h)=>{const c=document.createElement("canvas");c.width=400;c.height=300;const g=c.getContext("2d");g.fillStyle=`hsl(${h},60%,50%)`;g.fillRect(0,0,400,300);const im=new Image();im.src=c.toDataURL("image/jpeg",.8);return im};
  phPick=async(n)=>{const a=[__img(10),__img(120),__img(240)].slice(0,n);await Promise.all(a.map(i=>i.decode()));return a.map(img=>({img,src:null}))}});
 await p.evaluate(async()=>{closeAll();openChat("g:gr-1")});await p.waitForTimeout(700);
 await p.evaluate(()=>plusMenu(S.route.params.key));await p.waitForTimeout(400);
 ok(await p.$('#overlay [data-layer="plus"] #palb'),"grupta + menüsünde Ortak albüm");
 await p.evaluate(()=>{closeAll();chatInfo(S.route.params.key)});await p.waitForTimeout(500);
 ok(await p.$('#overlay [data-ci="album"]'),"Sohbet ayrıntılarında Ortak albüm satırı");
 await p.click('#overlay [data-ci="album"]');await p.waitForTimeout(700);
 ok(await p.$('#overlay [data-layer="album"] #albNew'),"albüm penceresi açıldı, Yeni albüm kartı var");
 await p.click('#albNew');await p.waitForTimeout(300);await p.fill('#albN','Okul gezisi');await p.click('#albGo');await p.waitForTimeout(2500);
 let r=await p.evaluate(()=>({t:document.getElementById("albT").textContent,n:document.querySelectorAll(".alb-grid .alb-ph").length,msgs:(S.msgs||[]).filter(m=>m.alb==="Okul gezisi"&&m.img).length,head:(document.querySelector(".alb-head")||{}).textContent}));
 ok(r.t==="Okul gezisi"&&r.n===3,"albüm açıldı, 3 fotoğraf ızgarada ("+r.n+")");ok(r.msgs===3,"fotoğraflar grup mesajı olarak gitti, alb alanıyla ("+r.msgs+")");ok(/sen ekledi/.test(r.head||""),"ekleyen yazıyor: "+r.head);
 ok((await over(p)).length===0,"albüm ekranında taşma yok");
 await p.screenshot({path:'/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/alb1-'+W+'.png'});
 await p.click('#albBk');await p.waitForTimeout(400);
 r=await p.evaluate(()=>[...document.querySelectorAll(".alb-card[data-alb]")].map(x=>x.querySelector("b").textContent+"|"+x.querySelector("small").textContent));
 ok(r.length===1&&/Okul gezisi\|3 fotoğraf/.test(r[0]),"albüm listesinde kart: "+r.join(","));
 await p.screenshot({path:'/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/alb2-'+W+'.png'});
 /* sohbette çip */
 await p.evaluate(()=>closeAll());await p.waitForTimeout(600);
 ok(await p.evaluate(()=>document.querySelectorAll('#msgs [data-albo="Okul gezisi"]').length===3),"sohbetteki albüm fotoğraflarında 'Albüm: Okul gezisi' çipi");
 await p.evaluate(()=>document.querySelector('#msgs [data-albo]').click());await p.waitForTimeout(600);
 ok(await p.evaluate(()=>document.getElementById("albT").textContent==="Okul gezisi"&&document.querySelectorAll(".alb-grid .alb-ph").length===3),"çipe dokununca albüm açılıyor");
 /* geri tuşu önce listeye döner */
 await p.evaluate(()=>closeTop());await p.waitForTimeout(300);ok(await p.evaluate(()=>!!document.getElementById("albNew")),"geri: önce albüm listesine dönüyor");
 /* eski albüm fotoğrafı (son 300 mesajın dışında) sorguyla gelir */
 await p.evaluate(async()=>{closeAll();const T=Date.now()-9e8;const c=document.createElement("canvas");c.width=60;c.height=60;c.getContext("2d").fillRect(0,0,60,60);
  await DB.set("chats/gr-1/msgs/old1",{from:"u2",at:T,img:c.toDataURL("image/jpeg",.7),text:"",alb:"Yaz tatili"});
  for(let i=0;i<305;i++)await DB.set("chats/gr-1/msgs/z"+i,{from:i%2?"u3":"u5",at:T+1000+i,text:"mesaj "+i});closeAll();go("chats");});
 await p.waitForTimeout(300);await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(1200);
 r=await p.evaluate(()=>({inMsgs:(S.msgs||[]).some(m=>m.id==="old1"),n:(S.msgs||[]).length}));ok(!r.inMsgs,"eski albüm fotoğrafı sohbetin yüklü mesajlarında yok ("+r.n+" mesaj)");
 await p.evaluate(()=>{for(const k in ALB)delete ALB[k];albSheet(S.route.params.key)});await p.waitForTimeout(1500);
 r=await p.evaluate(()=>[...document.querySelectorAll(".alb-card[data-alb]")].map(x=>x.dataset.alb));ok(r.includes("Yaz tatili")&&r.includes("Okul gezisi"),"albüm açılınca eski fotoğraflar da geldi: "+r.join(","));
 ok(await p.evaluate(()=>!document.getElementById("albLd")),"yükleniyor yazısı kalktı");
 /* DM'de yok */
 await p.evaluate(()=>{closeAll();openChat("u:u2")});await p.waitForTimeout(600);await p.evaluate(()=>plusMenu(S.route.params.key));await p.waitForTimeout(300);
 ok(!(await p.$('#overlay #palb')),"DM'de + menüsünde Ortak albüm yok");
 await p.evaluate(()=>{closeAll();chatInfo(S.route.params.key)});await p.waitForTimeout(400);ok(!(await p.$('#overlay [data-ci="album"]')),"DM ayrıntılarında albüm satırı yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.slice(0,2).join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
