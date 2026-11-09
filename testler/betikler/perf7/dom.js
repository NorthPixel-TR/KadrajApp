const {open}=require('../m70/lib');
(async()=>{const {b,p}=await open(390);await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(1500);
 console.log(await p.evaluate(()=>{const d=(e,l)=>[...e.children].map(c=>"  ".repeat(l)+c.tagName.toLowerCase()+"."+[...c.classList].join(".")+(c.dataset.pid?"#"+c.dataset.pid:"")+" ("+c.children.length+")").join("\n");const m=document.querySelector("#main");return d(m,0)+"\n--feed--\n"+[...m.querySelectorAll(":scope>*")].filter(x=>x.children.length>3).map(x=>x.className+"\n"+d(x,1)).join("\n")}));await b.close()})();
