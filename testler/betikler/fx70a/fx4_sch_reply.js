/* 7.0 hata avı A: yanıt seçiliyken gönder'e basılı tutup zamanlayınca yanıt zamanlanan mesaja geçer, sonraki mesaj yanlışlıkla yanıt olmaz. */
const {open}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,760,{});
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(900);
 await p.evaluate(()=>{S.replyTo={mid:"m5",from:"u2",text:"bende de fizik vardı"};drawReply()});
 await p.click("#msgIn");await p.keyboard.type("buna sonra cevap");await p.waitForTimeout(500);
 const bb=await p.locator("#sendBtn").boundingBox();
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(400);
 ok(await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="sch"]')),"zamanlama açıldı");
 await p.evaluate(()=>document.querySelector('#schF').requestSubmit());await p.waitForTimeout(700);
 const r=await p.evaluate(()=>{const m=S.msgs.find(x=>x.sch);return{rep:m&&m.reply&&m.reply.mid,st:S.replyTo,bar:!!document.querySelector("#replyBar .replybar"),q:!!(m&&document.querySelector(`#m-${m.id} .quote, [data-k="${m.id}"] .quote`))}});
 ok(r.rep==="m5","zamanlanan mesaj yanıtı taşıyor "+JSON.stringify(r));ok(!r.st&&!r.bar,"yanıt şeridi kalktı");
 await p.click("#msgIn");await p.keyboard.type("normal mesaj");await p.keyboard.press("Enter");await p.waitForTimeout(700);
 ok(await p.evaluate(()=>{const m=S.msgs.filter(x=>!x.sch).slice(-1)[0];return m.text==="normal mesaj"&&!m.reply}),"sonraki mesaj yanıt değil");
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
