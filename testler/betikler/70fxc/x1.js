/* Ayarlar: her anahtar kaydediliyor mu, yeniden açılınca korunuyor mu */
const {open,seed,ok,done,SP}=require('./h');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W);await seed(p);
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(600);
 const ids=await p.evaluate(()=>[...document.querySelectorAll('#main input[type=checkbox]')].map((e,i)=>{e.dataset.ti=i;return{i,set:e.dataset.set||e.id||e.getAttribute("data-k69s")||e.name||e.outerHTML.slice(0,120),c:e.checked,d:e.disabled}}));
 console.log(ids.length,"anahtar");
 const before={};for(const x of ids)before[x.set]=x.c;
 // setNotify'ı önce aç ki alttakiler açılsın
 for(const x of ids){if(x.set==="setRemember")continue;
  const r=await p.evaluate(async i=>{const e=document.querySelector(`#main input[data-ti="${i}"]`);if(!e)return "yok";const g=e.closest(".sg");if(g&&!g.classList.contains("open")){const h=g.querySelector(".sg-h");h&&h.click()}if(e.disabled)return "kapalı";const lb=e.closest("label");(lb||e).click();await new Promise(r=>setTimeout(r,250));const z=document.querySelector(`#main input[data-ti="${i}"]`);return z?z.checked:"gitti"},x.i);
  console.log(x.set,x.c,"->",r)}
 await p.waitForTimeout(500);
 const snap=await p.evaluate(()=>JSON.stringify(settings));
 await p.evaluate(()=>{render(true)});await p.waitForTimeout(400);
 console.log(snap);
 done(errors);await b.close()})();
