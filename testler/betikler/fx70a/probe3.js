const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
(async()=>{const {b,p,errors}=await open(W,760,{});const log=(...a)=>console.log(...a);
 p.on('console',m=>log("C:",m.text()));
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(600);
 await p.evaluate(()=>{const g=go;go=function(...a){console.log("go "+JSON.stringify(a[0]));return g.apply(this,a)};document.addEventListener("click",e=>console.log("click cap "+e.target.className+" "+(e.target.closest("[data-crow]")||{}).outerHTML?.slice(0,30)),true);document.addEventListener("click",e=>console.log("click bub defP="+e.defaultPrevented))});
 await p.click('#main [data-crow="u:u2"] .av');await p.waitForTimeout(800);
 log("route",await p.evaluate(()=>S.route.name));
 log("errors",errors);await b.close()})();
