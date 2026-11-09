const {open,OUT}=require('./lib');const {seed}=require('./seed');const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});await seed(p);
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(600);
 for(const id of ["pm1","pc1","pp1"]){const el=await p.$(`#main [data-pid="${id}"]`);if(!el){console.log("yok",id);continue}await el.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await el.screenshot({path:OUT+`p2s_${id}_${W}_${dark?"d":"l"}_${ui}.png`})}
 console.log("errors",errors);await b.close()})();
