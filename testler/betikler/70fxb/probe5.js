const {rich,ok,done}=require('./h.js');const SP='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70fxb/';
(async()=>{const A=await rich({width:360,ui:process.argv[2]||'vizor'});const p=A.page;
 await p.evaluate(async()=>{const T=Date.now();await DB.set("profiles/u9",{uid:"u9",username:"muhammedalikarakaya_2008",name:"MuhammedAliKarakayaOgluBuyukDedeTorunu40",bio:"kısa",avatar:null,following:{u1:T},botFollowers:{},private:false,createdAt:T});
  await DB.update("profiles/u1",{following:{u9:T}});await DB.set("posts/L1",{uid:"u9",at:T-1000,kind:"photo",src:"img/kahve.jpg",caption:"x",loc:"Kadıköy, İstanbul"});});await p.waitForTimeout(400);
 await p.evaluate(()=>go("profile",{uid:"u9"}));await p.waitForTimeout(500);await p.screenshot({path:SP+'prof40.png'});
 await p.evaluate(()=>go("post",{id:"L1"}));await p.waitForTimeout(500);await p.screenshot({path:SP+'post40.png'});
 console.log(await p.evaluate(()=>{const b=document.querySelector('#main [data-act="postmenu"]').getBoundingClientRect();return b.right}));
 await done(A)})();
