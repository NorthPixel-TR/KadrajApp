const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
await p.evaluate(()=>go("settings"));await p.waitForTimeout(800);
const info=()=>p.evaluate(()=>{const m=$("#main");const top=[...m.querySelector(".sg")?.parentElement.children||[]].map(e=>e.tagName+(e.id?"#"+e.id:"")+"."+String(e.className).split(" ")[0]+(e.dataset.g?"["+e.dataset.g+"]":"")+(e.hidden?"(h)":""));
 const gs=$$("#main .sg").map(g=>g.dataset.g+(g.classList.contains("open")?"*":"")+(g.hidden?"(h)":"")+":"+[...g.querySelectorAll(".sg-b>*")].map(x=>(x.id||x.querySelector(".sxh")?.textContent||x.className).slice(0,18)+(x.hidden?"(h)":"")).join("/"));
 return {top,gs,empty:$("#setEmpty")?.hidden,sw:document.scrollingElement.scrollWidth}});
console.log(JSON.stringify(await info(),null,1));
for(const q of ["tema","engellenen","çıkartma","animasyon","zirve","xyzq"]){await p.fill("#setQ",q);await p.waitForTimeout(250);const r=await info();console.log(q,"empty="+r.empty,r.gs.filter(x=>!/\(h\):/.test(x.split(":")[0]+":")).map(x=>x.replace(/[^\/:]+\(h\)\/?/g,"")).join(" || "))}
await p.fill("#setQ","");await p.waitForTimeout(250);console.log("cleared",(await info()).gs.map(x=>x.split(":")[0]).join(" "));
console.log(errors);await b.close()})();
