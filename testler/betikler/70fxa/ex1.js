/* keşif: ses kaydı, uzun metin, çift gönderme, düzenle, sil, ilet */
const L=require('./lib.js');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const A=await L.open({browser});await A.ctx.grantPermissions(['microphone']);const p=A.page;await L.seed(p);
 await p.evaluate(()=>go("chat",{key:"u:u2"}));await p.waitForTimeout(800);
 // ses kaydı
 await p.evaluate(()=>document.querySelector("#composer").requestSubmit());await p.waitForTimeout(1500);
 console.log("rec ui:",await p.evaluate(()=>document.querySelector("#composer").innerHTML.slice(0,120)));
 await p.evaluate(()=>document.querySelector('[data-act="recsend"]').click());await p.waitForTimeout(1500);
 console.log("audio msg:",await p.evaluate(()=>S.msgs.filter(m=>m.audio).length),"composer:",await p.evaluate(()=>!!document.querySelector("#composer .k693-cam")+" "+!!document.querySelector("#msgIn")));
 await p.screenshot({path:L.SHOT+'ex1a.png'});
 // çift gönder
 await p.fill("#msgIn","çift");await p.evaluate(()=>{const f=document.querySelector("#composer");f.requestSubmit()});await p.waitForTimeout(600);
 console.log("çift:",await p.evaluate(()=>S.msgs.filter(m=>m.text==="çift").length));
 // uzun metin
 await p.fill("#msgIn","a".repeat(5000));await p.evaluate(()=>document.querySelector("#composer").requestSubmit());await p.waitForTimeout(600);
 console.log("uzun:",await p.evaluate(()=>{const m=S.msgs[S.msgs.length-1];return m.text&&m.text.length}),"scrollW",await p.evaluate(()=>[document.documentElement.scrollWidth,document.getElementById("msgs").scrollWidth]));
 await p.fill("#msgIn","https://example.com/"+"b".repeat(300));await p.evaluate(()=>document.querySelector("#composer").requestSubmit());await p.waitForTimeout(600);
 console.log("uzun link scrollW",await p.evaluate(()=>[document.documentElement.scrollWidth,document.getElementById("msgs").scrollWidth,innerWidth]));
 await p.screenshot({path:L.SHOT+'ex1b.png'});
 console.log(A.errors);await A.close()})();
