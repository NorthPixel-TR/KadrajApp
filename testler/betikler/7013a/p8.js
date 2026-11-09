/* profil: dört sekme (paylaşım, Klaket, yeniden, etiket, kaydedilenler) dar ekranda */
const {open,OUT}=require('./lib');const {seed}=require('./seed');const W=+process.argv[2]||360;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});await seed(p);
 await p.evaluate(async()=>{const T=Date.now();await DB.update("posts/pm1",{tags:["u1"]});await DB.update("profiles/u1",{rp:{pm1:T}});S.profiles.u1={...S.profiles.u1,rp:{pm1:T}};
  await DB.set("posts/r9",{uid:"u1",at:T-1e4,kind:"reel",video:"reels/x.mp4",caption:"k",music:"none"})});await p.waitForTimeout(400);
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(800);
 const tabs=await p.evaluate(()=>[...document.querySelectorAll("#main .ptabs [data-ptab]")].map(x=>x.dataset.ptab));console.log("tabs",tabs.join(","));
 for(const t of tabs){await p.evaluate(t=>{const b=document.querySelector(`#main .ptabs [data-ptab="${t}"]`);b&&b.click()},t);await p.waitForTimeout(500);
  console.log(t,await p.evaluate(()=>{const m=document.querySelector("#main");return{m:m.scrollWidth-m.clientWidth,tiles:document.querySelectorAll("#main .grid .tile").length}}))}
 await p.screenshot({path:OUT+`p8_${W}_${dark?"d":"l"}_${ui}.png`});console.log("errors",errors);await b.close()})();
