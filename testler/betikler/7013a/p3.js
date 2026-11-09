/* Klaket sayfası + video indirme kenar durumları */
const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});
 const du='data:video/webm;base64,'+fs.readFileSync(V+'d3.webm').toString('base64');
 await p.evaluate(async(du)=>{const T=Date.now();await DB.set("posts/r1",{uid:"u2",at:T-1e4,kind:"reel",video:du,caption:"klaket bir #test çok uzun bir açıklama satırı burada devam ediyor ve ediyor",music:"none",dur:3});
  await DB.set("posts/r2",{uid:"u3",at:T-2e4,kind:"reel",video:"chunk:yok123:2",caption:"silinmiş video",music:"none"});
  await DB.set("posts/r3",{uid:"u1",at:T-3e4,kind:"reel",video:"",caption:"boş video",music:"none"})},du);await p.waitForTimeout(400);
 await p.evaluate(()=>{settings.reelRate=1.5;saveSettings();go("reels",{start:"r1"})});await p.waitForTimeout(1500);
 const st=await p.evaluate(()=>{const r=document.querySelector('#main .reel[data-pid="r1"]');const v=r&&r.querySelector("video");return{v:!!v,rate:v&&v.playbackRate,paused:v&&v.paused,sw:document.documentElement.scrollWidth}});console.log("reel",JSON.stringify(st));
 await p.screenshot({path:OUT+`p3_reel_${W}_${dark?"d":"l"}_${ui}.png`});
 // menü hız
 await p.evaluate(()=>postMenu("r1"));await p.waitForTimeout(300);console.log("menu",await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer="menu"] .opt')].map(x=>x.id||x.textContent.trim().slice(0,14)).join("|")));
 await p.click("#mRate");await p.waitForTimeout(200);console.log("rate after",await p.evaluate(()=>settings.reelRate+" "+document.querySelector('#main .reel[data-pid="r1"] video')?.playbackRate));
 await p.click("#mDl");await p.waitForTimeout(1500);console.log("dlsheet",await p.evaluate(()=>({st:document.querySelector("#dlSt")?.textContent,save:!!document.querySelector("#dlSave"),href:(document.querySelector("#dlSave")?.getAttribute("href")||"").slice(0,5)})));
 await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 // silinmiş parça
 await p.evaluate(()=>dlMedia("chunk:yok123:2","video"));await p.waitForTimeout(1500);console.log("dl chunk",await p.evaluate(()=>document.querySelector("#dlSt")?.textContent+" | act:"+document.querySelector("#dlAct")?.innerHTML.length));
 await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 await p.evaluate(()=>postMenu("r3"));await p.waitForTimeout(300);console.log("r3 mDl",await p.evaluate(()=>!!document.querySelector("#mDl")));await p.evaluate(()=>closeAll());
 await p.evaluate(()=>postMenu("r2"));await p.waitForTimeout(300);console.log("r2 mDl",await p.evaluate(()=>!!document.querySelector("#mDl")));await p.evaluate(()=>closeAll());
 // r2 sayfası
 await p.evaluate(()=>go("reels",{start:"r2"}));await p.waitForTimeout(1500);await p.screenshot({path:OUT+`p3_reel2_${W}.png`});
 console.log("errors",errors);await b.close()})();
