const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
const px=c=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${c}"/></svg>`)}`;
(async()=>{const {b,p,errors}=await open(W,860,{dark:process.argv[3]==="dark",ui:process.argv[4]||"vizor"});
 await p.evaluate(async(c)=>{const set=async(u,o)=>{await DB.update("profiles/"+u,o);S.profiles[u]={...S.profiles[u],...o}};
  await set("u1",{avatar:c[0],avs:[c[1],c[2],c[3],c[4]]});await set("u3",{avatar:null,avs:[c[1],c[2]]});await set("u2",{avatar:c[5],avs:[c[0]]})},["red","blue","green","gold","purple","cyan"].map(px));
 const ov=()=>p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,m:document.querySelector("#main").scrollWidth-document.querySelector("#main").clientWidth}));
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(100);
 console.log("own route",await p.evaluate(()=>JSON.stringify(S.route)));
 const seq=[];const t0=Date.now();while(Date.now()-t0<3500){const v=await p.evaluate(()=>AVI.u1);if(seq[seq.length-1]!==v)seq.push(v);await p.waitForTimeout(40)}
 console.log("own seq",JSON.stringify(seq),await ov());await p.screenshot({path:OUT+`p1_own_${W}.png`});
 await p.evaluate(()=>go("profile",{uid:"u3"}));await p.waitForTimeout(100);
 console.log("u3 av html",await p.evaluate(()=>document.querySelector("#main .prof-top > .av")?.outerHTML.slice(0,200)));
 await p.waitForTimeout(1600);console.log("u3 after",await p.evaluate(()=>({i:AVI.u3,src:document.querySelector("#main .prof-top > .av img")?.src.slice(0,80),dots:document.querySelectorAll("#main .k704-dots i").length})));
 await p.evaluate(()=>go("profile",{uid:"u1"}));await p.waitForTimeout(330);await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(60);
 console.log("u2 dots right after",await p.evaluate(()=>[...document.querySelectorAll("#main .k704-dots i")].map(x=>x.className).join(",")+" AVI "+JSON.stringify(AVI)));
 await p.waitForTimeout(1500);console.log("u2 end",await p.evaluate(()=>({i:AVI.u2,done:AVR.done===S.route,t:AVR.t,src:decodeURIComponent(document.querySelector("#main .prof-top > .av img")?.src||"").slice(-40)})));
 await p.evaluate(()=>go("edit"));await p.waitForTimeout(600);console.log("edit",await p.evaluate(()=>document.querySelectorAll("#main .k704-t").length),await ov());await p.screenshot({path:OUT+`p1_edit_${W}.png`});
 console.log("errors",errors);await b.close()})();
