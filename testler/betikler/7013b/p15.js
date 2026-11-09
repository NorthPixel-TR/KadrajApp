const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
await p.evaluate(()=>go("settings"));await p.waitForTimeout(700);
await p.click("#setQ");await p.keyboard.type("gönderme");await p.waitForTimeout(300);
await p.evaluate(()=>refresh());// data arrives while typing -> deferred
const sel='input[data-set="sendSnd"]';
const before=await p.evaluate(s=>({v:settings.sendSnd,vis:!!document.querySelector(s)?.closest(".srow")?.offsetParent}),sel);console.log("before",before);
const box=await p.evaluate(s=>{const r=document.querySelector(s).closest(".srow").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}},sel);
const c=await p.context().newCDPSession(p);
await c.send('Input.dispatchTouchEvent',{type:"touchStart",touchPoints:[{x:box.x,y:box.y}]});await p.waitForTimeout(140);
await c.send('Input.dispatchTouchEvent',{type:"touchEnd",touchPoints:[]});await p.waitForTimeout(500);
console.log("after",await p.evaluate(()=>({v:settings.sendSnd,q:$("#setQ").value,S:S.setQ})));
console.log(errors);await b.close()})();
