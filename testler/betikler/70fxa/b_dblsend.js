/* Hata: gönder düğmesine hızlıca iki kez dokununca ilki mesajı gönderir, düğme mikrofona döner ve ikinci dokunuş
   istemeden sesli mesaj kaydını başlatır (mikrofon izni/kayıt). */
const L=require('./lib.js');const {ok}=L;const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const A=await L.open({browser});await A.ctx.grantPermissions(['microphone']);const p=A.page;await L.seed(p);
 await p.evaluate(()=>go("chat",{key:"u:u2"}));await p.waitForTimeout(800);
 await p.fill("#msgIn","hızlı");
 await p.evaluate(()=>{const b=document.getElementById("sendBtn");b.click();setTimeout(()=>{const b2=document.getElementById("sendBtn");b2&&b2.click()},120)});await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>({sent:S.msgs.filter(m=>m.text==="hızlı").length,rec:!!REC,ui:!!document.querySelector('#composer [data-act="recsend"]')}));
 ok(r.sent===1,"mesaj bir kez gönderildi");ok(!r.rec&&!r.ui,"ikinci dokunuş ses kaydını başlatmadı "+JSON.stringify(r));
 if(r.rec)await p.evaluate(()=>stopRec(false));
 /* bir süre sonra boş kutuda mikrofon yine çalışır */
 await p.waitForTimeout(900);await p.evaluate(()=>document.getElementById("sendBtn").click());await p.waitForTimeout(800);
 ok(await p.evaluate(()=>!!REC),"bekleyince mikrofona dokunmak kaydı başlatır");await p.evaluate(()=>stopRec(false));await p.waitForTimeout(400);
 await L.done(A)})();
