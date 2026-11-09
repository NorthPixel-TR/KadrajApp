const L=require('./lib.js');(async()=>{const A=await L.open();await L.seed(A.page);const p=A.page;
await p.evaluate(()=>go("chat",{key:"u:u2"}));await p.waitForTimeout(800);
await p.screenshot({path:L.SHOT+'chat.png'});
console.log(A.errors);await A.close()})();
