/* 7.0.3: kalan üç hata — sohbet ayrıntıları kayarken taşma, kapsül kartı yeni düzen, yeni DM'de basılı tut ile zamanlama */
const {open}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W);
 /* 1) chatInfo açılırken sayfa/overlay yatay taşmasın */
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(800);
 let mx=0;await p.evaluate(()=>chatInfo());for(let i=0;i<12;i++){const v=await p.evaluate(()=>{const o=document.getElementById("overlay");o.scrollLeft=60;const sl=o.scrollLeft;o.scrollLeft=0;return Math.max(sl,document.documentElement.scrollWidth-document.documentElement.clientWidth,getComputedStyle(o).overflowX==="clip"?0:o.scrollWidth-o.clientWidth)});mx=Math.max(mx,v);await p.waitForTimeout(30)}
 ok(mx<=0,"sohbet ayrıntıları kayarken yana kayma/taşma yok ("+mx+" px)");
 await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(500);
 /* 2) kilitli zaman kapsülü kartı yeni düzende */
 await p.evaluate(async()=>{await DB.set("posts/capx",{uid:"u2",at:Date.now()-1000,kind:"note",text:"gelecek",bg:0,cap:Date.now()+864e5*30});});await p.waitForTimeout(400);
 await p.evaluate(()=>render(true));await p.waitForTimeout(500);
 let r=await p.evaluate(()=>{const a=document.querySelector('#main article.capc[data-pid="capx"]');if(!a)return null;const k=a.querySelector(".capk");const cs=getComputedStyle(k);return{k70:a.classList.contains("k70c"),un:a.querySelector(".uname")?.textContent,rad:cs.borderTopLeftRadius,ml:cs.marginLeft}});
 ok(r&&r.k70&&r.un==="ayse"&&r.rad==="0px"&&r.ml==="0px","kapsül kartı yeni düzende "+JSON.stringify(r));
 /* 3) hiç mesajı olmayan yeni DM'de basılı tut → zamanlama açılır ve gönderilir */
 await p.evaluate(()=>openChat("u:u5"));await p.waitForTimeout(800);
 ok(await p.evaluate(()=>!S.chats[cidFor("u1","u5")]),"u5 ile sohbet belgesi yok (yeni DM)");
 await p.fill("#msgIn","yarın 9'da hatırlat");await p.dispatchEvent("#msgIn","input");await p.waitForTimeout(200);
 const bb=await p.locator("#sendBtn").boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(400);
 r=await p.evaluate(()=>({sheet:!!document.querySelector('#overlay [data-layer="sch"] #schF'),val:document.querySelector("#schT")?.value,toast:[...document.querySelectorAll("#toasts *")].map(x=>x.textContent).join("|")}));
 ok(r.sheet&&r.val==="yarın 9'da hatırlat","yeni DM'de zamanlama penceresi açıldı "+JSON.stringify(r));
 if(r.sheet){await p.evaluate(()=>document.querySelector("#schF button.btn").click());await p.waitForTimeout(900);
  r=await p.evaluate(async()=>{const cid=cidFor("u1","u5");const c=await DB.get("chats/"+cid);const ms=S.msgs.filter(m=>m.sch);return{doc:!!c,mem:c&&c.members,sch:ms.length}});
  ok(r.doc&&r.sch===1,"zamanlanan mesaj yazıldı, sohbet belgesi kuruldu "+JSON.stringify(r))}
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close()})();
