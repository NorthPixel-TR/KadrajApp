const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
await p.context().grantPermissions(["clipboard-read","clipboard-write"],{origin:"http://kadraj.test"});
await p.evaluate(()=>openChat("u:bot:rota"));await p.waitForTimeout(800);
await p.click("#msgIn");await p.keyboard.type("Kadraj nedir?");await p.keyboard.press("Enter");await p.waitForTimeout(6000);
const msgs=()=>p.evaluate(()=>[...document.querySelectorAll("#msgs .msg")].map(m=>(m.dataset.bmc?"[bmc]":"")+(m.dataset.mid?"[mid]":"")+m.textContent.trim().slice(0,50)));
console.log(await msgs());
const last=await p.evaluate(()=>{const a=[...document.querySelectorAll("#msgs .msg[data-bmc]")];return a.length?a[a.length-1].dataset.bmc:null});
console.log("last bmc",last);
if(last){await p.evaluate(at=>bmcMenu(at),last).catch(e=>console.log("bmcMenu err",e.message));await p.waitForTimeout(300);
 console.log(await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer] button')].map(b=>b.textContent.trim()).join("|")));
 await p.evaluate(()=>{window.__cp=null;const o=document.execCommand.bind(document);document.execCommand=(c,...a)=>{if(c==="copy")__cp=document.activeElement&&document.activeElement.value;return o(c,...a)};const b=[...document.querySelectorAll("#overlay [data-layer] button")].find(x=>/kopyala/i.test(x.textContent));b&&b.click()});await p.waitForTimeout(400);console.log("cp",JSON.stringify(await p.evaluate(()=>__cp)).slice(0,100))}
// test bot
await p.evaluate(()=>openChat(TB_KEY));await p.waitForTimeout(800);console.log("tb route",await p.evaluate(()=>S.route.params.key));
await p.click("#msgIn");await p.keyboard.type("selam");await p.keyboard.press("Enter");await p.waitForTimeout(5000);console.log(await msgs());
await p.screenshot({path:OUT+"p14.png"});
console.log(errors);await b.close()})();
