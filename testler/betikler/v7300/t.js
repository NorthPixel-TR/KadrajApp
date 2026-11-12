// 7.3.0 Okul Çantası: Keşfet girişleri, program, şu anki/sıradaki ders, ders saatleri, ödev, sınav (+LGS), odak (profiles.cal, arkadaşlar, bitiş), başarım, Neler yeni. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(async()=>{settings.clawd=false;LS.del("kadraj_canta_u1");await DB.update("profiles/u2",{cal:{u:Date.now()+20*6e4,d:"Matematik"}});await DB.update("profiles/u3",{cal:{u:Date.now()-6e4,d:"Fen"}});closeAll();tab("explore")});await p.waitForTimeout(900);
 let r=await p.evaluate(()=>{const k=document.querySelector("#main .ctk"),g=document.querySelector("#main .gkk"),o=document.querySelector("#main .okc");return{row:!!k&&g&&g.nextElementSibling===k,t:k&&k.textContent,okc:o&&o.dataset.ct7300}});ok(r.row&&r.okc==="1","Keşfet: okul sayacı dokunulur, Günün Kelimesi'nin altında Okul Çantası");
 await p.click("#main .okc");await p.waitForTimeout(1100);ok(await p.evaluate(()=>!!window.CANTA&&document.querySelectorAll(".ct-tabs button").length===5),"canta.js yüklendi, 5 sekme");
 // sahte saat: pazartesi 08:50
 await p.evaluate(()=>{const d=new Date();d.setDate(d.getDate()+((8-d.getDay())%7||7));d.setHours(8,50,0,0);window.__mon=d.getTime();CANTA._t.set({now:()=>window.__mon})});
 await p.click('[data-ct-tab="prog"]');await p.waitForTimeout(300);
 r=await p.evaluate(()=>({cells:document.querySelectorAll("[data-ct-cell]").length,tm:[...document.querySelectorAll(".ct-grid .tm")].slice(0,3).map(x=>x.textContent).join(",")}));ok(r.cells===40&&r.tm==="08:30,09:20,10:10","program ızgarası 5x8, saatler "+r.tm);
 for(const [cell,d] of [["1_0","Türkçe"],["1_1","Matematik"],["1_2",null]]){await p.click(`[data-ct-cell="${cell}"]`);await p.waitForTimeout(250);if(d)await p.click(`#overlay [data-ct-pick="${d}"]`);else{await p.fill("#ctOwn","Robotik Kulübü");await p.click('#overlay [data-ct-pick="__own"]')}await p.waitForTimeout(250)}
 r=await p.evaluate(()=>CANTA.state().prog[1]);ok(r.join(",")==="Türkçe,Matematik,Robotik Kulübü","pazartesi dersleri kaydedildi (kendi ders adıyla)");
 await p.screenshot({path:O+"ct-prog-"+W+".png"});
 await p.click('[data-ct-tab="bugun"]');await p.waitForTimeout(300);r=await p.evaluate(()=>document.querySelector(".ct-now").textContent);ok(/Şu an/.test(r)&&/Türkçe/.test(r)&&/20 dk kaldı/.test(r)&&/sonra Matematik/.test(r),"Bugün: "+r.replace(/\s+/g," "));
 await p.evaluate(()=>{window.__mon+=25*6e4;document.querySelector('[data-ct-tab="bugun"]').click()});await p.waitForTimeout(200);r=await p.evaluate(()=>document.querySelector(".ct-now").textContent);ok(/Sıradaki ders/.test(r)&&/Matematik/.test(r)&&/09:20/.test(r)&&/5 dk sonra/.test(r),"teneffüste sıradaki ders: "+r.replace(/\s+/g," "));
 r=await p.evaluate(()=>[...document.querySelectorAll(".ct-l")].map(x=>x.className.replace("ct-l","").trim()||"-").join(","));ok(r==="past,-,-","geçen ders soluk ("+r+")");
 // ders saatleri: 45 dk ders
 await p.click('[data-ct-tab="prog"]');await p.waitForTimeout(200);await p.fill("#ctL","45");await p.click('[data-ct="bell"]');await p.waitForTimeout(200);r=await p.evaluate(()=>[...document.querySelectorAll(".ct-grid .tm")].slice(0,2).map(x=>x.textContent).join(","));ok(r==="08:30,09:25","ders saatleri değişti: "+r);
 await p.fill("#ctL","5");await p.click('[data-ct="bell"]');ok(await p.evaluate(()=>CANTA.state().bell.l===20),"aralık dışı değer sınırlanır");await p.fill("#ctL","40");await p.click('[data-ct="bell"]');
 // ödev
 await p.click('[data-ct-tab="hw"]');await p.waitForTimeout(200);await p.click('[data-ct-hwd="Matematik"]');await p.fill("#ctHwT","Sayfa 45, 1-10 arası sorular");await p.click('[data-ct="hwadd"]');await p.waitForTimeout(200);
 r=await p.evaluate(()=>{const h=CANTA.state().hw[0];return{h,t:document.querySelector(".ct-hw").textContent}});ok(r.h&&r.h.d==="Matematik"&&/yarın teslim/.test(r.t),"ödev eklendi: "+r.t);
 await p.click('[data-ct="hwadd"]');ok(await p.evaluate(()=>CANTA.state().hw.length===1),"boş ödev eklenmez");
 // sınav
 await p.click('[data-ct-tab="ex"]');await p.waitForTimeout(200);await p.fill("#ctExT","Fen 1. yazılı");await p.click('[data-ct="exadd"]');await p.waitForTimeout(200);
 r=await p.evaluate(()=>[...document.querySelectorAll(".ct-ex")].map(x=>x.textContent.replace(/\s+/g," ")));ok(r.length===2&&/7\s*gün/.test(r[0])&&/Fen 1\. yazılı/.test(r[0])&&/LGS/.test(r[1]),"sınav geri sayımı ve LGS: "+r.join(" | "));
 await p.screenshot({path:O+"ct-ex-"+W+".png"});
 await p.click('[data-ct-tab="bugun"]');await p.waitForTimeout(200);r=await p.evaluate(()=>document.querySelector("#ctB2").textContent);ok(/Sayfa 45/.test(r)&&/En yakın sınav/.test(r)&&/Ayşe/.test(r)&&!/Can Demir/.test(r),"Bugün: ödev, en yakın sınav, şu an çalışan arkadaş (süresi geçen yok)");
 await p.screenshot({path:O+"ct-bugun-"+W+".png"});
 await p.click('.ct-hw [data-ct-done]');ok(await p.evaluate(()=>CANTA.state().hw[0].done===1&&!document.querySelector("#ctB2 .ct-hw")),"ödev bitti işaretlendi, Bugün'den kalktı");await p.click('[data-ct-tab="hw"]');await p.waitForTimeout(150);await p.click('.ct-hw.done [data-ct-done]');ok(await p.evaluate(()=>CANTA.state().hw[0].done===0),"Ödevler'den geri alındı");
 // odak
 await p.evaluate(()=>CANTA._t.set({now:()=>Date.now()}));await p.click('[data-ct-tab="odak"]');await p.waitForTimeout(200);await p.click('[data-ct-len="15"]');await p.click('[data-ct-od="Matematik"]');await p.click('[data-ct="go"]');await p.waitForTimeout(1300);
 r=await p.evaluate(()=>({cal:P("u1").cal,run:CANTA.state().run,tm:document.querySelector("#ctTm").textContent,cw:!!document.querySelector(".ct-cw svg")}));ok(r.cal&&r.cal.u>Date.now()+14*6e4&&r.cal.d==="Matematik"&&r.run.len===15,"odak başladı, profiles.cal yazıldı");ok(/^(14:5\d|15:00)$/.test(r.tm)&&r.cw,"sayaç işliyor ("+r.tm+"), Clawd yanında");
 await p.screenshot({path:O+"ct-odak-"+W+".png"});
 await p.evaluate(()=>{closeAll();tab("feed");tab("explore")});await p.waitForTimeout(600);r=await p.evaluate(()=>document.querySelector("#main .ctk").textContent);ok(/Odak sürüyor/.test(r),"Keşfet satırı: "+r);
 // süre biter (sayfa kapalıyken de)
 await p.evaluate(()=>{const o=LS.get("kadraj_canta_u1");o.run.end=Date.now()-1000;LS.set("kadraj_canta_u1",o)});await p.waitForTimeout(1600);
 r=await p.evaluate(()=>({o:CANTA.state(),cal:P("u1").cal,toast:document.querySelector("#toasts").textContent}));ok(!r.o.run&&r.o.foc.n===1&&Object.values(r.o.foc.log)[0]===15&&r.cal.u===0&&/Odak bitti/.test(r.toast),"süre dolunca kayıt, cal temizlendi, uyarı");
 await p.evaluate(()=>{closeAll();tab("feed");tab("explore")});await p.waitForTimeout(600);r=await p.evaluate(()=>document.querySelector("#main .ctk").textContent);ok(/1 ödev bekliyor/.test(r)&&/sınava \d+ gün/.test(r),"Keşfet satırı: "+r);
 // başarım, Neler yeni
 r=await p.evaluate(async()=>{const o=LS.get("kadraj_canta_u1");o.foc.n=10;LS.set("kadraj_canta_u1",o);achCheck(true);await new Promise(r=>setTimeout(r,400));return{e:!!achSt().e.caliskan,n:ACH.length,last:ACH[ACH.length-1][0],wn:WN_ITEMS.map(x=>x.v),name:VER_NAMES[73],full:APP_FULL}});
 ok(r.e&&r.n===34&&r.last==="zirve","Çalışkan başarımı (34)");ok(r.wn.length===3&&r.wn.every(v=>v===70300)&&r.name==="Kaçkar"&&/4\.3\.0 Kaçkar/.test(r.full),"Neler yeni yalnızca 4.3 Kaçkar ("+r.full+")");
 r=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(r<=0,"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
