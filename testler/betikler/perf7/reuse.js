const {open}=require('../m70/lib');
(async()=>{const {b,p}=await open(390);await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(1500);
 console.log(await p.evaluate(async()=>{const m=$("#main");const before=[...m.children];refresh();await new Promise(r=>setTimeout(r,50));const after=[...m.children];
  const kept=after.filter(x=>before.includes(x)).length;const diff=[];for(const a of after)if(!before.includes(a))diff.push(a.tagName+"."+a.className+(a.dataset.pid?"#"+a.dataset.pid:""));return {n:after.length,kept,diff}}));
 console.log(await p.evaluate(async()=>{const m=$("#main");const c=[...m.children].filter(x=>!x._ks).map(x=>x.className);return c}));await b.close()})();
