/* keşif: iki sekme (u1, u2), bildirim kartı, okunmadı, görüldü */
const L=require('./lib.js');
(async()=>{const A=await L.open();const p1=A.page;await L.seed(p1,{as:"u1"});
 const B=await L.open({browser:A.browser,ctx:A.ctx});const p2=B.page;await p2.evaluate(async()=>{await bootLocal();S.uid="u2";await enterApp(false)});await p2.waitForTimeout(800);await p2.evaluate(()=>closeAll());
 await p2.evaluate(()=>{settings.notify=true;window.notifReady=true});
 console.log("u2 notifReady",await p2.evaluate(()=>typeof notifReady!=="undefined"&&notifReady));
 await p1.waitForTimeout(3500);await p1.evaluate(()=>go("chat",{key:"u:u2"}));await p1.waitForTimeout(600);
 await p1.fill("#msgIn","merhaba ayşe");await p1.evaluate(()=>document.querySelector("#composer").requestSubmit());await p1.waitForTimeout(1200);
 console.log("u2 kart:",await p2.evaluate(()=>[...document.querySelectorAll(".kn")].map(x=>x.textContent.slice(0,80))));
 console.log("u2 toasts:",await p2.evaluate(()=>[...document.querySelectorAll("#toasts *")].map(x=>x.textContent.slice(0,80)).slice(0,5)));
 console.log("u2 unread:",await p2.evaluate(()=>unreadCount()));
 await p2.screenshot({path:L.SHOT+'ex2a.png'});
 console.log("errors",A.errors,B.errors);await A.close()})();
