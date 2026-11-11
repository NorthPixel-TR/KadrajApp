// 7.2.3 Haftalık meydan okuma: tema haftaya göre döner, Keşfet kartı, katılım sayısı, Katıl açıklamaya etiket ekler, Rota duyurusu, başarım. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 let r=await p.evaluate(()=>{const D=24*H,a=hmNow(Date.UTC(2026,10,9,0,30)-3*H),b2=hmNow(Date.UTC(2026,10,15,23,30)-3*H),c=hmNow(Date.UTC(2026,10,16,0,10)-3*H);const tags=new Set();for(let w=0;w<HM.length;w++)tags.add(hmNow(HM0+w*WK+1000).tag);
  return{same:a.w===b2.w&&a.tag===b2.tag,next:c.w===a.w+1&&c.tag!==a.tag,mon:new Date(c.start+3*H).getUTCDay(),all:tags.size,n:HM.length,mar:hmNow(Date.UTC(2027,2,31,12)).tag,left:a.left}});
 ok(r.same&&r.next&&r.mon===1,"hafta pazartesi 00:00'da değişir "+JSON.stringify(r));ok(r.all===r.n&&r.n>=30,"32 haftada bütün temalar bir kez ("+r.all+")");
 const h=await p.evaluate(()=>{const h=hmNow();return h});
 await p.evaluate(async h=>{settings.clawd=false;const T=Date.now();await DB.set("posts/h1",{uid:"u2",at:T-3e5,kind:"photo",src:"img/kahve.jpg",caption:"Bakın #"+h.tag,ar:"1/1"});await DB.set("posts/h2",{uid:"u3",at:T-2e5,kind:"photo",src:"img/kahve.jpg",caption:"#"+h.tag+"!",ar:"1/1"});
  await DB.set("posts/h3",{uid:"u3",at:h.start-5000,kind:"photo",src:"img/kahve.jpg",caption:"#"+h.tag,ar:"1/1"});await DB.set("posts/h4",{uid:"u2",at:T-1e5,kind:"photo",src:"img/kahve.jpg",caption:"#"+h.tag+"lar",ar:"1/1"});closeAll();tab("explore")},h);
 await p.waitForTimeout(900);
 r=await p.evaluate(()=>{const c=document.querySelector("#main .hmc");const ok=document.querySelector("#main .okc");return c&&{t:c.textContent,th:c.querySelectorAll(".hm-th").length,before:!ok||!!(c.compareDocumentPosition(ok)&Node.DOCUMENT_POSITION_FOLLOWING),ov:c.scrollWidth-c.clientWidth}});
 ok(r&&r.t.includes(h.ad)&&/gün kaldı|son gün/.test(r.t),"Keşfet'te kart: "+(r&&r.t.slice(0,90)));ok(r&&r.th===2&&/2 katılım/.test(r.t),"yalnızca bu haftaki tam etiketli 2 katılım");ok(r&&r.before&&r.ov<=0,"okul sayacının üstünde, taşma yok");
 await p.screenshot({path:O+"hm-"+W+".png"});
 await p.evaluate(()=>{const q=document.querySelector("#q");if(q){q.value="ayse";q.dispatchEvent(new Event("input",{bubbles:true}))}});await p.waitForTimeout(700);ok(await p.evaluate(()=>!document.querySelector("#main .hmc")),"aramada kart yok");
 await p.evaluate(()=>{const q=document.querySelector("#q");if(q){q.value="";q.dispatchEvent(new Event("input",{bubbles:true}))}closeAll();tab("feed");tab("explore")});await p.waitForTimeout(600);
 await p.click('#main [data-act="hmSee"]');await p.waitForTimeout(800);ok(await p.evaluate(t=>document.querySelector("#main").textContent.toLocaleLowerCase("tr").includes("#"+t),h.tag),"etiket sayfası açıldı");
 // Katıl: fotoğraf seçici yerine galeriyi taklit et
 await p.evaluate(()=>{S.q="";closeAll();tab("feed");tab("explore");window.phPick=async()=>{const im=new Image();im.src="img/kahve.jpg";await im.decode();return[{img:im,src:"img/kahve.jpg"}]}});await p.waitForTimeout(600);
 await p.click('#main [data-act="hmJoin"]');await p.waitForTimeout(1200);
 r=await p.evaluate(()=>({cap:S.cmp&&S.cmp.caption,el:(document.querySelector("#cCap")||{}).value}));ok(r.cap&&r.cap.includes("#"+h.tag)&&r.el===r.cap,"Katıl: açıklamada #"+h.tag+" ("+r.el+")");
 await p.evaluate(()=>closeAll());
 // Rota duyurusu
 ok(await p.evaluate(h=>{const x=BOT_POSTS.find(q=>q.id==="hm-"+h.w);return x&&x.text.includes(h.ad)&&x.caption.includes("#"+h.tag)&&x.at<=Date.now()},h),"Rota haftanın temasını Akış'ta duyurur");
 // başarım
 r=await p.evaluate(async h=>{await DB.set("posts/h5",{uid:"u1",at:Date.now(),kind:"photo",src:"img/kahve.jpg",caption:"ben de #"+h.tag,ar:"1/1"});await new Promise(r=>setTimeout(r,400));achCheck(true);await new Promise(r=>setTimeout(r,500));
  return{e:!!achSt().e.meydan,last:ACH[ACH.length-1][0],n:ACH.length}},h);ok(r.e&&r.last==="zirve"&&r.n===29,"başarım Meydan okuyan (zirve sonda, 29) "+JSON.stringify(r));
 await p.evaluate(()=>{const e=document.getElementById("achPop");e&&e.remove();closeAll();tab("explore")});await p.waitForTimeout(600);ok(await p.evaluate(()=>/sen de varsın/.test(document.querySelector("#main .hmc").textContent)),"katılınca 'sen de varsın'");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
