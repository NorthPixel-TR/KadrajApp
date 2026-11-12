// 7.2.11 Günün Kelimesi: günlük kelime, klavye, geçersiz kelime, renkler, çözme, profiles.gk, istatistik, arkadaşlar, paylaş, yeni gün, kaybetme, Keşfet satırı, başarım. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(async()=>{settings.clawd=false;LS.del("kadraj_gk_u1");const d=gkDay();await DB.update("profiles/u2",{gk:{d,n:4}});await DB.update("profiles/u3",{gk:{d:d-1,n:2}});await DB.update("profiles/u4",{gk:{d,n:0}});closeAll();tab("explore")});await p.waitForTimeout(900);
 let r=await p.evaluate(()=>{const k=document.querySelector("#main .gkk"),d=document.querySelector("#main .pdk");return k&&{t:k.textContent,after:d&&d.nextElementSibling===k}});ok(r&&r.after&&/seni bekliyor/.test(r.t),"Keşfet'te Piksel Duvarı'nın altında: "+(r&&r.t));
 await p.click("#main .gkk");await p.waitForTimeout(1200);
 const w=await p.evaluate(()=>({a:GK.a,d:GK.d,same:gkWord(GK.E,GK.d)===GK.a,next:gkWord(GK.E,GK.d+1)!==GK.a,valid:GK.E.okWord(GK.a)}));ok(w.same&&w.next&&w.valid&&Array.from(w.a).length===5,"günün kelimesi belirli ve her gün başka (#"+w.d+")");
 r=await p.evaluate(()=>({rows:document.querySelectorAll(".gk-r").length,keys:document.querySelectorAll(".gk-k").length,fr:document.querySelector("#gkEnd").textContent}));ok(r.rows===6&&r.keys===31&&/Arkadaşların bugün/.test(r.fr)&&/Ayşe/.test(r.fr)&&/4\/6/.test(r.fr)&&/bilemedi/.test(r.fr)&&!/Can/.test(r.fr),"6 satır, Türkçe klavye, yalnızca bugün oynayan arkadaşlar");
 // geçersiz kelime (fiziksel klavye)
 await p.keyboard.type("qqqqq");await p.keyboard.type("abcde");await p.keyboard.press("Enter");await p.waitForTimeout(200);r=await p.evaluate(()=>({m:document.querySelector("#gkMsg").textContent,g:GK.o.g.length}));ok(/listede yok/.test(r.m)&&r.g===0,"listede olmayan kelime sayılmaz");
 for(let i=0;i<5;i++)await p.keyboard.press("Backspace");
 // geçerli ama yanlış bir kelime (ekran klavyesiyle), renkler
 const wrong=await p.evaluate(()=>GK.E.ANSL.find(x=>x!==GK.a&&Array.from(x).some(c=>GK.a.includes(c))));
 for(const c of Array.from(wrong))await p.click(`[data-gkk="${c}"]`);await p.click('[data-gkk="enter"]');await p.waitForTimeout(1500);
 r=await p.evaluate(w=>{const t=[...document.querySelectorAll(".gk-r")[0].querySelectorAll(".gk-t")];const exp=GK.E.score(w,GK.a);return{ok:t.every((x,i)=>x.classList.contains(["no","yer","ok"][exp[i]])),kb:document.querySelectorAll(".gk-k.no,.gk-k.yer,.gk-k.ok").length}},wrong);ok(r.ok&&r.kb>0,"ilk tahmin ("+wrong+") renkleri doğru, klavye boyandı");
 await p.screenshot({path:O+"gk-play-"+W+".png"});
 // çöz
 for(const c of Array.from(w.a))await p.click(`[data-gkk="${c}"]`);await p.click('[data-gkk="enter"]');await p.waitForTimeout(2200);
 r=await p.evaluate(()=>({db:P("u1").gk,st:GK.o.st,kb:!!document.querySelector(".gk-k"),end:document.querySelector("#gkEnd").textContent}));
 ok(r.db&&r.db.n===2&&r.db.d===w.d,"profiles.gk yazıldı (2/6)");ok(r.st.played===1&&r.st.wins===1&&r.st.streak===1&&r.st.dist[1]===1&&!r.kb,"istatistik, klavye kalktı");ok(/Yeni kelime/.test(r.end)&&/paylaş/.test(r.end),"sonuç: sayaç ve paylaş");
 await p.screenshot({path:O+"gk-end-"+W+".png"});
 // paylaş
 await p.click('[data-gk="share"]');await p.waitForTimeout(400);await p.click('#overlay [data-gks="u:u2"]');await p.waitForTimeout(900);
 r=await p.evaluate(()=>{const db=JSON.parse(localStorage.kadraj_db||"{}");const k=Object.keys(db).filter(x=>x.startsWith("chats/"+cidFor("u1","u2")+"/msgs/")).map(x=>db[x]).sort((a,b)=>b.at-a.at)[0];return k&&{t:k.text,img:String(k.img||"").slice(0,22)}});
 ok(r&&new RegExp("Günün Kelimesi "+w.d+": 2/6").test(r.t)&&/^data:image\/png/.test(r.img),"sohbete sonuç ve kareler resmi gitti: "+(r&&r.t));
 // yeniden açınca bitmiş durum, Keşfet satırı
 await p.evaluate(()=>{closeAll();tab("feed");tab("explore")});await p.waitForTimeout(700);r=await p.evaluate(()=>document.querySelector("#main .gkk").textContent);ok(/Bugün çözdün: 2\/6/.test(r),"Keşfet: "+r);
 // ertesi gün: yeni kelime, kaybetme, seri sıfırlanır
 await p.evaluate(()=>{GKT.now=()=>Date.now()+864e5;closeAll();gkOpen()});await p.waitForTimeout(1200);
 r=await p.evaluate(()=>({d:GK.d,g:GK.o.g.length,a:GK.a}));ok(r.d===w.d+1&&r.g===0&&r.a!==w.a,"ertesi gün yeni kelime, boş tahta");
 const ws=await p.evaluate(()=>GK.E.ANSL.filter(x=>x!==GK.a).slice(0,6));for(const x of ws){for(const c of Array.from(x))await p.click(`[data-gkk="${c}"]`);await p.click('[data-gkk="enter"]');await p.waitForTimeout(150)}await p.waitForTimeout(1800);
 r=await p.evaluate(()=>({db:P("u1").gk,st:GK.o.st,m:document.querySelector("#gkMsg").textContent}));ok(r.db.n===0&&r.st.played===2&&r.st.streak===0&&r.st.best===1&&/Kelime:/.test(r.m),"6 yanlışta bilemedi, kelime gösterildi, seri sıfırlandı "+JSON.stringify(r));
 // başarım
 r=await p.evaluate(async()=>{const o=LS.get("kadraj_gk_u1");o.st.wins=5;LS.set("kadraj_gk_u1",o);achCheck(true);await new Promise(r=>setTimeout(r,400));return{e:!!achSt().e.kelimeci,n:ACH.length,last:ACH[ACH.length-1][0]}});ok(r.e&&r.n===33&&r.last==="zirve","Kelimeci başarımı (33)");
 await p.evaluate(()=>closeAll());await p.evaluate(()=>gmHub());await p.waitForTimeout(300);ok(await p.$('[data-gm="gk"]'),"Oyunlar penceresinde Günün Kelimesi");
 r=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(r<=0,"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
