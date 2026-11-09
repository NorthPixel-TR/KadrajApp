const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
const st=()=>p.evaluate(()=>{const fm=$("#composer");return fm?{has:fm.classList.contains("k693-has"),val:$("#msgIn").value,lbl:$("#sendBtn")?.getAttribute("aria-label"),focus:document.activeElement?.id,ly:[...document.querySelectorAll('#overlay [data-layer]')].map(x=>x.dataset.layer).join(","),route:S.route.name,nm:S.msgs.length}:{none:1,route:S.route.name}});
// draft restore
await p.evaluate(()=>{draftSet("u:u2","taslak yazı");openChat("u:u2")});await p.waitForTimeout(600);console.log("draft",await st());
await p.evaluate(()=>{$("#msgIn").value="";$("#msgIn").dispatchEvent(new Event("input"))});
// type and long press
await p.click("#msgIn");await p.keyboard.type("merhaba dünya");console.log("typed",await st());
const bb=await p.locator("#sendBtn").boundingBox();await p.touchscreen.tap(bb.x+5,bb.y+5);await p.waitForTimeout(500);console.log("tap send",await st());
// long press via mouse
await p.click("#msgIn");await p.keyboard.type("zamanla bunu");await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up();await p.waitForTimeout(400);console.log("longpress",await st());
// back key while sch open
await p.evaluate(()=>closeTop());await p.waitForTimeout(400);console.log("after closeTop",await st());
// Meydan long press
await p.evaluate(()=>openChat("meydan"));await p.waitForTimeout(600);await p.click("#msgIn");await p.keyboard.type("meydan yazısı");
const b2=await p.locator("#sendBtn").boundingBox();await p.mouse.move(b2.x+b2.width/2,b2.y+b2.height/2);await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up();await p.waitForTimeout(400);console.log("meydan lp",await st());
// refresh while typing in DM
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);await p.click("#msgIn");await p.keyboard.type("abc");await p.evaluate(()=>{refresh();render(false)});await p.waitForTimeout(300);console.log("refresh typing",await st());
// group
await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(600);console.log("group",await st());
await p.screenshot({path:OUT+"p2.png"});
console.log("errors",errors);await b.close()})();
