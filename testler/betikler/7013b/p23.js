const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);
const ly=()=>p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer]')].map(x=>x.dataset.layer).join(","));
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);
for(const lab of ["Takma adlar","Sessize al","Gizlilik ve güve","Tema","Seçenekler","Ara","Medya"]){
 await p.evaluate(()=>{closeAll();chatInfo("u:u2")});await p.waitForTimeout(600);
 const ok=await p.evaluate(lab=>{const b=[...document.querySelectorAll('#overlay [data-layer="cinfo"] button')].find(x=>x.textContent.trim().startsWith(lab));if(!b)return false;b.click();return true},lab);
 await p.waitForTimeout(700);console.log(lab,ok,"->",await ly(),S=await p.evaluate(()=>S.route.name));
 if(lab==="Takma adlar"){const inp=await p.$('#overlay [data-layer]:last-child input, #overlay [data-layer]:last-child textarea');if(inp){await inp.fill("Ayşoş");const sv=await p.evaluate(()=>{const l=[...document.querySelectorAll('#overlay [data-layer]')].pop();const b=[...l.querySelectorAll("button")].find(x=>/Kaydet/.test(x.textContent));b&&b.click();return !!b});await p.waitForTimeout(600);console.log(" saved",sv,await p.evaluate(()=>JSON.stringify(S.chats[cidFor("u1","u2")].nicks)),await p.evaluate(()=>$("#top").innerText.slice(0,40)))}}
}
console.log(errors);await b.close()})();
