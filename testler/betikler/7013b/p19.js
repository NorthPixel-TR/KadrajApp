const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";const {b,p,errors}=await open(W,780,{dark,ui});
await p.evaluate(()=>go("settings"));await p.waitForTimeout(700);
const gs=await p.evaluate(()=>$$("#main .sg").map(g=>g.dataset.g));
for(const g of gs){await p.evaluate(g=>{const w=$(`#main .sg[data-g="${g}"]`);if(!w.classList.contains("open"))w.querySelector(".sg-h").click()},g);await p.waitForTimeout(900);
 const r=await p.evaluate(()=>{const vw=innerWidth;const out=[];if(document.scrollingElement.scrollWidth>vw)out.push("PAGE "+document.scrollingElement.scrollWidth);const m=$("#main");if(m.scrollWidth>m.clientWidth+1)out.push("MAIN "+m.scrollWidth);
  for(const e of $$("#main .sg.open *")){const r=e.getBoundingClientRect();if(r.width&&(r.right>vw+0.5||r.left<-0.5)&&e.offsetParent){out.push((e.id||String(e.className.baseVal??e.className).slice(0,30)||e.tagName)+"["+Math.round(r.left)+","+Math.round(r.right)+"]")}}
  return [...new Set(out)].slice(0,6)});
 console.log(g,r.length?r.join(" | "):"ok");
 if(g==="k69"||g==="gorunum"){const el=await p.$(`#main .sg[data-g="${g}"]`);await el.screenshot({path:OUT+"p19"+g+W+".png"})}}
console.log(errors);await b.close()})();
