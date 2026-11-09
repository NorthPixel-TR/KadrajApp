const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
(async()=>{const {b,p,errors}=await open(W,760,{});const log=(...a)=>console.log(...a);
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(600);
 await p.click("#k70Q");await p.keyboard.type("ay");await p.waitForTimeout(100);
 await p.evaluate(async()=>{const T=Date.now();S.online.add("u3");await DB.set("chats/gr-1/msgs/g9",{from:"u5",at:T,text:"yeni"});await DB.update("chats/gr-1",{last:{text:"yeni",from:"u5",at:T},updatedAt:T});scheduleRefresh()});await p.waitForTimeout(800);
 log("focus after data:",await p.evaluate(()=>document.activeElement&&document.activeElement.id),await p.evaluate(()=>$("#k70Q")&&$("#k70Q").value),await p.evaluate(()=>S.dirty));
 // open DM via search result click
 await p.click('#main [data-crow="u:u2"] .av');await p.waitForTimeout(800);
 log("route",await p.evaluate(()=>S.route.name));
 await p.evaluate(()=>back());await p.waitForTimeout(600);
 log("back q:",await p.evaluate(()=>$("#k70Q").value));
 // group chat
 await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(900);
 const bb=await p.locator("#sendBtn").boundingBox();
 await p.click("#msgIn");await p.keyboard.type("grup zaman");
 await p.mouse.move(bb.x+20,bb.y+20);await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up();await p.waitForTimeout(300);
 log("group sch:",await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="sch"]')));
 await p.evaluate(()=>closeAll());
 // Escape closes, then tap send
 await p.click("#sendBtn");await p.waitForTimeout(600);
 log("sent after close:",await p.evaluate(()=>S.msgs.slice(-1)[0].text));
 // reduced motion
 await p.evaluate(()=>{settings.reduceMotion=true;saveSettings();applyTheme&&applyTheme()});
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(800);
 await p.click("#msgIn");await p.keyboard.type("x");await p.waitForTimeout(100);
 log("rm:",await p.evaluate(()=>({so:getComputedStyle($("#sendBtn .k70-snd")).opacity,t:getComputedStyle(document.documentElement).getPropertyValue("--k70-t")})));
 log("errors",errors);await b.close()})();
