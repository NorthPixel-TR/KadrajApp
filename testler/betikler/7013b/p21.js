const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const {b,p,errors}=await open(W,780);
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);
await p.evaluate(()=>gifPick("u:u2","gif"));await p.waitForTimeout(800);
const txt=()=>p.evaluate(()=>{const l=$('#overlay [data-layer="k69gif"]');return l?l.querySelector(".body").innerText.replace(/\s+/g," ").slice(0,160):"(yok)"});
console.log("gif:",await txt());
for(const t of ["stk","mine","gif"]){await p.evaluate(t=>{const b=document.querySelector(`#overlay [data-layer="k69gif"] [data-k69t="${t}"]`);b?b.click():console.log("no tab "+t)},t);await p.waitForTimeout(700);console.log(t+":",await txt())}
const tabs=await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer="k69gif"] [role=tab]')].map(x=>x.outerHTML.slice(0,80)));console.log(tabs);
await p.screenshot({path:OUT+"p21.png"});
// search typing
const q=await p.$('#overlay [data-layer="k69gif"] input,#overlay [data-layer="k69gif"] textarea');if(q){await q.click();await p.keyboard.type("kedi");await p.waitForTimeout(900);console.log("search:",await txt())}
console.log(errors);await b.close()})();
