// 7.2.1 Profil temaları: Düzenle'den seç, profiles.pth yazılır, profilde şerit, başkası görür, kaldır. node t.js <genişlik> [koyu]
const {open}=require('../m70/lib');const W=+process.argv[2]||390,DK=process.argv[3]==="koyu";let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820,{dark:DK});
 await p.evaluate(()=>{settings.clawd=false;closeAll();go("edit")});await p.waitForTimeout(700);
 let r=await p.evaluate(()=>{const e=document.querySelector("#editForm .pth-row");return e&&e.textContent});ok(r&&/Profil teması/.test(r)&&/Seçilmedi/.test(r),"Düzenle'de satır: "+r);
 await p.click("#editForm .pth-row");await p.waitForTimeout(500);
 r=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="pth"]');return l&&{n:l.querySelectorAll("[data-pthp]").length,svg:l.querySelectorAll(".pth-pv svg").length,on:l.querySelector(".pth-t.on").textContent,ov:l.querySelector(".sheet").scrollWidth-l.querySelector(".sheet").clientWidth}});
 ok(r&&r.n===9&&r.svg===8&&/Temasız/.test(r.on)&&r.ov<=0,"seçici: 8 tema + temasız "+JSON.stringify(r));
 await p.screenshot({path:O+"pth-sheet-"+W+".png"});
 await p.click('[data-pthp="erciyes"]');await p.waitForTimeout(600);
 r=await p.evaluate(()=>({db:P("u1").pth,row:document.querySelector("#editForm .pth-row").textContent}));ok(r.db==="erciyes"&&/Erciyes/.test(r.row),"kaydedildi, satır güncel: "+r.row);
 await p.evaluate(()=>{closeAll();tab("profile")});await p.waitForTimeout(900);
 r=await p.evaluate(()=>{const pr=document.querySelector("#main .prof"),t=pr&&pr.firstElementChild,av=pr.querySelector(".prof-top>.av").getBoundingClientRect(),th=t.getBoundingClientRect(),st=pr.querySelector(".stats").getBoundingClientRect();return {cls:t&&t.className,on:pr.classList.contains("pth-on"),h:Math.round(th.height),avTop:Math.round(av.top-th.top),stTop:Math.round(st.top-th.bottom),sw:document.documentElement.scrollWidth-innerWidth}});
 ok(/pth pth-erciyes/.test(r.cls)&&r.on&&r.h>=80,"profilde şerit "+JSON.stringify(r));ok(r.avTop>0&&r.avTop<r.h&&r.stTop>=-2&&r.sw<=0,"avatar şeridin üstüne biner, sayılar şeridin altında");
 await p.waitForTimeout(1500);await p.screenshot({path:O+"pth-prof-"+W+(DK?"k":"")+".png"});
 // yeniden çizim şeridi çoğaltmaz
 await p.evaluate(()=>{render(false);render(false)});await p.waitForTimeout(300);ok(await p.evaluate(()=>document.querySelectorAll("#main .prof>.pth").length===1),"yeniden çizimde tek şerit");
 // bütün temalar çizilir, sonlu animasyon
 r=await p.evaluate(()=>PTH.map(([k])=>{const s=pthSvg(k);return [k,s.length,(s.match(/<path/g)||[]).length]}));ok(r.every(x=>x[1]>500&&x[1]<60000&&x[2]>3),"8 tema çizilir "+r.map(x=>x[0]+":"+Math.round(x[1]/1024)+"KB").join(" "));
 r=await p.evaluate(()=>[...document.styleSheets].flatMap(s=>{try{return[...s.cssRules]}catch{return[]}}).filter(x=>x.cssText&&/\.pl-|\.pth/.test(x.cssText)&&/infinite/.test(x.cssText)).length);ok(r===0,"sonsuz animasyon yok");
 // başkası görür
 await p.evaluate(async()=>{await DB.update("profiles/u2",{pth:"istanbul"});closeAll();go("profile",{uid:"u2"})});await p.waitForTimeout(900);
 ok(await p.evaluate(()=>!!document.querySelector("#main .prof>.pth.pth-istanbul")),"başkasının profilinde onun teması");await p.screenshot({path:O+"pth-u2-"+W+(DK?"k":"")+".png"});
 await p.evaluate(async()=>{await DB.update("profiles/u2",{pth:"<img onerror=x>"});render(false)});await p.waitForTimeout(400);ok(await p.evaluate(()=>!document.querySelector("#main .prof>.pth")&&!document.querySelector("#main .prof.pth-on")),"geçersiz tema değeri yok sayılır");
 // kaldır
 await p.evaluate(()=>{closeAll();go("edit")});await p.waitForTimeout(600);await p.click("#editForm .pth-row");await p.waitForTimeout(400);await p.click('[data-pthp=""]');await p.waitForTimeout(500);
 await p.evaluate(()=>{closeAll();tab("profile")});await p.waitForTimeout(700);ok(await p.evaluate(()=>P("u1").pth===""&&!document.querySelector("#main .prof>.pth")),"temasız seçince şerit kalkar");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
