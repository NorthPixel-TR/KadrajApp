/* öne çıkan hikâyeler satırı 4+ sekmeli profilde de sekmelerin üstünde mi (eskiden sayfanın en altına düşüyordu) */
const {open,OUT}=require('./lib');const {seed}=require('./seed');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,860);await seed(p);
 const pos=()=>p.evaluate(()=>{const hl=document.querySelector("#main .hls,#main .hl-row,#main [class*='hl']");const row=[...document.querySelectorAll("#main *")].find(e=>/Yeni/.test(e.textContent)&&e.querySelector&&e.querySelector("[data-act],button")&&e.children.length<12&&e.closest(".prof,#main")&&/hl/.test(e.className));
  const t=document.querySelector("#main .ptabs");const h=document.querySelector("#main [class^='hl'],#main [class*=' hl']");return{tabs:t&&t.className,hlBefore:!!(h&&t&&(h.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING)),hl:h&&h.className}});
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(600);let r=await pos();ok(r.hl&&r.hlBefore,"3 sekme: öne çıkanlar sekmelerin üstünde "+JSON.stringify(r));
 await p.evaluate(async()=>{const T=Date.now();await DB.update("posts/pm1",{tags:["u1"]});await DB.update("profiles/u1",{rp:{pm1:T}});S.profiles.u1={...S.profiles.u1,rp:{pm1:T}}});await p.waitForTimeout(300);
 await p.evaluate(()=>{tab("feed")});await p.waitForTimeout(200);await p.evaluate(()=>tab("profile"));await p.waitForTimeout(600);r=await pos();
 ok(/many/.test(r.tabs)&&r.hl&&r.hlBefore,"5 sekme: öne çıkanlar sekmelerin üstünde "+JSON.stringify(r));
 await p.screenshot({path:OUT+`hlrow_${W}.png`});
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));console.log(pass+"/"+(pass+fail));await b.close()})();
