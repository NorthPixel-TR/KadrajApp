const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
(async()=>{const {b,p,errors}=await open(W,760,{});const log=(...a)=>console.log(...a);
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(700);
 let fc=0;p.on("filechooser",()=>fc++);
 const bb=await p.locator('#main [data-crow="u:u3"] .k70-cam').boundingBox();
 await p.mouse.move(bb.x+20,bb.y+20);await p.mouse.down();await p.waitForTimeout(700);await p.mouse.up();await p.waitForTimeout(500);
 log("longpress cam: menu",await p.evaluate(()=>[...document.querySelectorAll("#overlay [data-layer]")].map(x=>x.dataset.layer)),"filechooser",fc);
 await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 // long press on row (not cam)
 const rb=await p.locator('#main [data-crow="u:u3"] .av').boundingBox();
 await p.mouse.move(rb.x+20,rb.y+20);await p.mouse.down();await p.waitForTimeout(700);await p.mouse.up();await p.waitForTimeout(500);
 log("longpress row: layers",await p.evaluate(()=>[...document.querySelectorAll("#overlay [data-layer]")].map(x=>x.dataset.layer)),"route",await p.evaluate(()=>S.route.name));
 log("errors",errors);await b.close()})();
