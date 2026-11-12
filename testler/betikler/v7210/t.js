// 7.2.10 Piksel Duvarı (iki sekme, aynı LocalDB): açılır, boş duvar kurulur, koy, bekleme, canlı görünür, kim koydu, sıralama, 2x, geçen hafta, Keşfet girişi, başarım. node t.js [genişlik]
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/',W=+process.argv[2]||390,O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
async function page(ctx,errors){const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);return p}
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:820},hasTouch:true});const errors=[];
 const A=await page(ctx,errors);
 await A.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:T,u2:T},botFollowers:{},private:false,createdAt:T});S.uid="u1";await enterApp(false);settings.clawd=false});
 const B=await page(ctx,errors);await B.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u2";await enterApp(false);settings.clawd=false});
 // Keşfet girişi
 await A.evaluate(()=>{closeAll();tab("explore")});await A.waitForTimeout(800);let r=await A.evaluate(()=>{const k=document.querySelector("#main .pdk"),h=document.querySelector("#main .hmc");return k&&h&&h.nextElementSibling===k});ok(r,"Keşfet'te meydan okumanın altında Piksel Duvarı");
 await A.click("#main .pdk");await A.waitForTimeout(1200);
 r=await A.evaluate(()=>({l:!!document.querySelector('[data-layer="duvar"]'),pal:document.querySelectorAll("[data-pdc]").length,doc:JSON.parse(localStorage.kadraj_db||"{}")["games/pd-"+hmNow().w]}));
 ok(r.l&&r.pal===16,"duvar açıldı, 16 renk");ok(r.doc&&r.doc.pd===1&&r.doc.w>0,"boş duvar belgesi kuruldu (hafta "+(r.doc&&r.doc.w)+")");
 for(const p of [A,B])await p.evaluate(()=>new Promise(r=>pdGo(D=>{D._t.set({CD:1500});r()})));
 await B.evaluate(()=>{closeAll();gmHub()});await B.waitForTimeout(300);ok(await B.$('[data-gm="pd"]'),"Oyunlar penceresinde Piksel Duvarı");await B.click('[data-gm="pd"]');await B.waitForTimeout(1000);
 // A: (5,7) kırmızı koy, canvas dokunuşuyla imleç
 const cv=await A.$("#pdC");const bb=await cv.boundingBox();await A.mouse.click(bb.x+bb.width*(5.5/40),bb.y+bb.height*(7.5/40));await A.click('[data-pdc="4"]');await A.click("#pdGo");await A.waitForTimeout(500);
 r=await A.evaluate(()=>{const D=DUVAR._t.D();return{v:D.p["5_7"],dis:document.querySelector("#pdGo").disabled,txt:document.querySelector("#pdGo").textContent}});ok(r.v==="4|u1","dokunulan kareye seçili renk kondu ("+r.v+")");ok(r.dis&&/sn/.test(r.txt),"bekleme süresi başladı: "+r.txt);
 await A.click("#pdGo");ok(await A.evaluate(()=>Object.keys(DUVAR._t.D().p).length===1),"beklerken ikinci piksel konmaz");
 await B.waitForTimeout(900);r=await B.evaluate(()=>{const c=document.querySelector("#pdC").getContext("2d").getImageData(5,7,1,1).data;return{v:(DUVAR._t.D().p||{})["5_7"],px:[c[0],c[1],c[2]].join(",")}});
 ok(r.v==="4|u1"&&r.px==="225,29,72","öteki sekmede canlı göründü (piksel "+r.px+")");
 // B: başka renkler koy, sonra aynı kareyi boyar
 await B.evaluate(()=>{DUVAR._t.cur(10,10);document.querySelector('[data-pdc="11"]').click()});await B.click("#pdGo");await B.waitForTimeout(1700);await B.evaluate(()=>DUVAR._t.cur(5,7));await B.click("#pdGo");await B.waitForTimeout(800);
 r=await A.evaluate(()=>{const D=DUVAR._t.D();return{a:D.p["5_7"],b:D.p["10_10"],st:document.querySelector("#pdSt").textContent,top:[...document.querySelectorAll(".pd-t")].map(x=>x.textContent)}});
 ok(r.a==="11|u2"&&r.b==="11|u2","üstüne boyama ve ikinci piksel A'ya geldi");ok(/2 \/ 1600/.test(r.st)&&r.top.length===1&&/Ayşe/.test(r.top[0])&&/2$/.test(r.top[0]),"sayılar ve ressamlar: "+r.st+" | "+r.top.join(","));
 // basılı tut: kim koydu
 await A.mouse.move(bb.x+bb.width*(5.5/40),bb.y+bb.height*(7.5/40));await A.mouse.down();await A.waitForTimeout(600);await A.mouse.up();r=await A.evaluate(()=>document.querySelector("#pdWho").textContent);ok(/Ayşe Yılmaz koydu/.test(r),"basılı tutunca kim koydu: "+r);
 // 2x
 await A.click('[data-pd="z"]');await A.waitForTimeout(300);r=await A.evaluate(()=>{const w=document.querySelector("#pdW");return{sw:w.scrollWidth,cw:w.clientWidth,page:document.documentElement.scrollWidth-innerWidth}});ok(r.sw>=r.cw*1.9&&r.page<=0,"2x yakınlaştırma kendi kutusunda kayar, sayfa taşmaz");await A.click('[data-pd="z"]');
 await A.screenshot({path:O+"pd-"+W+".png"});
 // geçen hafta
 await A.evaluate(async()=>{const w=hmNow().w-1;await DB.set("games/pd-"+w,{pd:1,w,p:{"1_1":"5|u1","2_2":"7|u2","3_3":"7|u2"}})});await A.click('[data-pd="old"]');await A.waitForTimeout(700);
 r=await A.evaluate(()=>{const l=document.querySelector('[data-layer="duvareski"]');return l&&{cv:!!l.querySelector("canvas"),t:l.textContent}});ok(r&&r.cv&&/3 piksel, 2 ressam/.test(r.t)&&/Resmi kaydet/.test(r.t),"geçen haftanın duvarı ve Resmi kaydet");
 await A.screenshot({path:O+"pd-old-"+W+".png"});await A.evaluate(()=>closeLayer("duvareski"));
 // başarım ve kapanınca dinleyici kapanır
 r=await A.evaluate(async()=>{LS.set("kadraj_pdn_u1",30);achCheck(true);await new Promise(r=>setTimeout(r,400));return{e:!!achSt().e.piksel,n:ACH.length,last:ACH[ACH.length-1][0]}});ok(r.e&&r.n===32&&r.last==="zirve","Piksel ressamı başarımı (32)");
 await A.evaluate(()=>closeLayer("duvar"));await A.waitForTimeout(300);ok(await A.evaluate(()=>!document.querySelector('[data-layer="duvar"]')&&DUVAR._t.D()===null),"kapanınca durum ve dinleyici bırakıldı");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
