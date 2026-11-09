/* hikâye: şeritten açılış, kişiler arası geçiş, hızlı dokunuşlar */
const {open,OUT}=require('./lib');const {px}=require('./seed');const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});
 await p.evaluate(async(c)=>{const T=Date.now();await DB.set("stories/s1",{uid:"u2",at:T-6e4,img:c[0],views:{}});await DB.set("stories/s2",{uid:"u2",at:T-5e4,img:c[1],views:{}});
  await DB.set("stories/s3",{uid:"u3",at:T-4e4,img:c[2],views:{}});await DB.set("stories/s4",{uid:"u4",at:T-3e4,img:c[3],views:{}})},[px("red",72,128),px("blue",72,128),px("green",72,128),px("gold",72,128)]);
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(800);
 console.log("strip",await p.evaluate(()=>[...document.querySelectorAll("#main .stories [data-story]")].map(x=>x.dataset.story).join(",")));
 await p.click('#main .stories [data-story="u2"]');await p.waitForTimeout(800);
 const cur=()=>p.evaluate(()=>{const ls=[...document.querySelectorAll('#overlay [data-layer="story"]')];return ls.length+":"+(ls[0]&&ls[0]._k70u)+":"+(ls[0]?[...ls[0].querySelectorAll(".bars b")].map(b=>b.style.width).join("/"):"")});
 console.log("open",await cur());
 const tapNext=async()=>{const bx=await p.locator("#svNext").boundingBox();await p.mouse.click(bx.x+bx.width/2,bx.y+bx.height/2)};
 await tapNext();await p.waitForTimeout(500);console.log("after next1",await cur());
 await tapNext();await p.waitForTimeout(900);console.log("after next2 (u3?)",await cur());
 await tapNext();await p.waitForTimeout(900);console.log("after next3 (u4?)",await cur());
 const tapPrev=async()=>{const bx=await p.locator("#svPrev").boundingBox();await p.mouse.click(bx.x+bx.width/2,bx.y+bx.height/2)};
 await tapPrev();await p.waitForTimeout(900);console.log("after prev (u3?)",await cur());
 await tapNext();await p.waitForTimeout(900);await tapNext();await p.waitForTimeout(900);console.log("after next past last",await cur(),await p.evaluate(()=>document.querySelectorAll("#k70Gh > *").length));
 // profil: hikâyeli kişi + tur
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(400);
 console.log("errors",errors);await b.close()})();
