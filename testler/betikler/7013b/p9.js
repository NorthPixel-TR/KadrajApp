const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
await p.evaluate(()=>tab("chats"));await p.waitForTimeout(600);
const vis=()=>p.evaluate(()=>{const r=$("#main .k70l");return [...r.querySelectorAll("[data-crow],[data-chat='meydan'],[data-msg],.sec-h,.k70-none,.box,.notes,.nstrip")].filter(e=>e.offsetParent!==null).map(e=>(e.dataset.crow||e.dataset.chat||(e.dataset.msg?"msg:"+e.dataset.msg:"")||e.className.split(" ")[0]+(e.classList.contains("sec-h")?":"+e.textContent.trim():""))).join(" ")});
console.log("none:",await vis());
for(const q of ["ayse","can","mert","meydan","rota","sınıf","SINIF","qqq"]){await p.fill("#k70Q",q);await p.waitForTimeout(200);console.log(q+":",await vis())}
await p.fill("#k70Q","mert");await p.waitForTimeout(200);await p.click('[data-msg="u5"]');await p.waitForTimeout(600);console.log(await p.evaluate(()=>S.route.name+" "+JSON.stringify(S.route.params)));
await p.screenshot({path:OUT+"p9.png"});
console.log(errors);await b.close()})();
