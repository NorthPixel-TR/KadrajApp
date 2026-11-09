const {open,OUT}=require('./lib');
(async()=>{const {b,p,errors}=await open(390,780);
const ly=()=>p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer]')].map(x=>x.dataset.layer).join(",")+" v="+$("#msgIn")?.value+" n="+S.msgs.length);
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);await p.click("#msgIn");await p.keyboard.type("merhaba");await p.waitForTimeout(400);
const bb=await p.locator("#sendBtn").boundingBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
await p.mouse.move(cx,cy);await p.mouse.down();await p.waitForTimeout(700);console.log("held",await ly());await p.mouse.up();await p.waitForTimeout(500);console.log("up",await ly());
await p.screenshot({path:OUT+"p3a.png"});
// submit schedule (1 saat)
const opts=await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer="sch"] button')].map(x=>x.id+":"+x.textContent.trim().slice(0,20)));console.log(opts);
// CDP touch long press
const c=await p.context().newCDPSession(p);
await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
const tp=(t)=>c.send('Input.dispatchTouchEvent',{type:t,touchPoints:t==="touchEnd"?[]:[{x:cx,y:cy}]});
await tp("touchStart");await p.waitForTimeout(700);console.log("touch held",await ly());await tp("touchEnd");await p.waitForTimeout(500);console.log("touch up",await ly());
console.log(errors);await b.close()})();
