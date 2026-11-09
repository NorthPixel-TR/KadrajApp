/* 7.0 hata avı A: sohbet aramasında yazarken veri gelince, sonuca dokunmak sohbeti açmalı ve kutu odağını korumalı. */
const {open}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,760,{});
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(600);
 await p.click("#k70Q");await p.keyboard.type("ay");await p.waitForTimeout(100);
 await p.evaluate(async()=>{const T=Date.now();await DB.set("chats/gr-1/msgs/g9",{from:"u5",at:T,text:"yeni"});await DB.update("chats/gr-1",{last:{text:"yeni",from:"u5",at:T},updatedAt:T});S.online.add("u3");scheduleRefresh()});await p.waitForTimeout(500);
 const r=await p.evaluate(()=>({f:document.activeElement&&document.activeElement.id,v:$("#k70Q").value,s:$("#k70Q").selectionStart,grp:document.querySelector('#main [data-crow="g:gr-1"] .s')?.textContent||""}));
 ok(r.f==="k70Q"&&r.v==="ay"&&r.s===2,"veri gelince kutu odakta, imleç yerinde "+JSON.stringify(r));
 ok(/yeni/.test(r.grp),"liste yazarken de güncellenir "+r.grp);
 await p.keyboard.type("şe");ok(await p.evaluate(()=>$("#k70Q").value==="ayşe"),"yazmaya devam edilir");
 const bb=await p.locator('#main [data-crow="u:u2"] .av').boundingBox();
 await p.mouse.move(bb.x+10,bb.y+10);await p.mouse.down();await p.waitForTimeout(150);await p.mouse.up();await p.waitForTimeout(800);
 ok(await p.evaluate(()=>S.route.name==="chat"&&S.route.params.key==="u:u2"),"sonuca ilk dokunuş sohbeti açar");
 await p.evaluate(()=>back());await p.waitForTimeout(500);ok(await p.evaluate(()=>$("#k70Q").value==="ayşe"),"sohbetten geri dönünce arama duruyor");
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(400);await p.evaluate(()=>tab("chats"));await p.waitForTimeout(400);
 ok(await p.evaluate(()=>$("#k70Q").value===""&&[...document.querySelectorAll("#main [data-crow]")].every(x=>!x.hidden)),"başka sekmeden dönünce arama temiz");
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
