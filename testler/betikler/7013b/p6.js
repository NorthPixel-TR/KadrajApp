const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
const st=()=>p.evaluate(()=>S.route.name+" ["+[...document.querySelectorAll('#overlay [data-layer]')].map(x=>x.dataset.layer).join(",")+"] stack="+S.stack.length);
await p.evaluate(()=>tab("chats"));await p.waitForTimeout(400);
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);console.log("chat",await st());
await p.evaluate(()=>chatInfo("u:u2"));await p.waitForTimeout(500);console.log("info",await st());
await p.evaluate(()=>wallpaperMenu());await p.waitForTimeout(500);console.log("wp",await st());
await p.goBack();await p.waitForTimeout(500);console.log("back1",await st());
await p.goBack();await p.waitForTimeout(500);console.log("back2",await st());
await p.goBack();await p.waitForTimeout(500);console.log("back3",await st());
// kBack path
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(500);await p.evaluate(()=>msgMenu("m3"));await p.waitForTimeout(300);
console.log("mm",await st());console.log("kBack",await p.evaluate(()=>window.kBack&&window.kBack()),await st());
console.log("kBack",await p.evaluate(()=>window.kBack&&window.kBack()),await st());
// dialog on top of sheet
await p.evaluate(()=>{sheet("t1","Deneme","<button class='opt'>x</button>");dialog("Emin misin","metin",[{label:"Tamam",fn:()=>{}}])});await p.waitForTimeout(300);console.log("sheet+dialog",await st());
await p.keyboard.press("Escape");await p.waitForTimeout(300);console.log("esc",await st());
await p.keyboard.press("Escape");await p.waitForTimeout(300);console.log("esc2",await st());
console.log(errors);await b.close()})();
